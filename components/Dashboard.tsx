
import React from 'react';
import { AppMode } from '../types';
import { TrendingUp, Users, ShieldCheck, Clock, FileText, ArrowRight } from 'lucide-react';

interface DashboardProps {
  history: any[];
  mode: AppMode;
}

export const Dashboard: React.FC<DashboardProps> = ({ history, mode }) => {
  // Dynamic Calculation of Statistics
  const totalAnalyses = history.length;
  
  const approvedCount = history.filter(h => h.status === 'Approved').length;
  const avgApprovalRate = totalAnalyses > 0 
    ? ((approvedCount / totalAnalyses) * 100).toFixed(0) + '%' 
    : '0%';

  const pendingReviews = history.filter(h => h.status === 'Manual Review').length;

  const totalVolumeRaw = history
    .filter(h => h.status === 'Approved')
    .reduce((sum, h) => sum + (h.loanAmount || 0), 0);
  
  const totalVolume = totalVolumeRaw >= 10000000 
    ? `₹${(totalVolumeRaw / 10000000).toFixed(2)} Cr` 
    : `₹${(totalVolumeRaw / 100000).toFixed(2)} L`;

  const stats = [
    { label: 'Total Analyses', value: totalAnalyses, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Avg Approval Rate', value: avgApprovalRate, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Manual Reviews', value: pendingReviews, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approved Volume', value: totalVolume, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Recent Applications</h3>
          <button className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
            View All <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Loan Details</th>
                <th className="px-6 py-4">CIBIL</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length > 0 ? history.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {item.fullName.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{item.fullName}</div>
                        <div className="text-xs text-slate-400">{item.employmentType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">₹{(item.loanAmount / 100000).toFixed(1)}L for {item.loanTenure}m</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${item.cibilScore > 750 ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {item.cibilScore}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-indigo-600">
                      <ArrowRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No applications found. Run an analysis to see results here.
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
