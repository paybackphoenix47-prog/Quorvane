import React from 'react';
import { 
  Shield, 
  Cpu, 
  BookOpen, 
  Award, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  ExternalLink,
  Lock,
  Search,
  Server,
  AlertCircle
} from 'lucide-react';
import type { UserProfile, ViewTab } from '../types';
import { FRAMEWORK_STAGES, ACADEMY_MODULES, CYBER_LABS, ACHIEVEMENTS } from '../data/cyberContent';

interface DashboardViewProps {
  userProfile: UserProfile;
  onNavigateTab: (tab: ViewTab) => void;
  onSelectStage?: (stageId: string) => void;
  onSelectModule?: (moduleId: string) => void;
  onSelectLab?: (labId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  onNavigateTab,
  onSelectStage,
  onSelectModule,
  onSelectLab
}) => {
  const frameworkPercent = Math.round((userProfile.completedStages.length / FRAMEWORK_STAGES.length) * 100);
  const academyPercent = Math.round((userProfile.completedModules.length / ACADEMY_MODULES.length) * 100);
  const labPercent = Math.round((userProfile.completedLabs.length / CYBER_LABS.length) * 100);
  const overallScore = Math.round((frameworkPercent + academyPercent + labPercent) / 3);

  // Next recommended module to continue
  const nextModule = ACADEMY_MODULES.find(m => !userProfile.completedModules.includes(m.id)) || ACADEMY_MODULES[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Welcome Operator Dossier Banner (Electric Cyan Header Section) */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-[#061224] text-white border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.12)] overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#091b34] border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>CLEARANCE TIER: LEVEL {userProfile.level} {userProfile.role.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-cyan-400">{userProfile.username}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              QUORVANE Defensive Simulation Enclave is active. All simulated ranges, training modules, and testing utilities are calibrated for safe authorized execution.
            </p>
          </div>

          {/* XP & Level Badge Box */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#030914] border border-cyan-500/30 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex flex-col items-center justify-center text-cyan-400 shadow-xs">
              <Zap className="w-6 h-6 fill-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-cyan-400">{userProfile.xp} XP</div>
              <div className="text-xs text-slate-400 font-medium">Experience Points</div>
              <div className="w-32 h-1.5 rounded-full bg-slate-800 mt-2 overflow-hidden">
                <div 
                  className="h-full bg-cyan-400" 
                  style={{ width: `${Math.min((userProfile.xp % 500) / 5, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Overview Cards - Clean Modern Dark SaaS Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Progress */}
        <div className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span>Overall Readiness</span>
            <span className="text-cyan-400 font-bold bg-[#07172b] px-2 py-0.5 rounded-md border border-cyan-500/30">
              {overallScore}%
            </span>
          </div>
          <div className="text-xl font-bold text-white mb-2">Defensive Mastery</div>
          <div className="w-full h-2 rounded-full bg-[#040810] overflow-hidden mb-3 border border-slate-800/80">
            <div className="h-full bg-cyan-400 rounded-full transition-all duration-500" style={{ width: `${overallScore}%` }} />
          </div>
          <p className="text-xs text-slate-400">Aggregated across all academy &amp; lab curricula</p>
        </div>

        {/* Framework Progress */}
        <div 
          onClick={() => onNavigateTab('framework')}
          className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Shield className="w-3.5 h-3.5" />
              Framework
            </span>
            <span className="font-bold text-slate-300">{userProfile.completedStages.length} / {FRAMEWORK_STAGES.length}</span>
          </div>
          <div className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            7-Stage Framework
          </div>
          <div className="w-full h-2 rounded-full bg-[#040810] overflow-hidden mb-3 border border-slate-800/80">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${frameworkPercent}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-semibold">
            <span>{frameworkPercent}% Mastered</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Training Progress */}
        <div 
          onClick={() => onNavigateTab('academy')}
          className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5 text-slate-200 font-bold">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Academy
            </span>
            <span className="font-bold text-slate-300">{userProfile.completedModules.length} / {ACADEMY_MODULES.length}</span>
          </div>
          <div className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            Training Modules
          </div>
          <div className="w-full h-2 rounded-full bg-[#040810] overflow-hidden mb-3 border border-slate-800/80">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${academyPercent}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-semibold">
            <span>{academyPercent}% Completed</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Cyber Range Activity */}
        <div 
          onClick={() => onNavigateTab('range')}
          className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              Cyber Range
            </span>
            <span className="font-bold text-slate-300">{userProfile.completedLabs.length} / {CYBER_LABS.length}</span>
          </div>
          <div className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            Simulated Labs
          </div>
          <div className="w-full h-2 rounded-full bg-[#040810] overflow-hidden mb-3 border border-slate-800/80">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${labPercent}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 font-semibold">
            <span>{labPercent}% Cleared</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Missions & Security Hygiene */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Next Recommended Modules & Labs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Continue Next Mission Banner */}
          <div className="p-6 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  RECOMMENDED NEXT TRAINING SEQUENCE
                </h3>
              </div>
              <span className="text-xs font-bold text-cyan-300 bg-[#07172b] border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                +{nextModule.xpReward} XP
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                  Module 0{nextModule.number} · {nextModule.category}
                </span>
                <h4 className="text-xl font-bold text-white mt-0.5">
                  {nextModule.title}
                </h4>
                <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {nextModule.summary}
                </p>
              </div>

              <button
                id="btn-continue-next-module"
                onClick={() => {
                  if (onSelectModule) onSelectModule(nextModule.id);
                  onNavigateTab('academy');
                }}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:-translate-y-0.5"
              >
                <span>LAUNCH MODULE</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          </div>

          {/* Quick Launch Cyber Range Labs */}
          <div className="p-6 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  CYBER RANGE LABORATORIES (QUICK LAUNCH)
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('range')}
                className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All Labs
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CYBER_LABS.slice(0, 4).map((lab) => {
                const isDone = userProfile.completedLabs.includes(lab.id);
                return (
                  <div
                    key={lab.id}
                    onClick={() => {
                      if (onSelectLab) onSelectLab(lab.id);
                      onNavigateTab('range');
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isDone
                        ? 'bg-[#061426]/70 border-cyan-500/40 shadow-xs'
                        : 'bg-[#050b14] border-slate-800 hover:border-cyan-500/50 hover:bg-[#091220]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-1.5">
                        <span className="text-slate-400 uppercase">{lab.category}</span>
                        {isDone ? (
                          <span className="text-cyan-400 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                            CLEARED
                          </span>
                        ) : (
                          <span className="text-cyan-300 font-bold">+{lab.xpReward} XP</span>
                        )}
                      </div>
                      <h5 className="text-sm font-bold text-white line-clamp-1">
                        {lab.title}
                      </h5>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/80">
                      <span>{lab.difficulty} · {lab.duration}</span>
                      <span className="text-cyan-400 font-bold">Launch &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Operational Reminders & Ethical Boundaries */}
          <div className="p-5 rounded-2xl bg-[#061426]/60 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3.5">
            <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase tracking-wide">
                OPERATIONAL SECURITY NOTICE &amp; RULES OF ENGAGEMENT
              </h5>
              <p className="text-slate-300 leading-relaxed">
                All assessments in QUORVANE execute in isolated, synthetic training environments. 
                Never apply offensive scans, exploits, or payload injections to external networks, servers, or APIs 
                without explicit, signed bilateral authorization from the rightful system owner.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Achievements & Security Hygiene Tip */}
        <div className="lg:col-span-4 space-y-6">
          {/* Achievements Gallery */}
          <div className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  OPERATOR ACHIEVEMENTS
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {userProfile.achievements.length} / {ACHIEVEMENTS.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {ACHIEVEMENTS.map((ach) => {
                const isUnlocked = userProfile.achievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                      isUnlocked
                        ? 'bg-[#061528]/80 border-cyan-500/40 text-white'
                        : 'bg-[#050b14] border-slate-800/80 opacity-60 text-slate-500'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isUnlocked ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                          {ach.title}
                        </h5>
                        <span className="text-[11px] font-bold text-cyan-400">+{ach.xp} XP</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-normal">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Defensive Tip */}
          <div className="p-5 rounded-2xl bg-[#09111e] border border-slate-800 shadow-soft">
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-800 text-xs font-bold text-cyan-400 uppercase">
              <Zap className="w-4 h-4 text-cyan-400" />
              DAILY DEFENSIVE HYGIENE TIP
            </div>
            <h5 className="text-sm font-bold text-white">
              Deprecate Legacy Hashes in APIs
            </h5>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Never use MD5 or SHA-1 for message signatures or integrity tokens. Even SHA-256 is insufficient for password storage due to rapid GPU throughput. Migrate to memory-hard Argon2id with random 128-bit salts.
            </p>
            <button
              onClick={() => onNavigateTab('framework')}
              className="mt-3 text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Test Stage 1 &amp; 3 Cryptographic Tools &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
