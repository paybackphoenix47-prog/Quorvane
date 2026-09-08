import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  auth, 
  fetchUserProfile, 
  updateUserProfileInDb, 
  createUserProfileInDb 
} from './lib/firebase';
import type { UserProfile, ViewTab } from './types';
import { NetworkBackground } from './components/NetworkBackground';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { FrameworkView } from './components/FrameworkView';
import { AcademyView } from './components/AcademyView';
import { CyberRangeView } from './components/CyberRangeView';
import { ClearanceGate } from './components/ClearanceGate';
import { AboutView } from './components/AboutView';
import { AuthModal } from './components/AuthModal';
import { Shield, RotateCcw, Award, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<ViewTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [pendingRedirectTab, setPendingRedirectTab] = useState<ViewTab | null>(null);

  // Deep-selection targets when navigating from dashboard
  const [selectedStageId, setSelectedStageId] = useState<string | undefined>();
  const [selectedModuleId, setSelectedModuleId] = useState<string | undefined>();
  const [selectedLabId, setSelectedLabId] = useState<string | undefined>();

  // Toast / Achievement Unlock notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Profile State: starts as unauthenticated guest analyst (null) unless session is cached
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('quorvane_operator_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.id && parsed.id !== 'guest_operator') return parsed;
      } catch (e) {
        // ignore
      }
    }
    return null;
  });

  const isAuthenticated = Boolean(userProfile && userProfile.id && userProfile.id !== 'guest_operator');
  const isProtectedTab = ['framework', 'academy', 'training', 'range', 'dashboard', 'tools'].includes(activeTab);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin', targetTab?: ViewTab) => {
    setAuthModalMode(mode);
    if (targetTab) {
      setPendingRedirectTab(targetTab);
    }
    setAuthModalOpen(true);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          localStorage.setItem('quorvane_operator_profile', JSON.stringify(profile));
        } else {
          const newProfile: UserProfile = {
            id: user.uid,
            username: user.displayName || user.email?.split('@')[0] || 'Operator',
            email: user.email || 'operator@quorvane.sec',
            role: 'operator',
            xp: 250,
            level: 1,
            completedLabs: [],
            completedModules: [],
            completedStages: [],
            achievements: ['ach-first-lab'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await createUserProfileInDb(newProfile);
          setUserProfile(newProfile);
          localStorage.setItem('quorvane_operator_profile', JSON.stringify(newProfile));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Gamification: Award XP & Level Calculation
  const addXpAndSync = async (amount: number, updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const currentXp = (prev?.xp || 0) + amount;
      const newLevel = Math.max(1, Math.floor(currentXp / 500) + 1);

      const base: UserProfile = prev || {
        id: 'operator_' + Math.random().toString(36).substring(2, 8),
        username: 'Operator',
        email: 'operator@quorvane.sec',
        role: 'operator',
        xp: 0,
        level: 1,
        completedLabs: [],
        completedModules: [],
        completedStages: [],
        achievements: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated: UserProfile = {
        ...base,
        ...updates,
        xp: currentXp,
        level: newLevel,
        updatedAt: new Date().toISOString()
      };

      // Check achievement triggers
      const newAchievements = [...updated.achievements];
      if (updated.completedLabs.length >= 1 && !newAchievements.includes('ach-first-lab')) {
        newAchievements.push('ach-first-lab');
        triggerToast('🏆 ACHIEVEMENT UNLOCKED: First Breach Neutralized (+100 XP)');
      }
      if (updated.completedStages.length >= 7 && !newAchievements.includes('ach-all-stages')) {
        newAchievements.push('ach-all-stages');
        triggerToast('🏆 ACHIEVEMENT UNLOCKED: Framework Architect (+300 XP)');
      }
      if (updated.completedModules.length >= 12 && !newAchievements.includes('ach-academy-grad')) {
        newAchievements.push('ach-academy-grad');
        triggerToast('🏆 ACHIEVEMENT UNLOCKED: Quorvane Academy Master (All 12 Modules Mastered) (+500 XP)');
      }

      updated.achievements = newAchievements;

      // Sync to Firebase if authenticated or local storage
      localStorage.setItem('quorvane_operator_profile', JSON.stringify(updated));
      updateUserProfileInDb(updated.id, updated).catch(console.error);

      return updated;
    });

    triggerToast(`+${amount} XP Awarded to Operator Dossier`);
  };

  // Toggle Framework Stage completion
  const handleToggleCompleteStage = (stageId: string) => {
    const stages = userProfile?.completedStages || [];
    const isDone = stages.includes(stageId);
    let updatedStages: string[];
    let xpGain = 0;

    if (isDone) {
      updatedStages = stages.filter((id) => id !== stageId);
    } else {
      updatedStages = [...stages, stageId];
      xpGain = 100;
    }

    addXpAndSync(xpGain, { completedStages: updatedStages });
  };

  // Complete Academy Module
  const handleCompleteModule = (moduleId: string, xpReward: number) => {
    const modules = userProfile?.completedModules || [];
    if (!modules.includes(moduleId)) {
      const updatedModules = [...modules, moduleId];
      addXpAndSync(xpReward, { completedModules: updatedModules });
    }
  };

  // Complete Cyber Range Lab
  const handleCompleteLab = (labId: string, xpReward: number) => {
    const labs = userProfile?.completedLabs || [];
    if (!labs.includes(labId)) {
      const updatedLabs = [...labs, labId];
      addXpAndSync(xpReward, { completedLabs: updatedLabs });
    } else {
      triggerToast('Lab already cleared in operator record.');
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
    setUserProfile(null);
    localStorage.removeItem('quorvane_operator_profile');
    setActiveTab('home');
    triggerToast('Signed out. Public guest session active.');
  };

  const handleDemoLogin = () => {
    const guest: UserProfile = {
      id: 'op_guest_' + Math.random().toString(36).substring(2, 7),
      username: 'Ghost_Operator',
      email: 'ghost@quorvane.sec',
      role: 'operator',
      xp: 350,
      level: 1,
      completedLabs: ['lab-password-1'],
      completedModules: ['mod-fundamentals-1'],
      completedStages: ['stage-1'],
      achievements: ['ach-first-lab'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setUserProfile(guest);
    localStorage.setItem('quorvane_operator_profile', JSON.stringify(guest));
    triggerToast('Guest Operator clearance granted: Welcome, Ghost_Operator');
    if (pendingRedirectTab) {
      setActiveTab(pendingRedirectTab);
      setPendingRedirectTab(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0e] text-slate-200 font-sans relative selection:bg-cyan-500 selection:text-slate-950 flex flex-col cyber-grid-dark">
      {/* Interactive Ambient Canvas Background */}
      <NetworkBackground />

      {/* Cinematic Intro (Shows on first load or when user clicks Replay Intro) */}
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Global Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        userProfile={userProfile}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'signin')}
        onSignOut={handleSignOut}
      />

      {/* Toast Notification Banner for Achievements and XP */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 p-4 rounded-xl bg-[#091527]/95 border border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] text-xs font-semibold text-white animate-bounce backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16 z-10">
        {/* Unauthenticated Protection Gate for Framework, Training, Cyber Range, Dashboard */}
        {!isAuthenticated && isProtectedTab ? (
          <ClearanceGate
            targetTab={activeTab}
            onOpenAuth={() => handleOpenAuth('signin', activeTab)}
            onBackToHome={() => setActiveTab('home')}
            onDemoLogin={handleDemoLogin}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <div className="space-y-8">
                <LandingHero
                  onExplore={() => setActiveTab('dashboard')}
                  onOpenAuth={(mode) => handleOpenAuth(mode || 'signup', 'dashboard')}
                  onNavigateTab={(tab) => {
                    setActiveTab(tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  isAuthenticated={isAuthenticated}
                  userProfile={userProfile}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <DashboardView
                userProfile={userProfile || {
                  id: 'guest_operator',
                  username: 'Guest_Analyst',
                  email: 'guest@quorvane.internal',
                  role: 'trainee',
                  xp: 150,
                  level: 1,
                  completedLabs: [],
                  completedModules: [],
                  completedStages: [],
                  achievements: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectStage={(stageId) => {
                  setSelectedStageId(stageId);
                  setActiveTab('framework');
                }}
                onSelectModule={(moduleId) => {
                  setSelectedModuleId(moduleId);
                  setActiveTab('academy');
                }}
                onSelectLab={(labId) => {
                  setSelectedLabId(labId);
                  setActiveTab('range');
                }}
              />
            )}

            {(activeTab === 'framework' || activeTab === 'tools') && (
              <FrameworkView
                userProfile={userProfile || {
                  id: 'guest_operator',
                  username: 'Guest_Analyst',
                  email: 'guest@quorvane.internal',
                  role: 'trainee',
                  xp: 150,
                  level: 1,
                  completedLabs: [],
                  completedModules: [],
                  completedStages: [],
                  achievements: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                selectedStageId={selectedStageId}
                onToggleCompleteStage={handleToggleCompleteStage}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {(activeTab === 'academy' || activeTab === 'training') && (
              <AcademyView
                userProfile={userProfile || {
                  id: 'guest_operator',
                  username: 'Guest_Analyst',
                  email: 'guest@quorvane.internal',
                  role: 'trainee',
                  xp: 150,
                  level: 1,
                  completedLabs: [],
                  completedModules: [],
                  completedStages: [],
                  achievements: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                selectedModuleId={selectedModuleId}
                onCompleteModule={handleCompleteModule}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'range' && (
              <CyberRangeView
                userProfile={userProfile || {
                  id: 'guest_operator',
                  username: 'Guest_Analyst',
                  email: 'guest@quorvane.internal',
                  role: 'trainee',
                  xp: 150,
                  level: 1,
                  completedLabs: [],
                  completedModules: [],
                  completedStages: [],
                  achievements: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }}
                selectedLabId={selectedLabId}
                onCompleteLab={handleCompleteLab}
                onBackToHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'about' && (
              <AboutView 
                onBackToHome={() => setActiveTab('home')} 
                onNavigateTab={(tab) => setActiveTab(tab)} 
              />
            )}
          </>
        )}
      </main>

      {/* Global Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-[#050b14] text-slate-300 py-8 px-4 sm:px-8 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="font-extrabold text-white tracking-wide">QUORVANE</span>
            </div>
            <span className="hidden sm:inline text-slate-700">&bull;</span>
            <span className="text-cyan-400 font-bold tracking-wider uppercase text-[10px]">SECURING THE DIGITAL FUTURE</span>
            <span className="hidden sm:inline text-slate-700">&bull;</span>
            <span className="text-slate-400 text-[11px]">Authorized Training Environment Only</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setShowIntro(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay Cinematic Intro</span>
            </button>
            <span className="text-slate-700">&bull;</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(profile) => {
          setUserProfile(profile);
          localStorage.setItem('quorvane_operator_profile', JSON.stringify(profile));
          triggerToast(`Clearance Verified: Welcome, Operator ${profile.username}`);
          if (pendingRedirectTab) {
            setActiveTab(pendingRedirectTab);
            setPendingRedirectTab(null);
          } else if (activeTab === 'home') {
            setActiveTab('dashboard');
          }
        }}
        onDemoLogin={handleDemoLogin}
      />
    </div>
  );
}
