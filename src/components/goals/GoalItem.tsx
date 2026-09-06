import React, { useState } from 'react';
import type { Goal } from '../../types';
import { useTracker } from '../../context/TrackerContext';
import { MoreHorizontal, Edit2, Trash2, Check } from 'lucide-react';

interface GoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit }) => {
  const { incrementGoal, deleteGoal } = useTracker();
  const [showMenu, setShowMenu] = useState(false);

  const percentage = Math.min(
    100,
    Math.round((goal.currentValue / goal.targetValue) * 100)
  );

  const isCompleted = goal.completed || percentage >= 100;

  return (
    <div className="group p-3 rounded-xl border border-stone-200/60 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-2xs hover:border-stone-300 dark:hover:border-stone-700 transition-all">
      {/* Header with Title & Percentage */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            {isCompleted && (
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={3} />
              </span>
            )}
            <h4
              className={`text-xs sm:text-sm font-medium truncate ${
                isCompleted ? 'text-stone-500 dark:text-stone-400' : 'text-stone-800 dark:text-stone-200'
              }`}
            >
              {goal.title}
            </h4>
          </div>
          {goal.description && (
            <p className="text-[10px] text-stone-400 dark:text-stone-500 font-light truncate mt-0.5">
              {goal.description}
            </p>
          )}
        </div>

        {/* Action Menu */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold font-mono text-stone-700 dark:text-stone-300">
            {percentage}%
          </span>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <MoreHorizontal size={13} />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-28 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(goal);
                    }}
                    className="w-full text-left px-3 py-1 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      deleteGoal(goal.id);
                    }}
                    className="w-full text-left px-3 py-1 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400 cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isCompleted
              ? 'bg-emerald-600 dark:bg-emerald-500'
              : 'bg-stone-800 dark:bg-stone-300'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Counter & Quick Increment Footer */}
      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-mono">
        <span>
          {goal.currentValue} / {goal.targetValue} {goal.unit || ''}
        </span>

        <div className="flex items-center gap-1 font-sans">
          <button
            onClick={() => incrementGoal(goal.id, 1)}
            className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-medium transition-colors cursor-pointer"
          >
            +1
          </button>
          {goal.targetValue >= 10 && (
            <button
              onClick={() => incrementGoal(goal.id, 5)}
              className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-medium transition-colors cursor-pointer"
            >
              +5
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
