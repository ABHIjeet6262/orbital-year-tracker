-- ==============================================================================
-- Orbital Year Tracker - PostgreSQL Database Schema with Row-Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table (Extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  email text,
  circle_palette text default 'forest_dark',
  circle_tone text default 'dark' check (circle_tone in ('bright', 'dark')),
  page_theme text default 'dark' check (page_theme in ('light', 'dark')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Habits Table
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  description text,
  frequency text not null default 'daily' check (frequency in ('daily', 'weekdays', 'weekends')),
  category text,
  color text,
  start_date text not null,
  archived boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Goals Table
create table if not exists public.goals (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  current_value numeric not null default 0,
  target_value numeric not null default 100,
  unit text,
  deadline text,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Completions Table
create table if not exists public.completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null, -- YYYY-MM-DD
  completed_habit_ids jsonb not null default '[]'::jsonb check (jsonb_typeof(completed_habit_ids) = 'array'),
  note text,
  mood text check (mood is null or mood in ('great', 'good', 'neutral', 'tired', 'bad')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_user_date unique (user_id, date)
);

-- Indexes for optimal performance
create index if not exists idx_habits_user on public.habits(user_id);
create index if not exists idx_goals_user on public.goals(user_id);
create index if not exists idx_completions_user_date on public.completions(user_id, date);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.goals enable row level security;
alter table public.completions enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Habits Policies
create policy "Users can view own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "Users can insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "Users can delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- Goals Policies
create policy "Users can view own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Completions Policies
create policy "Users can view own completions"
  on public.completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.completions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own completions"
  on public.completions for update
  using (auth.uid() = user_id);

create policy "Users can delete own completions"
  on public.completions for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- REALTIME ENABLEMENT
-- ==============================================================================
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.goals;
alter publication supabase_realtime add table public.completions;
