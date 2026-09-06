import React, { useState } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { GoalItem } from './GoalItem';
import { AddGoalModal } from './AddGoalModal';
import type { Goal } from '../../types';
import { Plus, Target } from 'lucide-react';

export const GoalList: React.FC = () => {
  const { goals, addGoal, updateGoal } = useTracker();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const completedGoalsCount = goals.filter(
    (g) => g.completed || g.currentValue >= g.targetValue
  ).length;

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleSave = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    } else {
      addGoal(goalData);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-stone-400 dark:text-stone-500 block">
            Annual Targets
          </span>
          <h2 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
            GOALS
          </h2>
        </div>

        {/* Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs font-semibold">
          <Target size={13} className="text-stone-400" />
          <span>
            {completedGoalsCount} / {goals.length}
          </span>
        </div>
      </div>

      {/* Goals List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 py-3.5 min-h-[220px]">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-stone-400">
            <p className="text-xs">No yearly goals set yet.</p>
            <button
              onClick={handleCreateNew}
              className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              + Add a yearly goal
            </button>
          </div>
        ) : (
          goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onEdit={handleEdit} />
          ))
        )}
      </div>

      {/* Footer Add Button */}
      <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
        <button
          onClick={handleCreateNew}
          className="w-full py-2 px-3 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:border-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-all text-xs font-medium cursor-pointer"
        >
          <Plus size={14} /> Add Goal
        </button>
      </div>

      {/* Goal Modal */}
      <AddGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingGoal={editingGoal}
      />
    </div>
  );
};
