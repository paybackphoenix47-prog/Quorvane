import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, ChevronRight, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

const BOOT_SEQUENCES = [
  'Initializing Quorvane Security Architecture...',
  'Verifying zero-trust integrity parameters...',
  'Syncing ethical hacking & defense modules...',
  'Calibrating simulated cyber-range enclaves...',
  'Platform operational · 100% Authorized Sandbox Ready'
];

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => {
        if (prev < BOOT_SEQUENCES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 550);

    const autoFinishTimer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearInterval(interval);
      clearTimeout(autoFinishTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070a0e] text-slate-100 overflow-hidden select-none"
    >
      {/* Subtle clean grid background */}
      <div className="absolute inset-0 cyber-grid-dark opacity-60 pointer-events-none" />

      {/* Soft circular cyan glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Skip button in upper right */}
      <button
        id="btn-skip-intro"
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-800 bg-[#0c1422]/90 hover:bg-[#111e32] text-xs font-semibold text-slate-300 shadow-sm transition-all cursor-pointer hover:border-cyan-500/50"
      >
        <span>Skip Introduction</span>
        <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
      </button>

      {/* Center Modern Card */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6 text-center">
        {/* Brand Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative mb-6"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#091222] border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center justify-center relative">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-md bg-[#040e1c] border border-cyan-500/40 text-cyan-400 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2 mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07172b] border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>CYBERSECURITY TRAINING PLATFORM</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              QUOR<span className="text-cyan-400">VANE</span>
            </h1>
            <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mt-1">
              SECURING THE DIGITAL FUTURE
            </p>
          </div>

          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            A structured environment for ethical hacking, penetration testing methodologies, cybersecurity education, and practical cyber range training.
          </p>
        </motion.div>

        {/* Professional Status Progress Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="w-full p-4 rounded-xl bg-[#091220]/90 border border-slate-800 shadow-soft text-left text-xs space-y-2"
        >
          <div className="flex items-center justify-between font-semibold text-slate-300 pb-2 border-b border-slate-800">
            <span className="flex items-center gap-2 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              System Initialization
            </span>
            <span className="text-cyan-400 font-mono text-[11px]">
              {Math.min(100, Math.round(((activeLine + 1) / BOOT_SEQUENCES.length) * 100))}%
            </span>
          </div>

          <div className="text-slate-300 font-mono text-[11px] h-6 flex items-center">
            {BOOT_SEQUENCES[activeLine]}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-cyan-400"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeLine + 1) / BOOT_SEQUENCES.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.div>

        {/* Enter Platform Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 w-full"
        >
          <button
            id="btn-enter-platform"
            onClick={onComplete}
            className="w-full py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm tracking-wide uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>ENTER QUORVANE PLATFORM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Footer Note */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-500 font-medium px-4">
        100% Authorized Ethical Cybersecurity Simulation Environment
      </div>
    </motion.div>
  );
};
