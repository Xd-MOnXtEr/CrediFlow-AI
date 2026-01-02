
import React, { useState } from 'react';
import { Database, Download, Trash2, Cloud, HardDrive, ShieldCheck, AlertCircle, Cpu, Zap, Bug, Eye, EyeOff } from 'lucide-react';

interface SettingsViewProps {
  history: any[];
  onClear: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ history, onClear }) => {
  const [showKey, setShowKey] = useState(false);
  const apiKey = process.env.API_KEY || '';
  const isApiKeyPresent = apiKey && apiKey !== 'undefined' && apiKey !== '';

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
  const storageLimit = 5 * 1024 * 1024; // 5MB LocalStorage limit approx
  const percentage = Math.min(((storageUsed / storageLimit) * 100), 100).toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Manage your data storage and cloud connectivity.</p>
        </div>
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-xs font-bold transition-all ${
          isApiKeyPresent ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          <Cpu size={14} className={isApiKeyPresent ? 'animate-pulse' : ''} />
          AI ENGINE: {isApiKeyPresent ? 'GEMINI NATIVE' : 'KEY MISSING'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Storage Stats */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <HardDrive size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Browser Storage</h3>
                <p className="text-xs text-slate-400">LocalStorage Status</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
              <ShieldCheck size={14} /> Active
            </span>
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
            <p className="text-[10px] text-slate-400">Approximately {(storageUsed / 1024).toFixed(2)} KB used of browser limit.</p>
          </div>

          <div className="pt-4 flex gap-2">
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

        {/* Diagnostics Tool */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Bug size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Diagnostic Info</h3>
              <p className="text-xs text-slate-400">Environment Verification</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-500">API Key Status:</span>
              <span className={`text-xs font-bold ${isApiKeyPresent ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isApiKeyPresent ? 'LOADED ✓' : 'NOT FOUND ✗'}
              </span>
            </div>
            
            {isApiKeyPresent && (
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Masked Key:</span>
                <div className="flex items-center gap-2">
                  <code className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700">
                    {showKey ? apiKey : `${apiKey.substring(0, 4)}••••${apiKey.substring(apiKey.length - 4)}`}
                  </code>
                  <button onClick={() => setShowKey(!showKey)} className="text-slate-400 hover:text-indigo-600">
                    {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )}
            
            {!isApiKeyPresent && (
              <p className="text-[10px] text-rose-500 leading-tight">
                <strong>Fix:</strong> Set the <code>API_KEY</code> environment variable in your deployment platform settings.
              </p>
            )}
          </div>
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
            <p className="text-xs text-slate-400">Centralized Database</p>
          </div>
        </div>

        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-start gap-2 text-amber-400 mb-2">
            <AlertCircle size={14} className="mt-0.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Not Connected</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connect to cloud storage providers to synchronize assessment history across your banking network.
          </p>
        </div>

        <button 
          onClick={() => window.open('https://vercel.com/storage', '_blank')}
          className="max-w-xs py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-900"
        >
          Connect Cloud Storage
        </button>
      </div>
    </div>
  );
};
