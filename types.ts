
export type EmploymentType = 'Salaried' | 'Self-Employed' | 'Business' | 'Other';

export interface FinancialData {
  fullName: string;
  age: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingEMI: number;
  cibilScore: number;
  loanAmount: number;
  loanTenure: number;
  employmentType: EmploymentType;
  bankStatementSummary?: string;
}

export interface RiskAnalysisResult {
  status: 'Approved' | 'Rejected' | 'Manual Review';
  interestRate: number;
  riskScore: number; // 0-100
  pros: string[];
  cons: string[];
  maxEligibleAmount: number;
  explanation: string;
  confidenceScore: number;
}

export type AppMode = 'Bank' | 'Customer';
