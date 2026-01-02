
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RiskForm } from './components/RiskForm';
import { RiskAnalysis } from './components/RiskAnalysis';
import { Dashboard } from './components/Dashboard';
import { PortfolioView } from './components/PortfolioView';
import { RegulationsView } from './components/RegulationsView';
import { SettingsView } from './components/SettingsView';
import { AppMode, FinancialData, RiskAnalysisResult } from './types';
import { analyzeCreditRisk } from './geminiService';
import { LayoutDashboard, FileSearch, Briefcase, Gavel, Settings, Trash2 } from 'lucide-react';

type TabType = 'dashboard' | 'analyze' | 'portfolios' | 'regulations' | 'settings';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('Bank');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult | null>(null);
  const [currentData, setCurrentData] = useState<FinancialData | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Load history from LocalStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('crediflow_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crediflow_history', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async (data: FinancialData) => {
    setLoading(true);
    setResult(null);
    setCurrentData(data);
    try {
      const analysisResult = await analyzeCreditRisk(data);
      const newEntry = { ...data, ...analysisResult, id: Date.now(), date: new Date().toLocaleDateString() };
      setResult(analysisResult);
      setHistory(prev => [newEntry, ...prev]);
      setActiveTab('analyze');
    } catch (error: any) {
      console.error("Analysis Error:", error);
      alert(error.message || "Analysis failed. Please check your API Key in Vercel settings.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all analysis history?")) {
      setHistory([]);
      localStorage.removeItem('crediflow_history');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard history={history} mode={mode} />;
      case 'portfolios':
        return <PortfolioView history={history} />;
      case 'regulations':
        return <RegulationsView />;
      case 'settings':
        return <SettingsView history={history} onClear={clearHistory} />;
      case 'analyze':
      default:
        return (
          <div className="space-y-8">
            {!result && !loading && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Loan Application Assessment</h2>
                    <p className="text-slate-500 text-sm">Enter the applicant's financial details for an AI-powered risk verdict.</p>
                  </div>
                </div>
                <RiskForm onSubmit={handleAnalyze} isLoading={loading} />
              </div>
            )}

            {loading && (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Analyzing Credit Profile...</h3>
                <p className="text-slate-500 max-w-sm">
                  Our AI engine is currently scanning Indian banking norms and CIBIL benchmarks.
                </p>
              </div>
            )}

            {result && !loading && currentData && (
              <RiskAnalysis 
                result={result} 
                data={currentData} 
                onReset={() => {
                  setResult(null);
                  setCurrentData(null);
                }} 
                mode={mode} 
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header mode={mode} setMode={setMode} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className="w-full lg:w-64 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('analyze');
                setResult(null);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'analyze' && !result ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSearch size={20} />
              <span className="font-medium">New Analysis</span>
            </button>
            <button
              onClick={() => setActiveTab('portfolios')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'portfolios' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase size={20} />
              <span className="font-medium">Portfolios</span>
            </button>
            <button
              onClick={() => setActiveTab('regulations')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'regulations' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Gavel size={20} />
              <span className="font-medium">Regulations</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings size={20} />
              <span className="font-medium">Settings</span>
            </button>
            
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Recent Cases
                </h3>
              </div>
              <div className="space-y-2">
                {history.slice(0, 5).map(item => (
                  <div key={item.id} className="p-3 bg-white rounded-md border border-slate-100 flex items-center justify-between text-sm cursor-pointer hover:border-indigo-200 transition-colors">
                    <span className="truncate max-w-[100px] font-medium">{item.fullName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      item.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                      item.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="flex-grow">
            {renderContent()}
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 CrediFlow AI Solutions Pvt Ltd. Built for Indian Banking.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
