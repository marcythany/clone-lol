-- Create profiles table if it doesn't exist
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  summoner_name text,
  tag_line text,
  puuid text,
  region text,
  profile_icon_id integer,
  summoner_level integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Add indexes for better performance
  constraint profiles_puuid_key unique (puuid),
  constraint profiles_summoner_name_tag_line_key unique (summoner_name, tag_line)
);

-- Enable RLS
alter table profiles enable row level security;

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on profiles
  for each row
  execute procedure handle_updated_at();
