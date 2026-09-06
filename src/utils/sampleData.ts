import type { Habit, Goal, DayCompletionRecord } from '../types';
import { formatDateString, getDaysInMonth } from './dateUtils';

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    name: 'Wake up at 6:00 AM',
    description: 'Start the day early and refreshed',
    frequency: 'daily',
    category: 'Morning',
    color: '#388544',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-2',
    name: 'Drink 3L Water',
    description: 'Hydrate throughout the day',
    frequency: 'daily',
    category: 'Health',
    color: '#2b7fff',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-3',
    name: 'Workout / Exercise',
    description: '45 mins strength or cardio training',
    frequency: 'daily',
    category: 'Fitness',
    color: '#e05353',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-4',
    name: 'English Practice',
    description: 'Speaking, vocabulary, or writing for 30m',
    frequency: 'daily',
    category: 'Growth',
    color: '#8b5cf6',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-5',
    name: 'DSA Practice',
    description: 'Solve 2 problems on LeetCode/Codeforces',
    frequency: 'daily',
    category: 'Career',
    color: '#f59e0b',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-6',
    name: 'Read 20 Pages',
    description: 'Non-fiction, technical, or literature',
    frequency: 'daily',
    category: 'Mind',
    color: '#10b981',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-7',
    name: 'Less Phone Usage (< 2 hrs)',
    description: 'Mindful screen time',
    frequency: 'daily',
    category: 'Focus',
    color: '#ec4899',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
  {
    id: 'habit-8',
    name: 'Sleep by 10:00 PM',
    description: '8 hours of consistent restorative rest',
    frequency: 'daily',
    category: 'Night',
    color: '#6366f1',
    startDate: '2026-01-01',
    createdAt: '2026-01-01T06:00:00.000Z',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Build a healthy body',
    description: 'Consistent strength training, 15% body fat, 10k steps daily',
    category: 'Health',
    currentValue: 70,
    targetValue: 100,
    unit: '%',
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'goal-2',
    title: 'Improve English skills',
    description: 'Reach C1 fluency, read 5 novels, speak with international peers',
    category: 'Skill',
    currentValue: 40,
    targetValue: 100,
    unit: '%',
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'goal-3',
    title: 'Complete 300 DSA problems',
    description: 'Master Graphs, Dynamic Programming, Trees & System Design',
    category: 'Career',
    currentValue: 180,
    targetValue: 300,
    unit: 'problems',
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'goal-4',
    title: 'Read 12 books',
    description: 'Books on architecture, psychology, design, and philosophy',
    category: 'Mind',
    currentValue: 3,
    targetValue: 12,
    unit: 'books',
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'goal-5',
    title: 'Build 3 full-stack projects',
    description: 'High polish web apps with production architecture',
    category: 'Engineering',
    currentValue: 1,
    targetValue: 3,
    unit: 'projects',
    deadline: '2026-12-31',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

/**
 * Generates realistic sample completion data up to today (Sep 5, 2026)
 */
export function generateSampleCompletions(year: number = 2026): Record<string, DayCompletionRecord> {
  const records: Record<string, DayCompletionRecord> = {};
  const habitIds = INITIAL_HABITS.map((h) => h.id);

  const currentMonth = 8; // September
  const currentDay = 5;

  const sampleNotes = [
    'Great morning session, solved two hard graph problems.',
    'Focused 4 hours on system architecture design.',
    'Ran 5km outdoor morning sprint.',
    'Productive deep work day without phone distractions.',
    'Read Chapter 5 of Thinking in Systems.',
    'Felt slightly fatigued in afternoon, rested early.',
    '100% completion day! Super energized.',
    'Travel day, managed core habits.',
  ];

  for (let m = 0; m < 12; m++) {
    const daysInMonth = getDaysInMonth(year, m);

    for (let d = 1; d <= daysInMonth; d++) {
      if (m > currentMonth || (m === currentMonth && d > currentDay)) {
        continue;
      }

      const dateStr = formatDateString(year, m, d);
      const seed = (m * 31 + d * 17 + year * 7) % 100;

      let completedCount: number;
      if (seed < 8) {
        completedCount = 0;
      } else if (seed < 18) {
        completedCount = 1;
      } else if (seed < 35) {
        completedCount = 2 + (seed % 2);
      } else if (seed < 60) {
        completedCount = 4;
      } else if (seed < 85) {
        completedCount = 5 + (seed % 2);
      } else if (seed < 95) {
        completedCount = 7;
      } else {
        completedCount = 8;
      }

      if (m === currentMonth && d === currentDay) {
        completedCount = 6;
      }

      const completedHabitIds = habitIds.slice(0, completedCount);
      const note = seed % 6 === 0 ? sampleNotes[seed % sampleNotes.length] : undefined;
      const mood = completedCount >= 6 ? 'great' : completedCount >= 4 ? 'good' : completedCount > 0 ? 'neutral' : 'tired';

      records[dateStr] = {
        date: dateStr,
        completedHabitIds,
        note,
        mood,
      };
    }
  }

  return records;
}
