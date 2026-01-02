
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, RiskAnalysisResult } from "./types";

/**
 * Utility to get the active API key with local override priority.
 */
const getActiveApiKey = (): string => {
  const localKey = localStorage.getItem('crediflow_user_api_key');
  if (localKey && localKey.trim() !== "") {
    return localKey.trim();
  }
  return process.env.API_KEY || "";
};

/**
 * Analyzes credit risk using either Google Gemini Native SDK or OpenRouter.
 */
export async function analyzeCreditRisk(data: FinancialData): Promise<RiskAnalysisResult> {
  const apiKey = getActiveApiKey();
  
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }

  const isOpenRouter = apiKey.startsWith('sk-or-');

  const prompt = `
    Act as a Senior Credit Risk Officer for a top Indian commercial bank (like HDFC, ICICI, or SBI).
    Analyze the following applicant data and determine loan eligibility and appropriate Interest Rate (ROI).
    
    APPLICANT PROFILE:
    - Name: ${data.fullName}
    - Age: ${data.age}
    - Monthly Net Income: ₹${data.monthlyIncome}
    - Monthly Expenses: ₹${data.monthlyExpenses}
    - Existing EMIs: ₹${data.existingEMI}
    - CIBIL Score: ${data.cibilScore}
    - Requested Loan: ₹${data.loanAmount}
    - Tenure: ${data.loanTenure} months
    - Employment: ${data.employmentType}

    RULES FOR ANALYSIS:
    1. FOIR (Fixed Obligation to Income Ratio) should ideally be < 50%.
    2. CIBIL > 750 is Excellent (Low Interest). 700-750 is Good. < 650 is High Risk.
    3. ROI for personal loans in India typically ranges from 10.5% to 24%.
    4. Provide specific pros and cons relevant to the Indian financial context.
    
    RESPONSE FORMAT: Return a valid JSON object with the following keys:
    status (Approved/Rejected/Manual Review), interestRate (number), riskScore (0-100), 
    pros (string array), cons (string array), maxEligibleAmount (number), 
    explanation (string), confidenceScore (number 0-1).
  `;

  try {
    if (isOpenRouter) {
      // OpenRouter Integration via REST
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "CrediFlow AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-001",
          "messages": [
            { "role": "user", "content": prompt }
          ],
          "response_format": { "type": "json_object" }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `OpenRouter Error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      if (!content) throw new Error("OpenRouter returned an empty response.");
      return JSON.parse(content);
    } else {
      // Native Gemini Integration
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ['Approved', 'Rejected', 'Manual Review'] },
              interestRate: { type: Type.NUMBER },
              riskScore: { type: Type.NUMBER },
              pros: { type: Type.ARRAY, items: { type: Type.STRING } },
              cons: { type: Type.ARRAY, items: { type: Type.STRING } },
              maxEligibleAmount: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER },
            },
            required: ['status', 'interestRate', 'riskScore', 'pros', 'cons', 'maxEligibleAmount', 'explanation', 'confidenceScore'],
          },
        },
      });

      const jsonStr = response.text;
      if (!jsonStr) throw new Error("The AI model returned an empty response.");
      return JSON.parse(jsonStr.trim());
    }
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error(error.message || "Failed to perform credit risk analysis.");
  }
}
