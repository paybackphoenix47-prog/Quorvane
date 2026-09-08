import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User as UserIcon, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth, createUserProfileInDb, fetchUserProfile } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (profile: UserProfile) => void;
  onDemoLogin: () => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onDemoLogin,
  initialMode = 'signin'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fallbackLocalAvailable, setFallbackLocalAvailable] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleContinueAsLocal = (targetName?: string, targetEmail?: string) => {
    const chosenName = (targetName || username || email.split('@')[0] || 'Operator').trim();
    const chosenEmail = (targetEmail || email || `${chosenName.toLowerCase()}@quorvane.local`).trim();

    const localProfile: UserProfile = {
      id: 'local_' + Math.random().toString(36).substring(2, 10),
      email: chosenEmail,
      username: chosenName,
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

    createUserProfileInDb(localProfile);
    onSuccess(localProfile);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    setFallbackLocalAvailable(false);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      let profile = await fetchUserProfile(user.uid);
      if (!profile) {
        profile = {
          id: user.uid,
          email: user.email || 'operator@quorvane.sec',
          username: user.displayName || user.email?.split('@')[0] || 'Operator',
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
        await createUserProfileInDb(profile);
      }
      onSuccess(profile);
      onClose();
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in window closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Please allow popups or use Instant Guest Mode.');
        setFallbackLocalAvailable(true);
      } else if (err.code === 'auth/cancelled-popup-request') {
        setErrorMsg('Authentication request cancelled.');
      } else {
        setErrorMsg(err.message || 'Google sign-in could not be completed.');
        setFallbackLocalAvailable(true);
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    setFallbackLocalAvailable(false);

    try {
      if (mode === 'signup') {
        if (!username || username.trim().length < 3) {
          throw new Error('Call-Sign or name must be at least 3 characters long.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || email,
          username: username.trim(),
          role: 'trainee',
          xp: 100,
          level: 1,
          completedLabs: [],
          completedModules: [],
          completedStages: [],
          achievements: ['ach-first-lab'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await createUserProfileInDb(newProfile);
        onSuccess(newProfile);
        onClose();
      } else if (mode === 'signin') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let profile = await fetchUserProfile(user.uid);
        if (!profile) {
          profile = {
            id: user.uid,
            email: user.email || email,
            username: user.email?.split('@')[0] || 'Operator',
            role: 'operator',
            xp: 250,
            level: 1,
            completedLabs: [],
            completedModules: [],
            completedStages: [],
            achievements: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await createUserProfileInDb(profile);
        }
        onSuccess(profile);
        onClose();
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Encrypted password recovery link dispatched to your email.');
        setLoading(false);
      }
    } catch (err: any) {
      console.warn('Firebase Auth notice:', err);
      let message = 'An unexpected authentication error occurred.';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'Email & password login is disabled in Firebase for this project. Please use "Continue with Google" or click below to proceed with your Operator Call-Sign.';
        setFallbackLocalAvailable(true);
      } else if (err.code === 'auth/invalid-email') {
        message = 'Invalid email address provided.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'No registered operator found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        message = 'Invalid password.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'An account already exists with this email.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Password too short (minimum 6 characters).';
      } else if (err.message) {
        message = err.message;
      }
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0f1722] border border-slate-800 shadow-2xl text-white">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[#08182b] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {mode === 'signup' && 'Create Operator Account'}
              {mode === 'signin' && 'Sign In to QUORVANE'}
              {mode === 'reset' && 'Password Recovery'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Secure Operator Clearance &amp; Real-Time Progress Sync
            </p>
          </div>
        </div>

        {/* Primary OAuth Action: Continue with Google */}
        <div className="mb-5">
          <button
            id="btn-auth-google"
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl border border-slate-700 bg-[#090d14] hover:bg-[#131d2a] hover:border-slate-600 text-white font-bold text-xs flex items-center justify-center gap-3 shadow-sm transition-all cursor-pointer hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#0f1722] px-2 text-slate-500 font-semibold">Or with Email / Call-Sign</span>
          </div>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-[#1a0f12] border border-rose-800 text-rose-300 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
            {fallbackLocalAvailable && (
              <button
                type="button"
                onClick={() => handleContinueAsLocal()}
                className="w-full py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Continue as Local Operator ({username || email.split('@')[0] || 'Operator'})</span>
              </button>
            )}
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-[#08182b] border border-cyan-500/40 text-cyan-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Call-Sign or Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="input-auth-username"
                  type="text"
                  required
                  placeholder="e.g. Alex Hunter"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090d14] border border-slate-800 focus:border-cyan-400 text-sm text-white outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="input-auth-email"
                type="email"
                required
                placeholder="operator@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090d14] border border-slate-800 focus:border-cyan-400 text-sm text-white outline-none transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="input-auth-password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#090d14] border border-slate-800 focus:border-cyan-400 text-sm text-white outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>
          )}

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold tracking-wide uppercase text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="text-xs">Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'reset' && 'Send Recovery Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Operator Button */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#0f1722] px-2 text-slate-500 font-semibold">Or Instant Access</span>
          </div>
        </div>

        <button
          id="btn-demo-operator"
          type="button"
          onClick={() => {
            onDemoLogin();
            onClose();
          }}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-800 bg-[#090d14] hover:bg-[#131d2a] hover:border-cyan-500/30 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Instant Guest Operator Mode</span>
        </button>

        {/* Toggle Mode Links */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
          {mode === 'signin' && (
            <>
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-cyan-400 hover:underline font-bold cursor-pointer"
                >
                  Create Account
                </button>
              </p>
              <p>
                Forgot your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-slate-400 hover:underline cursor-pointer"
                >
                  Reset Password
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <p>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-cyan-400 hover:underline font-bold cursor-pointer"
              >
                Return to Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
