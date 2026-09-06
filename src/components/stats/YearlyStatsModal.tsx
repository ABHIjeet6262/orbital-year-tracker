import React from 'react';
import { createPortal } from 'react-dom';
import { useTracker } from '../../context/TrackerContext';
import { MONTH_NAMES, getDaysInMonth, formatDateString } from '../../utils/dateUtils';
import { X, Flame, Award, TrendingUp } from 'lucide-react';

interface YearlyStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YearlyStatsModal: React.FC<YearlyStatsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { year, yearStats, activeHabits, completions } = useTracker();

  if (!isOpen) return null;

  // Compute monthly stats
  const monthlyStats = MONTH_NAMES.map((monthName, mIndex) => {
    const daysInMonth = getDaysInMonth(year, mIndex);
    let totalPossible = daysInMonth * activeHabits.length;
    let monthCompleted = 0;
    let recordedDays = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = formatDateString(year, mIndex, d);
      const record = completions[dateStr];
      if (record) {
        recordedDays++;
        const val = record.completedHabitIds.filter((id) =>
          activeHabits.some((h) => h.id === id)
        ).length;
        monthCompleted += val;
      }
    }

    const percentage =
      totalPossible > 0 ? Math.round((monthCompleted / totalPossible) * 100) : 0;

    return {
      monthName,
      percentage,
      monthCompleted,
      recordedDays,
    };
  });

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-700 dark:text-emerald-400" />
            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
              {year} Annual Overview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
            <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              Consistency
            </div>
            <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400 mt-1">
              {yearStats.averageCompletion}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
            <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              Current Streak
            </div>
            <div className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200 mt-1 flex items-center justify-center gap-1">
              <Flame size={16} className="text-amber-500" />
              {yearStats.currentStreak}d
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
            <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              Best Streak
            </div>
            <div className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200 mt-1 flex items-center justify-center gap-1">
              <Award size={16} className="text-amber-500" />
              {yearStats.bestStreak}d
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800 text-center">
            <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
              Perfect Days
            </div>
            <div className="text-xl font-bold font-mono text-stone-800 dark:text-stone-200 mt-1">
              {yearStats.perfectDays}
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="space-y-2 mt-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
            Monthly Consistency
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {monthlyStats.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/30"
              >
                <span className="w-24 text-stone-700 dark:text-stone-300 font-medium">
                  {item.monthName}
                </span>

                <div className="flex-1 mx-3 h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right font-mono text-stone-500 dark:text-stone-400 font-medium">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-stone-100 dark:border-stone-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
