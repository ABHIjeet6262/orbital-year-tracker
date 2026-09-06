import React from 'react';
import { createPortal } from 'react-dom';
import { useTracker } from '../../context/TrackerContext';
import {
  Sparkles,
  CheckCircle2,
  Target,
  Layers,
  Sliders,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, endTour } = useTracker();

  if (!isTourActive) return null;

  const TOUR_STEPS = [
    {
      stepNumber: 1,
      badge: 'Centerpiece',
      icon: <Layers size={22} className="text-emerald-700 dark:text-emerald-400" />,
      title: 'The Concentric Year Orbit',
      subtitle: 'See your entire year in 12 concentric rings',
      description:
        'January sits as the outermost ring and December as the innermost. 32 radial sectors divide each day of the year, with a dedicated top Month column bounded by inclined dividers.',
      tip: '💡 Tip: Click any day cell on the circle to mark habits, write daily reflections, or log your mood.',
      highlightArea: 'Center Canvas',
    },
    {
      stepNumber: 2,
      badge: 'Left Column',
      icon: <CheckCircle2 size={22} className="text-blue-700 dark:text-blue-400" />,
      title: "Today's Habit Checklist",
      subtitle: 'Fast daily logging & streak momentum',
      description:
        "Your active daily routine checklist sits on the left. Check off habits to watch today's ring cell illuminate on the circle in real-time.",
      tip: '💡 Tip: Click the "+ Add Habit" button to create daily, weekday, or weekend habits with custom colors.',
      highlightArea: "Today's Habits",
    },
    {
      stepNumber: 3,
      badge: 'Right Column',
      icon: <Target size={22} className="text-amber-700 dark:text-amber-400" />,
      title: 'Annual Milestone Goals',
      subtitle: 'Track major 2026 targets with ease',
      description:
        'Keep big-picture annual goals in focus on the right. Track progress bars and use quick +1 and +5 increment buttons to log milestone achievements.',
      tip: '💡 Tip: Set numeric targets for books read, workouts completed, coding problems solved, or skills learned.',
      highlightArea: 'Annual Targets',
    },
    {
      stepNumber: 4,
      badge: 'Top Header',
      icon: <Sliders size={22} className="text-purple-700 dark:text-purple-400" />,
      title: 'Themes, Stats & Offline Tools',
      subtitle: 'Full personalization & data freedom',
      description:
        'Toggle between ☀️ Light and 🌙 Dark modes for the entire page, pick from 12 Bright & Dark circle color palettes (🎨), view consistency stats, or export a complete JSON backup.',
      tip: '💡 Tip: Orbital Year is 100% private and installable as an offline PWA app on your desktop and phone.',
      highlightArea: 'Header Controls',
    },
  ];

  const current = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const isLast = tourStep === TOUR_STEPS.length - 1;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-7 relative overflow-hidden text-stone-900 dark:text-stone-100 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle decorative top bar gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500" />

        {/* Header: Step Pill & Close/Skip Button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              {current.badge}
            </span>
            <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
              Step {current.stepNumber} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={() => endTour(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Skip Tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Content */}
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 shrink-0">
            {current.icon}
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              {current.title}
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-0.5">
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-stone-600 dark:text-stone-300 text-sm font-light leading-relaxed mb-4">
          {current.description}
        </p>

        {/* Action Tip Banner */}
        <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 font-normal mb-6">
          {current.tip}
        </div>

        {/* Footer: Step Indicators + Back + Next/Finish */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === tourStep
                    ? 'w-6 bg-emerald-600 dark:bg-emerald-400'
                    : 'w-1.5 bg-stone-300 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {tourStep > 0 && (
              <button
                onClick={prevTourStep}
                className="px-3.5 py-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={() => endTour(false)}
              className="px-3 py-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-medium transition-colors cursor-pointer hidden sm:block"
            >
              Skip
            </button>

            <button
              onClick={nextTourStep}
              className="px-4 py-2 rounded-xl bg-emerald-800 dark:bg-emerald-600 hover:bg-emerald-900 dark:hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>{isLast ? 'Start Tracking' : 'Next'}</span>
              {isLast ? <Sparkles size={14} /> : <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
