
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData, RiskAnalysisResult } from "./types";

// Initialize AI only if API key exists, otherwise provide a placeholder
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === "undefined" || apiKey === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export async function analyzeCreditRisk(data: FinancialData): Promise<RiskAnalysisResult> {
  try {
    const ai = getAIClient();
    
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
      4. Consider the DTI (Debt to Income) ratio.
      5. Provide specific pros and cons relevant to the Indian financial context.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING, enum: ['Approved', 'Rejected', 'Manual Review'] },
            interestRate: { type: Type.NUMBER, description: 'Annual percentage rate (APR)' },
            riskScore: { type: Type.NUMBER, description: 'Risk score from 0 (Safe) to 100 (High Risk)' },
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

    return JSON.parse(response.text.trim());
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      throw new Error("Google Gemini API Key is missing. Please add 'API_KEY' to your Vercel Environment Variables.");
    }
    console.error("AI Analysis Error:", error);
    throw new Error("Analysis failed. Please ensure your API key is correct and you have redeployed.");
  }
}
