import React, { useState } from 'react';
import { 
  Shield, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  Zap, 
  User as UserIcon,
  Layers,
  BookOpen,
  Cpu,
  Wrench,
  Info,
  Home,
  LayoutDashboard
} from 'lucide-react';
import type { ViewTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  userProfile: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  userProfile,
  onOpenAuth,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact navigation items requested by user:
  // HOME, FRAMEWORK, TRAINING, CYBER RANGE, ABOUT
  // (Tools are integrated directly inside Framework Stages)
  const navItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'framework', label: 'Framework', icon: Shield },
    { id: 'academy', label: 'Training', icon: BookOpen },
    { id: 'range', label: 'Cyber Range', icon: Cpu },
    { id: 'about', label: 'About', icon: Info },
  ];

  const isAuthenticated = Boolean(userProfile && userProfile.id !== 'guest_operator');

  const handleTabClick = (tab: ViewTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#050b14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Name & Tagline */}
          <div className="flex items-center gap-3">
            <button
              id="nav-logo"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 group focus:outline-none cursor-pointer text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#081528] border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Shield className="w-5 h-5 text-cyan-400 fill-cyan-500/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  QUORVANE
                </span>
                <span className="text-[10px] font-semibold text-cyan-400 tracking-wider uppercase mt-1">
                  SECURING THE DIGITAL FUTURE
                </span>
              </div>
            </button>
          </div>

          {/* Center/Right Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'academy' && activeTab === 'training');
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`text-sm font-medium tracking-normal transition-all cursor-pointer py-1 relative ${
                    isActive
                      ? 'text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Side: LOGIN & CREATE ACCOUNT (Guest) OR Profile & Dashboard (Auth) */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && userProfile ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Direct Dashboard Access Button */}
                <button
                  id="btn-nav-dashboard"
                  onClick={() => handleTabClick('dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-[#091527] border-cyan-500/40 text-cyan-400 hover:border-cyan-300 hover:bg-[#0c1c34]'
                  }`}
                  title="Open Operator Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>

                {/* XP Pill */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#091527] border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>{userProfile.xp} XP</span>
                  <span className="text-slate-400 text-[10px]">LVL {userProfile.level}</span>
                </div>

                {/* Profile Badge with User Avatar, Username, and Logout */}
                <div className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl bg-[#091322] border border-slate-700/80 text-xs font-medium text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[11px] border border-cyan-500/30">
                    {userProfile.username ? userProfile.username.charAt(0).toUpperCase() : <UserIcon className="w-3 h-3" />}
                  </div>
                  <span className="max-w-[100px] sm:max-w-[130px] truncate font-semibold text-white">
                    {userProfile.username}
                  </span>
                  <button
                    id="btn-sign-out"
                    onClick={onSignOut}
                    title="Sign Out"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-[#131f32] transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-login"
                  onClick={() => onOpenAuth('signin')}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-[#091322] hover:bg-[#0e1f37] text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="btn-nav-create-account"
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer hover:-translate-y-0.5"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-800 bg-[#09111e] text-slate-300 hover:bg-[#0f1d33] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#060c16] px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          {/* Status info */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#091527] border border-cyan-500/20 text-xs text-slate-200 mb-3">
            <span className="flex items-center gap-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM STATUS: OPERATIONAL
            </span>
            {userProfile && (
              <span className="text-cyan-300 font-bold">{userProfile.xp} XP</span>
            )}
          </div>

          {isAuthenticated && (
            <button
              id="mobile-nav-dashboard"
              onClick={() => handleTabClick('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#0a1930] text-cyan-400 border border-cyan-500/40'
                  : 'text-cyan-300 hover:bg-[#0c1524]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Operator Dashboard</span>
            </button>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'academy' && activeTab === 'training');
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#0a1930] text-cyan-400 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-[#0c1524] hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <button
                id="btn-mobile-sign-out"
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 flex items-center justify-center gap-2 font-semibold cursor-pointer text-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out ({userProfile?.username})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-btn-login"
                  onClick={() => {
                    onOpenAuth('signin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl border border-slate-700 bg-[#091322] hover:bg-[#0e1f37] text-white font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="mobile-btn-create-account"
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center hover:bg-cyan-400 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
