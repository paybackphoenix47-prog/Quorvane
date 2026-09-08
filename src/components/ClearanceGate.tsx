import React from 'react';
import { Shield, Lock, ArrowRight, UserPlus, LogIn, Zap, ArrowLeft } from 'lucide-react';
import type { ViewTab } from '../types';

interface ClearanceGateProps {
  targetTab: ViewTab;
  onOpenAuth: () => void;
  onBackToHome: () => void;
  onDemoLogin: () => void;
}

const TAB_METADATA: Record<string, { title: string; desc: string }> = {
  framework: {
    title: 'Ethical Hacking Framework & Working Tools Suite',
    desc: 'Access to the 7-stage operational lifecycle, threat modeling workflows, and interactive security utilities requires verified operator clearance.'
  },
  academy: {
    title: 'Security Academy & Specialized Training Modules',
    desc: 'Structured cybersecurity curriculum, knowledge checkpoints, and skill mastery logs require an active operator dossier.'
  },
  training: {
    title: 'Security Academy & Specialized Training Modules',
    desc: 'Structured cybersecurity curriculum, knowledge checkpoints, and skill mastery logs require an active operator dossier.'
  },
  range: {
    title: 'Cyber Range Simulated Vulnerability Labs',
    desc: 'Interactive lab sandboxes (SQLi, XSS, Linux terminal, Network analysis) run in isolated environments tied to registered analyst accounts.'
  },
  dashboard: {
    title: 'Security Operations Dossier & Real-Time Telemetry',
    desc: 'Operator performance analytics, completed credentials, and defensive progression requires an authenticated operator profile.'
  },
  tools: {
    title: 'Operational Security Tool Suite',
    desc: 'Diagnostic utilities (DNS, WHOIS, Port Scanning, CVSS Calculator) require operator authentication.'
  }
};

export const ClearanceGate: React.FC<ClearanceGateProps> = ({
  targetTab,
  onOpenAuth,
  onBackToHome,
  onDemoLogin
}) => {
  const meta = TAB_METADATA[targetTab] || {
    title: 'Restricted Cyber Intelligence Operational Module',
    desc: 'Access to operational modules requires verified cybersecurity analyst credentials.'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#060c16]/95 border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.6)] relative overflow-hidden text-center backdrop-blur-md">
        {/* Subtle cyan background aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Security Shield Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#08182b] border border-cyan-500/50 text-cyan-400 mb-6 shadow-[0_0_25px_rgba(6,182,212,0.25)] relative z-10">
          <Lock className="w-9 h-9 text-cyan-400" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#081b33] border border-cyan-500/30 text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>OPERATOR CLEARANCE REQUIRED</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Restricted Section: <span className="text-cyan-400">{meta.title}</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {meta.desc}
          </p>

          <p className="text-xs text-slate-400 font-medium">
            Please log in to your existing QUORVANE account or create a new operator dossier to access training, ranges, and operational framework tools.
          </p>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="btn-gate-signin"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>

            <button
              id="btn-gate-demo"
              onClick={onDemoLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-cyan-500/40 bg-[#08182b] hover:bg-[#0c223c] text-cyan-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Instant Guest Clearance</span>
            </button>

            <button
              id="btn-gate-home"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-800 bg-[#060e1a] hover:bg-[#0a1526] text-slate-400 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-10 pt-8 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left relative z-10">
          <div className="p-4 rounded-xl bg-[#040810]/80 border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 mb-1 font-mono">01. 7-STAGE FRAMEWORK</div>
            <p className="text-[11px] text-slate-400">Complete enterprise penetration testing methodology integrated with live security utilities.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#040810]/80 border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 mb-1 font-mono">02. 12 ACADEMY MODULES</div>
            <p className="text-[11px] text-slate-400">From network security to cryptography, OWASP Top 10, malware analysis, and cloud defense.</p>
          </div>
          <div className="p-4 rounded-xl bg-[#040810]/80 border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 mb-1 font-mono">03. CYBER RANGE LABS</div>
            <p className="text-[11px] text-slate-400">Simulated environments with interactive attacks, safe exploitation payloads, and flag submission.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
