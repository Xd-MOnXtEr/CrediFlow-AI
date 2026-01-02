
import React, { useState } from 'react';
import { FinancialData, EmploymentType } from '../types';
import { IndianRupee, User, Briefcase, Calendar, CreditCard, PieChart, AlertCircle } from 'lucide-react';

interface RiskFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

export const RiskForm: React.FC<RiskFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FinancialData>({
    fullName: '',
    age: 28,
    monthlyIncome: 65000,
    monthlyExpenses: 25000,
    existingEMI: 5000,
    cibilScore: 750,
    loanAmount: 500000,
    loanTenure: 36,
    employmentType: 'Salaried'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (formData.age < 18 || formData.age > 80) newErrors.age = 'Age must be between 18 and 80';
    if (formData.cibilScore < 300 || formData.cibilScore > 900) newErrors.cibilScore = 'CIBIL score must be between 300 and 900';
    if (formData.monthlyIncome < 10000) newErrors.monthlyIncome = 'Minimum monthly income required is ₹10,000';
    if (formData.monthlyExpenses < 0) newErrors.monthlyExpenses = 'Expenses cannot be negative';
    if (formData.existingEMI < 0) newErrors.existingEMI = 'EMI cannot be negative';
    if (formData.loanAmount < 25000) newErrors.loanAmount = 'Minimum loan amount is ₹25,000';
    if (formData.loanTenure < 6 || formData.loanTenure > 84) newErrors.loanTenure = 'Tenure must be between 6 and 84 months';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'fullName' || name === 'employmentType' ? value : Number(value)
    }));
    // Clear error for the field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const rest = { ...prev };
        delete rest[name];
        return rest;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const InputError = ({ message }: { message?: string }) => (
    message ? (
      <p className="text-rose-500 text-[11px] font-medium mt-1 flex items-center gap-1">
        <AlertCircle size={10} /> {message}
      </p>
    ) : null
  );

  return (
    <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <User size={14} className="text-slate-400" /> Full Name
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="e.g. Rahul Sharma"
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.fullName ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.fullName} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" /> Age
        </label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.age ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.age} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Briefcase size={14} className="text-slate-400" /> Employment Type
        </label>
        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
        >
          <option value="Salaried">Salaried</option>
          <option value="Self-Employed">Self-Employed</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <CreditCard size={14} className="text-slate-400" /> CIBIL Score (300-900)
        </label>
        <input
          type="number"
          name="cibilScore"
          value={formData.cibilScore}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.cibilScore ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.cibilScore} />
      </div>

      <hr className="md:col-span-2 border-slate-100 my-2" />

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <IndianRupee size={14} className="text-slate-400" /> Monthly Net Income
        </label>
        <input
          type="number"
          name="monthlyIncome"
          value={formData.monthlyIncome}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.monthlyIncome ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.monthlyIncome} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <IndianRupee size={14} className="text-slate-400" /> Total Monthly EMIs
        </label>
        <input
          type="number"
          name="existingEMI"
          value={formData.existingEMI}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.existingEMI ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.existingEMI} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <IndianRupee size={14} className="text-slate-400" /> Desired Loan Amount
        </label>
        <input
          type="number"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.loanAmount ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.loanAmount} />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <PieChart size={14} className="text-slate-400" /> Tenure (Months)
        </label>
        <input
          type="number"
          name="loanTenure"
          value={formData.loanTenure}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all outline-none ${errors.loanTenure ? 'border-rose-400 bg-rose-50' : 'border-slate-200'}`}
        />
        <InputError message={errors.loanTenure} />
      </div>

      <div className="md:col-span-2 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Processing Algorithm...' : 'Analyze Financial Risk Profile'}
        </button>
      </div>
    </form>
  );
};
