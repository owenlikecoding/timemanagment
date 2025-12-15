# Supabase Configuration

To use this application with Supabase, you need to:

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamp with time zone not null,
  estimated_minutes integer not null,
  business text check (business in ('nirvo-ai', 'palmetto-home-care')),
  revenue numeric(10, 2),
  urgency integer check (urgency >= 1 and urgency <= 10) not null,
  energy_required text check (energy_required in ('low', 'medium', 'high')) not null,
  completed boolean default false,
  scheduled_block_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);

-- Create index for performance
create index if not exists tasks_user_id_idx on tasks(user_id);
create index if not exists tasks_deadline_idx on tasks(deadline);
```

## Optional: Time Blocks Table

If you want to persist custom time blocks:

```sql
create table if not exists time_blocks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  day integer check (day >= 0 and day <= 6) not null,
  start_hour integer check (start_hour >= 0 and start_hour <= 23) not null,
  start_minute integer check (start_minute >= 0 and start_minute <= 59) not null,
  end_hour integer check (end_hour >= 0 and end_hour <= 23) not null,
  end_minute integer check (end_minute >= 0 and end_minute <= 59) not null,
  type text check (type in ('school', 'practice', 'sleep', 'available')) not null,
  locked boolean default false,
  title text,
  created_at timestamp with time zone default now()
);

alter table time_blocks enable row level security;

create policy "Users can view their own time blocks"
  on time_blocks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own time blocks"
  on time_blocks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own time blocks"
  on time_blocks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own time blocks"
  on time_blocks for delete
  using (auth.uid() = user_id);
```
