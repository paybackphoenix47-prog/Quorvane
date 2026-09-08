import React from 'react';
import { 
  Shield, 
  Lock, 
  Terminal, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Globe, 
  FileText, 
  AlertTriangle, 
  Mail, 
  ExternalLink,
  Layers,
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { BackButton } from './BackButton';
import type { ViewTab } from '../types';

interface AboutViewProps {
  onBackToHome: () => void;
  onNavigateTab: (tab: ViewTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBackToHome, onNavigateTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Back to Home Navigation Button */}
      <BackButton onBackToHome={onBackToHome} currentPageName="About Platform" />

      {/* Main Header / Mission Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-[#081220]/90 border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>PLATFORM MISSION & OPERATIONAL DOCTRINE</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none">
              QUORVANE
            </h1>
            <p className="text-sm sm:text-base font-bold text-cyan-400 tracking-wider uppercase mt-1">
              SECURING THE DIGITAL FUTURE
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed pt-2">
            QUORVANE was engineered to bridge the gap between theoretical cybersecurity education and practical defensive mastery. We deliver a production-grade, ethical security environment where engineers, analysts, and operators learn offensive tactics to build unbreakable defenses.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('framework')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
            >
              <span>Explore 7-Stage Framework</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('range')}
              className="px-5 py-2.5 rounded-xl bg-[#050b14] hover:bg-[#0c1a2e] border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Launch Cyber Range
            </button>
          </div>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>FOUNDATIONAL PILLARS</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
          The Principles Behind Quorvane
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#08182b] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Defensive-First Mindset
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              True cyber defense requires a granular understanding of adversary mechanics. We explore offensive vectors solely to engineer resilient, hardened architectures that anticipate attack surfaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#08182b] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Safe Simulation Labs
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every tool and challenge operates inside isolated client-contained sandboxes. Learners experiment safely with exploits, fuzzing, and telemetry without touching real external networks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#08182b] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Continuous Readiness
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Security is not static compliance. Through interactive scenarios, CVSS scoring matrices, and knowledge check quizzes, operators sharpen their tactical instincts against evolving threat landscapes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-cyan-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#08182b] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Compliance & Ethics
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              All training strictly enforces Rules of Engagement (RoE), legal authorization boundaries, non-disclosure principles, and certified remediation reporting standards.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Architecture & Technology Stack */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            INFRASTRUCTURE SPECIFICATIONS
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Platform Architecture & Security Controls
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            QUORVANE is built upon modern zero-trust paradigms, ensuring zero leakage of user data, client-side cryptographic isolation, and instantaneous state synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 space-y-2">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Runtime Architecture
            </div>
            <p className="text-slate-300 leading-relaxed">
              Engineered with React 18, TypeScript, and Vite. Leverages deterministic typing across all framework stages, academy modules, and telemetry simulators.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 space-y-2">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Client-Side Cryptography
            </div>
            <p className="text-slate-300 leading-relaxed">
              Native W3C WebCrypto API implementation for SHA-256 and SHA-1 hashing, ensuring no plaintext or credential payload ever traverses an external network.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#040810] border border-slate-800/90 space-y-2">
            <div className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Cloud Database & Auth
            </div>
            <p className="text-slate-300 leading-relaxed">
              Firebase Firestore and Authentication integration with strict security rules, granting operators seamless progress persistence, level sync, and achievement tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Responsible Disclosure & Ethical Charter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-[#060e1a] border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
            <span>RESPONSIBLE DISCLOSURE CHARTER</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Ethical Use & Legal Authorization Policy
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The tools, simulations, and educational materials provided by QUORVANE are strictly intended for authorized educational testing, vulnerability research, and security defense enhancement. Under no circumstances should any techniques or utilities demonstrated on this platform be deployed against systems or networks without explicit, written authorization from the system owners.
          </p>
          <div className="p-4 rounded-xl bg-[#040810] border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
            <strong className="text-cyan-300">Operator Commitment:</strong> By utilizing QUORVANE, you pledge to adhere to standard professional ethics (including (ISC)² Code of Ethics, EC-Council Code of Conduct, and NIST SP 800-115 standards), maintaining confidentiality and prioritizing system integrity at all times.
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#08182b] border border-cyan-500/40 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>SECURITY CONTACT</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Emergency & Vulnerability Reporting
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Have an operational security question, vulnerability disclosure report, or curriculum suggestion? Contact the QUORVANE SecOps desk.
            </p>
            <div className="p-3 rounded-lg bg-[#040b16] border border-slate-800 text-xs font-mono text-cyan-300">
              secops@quorvane.internal
            </div>
          </div>

          <div className="pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
            <span>PGP Fingerprint:</span>
            <span className="font-mono text-cyan-400">0x9F42...C7E1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
