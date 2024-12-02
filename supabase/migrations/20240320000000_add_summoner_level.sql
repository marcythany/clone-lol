-- Add summoner_level column to profiles table
alter table public.profiles
add column if not exists summoner_level integer;
