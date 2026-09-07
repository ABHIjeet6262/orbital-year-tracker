export type Frequency = 'daily' | 'weekdays' | 'weekends';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: Frequency;
  category?: string;
  color?: string;
  startDate: string; // YYYY-MM-DD
  archived?: boolean;
  createdAt: string;
}

export interface DayCompletionRecord {
  date: string; // YYYY-MM-DD
  completedHabitIds: string[];
  note?: string;
  mood?: 'great' | 'good' | 'neutral' | 'tired' | 'bad';
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  deadline?: string;
  completed?: boolean;
  createdAt: string;
}

export interface DayProgress {
  dateString: string; // YYYY-MM-DD
  dayOfMonth: number; // 1..31
  monthIndex: number; // 0..11 (0=Jan, 11=Dec)
  year: number;
  totalHabits: number;
  completedCount: number;
  percentage: number; // 0..100
  color: string;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isValidDay: boolean; // false for invalid month days (e.g. Feb 30)
  note?: string;
}

export type PageTheme = 'light' | 'dark';

export type ViewMode = 'landing' | 'tracker';

export type CircleTone = 'bright' | 'dark';

export type CirclePalette =
  // Bright palettes
  | 'sage_bright'
  | 'mint_bright'
  | 'sky_bright'
  | 'amber_bright'
  | 'rose_bright'
  | 'slate_bright'
  // Dark palettes
  | 'forest_dark'
  | 'mint_dark'
  | 'ocean_dark'
  | 'sunset_dark'
  | 'amethyst_dark'
  | 'slate_dark'
  // Legacy aliases
  | 'forest'
  | 'emerald'
  | 'ocean'
  | 'amber'
  | 'amethyst'
  | 'monochrome';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'guest';

export interface YearStats {
  totalDays: number;
  recordedDays: number;
  perfectDays: number;
  averageCompletion: number;
  currentStreak: number;
  bestStreak: number;
  totalHabitsCompleted: number;
}
