-- Adiciona novas colunas à tabela profiles
alter table public.profiles
  add column if not exists puuid text unique,
  add column if not exists summoner_name text,
  add column if not exists tag_line text,
  add column if not exists region text,
  add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- Remove colunas antigas que não serão mais usadas
alter table public.profiles
  drop column if exists summoner_id,
  drop column if exists profile_icon_id;
