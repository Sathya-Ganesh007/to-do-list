-- 1. Create the tasks table (Safe: Only if it doesn't exist)
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  completed boolean default false,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Security (RLS)
alter table public.tasks enable row level security;

-- 3. Reset Policies (Safe: Drops old ones first so you don't get errors)
drop policy if exists "Users can view their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

-- 4. Create Access Policies
create policy "Users can view their own tasks" 
  on public.tasks for select using (auth.uid() = user_id);

create policy "Users can insert their own tasks" 
  on public.tasks for insert with check (auth.uid() = user_id);

create policy "Users can update their own tasks" 
  on public.tasks for update using (auth.uid() = user_id);

create policy "Users can delete their own tasks" 
  on public.tasks for delete using (auth.uid() = user_id);
