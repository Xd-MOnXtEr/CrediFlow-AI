
import React from 'react';
import { AppMode } from '../types';
import { ShieldCheck, User, Building2 } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, setMode, activeTab, onTabChange }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Credi<span className="text-indigo-600">Flow</span></span>
            <span className="text-[10px] block font-semibold text-slate-400 -mt-1 uppercase tracking-widest">AI Analyst</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button 
            onClick={() => onTabChange('analyze')}
            className={`pb-5 pt-5 -mb-1 transition-all border-b-2 ${activeTab === 'analyze' ? 'text-indigo-600 border-indigo-600' : 'border-transparent hover:text-indigo-600'}`}
          >
            Assessment
          </button>
          <button 
            onClick={() => onTabChange('portfolios')}
            className={`pb-5 pt-5 -mb-1 transition-all border-b-2 ${activeTab === 'portfolios' ? 'text-indigo-600 border-indigo-600' : 'border-transparent hover:text-indigo-600'}`}
          >
            Portfolios
          </button>
          <button 
            onClick={() => onTabChange('regulations')}
            className={`pb-5 pt-5 -mb-1 transition-all border-b-2 ${activeTab === 'regulations' ? 'text-indigo-600 border-indigo-600' : 'border-transparent hover:text-indigo-600'}`}
          >
            Regulations
          </button>
        </nav>

        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode('Bank')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'Bank' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Building2 size={16} />
            <span className="hidden sm:inline">Bank View</span>
          </button>
          <button
            onClick={() => setMode('Customer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'Customer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={16} />
            <span className="hidden sm:inline">Customer View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
