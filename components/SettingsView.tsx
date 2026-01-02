
import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Trash2, Cloud, HardDrive, ShieldCheck, 
  AlertCircle, Cpu, Zap, Bug, Eye, EyeOff, Key, Save, RefreshCw 
} from 'lucide-react';

interface SettingsViewProps {
  history: any[];
  onClear: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ history, onClear }) => {
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load local key on mount
  useEffect(() => {
    const saved = localStorage.getItem('crediflow_user_api_key') || '';
    setLocalKey(saved);
  }, []);

  const vercelKey = process.env.API_KEY || '';
  const activeKey = localKey || vercelKey;
  const isApiKeyPresent = activeKey && activeKey !== 'undefined' && activeKey !== '';
  const isOpenRouter = activeKey.startsWith('sk-or-');
  const isLocalActive = !!localKey;

  const handleSaveKey = () => {
    setSaveStatus('saving');
    if (localKey.trim()) {
      localStorage.setItem('crediflow_user_api_key', localKey.trim());
    } else {
      localStorage.removeItem('crediflow_user_api_key');
    }
    
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 800);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "crediflow_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const storageUsed = new Blob([JSON.stringify(history)]).size;
  const storageLimit = 5 * 1024 * 1024; 
  const percentage = Math.min(((storageUsed / storageLimit) * 100), 100).toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Manage your API configuration and local storage.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-xs font-bold transition-all ${
          isApiKeyPresent 
            ? isOpenRouter ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          {isOpenRouter ? <Zap size={14} className="text-amber-500 animate-pulse" /> : <Cpu size={14} className={isApiKeyPresent ? 'animate-pulse text-emerald-500' : ''} />}
          AI ENGINE: {isApiKeyPresent ? (isOpenRouter ? 'OPENROUTER' : 'GEMINI NATIVE') : 'KEY MISSING'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Key Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Key size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">API Configuration</h3>
                <p className="text-xs text-slate-400">Manual Key Entry</p>
              </div>
            </div>
            {isLocalActive && (
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                Local Active
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="Enter Gemini or OpenRouter Key..."
                className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-mono"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-tight">
              Aapki key browser ke local storage mein save hogi. Ye Vercel environment variable se upar priority rakhti hai.
            </p>

            <button
              onClick={handleSaveKey}
              disabled={saveStatus !== 'idle'}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                saveStatus === 'saved' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-100 disabled:opacity-50'
              }`}
            >
              {saveStatus === 'saving' ? <RefreshCw size={16} className="animate-spin" /> : 
               saveStatus === 'saved' ? <ShieldCheck size={16} /> : <Save size={16} />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Key Saved' : 'Update API Key'}
            </button>
          </div>
        </div>

        {/* Diagnostics Tool */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isOpenRouter ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
              <Bug size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Diagnostic Info</h3>
              <p className="text-xs text-slate-400">Environment Verification</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500">Active Key:</span>
              <span className={`text-xs font-bold ${isApiKeyPresent ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isApiKeyPresent ? 'LOADED ✓' : 'NOT FOUND ✗'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500">Source:</span>
              <span className="text-xs font-bold text-indigo-600 uppercase">
                {localKey ? 'Local Storage (User)' : vercelKey ? 'Cloud (Vercel)' : 'None'}
              </span>
            </div>

            {isApiKeyPresent && (
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Infrastructure:</span>
                <span className="text-xs font-bold text-slate-700">
                  {isOpenRouter ? 'OpenRouter.ai' : 'Google Gemini'}
                </span>
              </div>
            )}
            
            {!isApiKeyPresent && (
              <p className="text-[10px] text-rose-500 leading-tight">
                <strong>Attention:</strong> No API Key found. Enter one in the configuration panel above to enable AI features.
              </p>
            )}
          </div>
        </div>

        {/* Local Storage Stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Browser Storage</h3>
                <p className="text-xs text-slate-400">Assessment History</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Usage</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button 
              onClick={exportData}
              className="flex-grow flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Download size={16} /> Export JSON
            </button>
            <button 
              onClick={onClear}
              className="p-2 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Cloud Integration */}
        <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Cloud size={80} />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 text-indigo-400 rounded-lg">
              <Cloud size={20} />
            </div>
            <div>
              <h3 className="font-bold">Cloud Sync</h3>
              <p className="text-xs text-slate-400">Bank-wide Access</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-slate-300 leading-relaxed">
              Connect to enterprise cloud storage to synchronize assessment history across your banking branch.
            </p>
          </div>

          <button 
            onClick={() => window.open('https://vercel.com/storage', '_blank')}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all"
          >
            Setup Enterprise Sync
          </button>
        </div>
      </div>
    </div>
  );
};
