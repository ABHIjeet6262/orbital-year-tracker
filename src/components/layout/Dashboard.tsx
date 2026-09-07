import React, { useState } from 'react';
import { YearTracker } from '../tracker/YearTracker';
import { CompletionLegend } from '../tracker/CompletionLegend';
import { HabitList } from '../habits/HabitList';
import { GoalList } from '../goals/GoalList';
import { DayDetailDrawer } from '../tracker/DayDetailDrawer';
import { useTracker } from '../../context/TrackerContext';
import { Circle, CheckSquare, Target } from 'lucide-react';

type MobileTab = 'orbit' | 'habits' | 'goals';

export const Dashboard: React.FC = () => {
  const { activeHabits, goals } = useTracker();
  const [activeTab, setActiveTab] = useState<MobileTab>('orbit');

  return (
    <main className="max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-3 sm:py-6 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Mobile-Only Segmented Navigation Bar (< lg screens) */}
      <div className="lg:hidden w-full mb-3 sticky top-[4.25rem] z-30">
        <div className="flex p-1 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('orbit')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'orbit'
                ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Circle size={13} className={activeTab === 'orbit' ? 'fill-white/30' : ''} />
            <span>Orbit Circle</span>
          </button>

          <button
            onClick={() => setActiveTab('habits')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'habits'
                ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <CheckSquare size={13} />
            <span>Habits</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'habits'
                ? 'bg-emerald-950/40 text-emerald-100'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
            }`}>
              {activeHabits.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-emerald-800 dark:bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            <Target size={13} />
            <span>Goals</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeTab === 'goals'
                ? 'bg-emerald-950/40 text-emerald-100'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
            }`}>
              {goals.length}
            </span>
          </button>
        </div>
      </div>

      {/* Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start flex-1">
        {/* Left Column: Today's Habits */}
        <section
          className={`lg:col-span-3 flex flex-col h-full ${
            activeTab === 'habits' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <HabitList />
        </section>

        {/* Center Column: The Circular Year Tracker */}
        <section
          className={`lg:col-span-6 flex flex-col items-center justify-center relative ${
            activeTab === 'orbit' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <div className="w-full flex flex-col items-center">
            <YearTracker />
            <div className="mt-2.5 w-full">
              <CompletionLegend />
            </div>
          </div>
        </section>

        {/* Right Column: Yearly Goals */}
        <section
          className={`lg:col-span-3 flex flex-col h-full ${
            activeTab === 'goals' ? 'block' : 'hidden lg:flex'
          }`}
        >
          <GoalList />
        </section>
      </div>

      {/* Floating Day Detail Popover/Drawer */}
      <DayDetailDrawer />
    </main>
  );
};
