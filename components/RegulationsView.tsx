
import React from 'react';
import { Info, Gavel, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

export const RegulationsView: React.FC = () => {
  const guidelines = [
    {
      title: "RBI Fair Practices Code",
      icon: ShieldCheck,
      description: "Lenders must disclose all charges and terms in a transparent manner. No hidden costs or excessive penalties.",
      link: "https://www.rbi.org.in"
    },
    {
      title: "CIBIL Reporting Standards",
      icon: FileText,
      description: "Guidelines on how credit history is reported and how errors in credit reports can be resolved by customers.",
      link: "#"
    },
    {
      title: "KYC Compliance (Know Your Customer)",
      icon: Gavel,
      description: "Mandatory verification process to prevent identity theft, financial fraud, money laundering, and terrorist financing.",
      link: "#"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">Regulatory Guidelines</h2>
        <p className="text-slate-500">Standard operating procedures for Indian Banking & Non-Banking Financial Companies (NBFCs).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Info size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Lending Thresholds</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            In the Indian market, unsecured personal loans generally follow a FOIR (Fixed Obligation to Income Ratio) cap of 50-60%. 
            Loans exceeding this typically require collateral or a co-applicant. Interest rates are regulated by market forces but monitored by the RBI to prevent usury.
          </p>
        </div>

        <div className="bg-indigo-600 p-8 rounded-2xl text-white shadow-lg shadow-indigo-100 space-y-4">
          <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-xl font-bold">Priority Sector Lending</h3>
          <p className="text-indigo-100 text-sm leading-relaxed">
            RBI mandates that 40% of Adjusted Net Bank Credit must be directed towards sectors like Agriculture, MSMEs, Education, and Housing for the weaker sections. 
            Risk analysis for these sectors often utilizes alternative data sources.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Compliance Documentation</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {guidelines.map((guide, i) => (
            <div key={i} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <guide.icon size={20} />
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-slate-800 mb-1">{guide.title}</h4>
                <p className="text-slate-500 text-sm leading-snug">{guide.description}</p>
              </div>
              <button className="text-indigo-600 text-xs font-bold hover:underline">Read Policy</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-8 text-center">
        <h3 className="text-white font-bold mb-2">Need Compliance Assistance?</h3>
        <p className="text-slate-400 text-sm mb-6">Our experts can help you set up automated underwriting that meets RBI's latest standards.</p>
        <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-slate-100 transition-all">
          Contact Compliance Team
        </button>
      </div>
    </div>
  );
};
