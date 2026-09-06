import React, { useState } from 'react';
import type { Habit } from '../../types';
import { useTracker } from '../../context/TrackerContext';
import { getTodayString } from '../../utils/dateUtils';
import { Check, MoreHorizontal, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({ habit, onEdit }) => {
  const {
    completions,
    toggleHabitCompletion,
    deleteHabit,
    filterHabitId,
    setFilterHabitId,
  } = useTracker();

  const [showMenu, setShowMenu] = useState(false);

  const todayStr = getTodayString();
  const todayRecord = completions[todayStr];
  const isDoneToday = todayRecord?.completedHabitIds?.includes(habit.id) || false;
  const isFilteringThis = filterHabitId === habit.id;

  const handleToggle = () => {
    toggleHabitCompletion(todayStr, habit.id);
  };

  const toggleFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFilteringThis) {
      setFilterHabitId(null);
    } else {
      setFilterHabitId(habit.id);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all select-none ${
        isDoneToday
          ? 'bg-stone-50/60 dark:bg-stone-900/40 border-stone-200/80 dark:border-stone-800'
          : 'bg-white dark:bg-stone-900 border-stone-200/60 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-2xs'
      }`}
    >
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={handleToggle}
      >
        {/* Custom Checkbox */}
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
            isDoneToday
              ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
              : 'border-1.5 border-stone-300 dark:border-stone-600 hover:border-emerald-600 dark:hover:border-emerald-500'
          }`}
        >
          {isDoneToday && <Check size={14} strokeWidth={2.8} />}
        </div>

        {/* Habit Name */}
        <div className="flex-1 min-w-0">
          <span
            className={`text-xs sm:text-sm font-medium transition-colors block truncate ${
              isDoneToday
                ? 'line-through text-stone-400 dark:text-stone-500'
                : 'text-stone-800 dark:text-stone-200'
            }`}
          >
            {habit.name}
          </span>
          {habit.category && (
            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-light block truncate">
              {habit.category}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
        {/* Isolate on circle button */}
        <button
          onClick={toggleFilter}
          title={isFilteringThis ? 'Reset full year view' : 'Highlight this habit on circle'}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isFilteringThis
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          {isFilteringThis ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>

        {/* Context Menu Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
          >
            <MoreHorizontal size={14} />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg py-1 z-30 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit(habit);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 cursor-pointer"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    deleteHabit(habit.id);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
