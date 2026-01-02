
import React from 'react';
import { RiskAnalysisResult, AppMode, FinancialData } from '../types';
import { 
  CheckCircle2, XCircle, AlertTriangle, ArrowLeft, TrendingUp, Info, 
  ShieldAlert, BadgeCheck, IndianRupee, Download, Printer, FileText, 
  BarChart3, Scale, User, Wallet, Calendar, Briefcase, Calculator, Clock,
  PieChart
} from 'lucide-react';
// Renamed PieChart from recharts to RechartsPieChart to avoid conflict with the lucide-react icon
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskAnalysisProps {
  result: RiskAnalysisResult;
  data: FinancialData;
  onReset: () => void;
  mode: AppMode;
}

// Fix: Complete the RiskAnalysis component to ensure it returns a valid ReactNode instead of void.
export const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ result, data, onReset, mode }) => {
  const isApproved = result.status === 'Approved';
  const isBankMode = mode === 'Bank';
  
  const chartData = [
    { name: 'Risk Score', value: result.riskScore },
    { name: 'Safety Margin', value: 100 - result.riskScore },
  ];

  const COLORS = [result.riskScore > 60 ? '#f43f5e' : result.riskScore > 30 ? '#f59e0b' : '#10b981', '#f1f5f9'];

  const exportAsCSV = () => {
    const csvData = [
      ['Category', 'Value'],
      ['Applicant Name', data.fullName],
      ['Age', data.age],
      ['Status', result.status],
      ['Interest Rate', `${result.interestRate}%`],
      ['Risk Score', result.riskScore],
      ['Max Eligible Amount', result.maxEligibleAmount],
      ['CIBIL Score', data.cibilScore],
      ['Monthly Income', data.monthlyIncome],
      ['Monthly EMI', data.existingEMI]
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvData.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Credit_Risk_Analysis_${data.fullName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm"
        >
          <ArrowLeft size={16} /> Back to Application
        </button>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
            <Printer size={18} />
          </button>
          <button onClick={exportAsCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Verdict Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-white rounded-2xl border ${isApproved ? 'border-emerald-100' : result.status === 'Rejected' ? 'border-rose-100' : 'border-amber-100'} shadow-sm overflow-hidden`}>
            <div className={`p-8 ${isApproved ? 'bg-emerald-50/50' : result.status === 'Rejected' ? 'bg-rose-50/50' : 'bg-amber-50/50'} flex items-start gap-6`}>
              <div className={`p-4 rounded-2xl ${isApproved ? 'bg-emerald-500 text-white' : result.status === 'Rejected' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'} shadow-lg`}>
                {isApproved ? <CheckCircle2 size={32} /> : result.status === 'Rejected' ? <XCircle size={32} /> : <AlertTriangle size={32} />}
              </div>
              <div className="space-y-1 flex-grow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Verdict</span>
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isApproved ? 'bg-emerald-100 text-emerald-700' : result.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {Math.round(result.confidenceScore * 100)}% Confidence
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900">
                  Loan {result.status}
                </h2>
                <p className="text-slate-600 leading-relaxed max-w-lg">
                  {result.explanation}
                </p>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-100 bg-white">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested ROI</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-indigo-600">{result.interestRate}%</span>
                  <span className="text-xs text-slate-400 font-medium">p.a.</span>
                </div>
              </div>
              <div className="space-y-1 border-x border-slate-100 px-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eligible Amount</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900">₹{(result.maxEligibleAmount / 100000).toFixed(2)}L</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Score</p>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black ${result.riskScore > 60 ? 'text-rose-500' : result.riskScore > 30 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {result.riskScore}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <BadgeCheck size={18} />
                <h3>Positive Indicators</h3>
              </div>
              <ul className="space-y-2">
                {result.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-600 font-bold">
                <ShieldAlert size={18} />
                <h3>Risk Warnings</h3>
              </div>
              <ul className="space-y-2">
                {result.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-600" />
              Risk Concentration
            </h3>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">{result.riskScore}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Risk</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 leading-relaxed italic">
                {isBankMode 
                  ? "Risk concentration calculated based on CIBIL, DTI and FOIR ratios using Indian standard deviation models." 
                  : "This percentage indicates how 'safe' your profile appears to the bank's automated systems."}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <Scale size={16} className="text-indigo-400" />
              Applicant Snapshot
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Net Monthly</span>
                <span className="font-bold">₹{data.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">EMI Outgo</span>
                <span className="font-bold">₹{data.existingEMI.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">DTI Ratio</span>
                <span className="font-bold text-indigo-400">{((data.existingEMI / data.monthlyIncome) * 100).toFixed(1)}%</span>
              </div>
              <hr className="border-white/10" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-indigo-400">
                  {data.cibilScore}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">CIBIL Score</div>
                  <div className="text-xs font-bold">
                    {data.cibilScore > 750 ? 'Excellent' : data.cibilScore > 700 ? 'Good' : 'Subprime'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
