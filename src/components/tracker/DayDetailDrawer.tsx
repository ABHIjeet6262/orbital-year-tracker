import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTracker } from '../../context/TrackerContext';
import {
  formatFriendlyDate,
  formatDateString,
  parseDateString,
  getTodayString,
  getDaysInMonth,
} from '../../utils/dateUtils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit3,
} from 'lucide-react';

export const DayDetailDrawer: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    isDayDrawerOpen,
    setIsDayDrawerOpen,
    activeHabits,
    completions,
    toggleHabitCompletion,
    updateDayNote,
    getDayProgress,
  } = useTracker();

  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  const progress = getDayProgress(selectedDate);
  const record = completions[selectedDate];
  const completedIds = new Set(record?.completedHabitIds || []);
  const today = getTodayString();
  const isToday = selectedDate === today;

  useEffect(() => {
    setNoteText(record?.note || '');
    setIsEditingNote(false);
  }, [selectedDate, record?.note]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDayDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsDayDrawerOpen]);

  if (!isDayDrawerOpen) return null;

  // Day navigation helpers
  const handlePrevDay = () => {
    const { year, monthIndex, day } = parseDateString(selectedDate);
    let newYear = year;
    let newMonth = monthIndex;
    let newDay = day - 1;

    if (newDay < 1) {
      newMonth--;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      newDay = getDaysInMonth(newYear, newMonth);
    }
    setSelectedDate(formatDateString(newYear, newMonth, newDay));
  };

  const handleNextDay = () => {
    const { year, monthIndex, day } = parseDateString(selectedDate);
    let newYear = year;
    let newMonth = monthIndex;
    let newDay = day + 1;
    const maxDays = getDaysInMonth(year, monthIndex);

    if (newDay > maxDays) {
      newDay = 1;
      newMonth++;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
    }
    setSelectedDate(formatDateString(newYear, newMonth, newDay));
  };

  const handleSaveNote = () => {
    updateDayNote(selectedDate, noteText);
    setIsEditingNote(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsDayDrawerOpen(false)}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Date Navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                {formatFriendlyDate(selectedDate)}
                {isToday && (
                  <span className="text-[10px] uppercase font-sans tracking-wide bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </h3>
            </div>
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={() => setIsDayDrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Completion Progress Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-500 dark:text-stone-400">
              {progress.completedCount} of {progress.totalHabits} completed
            </span>
            <span
              className={`font-semibold ${
                progress.percentage === 100
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : progress.percentage === 0
                  ? 'text-rose-500'
                  : 'text-stone-700 dark:text-stone-300'
              }`}
            >
              {progress.percentage}%
            </span>
          </div>
          <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300 rounded-full"
              style={{
                width: `${progress.percentage}%`,
                backgroundColor: progress.color,
              }}
            />
          </div>
        </div>

        {/* Habit Checklist Section */}
        <div className="px-6 py-3 max-h-[300px] overflow-y-auto space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
            Habits for this day
          </div>

          {activeHabits.length === 0 ? (
            <div className="text-sm text-stone-400 py-4 text-center italic">
              No habits created yet. Add habits on the dashboard to start tracking!
            </div>
          ) : (
            activeHabits.map((habit) => {
              const isChecked = completedIds.has(habit.id);
              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitCompletion(selectedDate, habit.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-stone-900 dark:text-stone-100'
                      : 'bg-stone-50/50 dark:bg-stone-800/30 border-stone-200/70 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border-2 border-stone-300 dark:border-stone-600'
                      }`}
                    >
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div>
                      <div
                        className={`text-sm font-medium ${
                          isChecked ? 'line-through opacity-85' : ''
                        }`}
                      >
                        {habit.name}
                      </div>
                      {habit.description && (
                        <div className="text-[11px] text-stone-400 dark:text-stone-500">
                          {habit.description}
                        </div>
                      )}
                    </div>
                  </div>

                  {habit.category && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {habit.category}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Daily Reflection / Note Section */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/30 dark:bg-stone-900/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500">
              Daily Reflection / Note
            </span>
            {!isEditingNote && record?.note && (
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 size={12} /> Edit
              </button>
            )}
          </div>

          {isEditingNote || !record?.note ? (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="What made today meaningful? Reflections, accomplishments..."
                rows={3}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1 text-xs font-medium bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingNote(true)}
              className="text-xs text-stone-700 dark:text-stone-300 p-2.5 bg-white dark:bg-stone-800 rounded-xl border border-stone-200/70 dark:border-stone-700 cursor-pointer hover:border-stone-300 transition-colors"
            >
              {record.note}
            </div>
          )}
        </div>

        {/* Quick jump to today footer */}
        {!isToday && (
          <div className="px-6 py-2.5 border-t border-stone-100 dark:border-stone-800 text-center">
            <button
              onClick={() => setSelectedDate(today)}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
            >
              ← Jump to Today ({formatFriendlyDate(today)})
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
