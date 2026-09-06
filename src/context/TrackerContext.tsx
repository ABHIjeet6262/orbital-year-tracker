import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import type {
  Habit,
  Goal,
  DayCompletionRecord,
  DayProgress,
  PageTheme,
  CirclePalette,
  UserProfile,
  YearStats,
} from '../types';
import {
  INITIAL_HABITS,
  INITIAL_GOALS,
  generateSampleCompletions,
} from '../utils/sampleData';
import {
  formatDateString,
  getDaysInMonth,
  getTodayString,
  isDateBefore,
  isSameDay,
  parseDateString,
} from '../utils/dateUtils';
import { getCompletionColor } from '../utils/colors';

interface TrackerContextType {
  year: number;
  setYear: (year: number) => void;
  habits: Habit[];
  activeHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  reorderHabits: (habits: Habit[]) => void;
  
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  incrementGoal: (id: string, delta: number) => void;

  completions: Record<string, DayCompletionRecord>;
  toggleHabitCompletion: (dateStr: string, habitId: string) => void;
  updateDayNote: (dateStr: string, note: string, mood?: DayCompletionRecord['mood']) => void;

  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isDayDrawerOpen: boolean;
  setIsDayDrawerOpen: (open: boolean) => void;
  openDayDrawer: (dateStr: string) => void;

  pageTheme: PageTheme;
  setPageTheme: (theme: PageTheme) => void;

  circlePalette: CirclePalette;
  setCirclePalette: (palette: CirclePalette) => void;

  user: UserProfile;
  setUser: (user: UserProfile) => void;

  filterHabitId: string | null;
  setFilterHabitId: (id: string | null) => void;

  getDayProgress: (dateStr: string) => DayProgress;
  getDayProgressByIndices: (year: number, monthIndex: number, dayOfMonth: number) => DayProgress;
  yearStats: YearStats;

  resetToSampleData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  HABITS: 'orbital_habits_v1',
  GOALS: 'orbital_goals_v1',
  COMPLETIONS: 'orbital_completions_v1',
  PAGE_THEME: 'orbital_page_theme_v2',
  CIRCLE_PALETTE: 'orbital_circle_palette_v2',
  USER: 'orbital_user_v1',
};

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [year, setYear] = useState<number>(2026);
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayString());
  const [isDayDrawerOpen, setIsDayDrawerOpen] = useState<boolean>(false);
  const [filterHabitId, setFilterHabitId] = useState<string | null>(null);

  // Page Theme: light / dark
  const [pageTheme, setPageThemeState] = useState<PageTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAGE_THEME);
    return saved === 'light' || saved === 'dark' ? (saved as PageTheme) : 'dark';
  });

  const setPageTheme = (newTheme: PageTheme) => {
    setPageThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.PAGE_THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (pageTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [pageTheme]);

  // Circle Color Palette
  const [circlePalette, setCirclePaletteState] = useState<CirclePalette>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CIRCLE_PALETTE);
    return (saved as CirclePalette) || 'forest';
  });

  const setCirclePalette = (p: CirclePalette) => {
    setCirclePaletteState(p);
    localStorage.setItem(STORAGE_KEYS.CIRCLE_PALETTE, p);
  };

  // User profile
  const [user, setUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: 'guest-1',
      name: 'Guest Traveler',
      isGuest: true,
    };
  });

  const setUser = (u: UserProfile) => {
    setUserState(u);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
  };

  // Habits
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_HABITS;
  });

  // Goals
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_GOALS;
  });

  // Completions
  const [completions, setCompletions] = useState<Record<string, DayCompletionRecord>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return generateSampleCompletions(2026);
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);

  // Habit Actions
  const addHabit = (newHabitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      for (const date in next) {
        if (next[date].completedHabitIds.includes(id)) {
          next[date] = {
            ...next[date],
            completedHabitIds: next[date].completedHabitIds.filter((hId) => hId !== id),
          };
        }
      }
      return next;
    });
  };

  const reorderHabits = (reordered: Habit[]) => {
    setHabits(reordered);
  };

  // Goal Actions
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        if (updated.currentValue >= updated.targetValue) {
          updated.completed = true;
        }
        return updated;
      })
    );
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const incrementGoal = (id: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const nextVal = Math.max(0, g.currentValue + delta);
        const isCompleted = nextVal >= g.targetValue;
        if (isCompleted && !g.completed) {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#16a34a', '#86efac'],
          });
        }
        return {
          ...g,
          currentValue: nextVal,
          completed: isCompleted,
        };
      })
    );
  };

  // Completion Actions
  const toggleHabitCompletion = (dateStr: string, habitId: string) => {
    setCompletions((prev) => {
      const existing = prev[dateStr] || { date: dateStr, completedHabitIds: [] };
      const isCompleted = existing.completedHabitIds.includes(habitId);
      const newCompletedIds = isCompleted
        ? existing.completedHabitIds.filter((id) => id !== habitId)
        : [...existing.completedHabitIds, habitId];

      if (!isCompleted && newCompletedIds.length === activeHabits.length && activeHabits.length > 0) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#14532d', '#22c55e', '#4ade80', '#86efac'],
        });
      }

      return {
        ...prev,
        [dateStr]: {
          ...existing,
          completedHabitIds: newCompletedIds,
        },
      };
    });
  };

  const updateDayNote = (
    dateStr: string,
    note: string,
    mood?: DayCompletionRecord['mood']
  ) => {
    setCompletions((prev) => {
      const existing = prev[dateStr] || { date: dateStr, completedHabitIds: [] };
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          note,
          ...(mood ? { mood } : {}),
        },
      };
    });
  };

  const openDayDrawer = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsDayDrawerOpen(true);
  };

  // Day Progress Calculators
  const getDayProgressByIndices = (
    yr: number,
    monthIndex: number,
    dayOfMonth: number
  ): DayProgress => {
    const daysInMonth = getDaysInMonth(yr, monthIndex);
    const isValidDay = dayOfMonth <= daysInMonth;
    const dateStr = formatDateString(yr, monthIndex, dayOfMonth);
    const today = getTodayString();

    if (!isValidDay) {
      return {
        dateString: dateStr,
        dayOfMonth,
        monthIndex,
        year: yr,
        totalHabits: 0,
        completedCount: 0,
        percentage: 0,
        color: getCompletionColor(0, false, false, pageTheme, circlePalette),
        isToday: false,
        isPast: false,
        isFuture: false,
        isValidDay: false,
      };
    }

    const record = completions[dateStr];
    const isToday = isSameDay(dateStr, today);
    const isPast = isDateBefore(dateStr, today);
    const isFuture = !isToday && !isPast;

    let totalHabits = activeHabits.length;
    let completedCount = 0;

    if (filterHabitId) {
      totalHabits = 1;
      completedCount = record && record.completedHabitIds.includes(filterHabitId) ? 1 : 0;
    } else {
      if (record) {
        completedCount = record.completedHabitIds.filter((id) =>
          activeHabits.some((h) => h.id === id)
        ).length;
      }
    }

    const percentage =
      totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    
    const isRecorded = Boolean(record) && (isPast || isToday);
    const color = getCompletionColor(percentage, isRecorded, true, pageTheme, circlePalette);

    return {
      dateString: dateStr,
      dayOfMonth,
      monthIndex,
      year: yr,
      totalHabits,
      completedCount,
      percentage,
      color,
      isToday,
      isPast,
      isFuture,
      isValidDay: true,
      note: record?.note,
    };
  };

  const getDayProgress = (dateStr: string): DayProgress => {
    const { year: yr, monthIndex, day } = parseDateString(dateStr);
    return getDayProgressByIndices(yr, monthIndex, day);
  };

  // Year Stats
  const yearStats = useMemo<YearStats>(() => {
    let totalDays = 0;
    let recordedDays = 0;
    let perfectDays = 0;
    let totalPercentage = 0;
    let totalHabitsCompleted = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = getTodayString();
    const isCurrentYear = year === new Date().getFullYear();

    for (let m = 0; m < 12; m++) {
      const days = getDaysInMonth(year, m);
      for (let d = 1; d <= days; d++) {
        totalDays++;
        const dateStr = formatDateString(year, m, d);
        const record = completions[dateStr];
        const isPastOrToday = isDateBefore(dateStr, today) || isSameDay(dateStr, today);

        if (isPastOrToday && record) {
          recordedDays++;
          const validCompleted = record.completedHabitIds.filter((id) =>
            activeHabits.some((h) => h.id === id)
          ).length;
          totalHabitsCompleted += validCompleted;

          const pct =
            activeHabits.length > 0
              ? Math.round((validCompleted / activeHabits.length) * 100)
              : 0;
          totalPercentage += pct;

          if (pct === 100) {
            perfectDays++;
          }

          if (pct > 0) {
            tempStreak++;
            if (tempStreak > bestStreak) bestStreak = tempStreak;
          } else {
            tempStreak = 0;
          }
        } else if (isPastOrToday) {
          tempStreak = 0;
        }
      }
    }

    if (isCurrentYear) {
      let checkDate = new Date();
      while (true) {
        const dStr = formatDateString(
          checkDate.getFullYear(),
          checkDate.getMonth(),
          checkDate.getDate()
        );
        if (checkDate.getFullYear() !== year) break;
        const rec = completions[dStr];
        if (rec && rec.completedHabitIds.length > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else if (isSameDay(dStr, today)) {
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    const averageCompletion =
      recordedDays > 0 ? Math.round(totalPercentage / recordedDays) : 0;

    return {
      totalDays,
      recordedDays,
      perfectDays,
      averageCompletion,
      currentStreak,
      bestStreak,
      totalHabitsCompleted,
    };
  }, [year, completions, activeHabits]);

  const resetToSampleData = () => {
    setHabits(INITIAL_HABITS);
    setGoals(INITIAL_GOALS);
    const newCompletions = generateSampleCompletions(year);
    setCompletions(newCompletions);
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(INITIAL_HABITS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_GOALS));
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(newCompletions));
  };

  const exportDataJSON = () => {
    const exportData = {
      version: 1,
      exportDate: new Date().toISOString(),
      user,
      habits,
      goals,
      completions,
    };
    return JSON.stringify(exportData, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.habits && Array.isArray(data.habits)) {
        setHabits(data.habits);
      }
      if (data.goals && Array.isArray(data.goals)) {
        setGoals(data.goals);
      }
      if (data.completions && typeof data.completions === 'object') {
        setCompletions(data.completions);
      }
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  };

  return (
    <TrackerContext.Provider
      value={{
        year,
        setYear,
        habits,
        activeHabits,
        addHabit,
        updateHabit,
        deleteHabit,
        reorderHabits,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        incrementGoal,
        completions,
        toggleHabitCompletion,
        updateDayNote,
        selectedDate,
        setSelectedDate,
        isDayDrawerOpen,
        setIsDayDrawerOpen,
        openDayDrawer,
        pageTheme,
        setPageTheme,
        circlePalette,
        setCirclePalette,
        user,
        setUser,
        filterHabitId,
        setFilterHabitId,
        getDayProgress,
        getDayProgressByIndices,
        yearStats,
        resetToSampleData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackerProvider');
  }
  return context;
};
