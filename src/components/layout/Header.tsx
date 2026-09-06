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
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { YearlyStatsModal } from '../stats/YearlyStatsModal';

export const Header: React.FC = () => {
  const {
    year,
    setYear,
    pageTheme,
    setPageTheme,
    user,
    resetToSampleData,
    exportDataJSON,
    importDataJSON,
    returnToLanding,
    startTour,
  } = useTracker();

  const { isInstallable, promptInstall } = usePWAInstall();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          alert('Data imported successfully!');
        } else {
          alert('Failed to import data. Please check the JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
    setShowSettingsMenu(false);
  };

  const handleReset = () => {
    if (confirm('Reset tracker data to sample 2026 dataset?')) {
      resetToSampleData();
      setShowSettingsMenu(false);
    }
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

        {/* Right Tools: Stats, PWA Install, Light/Dark Theme, User, Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* PWA Install Button (if available) */}
          {isInstallable && (
            <button
              onClick={promptInstall}
              className="px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer animate-in fade-in"
              title="Install App to Home Screen"
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

          {/* User / Guest Badge */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <User size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline font-medium truncate max-w-[90px]">
              {user.isGuest ? 'Guest' : user.name}
            </span>
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
                  {isInstallable && (
                    <button
                      onClick={() => {
                        promptInstall();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-emerald-700 dark:text-emerald-300 font-medium cursor-pointer"
                    >
                      <Smartphone size={14} /> Install Offline App
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
                    onClick={handleReset}
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
    </header>
  );
};
