import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type {
  Habit,
  Goal,
  DayCompletionRecord,
  DayProgress,
  PageTheme,
  ViewMode,
  CircleTone,
  CirclePalette,
  UserProfile,
  SyncStatus,
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
import {
  supabase,
  isSupabaseConfigured,
  fetchUserData,
  syncHabitToCloud,
  deleteHabitFromCloud,
  syncGoalToCloud,
  deleteGoalFromCloud,
  syncCompletionToCloud,
  uploadLocalDataToCloud,
  mapRowToHabit,
  mapRowToGoal,
  type CloudHabitRow,
  type CloudGoalRow,
  type CloudCompletionRow,
} from '../lib/supabase';

interface TrackerContextType {
  year: number;
  setYear: (year: number) => void;
  habits: Habit[];
  activeHabits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  reorderHabits: (habits: Habit[]) => void;
  
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  incrementGoal: (id: string, delta: number) => Promise<void>;

  completions: Record<string, DayCompletionRecord>;
  toggleHabitCompletion: (dateStr: string, habitId: string) => Promise<void>;
  updateDayNote: (dateStr: string, note: string, mood?: DayCompletionRecord['mood']) => Promise<void>;

  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isDayDrawerOpen: boolean;
  setIsDayDrawerOpen: (open: boolean) => void;
  openDayDrawer: (dateStr: string) => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  enterTracker: (startTourOption?: boolean) => void;
  returnToLanding: () => void;

  isTourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: (withConfetti?: boolean) => void;

  pageTheme: PageTheme;
  setPageTheme: (theme: PageTheme) => void;

  circlePalette: CirclePalette;
  setCirclePalette: (palette: CirclePalette) => void;

  circleTone: CircleTone;
  setCircleTone: (tone: CircleTone) => void;

  user: UserProfile;
  setUser: (user: UserProfile) => void;
  syncStatus: SyncStatus;
  isCloudConnected: boolean;
  syncLocalToCloud: () => Promise<boolean>;

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
  VIEW_MODE: 'orbital_view_mode_v2',
  HAS_SEEN_TOUR: 'orbital_has_seen_tour_v2',
  CIRCLE_PALETTE: 'orbital_circle_palette_v3',
  CIRCLE_TONE: 'orbital_circle_tone_v1',
  USER: 'orbital_user_v1',
};

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [year, setYear] = useState<number>(2026);
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayString());
  const [isDayDrawerOpen, setIsDayDrawerOpen] = useState<boolean>(false);
  const [filterHabitId, setFilterHabitId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('guest');

  // View Mode: 'landing' vs 'tracker'
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return saved === 'tracker' || saved === 'landing' ? (saved as ViewMode) : 'landing';
  });

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  };

  // Interactive Guided Tour State
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0);

  const startTour = () => {
    setTourStep(0);
    setIsTourActive(true);
  };

  const nextTourStep = () => {
    if (tourStep < 3) {
      setTourStep((s) => s + 1);
    } else {
      endTour(true);
    }
  };

  const prevTourStep = () => {
    if (tourStep > 0) {
      setTourStep((s) => s - 1);
    }
  };

  const endTour = (withConfetti: boolean = true) => {
    setIsTourActive(false);
    localStorage.setItem(STORAGE_KEYS.HAS_SEEN_TOUR, 'true');
    if (withConfetti) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    }
  };

  const enterTracker = (startTourOption: boolean = true) => {
    setViewMode('tracker');
    const hasSeenTour = localStorage.getItem(STORAGE_KEYS.HAS_SEEN_TOUR);
    if (startTourOption && !hasSeenTour) {
      setTourStep(0);
      setIsTourActive(true);
    } else if (startTourOption === true && hasSeenTour) {
      setTourStep(0);
      setIsTourActive(true);
    }
  };

  const returnToLanding = () => {
    setIsTourActive(false);
    setViewMode('landing');
  };

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

  // Circle Tone: bright (light) / dark
  const [circleTone, setCircleToneState] = useState<CircleTone>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CIRCLE_TONE);
    return saved === 'bright' || saved === 'dark' ? (saved as CircleTone) : 'dark';
  });

  const setCircleTone = (t: CircleTone) => {
    setCircleToneState(t);
    localStorage.setItem(STORAGE_KEYS.CIRCLE_TONE, t);
  };

  // Circle Color Palette
  const [circlePalette, setCirclePaletteState] = useState<CirclePalette>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CIRCLE_PALETTE);
    return (saved as CirclePalette) || 'forest_dark';
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
    setSyncStatus(u.isGuest ? 'guest' : 'synced');
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

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
  }, [completions]);

  // Load cloud data for logged-in users
  const loadCloudUserData = useCallback(async (userId: string) => {
    setSyncStatus('syncing');
    try {
      const cloudData = await fetchUserData(userId);
      if (cloudData) {
        if (cloudData.habits && cloudData.habits.length > 0) {
          setHabits(cloudData.habits);
        }
        if (cloudData.goals && cloudData.goals.length > 0) {
          setGoals(cloudData.goals);
        }
        if (cloudData.completions && Object.keys(cloudData.completions).length > 0) {
          setCompletions(cloudData.completions);
        }
        if (cloudData.profile?.circle_palette) {
          setCirclePaletteState(cloudData.profile.circle_palette);
        }
        if (cloudData.profile?.circle_tone) {
          setCircleToneState(cloudData.profile.circle_tone);
        }
      }
      setSyncStatus('synced');
    } catch (err) {
      console.error('Failed to load cloud data:', err);
      setSyncStatus('offline');
    }
  }, []);

  // Supabase Auth & Realtime Subscriptions
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setSyncStatus('guest');
      return;
    }

    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email,
          isGuest: false,
        };
        setUserState(u);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
        loadCloudUserData(session.user.id);
      } else {
        setSyncStatus('guest');
      }
    });

    // 2. Auth State Listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u: UserProfile = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            isGuest: false,
          };
          setUserState(u);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(u));
          loadCloudUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          const guest: UserProfile = {
            id: 'guest-1',
            name: 'Guest Traveler',
            isGuest: true,
          };
          setUserState(guest);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(guest));
          setSyncStatus('guest');
        }
      }
    );

    // 3. Realtime Postgres Changes Subscription
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
    if (user && !user.isGuest) {
      realtimeChannel = supabase
        .channel(`realtime:orbital-${user.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'habits', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newH = mapRowToHabit(payload.new as CloudHabitRow);
              setHabits((prev) => (prev.some((h) => h.id === newH.id) ? prev : [...prev, newH]));
            } else if (payload.eventType === 'UPDATE') {
              const updatedH = mapRowToHabit(payload.new as CloudHabitRow);
              setHabits((prev) => prev.map((h) => (h.id === updatedH.id ? updatedH : h)));
            } else if (payload.eventType === 'DELETE') {
              const oldId = (payload.old as { id: string }).id;
              setHabits((prev) => prev.filter((h) => h.id !== oldId));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newG = mapRowToGoal(payload.new as CloudGoalRow);
              setGoals((prev) => (prev.some((g) => g.id === newG.id) ? prev : [...prev, newG]));
            } else if (payload.eventType === 'UPDATE') {
              const updatedG = mapRowToGoal(payload.new as CloudGoalRow);
              setGoals((prev) => prev.map((g) => (g.id === updatedG.id ? updatedG : g)));
            } else if (payload.eventType === 'DELETE') {
              const oldId = (payload.old as { id: string }).id;
              setGoals((prev) => prev.filter((g) => g.id !== oldId));
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'completions', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const row = payload.new as CloudCompletionRow;
              setCompletions((prev) => ({
                ...prev,
                [row.date]: {
                  date: row.date,
                  completedHabitIds: Array.isArray(row.completed_habit_ids) ? row.completed_habit_ids : [],
                  note: row.note || undefined,
                  mood: (row.mood as DayCompletionRecord['mood']) || undefined,
                },
              }));
            }
          }
        )
        .subscribe();
    }

    return () => {
      authSubscription.unsubscribe();
      if (realtimeChannel) {
        realtimeChannel.unsubscribe();
      }
    };
  }, [user.id, user.isGuest, loadCloudUserData]);

  // Sync Local Data to Cloud
  const syncLocalToCloud = async (): Promise<boolean> => {
    if (user.isGuest || !isSupabaseConfigured) return false;
    setSyncStatus('syncing');
    try {
      await uploadLocalDataToCloud(user.id, habits, goals, completions);
      setSyncStatus('synced');
      return true;
    } catch (err) {
      console.error('Error syncing local data to cloud:', err);
      setSyncStatus('offline');
      return false;
    }
  };

  const activeHabits = useMemo(() => habits.filter((h) => !h.archived), [habits]);

  // Habit Actions
  const addHabit = async (newHabitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [...prev, newHabit]);

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await syncHabitToCloud(user.id, newHabit);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync habit error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    let updatedHabit: Habit | undefined;
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          updatedHabit = { ...h, ...updates };
          return updatedHabit;
        }
        return h;
      })
    );

    if (!user.isGuest && isSupabaseConfigured && updatedHabit) {
      setSyncStatus('syncing');
      try {
        await syncHabitToCloud(user.id, updatedHabit);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync habit error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const deleteHabit = async (id: string) => {
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

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await deleteHabitFromCloud(user.id, id);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Delete habit error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const reorderHabits = (reordered: Habit[]) => {
    setHabits(reordered);
  };

  // Goal Actions
  const addGoal = async (goalData: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [...prev, newGoal]);

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await syncGoalToCloud(user.id, newGoal);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync goal error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    let updatedGoal: Goal | undefined;
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const updated = { ...g, ...updates };
        if (updated.currentValue >= updated.targetValue) {
          updated.completed = true;
        }
        updatedGoal = updated;
        return updated;
      })
    );

    if (!user.isGuest && isSupabaseConfigured && updatedGoal) {
      setSyncStatus('syncing');
      try {
        await syncGoalToCloud(user.id, updatedGoal);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync goal error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const deleteGoal = async (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await deleteGoalFromCloud(user.id, id);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Delete goal error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const incrementGoal = async (id: string, delta: number) => {
    let updatedGoal: Goal | undefined;
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
        updatedGoal = {
          ...g,
          currentValue: nextVal,
          completed: isCompleted,
        };
        return updatedGoal;
      })
    );

    if (!user.isGuest && isSupabaseConfigured && updatedGoal) {
      setSyncStatus('syncing');
      try {
        await syncGoalToCloud(user.id, updatedGoal);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync goal error:', e);
        setSyncStatus('offline');
      }
    }
  };

  // Completion Actions
  const toggleHabitCompletion = async (dateStr: string, habitId: string) => {
    let updatedCompletedIds: string[] = [];
    let currentNote: string | undefined;
    let currentMood: DayCompletionRecord['mood'] | undefined;

    setCompletions((prev) => {
      const existing = prev[dateStr] || { date: dateStr, completedHabitIds: [] };
      const isCompleted = existing.completedHabitIds.includes(habitId);
      const newCompletedIds = isCompleted
        ? existing.completedHabitIds.filter((id) => id !== habitId)
        : [...existing.completedHabitIds, habitId];

      updatedCompletedIds = newCompletedIds;
      currentNote = existing.note;
      currentMood = existing.mood;

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

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await syncCompletionToCloud(user.id, dateStr, updatedCompletedIds, currentNote, currentMood);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync completion error:', e);
        setSyncStatus('offline');
      }
    }
  };

  const updateDayNote = async (
    dateStr: string,
    note: string,
    mood?: DayCompletionRecord['mood']
  ) => {
    let completedIds: string[] = [];

    setCompletions((prev) => {
      const existing = prev[dateStr] || { date: dateStr, completedHabitIds: [] };
      completedIds = existing.completedHabitIds;
      return {
        ...prev,
        [dateStr]: {
          ...existing,
          note,
          ...(mood ? { mood } : {}),
        },
      };
    });

    if (!user.isGuest && isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        await syncCompletionToCloud(user.id, dateStr, completedIds, note, mood);
        setSyncStatus('synced');
      } catch (e) {
        console.error('Sync day note error:', e);
        setSyncStatus('offline');
      }
    }
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
        color: getCompletionColor(0, false, false, circleTone, circlePalette),
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
    const color = getCompletionColor(percentage, isRecorded, true, circleTone, circlePalette);

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
        viewMode,
        setViewMode,
        enterTracker,
        returnToLanding,
        isTourActive,
        tourStep,
        startTour,
        nextTourStep,
        prevTourStep,
        endTour,
        pageTheme,
        setPageTheme,
        circlePalette,
        setCirclePalette,
        circleTone,
        setCircleTone,
        user,
        setUser,
        syncStatus,
        isCloudConnected: isSupabaseConfigured,
        syncLocalToCloud,
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
