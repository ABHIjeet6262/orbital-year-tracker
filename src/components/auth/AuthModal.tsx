import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useTracker } from '../../context/TrackerContext';
import {
  X,
  User,
  Check,
  ShieldCheck,
  Mail,
  Lock,
  Cloud,
  CloudOff,
  RefreshCw,
  Sparkles,
  LogOut,
  UploadCloud,
  AlertCircle,
} from 'lucide-react';
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithMagicLink,
  signOutCloud,
  generateUniqueId,
} from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthTab = 'signin' | 'signup' | 'magic';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser, syncStatus, isCloudConnected, syncLocalToCloud } = useTracker();
  const [tab, setTab] = useState<AuthTab>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mergeLocalData, setMergeLocalData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [syncingLocal, setSyncingLocal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Strength Evaluator
  const passwordStrength = useMemo(() => {
    if (!password) return { label: '', score: 0, color: 'bg-stone-300' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (score <= 3) return { label: 'Fair', score: 2, color: 'bg-amber-500' };
    return { label: 'Strong', score: 3, color: 'bg-emerald-500' };
  }, [password]);

  if (!isOpen) return null;

  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    if (tab !== 'magic' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (!isCloudConnected) {
      // Local fallback mode when Supabase is not configured
      setUser({
        id: generateUniqueId('local-user'),
        name: name.trim() || email.split('@')[0],
        email: email.trim(),
        isGuest: true, // Marked as guest with personalized name for clean semantics
      });
      setSuccessMsg('Profile personalized and saved locally on this device!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
      return;
    }

    setLoading(true);
    try {
      if (tab === 'signup') {
        const { data, error } = await signUpWithPassword(email, password, name);
        if (error) throw error;

        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            name: name.trim() || email.split('@')[0],
            email: data.session.user.email,
            isGuest: false,
          });
          if (mergeLocalData) {
            await syncLocalToCloud();
          }
          setSuccessMsg('Account created and local data synced to cloud!');
        } else {
          setSuccessMsg('Confirmation email sent! Please check your inbox to complete verification.');
        }
      } else if (tab === 'signin') {
        const { data, error } = await signInWithPassword(email, password);
        if (error) throw error;

        if (data.session?.user) {
          setUser({
            id: data.session.user.id,
            name: data.session.user.user_metadata?.name || email.split('@')[0],
            email: data.session.user.email,
            isGuest: false,
          });
          if (mergeLocalData) {
            await syncLocalToCloud();
          }
          setSuccessMsg('Signed in! Cloud synchronization active.');
        }
      } else if (tab === 'magic') {
        const { error } = await signInWithMagicLink(email);
        if (error) throw error;
        setSuccessMsg('Magic login link sent to your email! Click the link to log in.');
      }

      setTimeout(() => {
        if (tab !== 'magic' && (!successMsg.includes('Confirmation') || successMsg.includes('Signed in'))) {
          onClose();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSync = async () => {
    setSyncingLocal(true);
    const success = await syncLocalToCloud();
    setSyncingLocal(false);
    if (success) {
      setSuccessMsg('All current habits, goals & history synced to cloud!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } else {
      setErrorMsg('Failed to sync to cloud. Please check your network connection.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  const handleLogout = async () => {
    if (isCloudConnected) {
      await signOutCloud();
    }
    setUser({
      id: 'guest-1',
      name: 'Guest Traveler',
      isGuest: true,
    });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <User size={18} className="text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              {!user.isGuest ? 'Cloud Account' : 'Account & Sync'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="py-4 my-2 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3">
            <div className="w-9 h-9 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check size={18} />
            </div>
            <p className="text-xs font-medium text-emerald-900 dark:text-emerald-200">
              {successMsg}
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center gap-2 my-2 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl p-2.5">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Logged-In User Profile View */}
        {!user.isGuest ? (
          <div className="py-4 space-y-4">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60 space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-[10px] text-stone-400 uppercase font-semibold">
                  Signed in as
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                  {syncStatus === 'syncing' ? (
                    <>
                      <RefreshCw size={11} className="animate-spin" /> Syncing...
                    </>
                  ) : syncStatus === 'synced' ? (
                    <>
                      <Cloud size={11} /> Cloud Synced
                    </>
                  ) : (
                    <>
                      <CloudOff size={11} /> Offline Cached
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {user.name}
              </div>
              {user.email && (
                <div className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {user.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={handleManualSync}
                disabled={syncingLocal}
                className="w-full py-2 px-3 text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {syncingLocal ? (
                  <RefreshCw size={13} className="animate-spin" />
                ) : (
                  <UploadCloud size={14} />
                )}
                <span>Force Sync Local Data to Cloud</span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 px-1">
                <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Protected with PostgreSQL Row-Level Security</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut size={13} />
              <span>Sign Out / Return to Guest</span>
            </button>
          </div>
        ) : (
          /* Guest Mode / Auth Forms */
          <div className="mt-4 space-y-4">
            {/* Tab Navigation */}
            <div className="flex p-0.5 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200/60 dark:border-stone-700">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('magic');
                  setErrorMsg('');
                }}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  tab === 'magic'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                Magic Link
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {tab === 'signup' && (
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3 top-2.5 text-stone-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {tab !== 'magic' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                      Password
                    </label>
                    {tab === 'signup' && password && (
                      <span className="text-[10px] text-stone-500 font-medium">
                        Strength: <strong className={passwordStrength.score >= 3 ? 'text-emerald-600 dark:text-emerald-400' : passwordStrength.score === 2 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>{passwordStrength.label}</strong>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock
                      size={14}
                      className="absolute left-3 top-2.5 text-stone-400"
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  {/* Password Strength Progress Bar */}
                  {tab === 'signup' && password && (
                    <div className="w-full h-1 bg-stone-100 dark:bg-stone-800 rounded-full mt-1.5 overflow-hidden flex gap-0.5">
                      <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 1 ? passwordStrength.color : 'opacity-20 bg-stone-400'}`} />
                      <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 2 ? passwordStrength.color : 'opacity-20 bg-stone-400'}`} />
                      <div className={`h-full flex-1 transition-all ${passwordStrength.score >= 3 ? passwordStrength.color : 'opacity-20 bg-stone-400'}`} />
                    </div>
                  )}
                </div>
              )}

              {/* Merge Local Data Checkbox */}
              {tab !== 'magic' && (
                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mergeLocalData}
                    onChange={(e) => setMergeLocalData(e.target.checked)}
                    className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Upload & sync current local habits to this account</span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>
                  {loading
                    ? 'Processing...'
                    : tab === 'signup'
                    ? 'Create Account & Sync'
                    : tab === 'signin'
                    ? 'Sign In to Account'
                    : 'Send Magic Link'}
                </span>
              </button>
            </form>

            <div className="text-[11px] text-stone-400 dark:text-stone-500 text-center leading-relaxed">
              {isCloudConnected
                ? '🔒 Protected with PostgreSQL Row-Level Security and encrypted tokens.'
                : '💡 All tracker data is saved securely to your browser storage.'}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
