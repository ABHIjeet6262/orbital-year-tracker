import React from 'react';
import { useTracker } from '../../context/TrackerContext';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Moon,
  Layers,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { enterTracker, pageTheme, setPageTheme } = useTracker();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0f1210] text-stone-900 dark:text-stone-100 transition-colors duration-200 selection:bg-emerald-200 dark:selection:bg-emerald-900">
      {/* 1. Minimal Header Navigation */}
      <header className="w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md sticky top-0 z-30 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-700 dark:border-emerald-400 flex items-center justify-center p-1 shadow-2xs">
              <div className="w-full h-full rounded-full border border-dashed border-emerald-600 dark:border-emerald-300 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                ORBITAL
              </span>
              <span className="text-[10px] uppercase font-sans tracking-widest px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 font-normal">
                Year Tracker
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => setPageTheme(pageTheme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title={`Switch to ${pageTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {pageTheme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-stone-600" />}
            </button>

            {/* Launch App Button */}
            <button
              onClick={() => enterTracker(false)}
              className="px-4 py-2 rounded-xl bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <span>Launch Tracker</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 text-center flex flex-col items-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-6 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Digital Revival of the Physical Circular Planner</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 max-w-3xl leading-[1.12] mb-6">
            See your entire year in <span className="italic font-normal text-emerald-800 dark:text-emerald-400">one circle.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg lg:text-xl max-w-2xl font-light leading-relaxed mb-8 sm:mb-10">
            A minimal, elegant habit and goal tracker engineered with 12 concentric rings and 32 polar sectors. Turn 365 days into a single, breathtaking visual orbit.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-12 sm:mb-16">
            <button
              onClick={() => enterTracker(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-500 text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-emerald-900/20 dark:hover:shadow-emerald-900/50 transition-all flex items-center justify-center gap-2.5 cursor-pointer group active:scale-[0.98]"
            >
              <span>Enter Tracker & Tour</span>
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => enterTracker(false)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass size={17} className="text-emerald-700 dark:text-emerald-400" />
              <span>Direct to Workspace</span>
            </button>
          </div>

          {/* Interactive Concentric Rings SVG Artwork */}
          <div className="relative w-full max-w-[480px] sm:max-w-[560px] aspect-square mx-auto flex items-center justify-center p-4">
            <div className="absolute inset-0 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-3xl pointer-events-none" />
            
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl select-none">
              {/* Outer boundary */}
              <circle cx="200" cy="200" r="185" fill="none" stroke="currentColor" strokeWidth="1" className="text-stone-300 dark:text-stone-700" />
              
              {/* 12 Concentric Rings */}
              {Array.from({ length: 12 }, (_, i) => {
                const r = 185 - (i * (185 - 65) / 12);
                return (
                  <circle
                    key={`hero-ring-${i}`}
                    cx="200"
                    cy="200"
                    r={r}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.6"
                    className="text-stone-200 dark:text-stone-800"
                  />
                );
              })}

              {/* Sample colored arcs representing habit orbits */}
              <circle
                cx="200"
                cy="200"
                r="175"
                fill="none"
                stroke="#10b981"
                strokeWidth="7"
                strokeDasharray="180 500"
                strokeLinecap="round"
                className="opacity-80"
              />
              <circle
                cx="200"
                cy="200"
                r="155"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="7"
                strokeDasharray="260 400"
                strokeLinecap="round"
                className="opacity-75"
              />
              <circle
                cx="200"
                cy="200"
                r="135"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="7"
                strokeDasharray="210 420"
                strokeLinecap="round"
                className="opacity-80"
              />
              <circle
                cx="200"
                cy="200"
                r="115"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="7"
                strokeDasharray="140 460"
                strokeLinecap="round"
                className="opacity-85"
              />
              <circle
                cx="200"
                cy="200"
                r="95"
                fill="none"
                stroke="#22c55e"
                strokeWidth="7"
                strokeDasharray="320 300"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* Center Hub */}
              <circle cx="200" cy="200" r="60" fill="currentColor" stroke="currentColor" strokeWidth="1" className="text-white dark:text-stone-900 border text-stone-300 dark:text-stone-700" />
              <circle cx="200" cy="200" r="54" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="text-stone-300 dark:text-stone-700" />
              
              <text
                x="200"
                y="196"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fontFamily="Newsreader, serif"
                fontWeight="500"
                letterSpacing="0.1em"
                className="fill-stone-900 dark:fill-stone-100 font-serif"
              >
                2026
              </text>
              <text
                x="200"
                y="214"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8.5"
                letterSpacing="0.05em"
                className="fill-emerald-700 dark:fill-emerald-400 font-sans font-semibold uppercase"
              >
                ORBITAL YEAR
              </text>
            </svg>
          </div>
        </section>

        {/* 3. Core Architecture & Design Pillars */}
        <section className="border-t border-stone-200/80 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 mb-4">
                Engineered for visual clarity
              </h2>
              <p className="text-stone-600 dark:text-stone-400 font-light text-sm sm:text-base">
                Everything in Orbital Year is designed to reduce clutter and bring peaceful intentionality to your daily routines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex flex-col items-start transition-transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 mb-4">
                  <Layers size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-stone-900 dark:text-stone-100">
                  12 Concentric Rings
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                  January sits outermost and December innermost. 32-sector geometric division with dedicated month blocks and inclined radial dividers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex flex-col items-start transition-transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 mb-4">
                  <Award size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-stone-900 dark:text-stone-100">
                  7-Tier Heatmap Palettes
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                  Dynamic completion gradient from 0% (Red) to 100% (Darkest Emerald), with 12 selectable Bright and Dark circle colorways.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex flex-col items-start transition-transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 mb-4">
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-stone-900 dark:text-stone-100">
                  Habits & Annual Goals
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                  Manage daily checklists, track milestone streak counters, record journal reflections, and increment annual targets with 1-click.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-6 rounded-2xl bg-stone-50/80 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 flex flex-col items-start transition-transform hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 mb-4">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-serif text-lg font-semibold mb-2 text-stone-900 dark:text-stone-100">
                  100% Private & Offline
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm font-light leading-relaxed">
                  Zero cloud telemetry or mandatory logins. Everything is stored locally on your device with offline PWA install support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Bottom Call-To-Action Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-emerald-900 dark:bg-emerald-950 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border border-emerald-700/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full border border-emerald-700/40 pointer-events-none" />
            
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-emerald-50">
              Start your 2026 orbit today.
            </h2>
            <p className="text-emerald-200/90 text-sm sm:text-base max-w-lg mx-auto mb-8 font-light">
              Experience the focus and peace of seeing all 365 days united in a single, harmonious circular calendar.
            </p>
            <button
              onClick={() => enterTracker(true)}
              className="px-8 py-3.5 rounded-2xl bg-white text-emerald-950 font-semibold text-sm sm:text-base hover:bg-emerald-50 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center gap-2"
            >
              <span>Launch Orbital Tracker</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* 5. Minimal Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>Orbital Year Tracker © 2026 • Minimal Physical Planner Digital Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => enterTracker(true)}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Interactive Tour
            </button>
            <button
              onClick={() => enterTracker(false)}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
