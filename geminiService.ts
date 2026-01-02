
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, RiskAnalysisResult } from "./types";

/**
 * Analyzes credit risk using the Google Gemini API.
 * This implementation strictly follows the @google/genai guidelines.
 */
export async function analyzeCreditRisk(data: FinancialData): Promise<RiskAnalysisResult> {
  // Ensure the API key is obtained exclusively from process.env.API_KEY
  if (!process.env.API_KEY || process.env.API_KEY === "undefined" || process.env.API_KEY === "") {
    throw new Error("API_KEY_MISSING");
  }

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
    
    RESPONSE FORMAT: Return a valid JSON object matching the provided schema.
  `;

  try {
    // Correct initialization: always use new GoogleGenAI({ apiKey: process.env.API_KEY })
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using recommended model 'gemini-3-flash-preview' for basic text-based tasks
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

    // Directly access the text property as per latest SDK guidelines
    const jsonStr = response.text;
    
    if (!jsonStr) {
      throw new Error("The AI model returned an empty response.");
    }

    return JSON.parse(jsonStr.trim());
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    throw new Error(error.message || "Failed to perform credit risk analysis. Please check your configuration.");
  }
}
