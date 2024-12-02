create table if not exists public.riot_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  riot_id text not null,
  tag_line text not null,
  puuid text not null,
  region text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id),
  unique(puuid)
);

-- Adiciona RLS (Row Level Security)
alter table public.riot_accounts enable row level security;

-- Políticas de segurança
create policy "Usuários podem ver apenas suas próprias contas"
  on public.riot_accounts for select
  using (auth.uid() = user_id);

create policy "Usuários podem inserir apenas suas próprias contas"
  on public.riot_accounts for insert
  with check (auth.uid() = user_id);

create policy "Usuários podem atualizar apenas suas próprias contas"
  on public.riot_accounts for update
  using (auth.uid() = user_id);

create policy "Usuários podem deletar apenas suas próprias contas"
  on public.riot_accounts for delete
  using (auth.uid() = user_id);
