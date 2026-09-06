import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTracker } from '../../context/TrackerContext';
import { X, User, Check, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useTracker();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setUser({
      id: `user-${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      isGuest: false,
    });

    setSuccessMsg(
      isSignUp
        ? 'Account created! All your guest data has been synced.'
        : 'Logged in! Your yearly progress is active.'
    );

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleLogout = () => {
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
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <User size={18} className="text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              {!user.isGuest
                ? 'Your Account'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Check size={24} />
            </div>
            <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
              {successMsg}
            </p>
          </div>
        ) : !user.isGuest ? (
          <div className="py-4 space-y-4">
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
              <div className="text-xs text-stone-400 uppercase font-semibold">
                Signed in as
              </div>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                {user.name}
              </div>
              {user.email && (
                <div className="text-xs text-stone-500 font-mono mt-0.5">
                  {user.email}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
              <ShieldCheck size={16} />
              <span>Data automatically saved & synced to device</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900/50 transition-colors cursor-pointer"
            >
              Switch to Guest Mode
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            <div className="text-xs text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-200/50 dark:border-stone-700/50">
              You are in <strong>Guest Mode</strong>. Creating an account preserves all your existing habits, goals, and history.
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-3 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-3 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-medium bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl hover:opacity-90 transition-opacity mt-2 cursor-pointer"
            >
              {isSignUp ? 'Create & Sync Account' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:underline cursor-pointer"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
