import React from 'react';
import { Sparkles, Cpu, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AIBadge = ({ isDemo = false, engineName = '', compact = false }) => {
  const { systemStatus } = useAuth();
  const configured = systemStatus?.aiEngine?.isConfigured;
  const activeEngine = engineName || systemStatus?.aiEngine?.description || (configured ? 'Google Gemini 1.5' : 'Interactive Demo AI Engine');
  const demoActive = isDemo || !configured;

  if (compact) {
    return (
      <span
        title={demoActive ? 'Demo AI Simulation Engine (Configure GEMINI_API_KEY in backend/.env for Live API)' : 'Live AI Generation via Gemini/OpenAI'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          demoActive
            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}
      >
        <Sparkles className="w-3 h-3" />
        {demoActive ? 'Demo AI Mode' : 'Live AI API'}
      </span>
    );
  }

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border text-xs font-medium backdrop-blur-md ${
        demoActive
          ? 'bg-amber-500/10 text-amber-200 border-amber-500/30'
          : 'bg-indigo-500/10 text-indigo-200 border-indigo-500/30'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <Cpu className={`w-3.5 h-3.5 ${demoActive ? 'text-amber-400' : 'text-indigo-400'}`} />
        <span>AI Engine:</span>
      </div>
      <span className="font-semibold text-slate-100">{activeEngine}</span>
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          demoActive ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'
        }`}
      >
        {demoActive ? 'Simulation Mode' : 'Live Online'}
      </span>
    </div>
  );
};

export default AIBadge;
