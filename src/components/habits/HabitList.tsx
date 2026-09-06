import React, { useState } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { HabitItem } from './HabitItem';
import { AddHabitModal } from './AddHabitModal';
import type { Habit } from '../../types';
import { getTodayString } from '../../utils/dateUtils';
import { Plus, CheckCircle2 } from 'lucide-react';

export const HabitList: React.FC = () => {
  const { activeHabits, completions, addHabit, updateHabit } = useTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const today = getTodayString();
  const todayRecord = completions[today];
  const completedCount =
    todayRecord?.completedHabitIds?.filter((id) =>
      activeHabits.some((h) => h.id === id)
    ).length || 0;

  const totalCount = activeHabits.length;

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const handleSave = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 block">
            Today's Focus
          </span>
          <h2 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            HABITS
          </h2>
        </div>

        {/* Counter Badge (e.g. 6 / 8) */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold">
          <CheckCircle2
            size={13}
            className={
              completedCount === totalCount && totalCount > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400'
            }
          />
          <span>
            {completedCount} / {totalCount}
          </span>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto space-y-2 py-3.5 min-h-[220px]">
        {activeHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-stone-400">
            <p className="text-xs">No habits tracked yet.</p>
            <button
              onClick={handleCreateNew}
              className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              + Add your first habit
            </button>
          </div>
        ) : (
          activeHabits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} onEdit={handleEdit} />
          ))
        )}
      </div>

      {/* Footer Add Button */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={handleCreateNew}
          className="w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all text-xs font-medium cursor-pointer"
        >
          <Plus size={14} /> Add Habit
        </button>
      </div>

      {/* Habit Modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingHabit={editingHabit}
      />
    </div>
  );
};
