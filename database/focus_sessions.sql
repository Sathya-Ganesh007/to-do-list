-- Create a table for focus sessions
create table if not exists public.focus_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  duration_minutes integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.focus_sessions enable row level security;

-- Policies
create policy "Users can view their own focus sessions" 
  on public.focus_sessions for select using (auth.uid() = user_id);

create policy "Users can insert their own focus sessions" 
  on public.focus_sessions for insert with check (auth.uid() = user_id);
