import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Layers,
  Wrench,
  Activity, 
  Zap,
  Play,
  Server,
  BookOpen,
  ExternalLink,
  Check,
  LayoutDashboard
} from 'lucide-react';
import type { ViewTab, UserProfile } from '../types';
import { QuorvaneTerminal } from './QuorvaneTerminal';

interface LandingHeroProps {
  onExplore: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateTab: (tab: ViewTab) => void;
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onExplore,
  onOpenAuth,
  onNavigateTab,
  isAuthenticated,
  userProfile
}) => {
  return (
    <div className="relative pt-6 sm:pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Hero Section: Left Text + Right Terminal Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>CYBERSECURITY TRAINING PLATFORM</span>
          </div>

          {/* Large Clean Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Master Ethical Hacking.{' '}
            <span className="text-cyan-400 block mt-1">
              Build Cybersecurity Skills.
            </span>
          </h1>

          {/* Clean Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            QUORVANE provides structured ethical hacking education, penetration testing methodologies, 
            practical cybersecurity training, and simulated cyber-range environments for authorized learning.
          </p>

          {/* Functional CTA Buttons */}
          <div className="pt-2">
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="hero-open-dashboard-btn"
                  onClick={() => onNavigateTab('dashboard')}
                  className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-[0_0_25px_rgba(6,182,212,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-950" />
                  <span>OPEN DASHBOARD</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-continue-learning-btn"
                  onClick={() => onNavigateTab('academy')}
                  className="px-8 py-3.5 rounded-xl bg-[#091322] hover:bg-[#0f1f36] text-cyan-300 hover:text-cyan-200 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>CONTINUE LEARNING</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="hero-create-account-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5"
                >
                  <Shield className="w-4 h-4 text-slate-950" />
                  <span>CREATE ACCOUNT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-login-btn"
                  onClick={() => onOpenAuth('signin')}
                  className="px-6 py-3.5 rounded-xl bg-[#091322] hover:bg-[#0f1f36] text-cyan-300 hover:text-cyan-200 font-semibold text-sm border border-cyan-500/40 hover:border-cyan-400 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>LOGIN</span>
                </button>

                <button
                  id="hero-explore-platform-btn"
                  onClick={onExplore}
                  className="px-6 py-3.5 rounded-xl bg-[#060c16] hover:bg-[#0b1626] text-slate-300 hover:text-white font-medium text-sm border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-slate-400" />
                  <span>EXPLORE PLATFORM</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Kali-grade QUORVANE Terminal */}
        <div className="lg:col-span-5">
          <QuorvaneTerminal 
            contextTarget="target-corp.internal" 
            heightClass="h-[380px]"
          />
        </div>
      </div>

      {/* DASHBOARD / SYSTEM HUD SECTION (Section 11) */}
      <div className="mt-16 pt-12 border-t border-slate-800/60">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">
            OPERATIONAL METRICS &amp; STATUS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            QUORVANE System HUD
          </h2>
        </div>

        {/* 4 Status Cards: Operational, Online, Ready, Active */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 shadow-soft">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              System Status
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-lg font-bold text-cyan-400 tracking-wide">
                OPERATIONAL
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 shadow-soft">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Training
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-lg font-bold text-cyan-400 tracking-wide">
                ONLINE
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 shadow-soft">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Cyber Range
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-lg font-bold text-cyan-400 tracking-wide">
                READY
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#091322] border border-slate-800 shadow-soft">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Security
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-lg font-bold text-cyan-400 tracking-wide">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Metric Cards: Framework Stages, Training Modules, Completed Lessons, Cyber Range Labs, Security Tools */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <button
            onClick={() => onNavigateTab('framework')}
            className="p-5 rounded-2xl bg-[#081220] hover:bg-[#0c1a2e] border border-slate-800 hover:border-cyan-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-white">07</div>
            <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              Framework Stages
            </div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">Recon to Defense →</div>
          </button>

          <button
            onClick={() => onNavigateTab('academy')}
            className="p-5 rounded-2xl bg-[#081220] hover:bg-[#0c1a2e] border border-slate-800 hover:border-cyan-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-white">12</div>
            <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              Training Modules
            </div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">Full Lectures →</div>
          </button>

          <button
            onClick={() => onNavigateTab('range')}
            className="p-5 rounded-2xl bg-[#081220] hover:bg-[#0c1a2e] border border-slate-800 hover:border-cyan-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-white">06</div>
            <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              Cyber Range Labs
            </div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">Safe Simulation →</div>
          </button>

          <button
            onClick={() => onNavigateTab('framework')}
            className="p-5 rounded-2xl bg-[#081220] hover:bg-[#0c1a2e] border border-slate-800 hover:border-cyan-500/40 text-center transition-all cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-white">18+</div>
            <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              Security Tools
            </div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">Integrated in Stages →</div>
          </button>

          <div className="p-5 rounded-2xl bg-[#081220] border border-slate-800 text-center col-span-2 sm:col-span-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-3xl font-extrabold text-cyan-400">100%</div>
            <div className="text-xs font-semibold text-slate-300 mt-1 uppercase tracking-wider">
              Authorized Enclave
            </div>
            <div className="text-[10px] text-cyan-400 mt-1 font-mono">Controlled Labs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

