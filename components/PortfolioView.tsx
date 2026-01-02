
import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpRight } from 'lucide-react';

interface PortfolioViewProps {
  history: any[];
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Portfolio Management</h2>
          <p className="text-slate-500 text-sm">Manage and track all credit risk assessments in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
            <Download size={16} /> Bulk Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by applicant name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <th className="px-6 py-4">Applicant Profile</th>
                <th className="px-6 py-4">Loan Terms</th>
                <th className="px-6 py-4">Metrics</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Risk Level</th>
                <th className="px-6 py-4 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredHistory.length > 0 ? filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{item.fullName}</div>
                    <div className="text-xs text-slate-500">{item.employmentType} • {item.age} yrs</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">₹{item.loanAmount.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-slate-500">{item.loanTenure} Months</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 w-8">CIBIL</span>
                        <span className="font-bold text-slate-700">{item.cibilScore}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 w-8">ROI</span>
                        <span className="font-bold text-indigo-600">{item.interestRate}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.riskScore > 60 ? 'bg-rose-500' : item.riskScore > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${item.riskScore}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    {searchTerm ? "No results matching your search." : "Your portfolio is currently empty. Analyze a new application to see it here."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
