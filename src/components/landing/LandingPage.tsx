import React, { useState, useMemo } from 'react';
import { useTracker } from '../../context/TrackerContext';
import confetti from 'canvas-confetti';
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
  Flame,
  Palette,
  Check,
} from 'lucide-react';
import {
  calculateRingMetrics,
  getDayAngles,
  getMonthColumnAngles,
  polarToCartesian,
  createAnnularSectorPath,
  TOTAL_SECTORS,
  SECTOR_ANGLE,
} from '../../utils/geometry';
import { MONTH_SHORT_NAMES, formatDateString, getDaysInMonth } from '../../utils/dateUtils';
import {
  getGridBorderColor,
  getCompletionColor,
} from '../../utils/colors';
import type { CircleTone, CirclePalette, DayProgress } from '../../types';

export const LandingPage: React.FC = () => {
  const { enterTracker, pageTheme, setPageTheme } = useTracker();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  // Landing Page Interactive State
  const [activeTone, setActiveTone] = useState<CircleTone>('dark');
  const [activePalette, setActivePalette] = useState<CirclePalette>('forest_dark');
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    monthIndex: number;
    dayNum: number;
    pct: number;
    habitsCompleted: number;
    pos: { x: number; y: number };
  } | null>(null);
  const [selectedDay, setSelectedDay] = useState<{
    dateStr: string;
    monthIndex: number;
    dayNum: number;
    pct: number;
    habitsCompleted: number;
  } | null>(null);

  // Live Interactive Demo Habits for Today
  const [demoHabits, setDemoHabits] = useState([
    { id: '1', name: 'Morning Meditation', icon: '🧘', done: true },
    { id: '2', name: '5km Run / Workout', icon: '🏃', done: true },
    { id: '3', name: 'Read 20 Pages', icon: '📚', done: true },
    { id: '4', name: 'Deep Work Block', icon: '💻', done: true },
  ]);

  const toggleDemoHabit = (id: string) => {
    setDemoHabits((prev) => {
      const next = prev.map((h) => (h.id === id ? { ...h, done: !h.done } : h));
      const doneCount = next.filter((h) => h.done).length;
      if (doneCount === next.length) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
        });
      }
      return next;
    });
  };

  const todayDoneCount = demoHabits.filter((h) => h.done).length;
  const todayPct = Math.round((todayDoneCount / demoHabits.length) * 100);

  // Geometric Constants for Hero Canvas
  const SVG_SIZE = 720;
  const CENTER = SVG_SIZE / 2;
  const OUTER_RADIUS = 310;
  const INNER_RADIUS = 105;
  const DAY_NUM_RADIUS = OUTER_RADIUS + 18;

  const ringMetrics = useMemo(() => {
    return calculateRingMetrics(12, INNER_RADIUS, OUTER_RADIUS);
  }, []);

  const monthColumn = useMemo(() => getMonthColumnAngles(), []);
  const borderColor = useMemo(() => getGridBorderColor(activeTone), [activeTone]);

  // Generate realistic sample completion pattern for the landing hero
  const getDemoDayProgress = (mIndex: number, dayNum: number): DayProgress => {
    const daysInM = getDaysInMonth(currentYear, mIndex);
    const isValid = dayNum <= daysInM;
    const dateStr = formatDateString(currentYear, mIndex, dayNum);

    const isToday = mIndex === currentMonth && dayNum === currentDay;
    const isPast = mIndex < currentMonth || (mIndex === currentMonth && dayNum < currentDay);

    if (!isValid) {
      return {
        dateString: dateStr,
        dayOfMonth: dayNum,
        monthIndex: mIndex,
        year: currentYear,
        totalHabits: 0,
        completedCount: 0,
        percentage: 0,
        color: getCompletionColor(0, false, false, activeTone, activePalette),
        isToday: false,
        isPast: false,
        isFuture: false,
        isValidDay: false,
      };
    }

    if (isToday) {
      const color = getCompletionColor(todayPct, true, true, activeTone, activePalette);
      return {
        dateString: dateStr,
        dayOfMonth: dayNum,
        monthIndex: mIndex,
        year: currentYear,
        totalHabits: 4,
        completedCount: todayDoneCount,
        percentage: todayPct,
        color,
        isToday: true,
        isPast: false,
        isFuture: false,
        isValidDay: true,
      };
    }

    if (isPast) {
      // Deterministic realistic habit distribution
      const hash = (mIndex * 31 + dayNum * 17) % 100;
      let pct = 100;
      let done = 4;
      if (hash < 12) {
        pct = 0;
        done = 0;
      } else if (hash < 25) {
        pct = 25;
        done = 1;
      } else if (hash < 45) {
        pct = 50;
        done = 2;
      } else if (hash < 75) {
        pct = 75;
        done = 3;
      }

      const color = getCompletionColor(pct, true, true, activeTone, activePalette);
      return {
        dateString: dateStr,
        dayOfMonth: dayNum,
        monthIndex: mIndex,
        year: currentYear,
        totalHabits: 4,
        completedCount: done,
        percentage: pct,
        color,
        isToday: false,
        isPast: true,
        isFuture: false,
        isValidDay: true,
      };
    }

    // Future
    const color = getCompletionColor(0, false, true, activeTone, activePalette);
    return {
      dateString: dateStr,
      dayOfMonth: dayNum,
      monthIndex: mIndex,
      year: currentYear,
      totalHabits: 4,
      completedCount: 0,
      percentage: 0,
      color,
      isToday: false,
      isPast: false,
      isFuture: true,
      isValidDay: true,
    };
  };

  const handleCellClick = (e: React.MouseEvent, progress?: DayProgress) => {
    if (progress && progress.isValidDay) {
      setSelectedDay({
        dateStr: progress.dateString,
        monthIndex: progress.monthIndex,
        dayNum: progress.dayOfMonth,
        pct: progress.percentage,
        habitsCompleted: progress.completedCount,
      });
    }
    confetti({
      particleCount: 35,
      spread: 45,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#22c55e', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    });
  };

  const monthCellBg = activeTone === 'dark' ? '#181e1a' : '#ece8df';
  const monthTextColor = activeTone === 'dark' ? '#e2e8f0' : '#1c1917';

  const DEMO_PALETTES: { id: CirclePalette; tone: CircleTone; name: string; color: string }[] = [
    { id: 'forest_dark', tone: 'dark', name: 'Midnight Forest', color: '#3fa35e' },
    { id: 'mint_dark', tone: 'dark', name: 'Cyber Mint', color: '#14b8a6' },
    { id: 'ocean_dark', tone: 'dark', name: 'Ocean Indigo', color: '#3b82f6' },
    { id: 'sunset_dark', tone: 'dark', name: 'Solar Flare', color: '#f59e0b' },
    { id: 'amethyst_dark', tone: 'dark', name: 'Neon Amethyst', color: '#8b5cf6' },
    { id: 'sage_bright', tone: 'bright', name: 'Sage Paper', color: '#1b4332' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#0f1210] text-stone-900 dark:text-stone-100 transition-colors duration-300 selection:bg-emerald-200 dark:selection:bg-emerald-900 overflow-x-hidden">
      {/* 1. Minimal Header Navigation */}
      <header className="w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
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

      {/* 2. Hero Showcase Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 text-center flex flex-col items-center relative">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/60 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-5 animate-in fade-in slide-in-from-top-3 duration-500">
            <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
            <span>Digital Revival of the Physical Circular Planner</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 max-w-3xl leading-[1.12] mb-5">
            See your entire year in <span className="italic font-normal text-emerald-800 dark:text-emerald-400">one circle.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg lg:text-xl max-w-2xl font-light leading-relaxed mb-7 sm:mb-9">
            Engineered with 12 concentric month rings and 32 polar sectors. Hover and click the live orbit below to experience your year in motion.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-10">
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

          {/* Mobile Metric Badges Strip (visible on mobile where floating badges are hidden) */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 flex-wrap mb-4 w-full px-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-[11px] font-medium text-stone-800 dark:text-stone-200 shadow-2xs">
              <Layers size={12} className="text-emerald-600 dark:text-emerald-400" />
              <span>12 Rings</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-[11px] font-medium text-stone-800 dark:text-stone-200 shadow-2xs">
              <Sparkles size={12} className="text-amber-500" />
              <span>13 Perfect</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-[11px] font-medium text-stone-800 dark:text-stone-200 shadow-2xs">
              <Flame size={12} className="text-rose-500" />
              <span>24d Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800 text-[11px] font-medium text-stone-800 dark:text-stone-200 shadow-2xs">
              <ShieldCheck size={12} className="text-blue-500" />
              <span>100% Offline</span>
            </div>
          </div>

          {/* 3. LIVE INTERACTIVE ORBIT CANVAS */}
          <div className="relative w-full max-w-[620px] aspect-square mx-auto flex items-center justify-center p-2">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl pointer-events-none animate-pulse-subtle" />

            {/* Floating Live Metric Badges */}
            <div className="hidden sm:flex absolute -top-2 -left-6 z-20 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-md text-xs font-medium text-stone-800 dark:text-stone-200 animate-in fade-in duration-700">
              <Layers size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>12 Month Rings</span>
            </div>

            <div className="hidden sm:flex absolute -top-2 -right-6 z-20 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-md text-xs font-medium text-stone-800 dark:text-stone-200 animate-in fade-in duration-700 delay-100">
              <Sparkles size={14} className="text-amber-500" />
              <span>13 Perfect Days</span>
            </div>

            <div className="hidden sm:flex absolute -bottom-2 -left-6 z-20 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-md text-xs font-medium text-stone-800 dark:text-stone-200 animate-in fade-in duration-700 delay-200">
              <Flame size={14} className="text-rose-500" />
              <span>24-Day Streak</span>
            </div>

            <div className="hidden sm:flex absolute -bottom-2 -right-6 z-20 items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-md text-xs font-medium text-stone-800 dark:text-stone-200 animate-in fade-in duration-700 delay-300">
              <ShieldCheck size={14} className="text-blue-500" />
              <span>100% Private Offline</span>
            </div>

            {/* Main Interactive SVG */}
            <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="w-full h-full drop-shadow-2xl select-none">
              {/* Outer boundary */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={OUTER_RADIUS + 2}
                fill="none"
                stroke={borderColor}
                strokeWidth="1.2"
              />

              {/* 32 Radial Sector Lines */}
              {Array.from({ length: TOTAL_SECTORS }, (_, i) => i).map((sectorIdx) => {
                const lineAngle = monthColumn.startAngle + sectorIdx * SECTOR_ANGLE;
                const pStart = polarToCartesian(CENTER, CENTER, INNER_RADIUS, lineAngle);
                const pEnd = polarToCartesian(CENTER, CENTER, OUTER_RADIUS, lineAngle);
                const isMonthBoundary = sectorIdx === 0 || sectorIdx === 1;

                return (
                  <line
                    key={`hero-grid-${sectorIdx}`}
                    x1={pStart.x}
                    y1={pStart.y}
                    x2={pEnd.x}
                    y2={pEnd.y}
                    stroke={borderColor}
                    strokeWidth={isMonthBoundary ? '1.2' : '0.5'}
                    opacity={isMonthBoundary ? '0.95' : '0.5'}
                  />
                );
              })}

              {/* Perimeter Labels: MONTH & Day Numbers */}
              <g className="select-none pointer-events-none">
                {/* MONTH Header at Top */}
                {(() => {
                  const mPos = polarToCartesian(CENTER, CENTER, DAY_NUM_RADIUS, monthColumn.midAngle);
                  return (
                    <text
                      x={mPos.x}
                      y={mPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9"
                      fontWeight="700"
                      letterSpacing="0.06em"
                      className="fill-emerald-700 dark:fill-emerald-400 font-sans"
                    >
                      MONTH
                    </text>
                  );
                })()}

                {/* Day Numbers 1..31 */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dNum) => {
                  const { midAngle } = getDayAngles(dNum);
                  const numPos = polarToCartesian(CENTER, CENTER, DAY_NUM_RADIUS, midAngle);
                  return (
                    <text
                      key={`hero-day-num-${dNum}`}
                      x={numPos.x}
                      y={numPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="9.5"
                      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                      className="fill-stone-400 dark:fill-stone-500 font-medium"
                    >
                      {dNum}
                    </text>
                  );
                })}
              </g>

              {/* 12 Concentric Month Rings */}
              {ringMetrics.map((ring) => {
                const mIndex = ring.monthIndex;
                const midRadius = (ring.innerRadius + ring.outerRadius) / 2;

                const monthCellPath = createAnnularSectorPath(
                  CENTER,
                  CENTER,
                  ring.innerRadius,
                  ring.outerRadius,
                  monthColumn.startAngle,
                  monthColumn.endAngle
                );
                const textPos = polarToCartesian(CENTER, CENTER, midRadius, monthColumn.midAngle);

                return (
                  <g key={`hero-month-ring-${mIndex}`}>
                    {/* Ring divider circle */}
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={ring.innerRadius}
                      fill="none"
                      stroke={borderColor}
                      strokeWidth="0.75"
                    />

                    {/* Dedicated Month Header Cell */}
                    <g className="select-none pointer-events-none">
                      <path
                        d={monthCellPath}
                        fill={monthCellBg}
                        stroke={borderColor}
                        strokeWidth="0.85"
                      />
                      <text
                        x={textPos.x}
                        y={textPos.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="9"
                        fontWeight="700"
                        letterSpacing="0.08em"
                        fill={monthTextColor}
                        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                      >
                        {MONTH_SHORT_NAMES[mIndex]}
                      </text>
                    </g>

                    {/* Days 1 to 31 Cells */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                      const { startAngle, endAngle } = getDayAngles(dayNum);
                      const progress = getDemoDayProgress(mIndex, dayNum);
                      const pathData = createAnnularSectorPath(
                        CENTER,
                        CENTER,
                        ring.innerRadius,
                        ring.outerRadius,
                        startAngle,
                        endAngle
                      );

                      if (!progress.isValidDay) {
                        return (
                          <path
                            key={`hero-cell-${mIndex}-${dayNum}`}
                            d={pathData}
                            fill={progress.color}
                            stroke={borderColor}
                            strokeWidth="0.5"
                            strokeDasharray="2,2"
                            opacity="0.3"
                            style={{ pointerEvents: 'none' }}
                          />
                        );
                      }

                      const midAngle = (startAngle + endAngle) / 2;
                      const dotPos = polarToCartesian(CENTER, CENTER, midRadius, midAngle);

                      return (
                        <g
                          key={`hero-cell-${mIndex}-${dayNum}`}
                          className="cursor-pointer group/cell"
                          onMouseEnter={(e) =>
                            setHoveredDay({
                              dateStr: progress.dateString,
                              monthIndex: mIndex,
                              dayNum,
                              pct: progress.percentage,
                              habitsCompleted: progress.completedCount,
                              pos: { x: e.clientX, y: e.clientY },
                            })
                          }
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={(e) => handleCellClick(e, progress)}
                        >
                          <path
                            d={pathData}
                            fill={progress.color}
                            stroke={borderColor}
                            strokeWidth="0.65"
                            className="transition-all duration-150 hover:brightness-125 hover:opacity-90 active:scale-[0.99] origin-center"
                          />
                          {progress.isToday && (
                            <circle
                              cx={dotPos.x}
                              cy={dotPos.y}
                              r="2.2"
                              fill="#ffffff"
                              stroke="#10b981"
                              strokeWidth="1.2"
                              className="pointer-events-none animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Central Hub */}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={INNER_RADIUS}
                fill={activeTone === 'dark' ? '#141815' : '#ffffff'}
                stroke={borderColor}
                strokeWidth="1"
              />
              <circle
                cx={CENTER}
                cy={CENTER}
                r={INNER_RADIUS - 7}
                fill="none"
                stroke={borderColor}
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
              <text
                x={CENTER}
                y={CENTER - 10}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="26"
                fontFamily="Newsreader, serif"
                fontWeight="500"
                letterSpacing="0.1em"
                fill={activeTone === 'dark' ? '#f3f4f6' : '#1c1917'}
              >
                {currentYear}
              </text>
              <text
                x={CENTER}
                y={CENTER + 16}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="11"
                letterSpacing="0.04em"
                fill={activeTone === 'dark' ? '#9ca3af' : '#78716c'}
              >
                51% consistency
              </text>
            </svg>

            {/* Hover Tooltip on Hero (Desktop) */}
            {hoveredDay && (
              <div
                className="hidden sm:block fixed z-50 pointer-events-none px-3 py-2 rounded-xl bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md text-white text-xs shadow-2xl border border-stone-800 animate-in fade-in duration-100"
                style={{
                  left: hoveredDay.pos.x + 12,
                  top: hoveredDay.pos.y - 45,
                }}
              >
                <div className="font-serif font-medium text-sm text-stone-100 flex items-center gap-1.5">
                  <span>{MONTH_SHORT_NAMES[hoveredDay.monthIndex]} {hoveredDay.dayNum}, {currentYear}</span>
                  {hoveredDay.pct === 100 && <Sparkles size={12} className="text-amber-400" />}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  {hoveredDay.pct}% complete • {hoveredDay.habitsCompleted}/4 habits
                </div>
                <div className="text-[10px] text-stone-400 font-light mt-0.5">
                  Click cell to test habit toggle spark ✨
                </div>
              </div>
            )}
          </div>

          {/* Mobile Tapped Day Inspector Card */}
          {selectedDay && (
            <div className="flex sm:hidden w-full max-w-sm mt-3 px-3.5 py-2.5 rounded-2xl bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border border-stone-800 text-white shadow-xl items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="text-left">
                <div className="font-serif font-medium text-xs text-stone-100 flex items-center gap-1.5">
                  <span>{MONTH_SHORT_NAMES[selectedDay.monthIndex]} {selectedDay.dayNum}, {currentYear}</span>
                  {selectedDay.pct === 100 && <Sparkles size={11} className="text-amber-400" />}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  {selectedDay.pct}% complete • {selectedDay.habitsCompleted}/4 habits
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="px-2 py-1 rounded-lg text-xs text-stone-400 hover:text-white bg-stone-800/80 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 4. LIVE INTERACTIVE THEME & DEMO BAR */}
          <div className="w-full max-w-xl mx-auto mt-6 p-4 sm:p-5 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-xl flex flex-col gap-4">
            {/* Palette Switcher */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Palette size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Live Orbit Palette:</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {DEMO_PALETTES.map((pal) => {
                  const isSelected = activePalette === pal.id;
                  return (
                    <button
                      key={pal.id}
                      onClick={() => {
                        setActivePalette(pal.id);
                        setActiveTone(pal.tone);
                      }}
                      className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pal.color }} />
                      <span>{pal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Today's Habit Toggles */}
            <div className="text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Try ticking habits for Today ({MONTH_SHORT_NAMES[currentMonth]} {currentDay}) to watch the orbit react live:
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {todayPct}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {demoHabits.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => toggleDemoHabit(h.id)}
                    className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                      h.done
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-500 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        h.done ? 'bg-emerald-600 text-white' : 'border border-stone-300 dark:border-stone-600'
                      }`}
                    >
                      {h.done && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="truncate">{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Core Architecture & Design Pillars */}
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

        {/* 6. Bottom Call-To-Action Banner */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-emerald-900 dark:bg-emerald-950 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border border-emerald-700/40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full border border-emerald-700/40 pointer-events-none" />
            
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4 text-emerald-50">
              Start your {currentYear} orbit today.
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

      {/* 7. Minimal Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span>Orbital Year Tracker © {currentYear} • Minimal Physical Planner Digital Edition</span>
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
