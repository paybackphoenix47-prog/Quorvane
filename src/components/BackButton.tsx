import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ViewTab } from '../types';

interface BackButtonProps {
  onBackToHome: () => void;
  currentPageName?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBackToHome, currentPageName }) => {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-slate-800/80 pb-4">
      <button
        id="btn-back-to-home"
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#09111e] hover:bg-[#0f1d33] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 text-xs font-semibold tracking-wide transition-all shadow-sm group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-cyan-400" />
        <span>Back to Home</span>
      </button>

      {currentPageName && (
        <span className="text-xs font-mono text-slate-400 tracking-wider hidden sm:inline-block">
          QUORVANE // <span className="text-cyan-400 uppercase">{currentPageName}</span>
        </span>
      )}
    </div>
  );
};
