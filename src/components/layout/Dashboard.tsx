import React from 'react';
import { YearTracker } from '../tracker/YearTracker';
import { CompletionLegend } from '../tracker/CompletionLegend';
import { HabitList } from '../habits/HabitList';
import { GoalList } from '../goals/GoalList';
import { DayDetailDrawer } from '../tracker/DayDetailDrawer';

export const Dashboard: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-4rem)]">
      {/* 3-Column Editorial Grid on Desktop, Stacked on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Left Column: Today's Habits */}
        <section className="lg:col-span-3 order-2 lg:order-1 flex flex-col h-full">
          <HabitList />
        </section>

        {/* Center Column: The Circular Year Tracker (Heart of the App) */}
        <section className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-center justify-center relative">
          <div className="w-full flex flex-col items-center">
            <YearTracker />
            <div className="mt-2 w-full">
              <CompletionLegend />
            </div>
          </div>
        </section>

        {/* Right Column: Yearly Goals */}
        <section className="lg:col-span-3 order-3 lg:order-3 flex flex-col h-full">
          <GoalList />
        </section>
      </div>

      {/* Floating Day Detail Popover/Drawer */}
      <DayDetailDrawer />
    </main>
  );
};
