import React from 'react';
import type { DayProgress, Habit, DayCompletionRecord } from '../../types';
import { formatFriendlyDate } from '../../utils/dateUtils';
import { Check, X, FileText } from 'lucide-react';

interface DayTooltipProps {
  progress: DayProgress | null;
  position: { x: number; y: number };
  activeHabits: Habit[];
  record?: DayCompletionRecord;
}

export const DayTooltip: React.FC<DayTooltipProps> = ({
  progress,
  position,
  activeHabits,
  record,
}) => {
  if (!progress || !progress.isValidDay) return null;

  const completedIds = new Set(record?.completedHabitIds || []);

  const tooltipWidth = 240;
  const left = Math.min(
    Math.max(12, position.x - tooltipWidth / 2),
    window.innerWidth - tooltipWidth - 16
  );
  const top = position.y - 12;

  return (
    <div
      className="fixed pointer-events-none z-50 bg-stone-900/95 text-stone-100 dark:bg-stone-950/95 dark:text-stone-100 px-3.5 py-3 rounded-lg shadow-xl backdrop-blur-xs border border-stone-700/50 text-xs w-[240px] transition-opacity duration-150 animate-in fade-in zoom-in-95"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translateY(-100%)',
      }}
    >
      {/* Header Date */}
      <div className="flex items-center justify-between border-b border-stone-700/60 pb-1.5 mb-2">
        <span className="font-semibold text-stone-200">
          {formatFriendlyDate(progress.dateString)}
        </span>
        {progress.isToday && (
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
            Today
          </span>
        )}
      </div>

      {/* Completion Summary */}
      <div className="flex items-center justify-between mb-2 text-stone-300">
        <span className="font-medium">
          {progress.completedCount} / {progress.totalHabits} completed
        </span>
        <span
          className={`font-semibold ${
            progress.percentage === 100
              ? 'text-emerald-400'
              : progress.percentage === 0
              ? 'text-rose-400'
              : 'text-stone-300'
          }`}
        >
          {progress.percentage}%
        </span>
      </div>

      {/* Habit Checklist Preview */}
      {activeHabits.length > 0 ? (
        <div className="space-y-1 my-1.5 max-h-36 overflow-y-auto">
          {activeHabits.map((habit) => {
            const isDone = completedIds.has(habit.id);
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between text-[11px] py-0.5"
              >
                <span
                  className={`truncate pr-2 ${
                    isDone ? 'text-stone-200' : 'text-stone-400 line-through opacity-70'
                  }`}
                >
                  {habit.name}
                </span>
                {isDone ? (
                  <Check size={12} className="text-emerald-400 shrink-0" />
                ) : (
                  <X size={12} className="text-rose-400/80 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-[11px] text-stone-400 italic">No habits configured</div>
      )}

      {/* Note preview if any */}
      {record?.note && (
        <div className="mt-2 pt-1.5 border-t border-stone-800 text-[11px] text-stone-400 flex items-start gap-1">
          <FileText size={12} className="shrink-0 mt-0.5 text-stone-500" />
          <p className="truncate">{record.note}</p>
        </div>
      )}

      {/* Micro footer hint */}
      <div className="mt-2 text-[9px] text-stone-500 text-center">
        Click cell to edit day
      </div>
    </div>
  );
};
