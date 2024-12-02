-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  summoner_id text,
  summoner_name text,
  region text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

-- Create indexes
create index profiles_summoner_id_idx on profiles(summoner_id);
create index profiles_summoner_name_idx on profiles(summoner_name);

-- Set up Row Level Security
alter table profiles force row level security;
