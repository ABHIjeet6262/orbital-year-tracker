import { createClient, type SupabaseClient, type User as SupabaseUser } from '@supabase/supabase-js';
import type { Habit, Goal, DayCompletionRecord, CirclePalette, CircleTone, PageTheme } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 10
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Generates collision-resistant unique IDs using native crypto.randomUUID()
 */
export function generateUniqueId(prefix: string = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ==============================================================================
// AUTH HELPERS
// ==============================================================================

export async function getCurrentSession() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('Supabase getSession error:', error.message);
      return null;
    }
    return data.session;
  } catch (err) {
    console.warn('Supabase getSession exception:', err);
    return null;
  }
}

export async function getCurrentUser(): Promise<SupabaseUser | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('Supabase getUser error:', error.message);
      return null;
    }
    return data.user;
  } catch (err) {
    console.warn('Supabase getUser exception:', err);
    return null;
  }
}

export async function signInWithPassword(email: string, password: string) {
  if (!supabase) throw new Error('Cloud backend is not configured.');
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string, name?: string) {
  if (!supabase) throw new Error('Cloud backend is not configured.');
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split('@')[0],
      },
    },
  });
}

export async function signInWithMagicLink(email: string) {
  if (!supabase) throw new Error('Cloud backend is not configured.');
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });
}

export async function signOutCloud() {
  if (!supabase) return;
  return await supabase.auth.signOut();
}

// ==============================================================================
// DATA CLOUD SYNC & REPOSITORY
// ==============================================================================

export interface CloudHabitRow {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  frequency: string;
  category?: string | null;
  color?: string | null;
  start_date: string;
  archived: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CloudGoalRow {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  current_value: number;
  target_value: number;
  unit?: string | null;
  deadline?: string | null;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CloudCompletionRow {
  id?: string;
  user_id: string;
  date: string;
  completed_habit_ids: string[];
  note?: string | null;
  mood?: string | null;
}

export interface CloudProfileRow {
  id: string;
  name?: string | null;
  email?: string | null;
  circle_palette?: CirclePalette | null;
  circle_tone?: CircleTone | null;
  page_theme?: PageTheme | null;
}

// Transform Helpers
export function mapRowToHabit(row: CloudHabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    frequency: (row.frequency as Habit['frequency']) || 'daily',
    category: row.category || undefined,
    color: row.color || undefined,
    startDate: row.start_date,
    archived: row.archived,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapHabitToRow(userId: string, habit: Habit): CloudHabitRow {
  return {
    id: habit.id,
    user_id: userId,
    name: habit.name,
    description: habit.description || null,
    frequency: habit.frequency,
    category: habit.category || null,
    color: habit.color || null,
    start_date: habit.startDate,
    archived: habit.archived ?? false,
    created_at: habit.createdAt,
    updated_at: new Date().toISOString(),
  };
}

export function mapRowToGoal(row: CloudGoalRow): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    category: row.category || undefined,
    currentValue: Number(row.current_value) || 0,
    targetValue: Number(row.target_value) || 100,
    unit: row.unit || undefined,
    deadline: row.deadline || undefined,
    completed: row.completed,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapGoalToRow(userId: string, goal: Goal): CloudGoalRow {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    description: goal.description || null,
    category: goal.category || null,
    current_value: goal.currentValue,
    target_value: goal.targetValue,
    unit: goal.unit || null,
    deadline: goal.deadline || null,
    completed: goal.completed ?? false,
    created_at: goal.createdAt,
    updated_at: new Date().toISOString(),
  };
}

// Database Operations
export async function fetchUserData(userId: string) {
  if (!supabase) return null;

  const [habitsRes, goalsRes, completionsRes, profileRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('goals').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
    supabase.from('completions').select('*').eq('user_id', userId),
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
  ]);

  if (habitsRes.error) throw habitsRes.error;
  if (goalsRes.error) throw goalsRes.error;
  if (completionsRes.error) throw completionsRes.error;
  if (profileRes.error) throw profileRes.error;

  const habits: Habit[] = (habitsRes.data || []).map(mapRowToHabit);
  const goals: Goal[] = (goalsRes.data || []).map(mapRowToGoal);
  
  const completions: Record<string, DayCompletionRecord> = {};
  (completionsRes.data || []).forEach((row: CloudCompletionRow) => {
    completions[row.date] = {
      date: row.date,
      completedHabitIds: Array.isArray(row.completed_habit_ids) ? row.completed_habit_ids : [],
      note: row.note || undefined,
      mood: (row.mood as DayCompletionRecord['mood']) || undefined,
    };
  });

  return {
    habits,
    goals,
    completions,
    profile: profileRes.data as CloudProfileRow | null,
  };
}

export async function syncHabitToCloud(userId: string, habit: Habit) {
  if (!supabase) return;
  const row = mapHabitToRow(userId, habit);
  const { error } = await supabase.from('habits').upsert(row, { onConflict: 'id' });
  if (error) throw error;
}

export async function syncHabitsBatchToCloud(userId: string, habits: Habit[]) {
  if (!supabase || habits.length === 0) return;
  const rows = habits.map((h) => mapHabitToRow(userId, h));
  const { error } = await supabase.from('habits').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteHabitFromCloud(userId: string, habitId: string) {
  if (!supabase) return;
  const { error } = await supabase.from('habits').delete().eq('user_id', userId).eq('id', habitId);
  if (error) throw error;
}

export async function syncGoalToCloud(userId: string, goal: Goal) {
  if (!supabase) return;
  const row = mapGoalToRow(userId, goal);
  const { error } = await supabase.from('goals').upsert(row, { onConflict: 'id' });
  if (error) throw error;
}

export async function deleteGoalFromCloud(userId: string, goalId: string) {
  if (!supabase) return;
  const { error } = await supabase.from('goals').delete().eq('user_id', userId).eq('id', goalId);
  if (error) throw error;
}

export async function syncCompletionToCloud(
  userId: string,
  date: string,
  completedHabitIds: string[],
  note?: string,
  mood?: DayCompletionRecord['mood']
) {
  if (!supabase) return;
  const payload: CloudCompletionRow = {
    user_id: userId,
    date,
    completed_habit_ids: completedHabitIds,
    note: note || null,
    mood: mood || null,
  };
  const { error } = await supabase.from('completions').upsert(payload, { onConflict: 'user_id,date' });
  if (error) throw error;
}

export async function uploadLocalDataToCloud(
  userId: string,
  habits: Habit[],
  goals: Goal[],
  completions: Record<string, DayCompletionRecord>
) {
  if (!supabase) return;

  // 1. Upload Habits
  if (habits.length > 0) {
    const habitRows = habits.map((h) => mapHabitToRow(userId, h));
    const { error: hErr } = await supabase.from('habits').upsert(habitRows, { onConflict: 'id' });
    if (hErr) throw hErr;
  }

  // 2. Upload Goals
  if (goals.length > 0) {
    const goalRows = goals.map((g) => mapGoalToRow(userId, g));
    const { error: gErr } = await supabase.from('goals').upsert(goalRows, { onConflict: 'id' });
    if (gErr) throw gErr;
  }

  // 3. Upload Completions
  const completionRows: CloudCompletionRow[] = Object.values(completions).map((c) => ({
    user_id: userId,
    date: c.date,
    completed_habit_ids: c.completedHabitIds,
    note: c.note || null,
    mood: c.mood || null,
  }));

  if (completionRows.length > 0) {
    const { error: cErr } = await supabase.from('completions').upsert(completionRows, { onConflict: 'user_id,date' });
    if (cErr) throw cErr;
  }
}
