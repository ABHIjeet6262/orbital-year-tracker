import React, { useState, useRef } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  BarChart2,
  Download,
  Upload,
  RotateCcw,
  User,
  Printer,
  Smartphone,
  Home,
  Sparkles,
  Cloud,
  CloudOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { YearlyStatsModal } from '../stats/YearlyStatsModal';
import { InstallAppModal } from '../common/InstallAppModal';

export const Header: React.FC = () => {
  const {
    year,
    setYear,
    pageTheme,
    setPageTheme,
    user,
    syncStatus,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
    returnToLanding,
    startTour,
  } = useTracker();

  const { isInstallable, promptInstall } = usePWAInstall();
  const isElectron = typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    const dataStr = exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orbital-year-tracker-${year}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowSettingsMenu(false);
    showToast('Tracker data exported (PII scrubbed)', 'success');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
    setShowSettingsMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          showToast('Data verified & imported successfully!', 'success');
        } else {
          showToast('Invalid backup file. Import rejected for safety.', 'error');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePrint = () => {
    window.print();
    setShowSettingsMenu(false);
  };

  const handleConfirmReset = () => {
    resetToSampleData();
    setShowResetConfirm(false);
    showToast('Reset to default dataset', 'success');
  };

  return (
    <header className="w-full border-b border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <button
          onClick={returnToLanding}
          className="flex items-center gap-3 text-left group cursor-pointer"
          title="Return to Home Showcase"
        >
          {/* Minimal concentric rings SVG logo */}
          <div className="w-8 h-8 rounded-full border-2 border-emerald-700 dark:border-emerald-400 flex items-center justify-center p-1 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full border border-dashed border-emerald-600 dark:border-emerald-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" />
            </div>
          </div>
          <div>
            <h1 className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 flex items-center gap-2">
              ORBITAL
              <span className="text-[10px] uppercase font-sans tracking-widest px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-normal">
                Year Tracker
              </span>
            </h1>
          </div>
        </button>

        {/* Year Navigator (Center) */}
        <div className="flex items-center gap-1 sm:gap-2 bg-stone-100/80 dark:bg-stone-800/80 px-2 py-1 rounded-full border border-stone-200/50 dark:border-stone-700/50 shadow-2xs">
          <button
            onClick={() => setYear(year - 1)}
            aria-label="Previous year"
            className="p-1 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-serif font-medium text-sm sm:text-base px-2 text-stone-900 dark:text-stone-100 select-none">
            {year}
          </span>
          <button
            onClick={() => setYear(year + 1)}
            aria-label="Next year"
            className="p-1 rounded-full text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right Tools: Stats, PWA Install / Desktop Badge, Light/Dark Theme, User, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop App Badge or PWA Install Button */}
          {isElectron ? (
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 shadow-2xs"
              title="Running in Standalone Desktop Application"
            >
              <Smartphone size={13} />
              <span>Desktop App</span>
            </div>
          ) : (
            <button
              onClick={() => {
                if (isInstallable) {
                  promptInstall();
                } else {
                  setIsInstallModalOpen(true);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Install App to Desktop / Home Screen"
            >
              <Smartphone size={14} />
              <span className="hidden md:inline">Install App</span>
            </button>
          )}

          {/* Stats Button */}
          <button
            onClick={() => setIsStatsOpen(true)}
            className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Annual Stats & Consistency"
          >
            <BarChart2 size={16} />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Clean 2-State Page Theme Switcher: Light (White) / Dark */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl border border-stone-200/60 dark:border-stone-700">
            <button
              onClick={() => setPageTheme('light')}
              title="Light (White/Paper) Theme"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                pageTheme === 'light'
                  ? 'bg-white text-amber-600 shadow-2xs'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              <Sun size={14} />
            </button>
            <button
              onClick={() => setPageTheme('dark')}
              title="Dark Theme"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                pageTheme === 'dark'
                  ? 'bg-stone-700 text-stone-100 shadow-2xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon size={14} />
            </button>
          </div>

          {/* User / Cloud Sync Badge */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
            title={
              user.isGuest
                ? 'Guest Mode (Click to Sign In & Cloud Sync)'
                : syncStatus === 'syncing'
                ? 'Syncing with Supabase Cloud...'
                : syncStatus === 'synced'
                ? 'Cloud Synced with Supabase'
                : 'Offline Cached'
            }
          >
            {user.isGuest ? (
              <User size={13} className="text-stone-500 dark:text-stone-400" />
            ) : syncStatus === 'syncing' ? (
              <RefreshCw size={13} className="text-amber-500 animate-spin" />
            ) : syncStatus === 'synced' ? (
              <Cloud size={13} className="text-emerald-600 dark:text-emerald-400" />
            ) : (
              <CloudOff size={13} className="text-amber-500" />
            )}
            <span className="hidden sm:inline font-medium truncate max-w-[90px]">
              {user.isGuest ? 'Guest' : user.name}
            </span>
            {!user.isGuest && syncStatus === 'synced' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
            )}
          </button>

          {/* Data Menu / Export */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              title="Data, Print & Settings"
              className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw size={15} />
            </button>

            {showSettingsMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowSettingsMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-xl py-1.5 z-30 text-xs animate-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      startTour();
                      setShowSettingsMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-emerald-700 dark:text-emerald-300 font-medium cursor-pointer"
                  >
                    <Sparkles size={14} /> Start Guided Tour
                  </button>
                  <button
                    onClick={() => {
                      returnToLanding();
                      setShowSettingsMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                  >
                    <Home size={14} /> Return to Home Page
                  </button>
                  <div className="my-1 border-t border-stone-100 dark:border-stone-700" />
                  {!isElectron && (
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (isInstallable) {
                          promptInstall();
                        } else {
                          setIsInstallModalOpen(true);
                        }
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-emerald-700 dark:text-emerald-300 font-medium cursor-pointer"
                    >
                      <Smartphone size={14} /> Install Desktop App
                    </button>
                  )}
                  <button
                    onClick={handleExport}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                  >
                    <Download size={14} /> Export Backup (JSON)
                  </button>
                  <button
                    onClick={handleImportClick}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                  >
                    <Upload size={14} /> Import Backup (JSON)
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                  >
                    <Printer size={14} /> Print / Save PDF
                  </button>
                  <div className="my-1 border-t border-stone-100 dark:border-stone-700" />
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      setShowResetConfirm(true);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Reset to Sample Data
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : 'bg-rose-900 text-rose-100 border-rose-700'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 size={16} className="text-emerald-300" />
            ) : (
              <XCircle size={16} className="text-rose-300" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertTriangle size={22} />
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Reset Tracker Data?
              </h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
              This will replace all current habits, goals, and completion logs with the default sample dataset. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <YearlyStatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onTriggerInstall={promptInstall}
        canDirectInstall={isInstallable}
      />
    </header>
  );
};
