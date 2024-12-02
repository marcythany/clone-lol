-- Recria a tabela profiles com a estrutura correta
drop table if exists public.profiles;

create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    puuid text unique,
    summoner_name text,
    tag_line text,
    region text,
    profile_icon_id integer
);

-- Configura RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Cria políticas de segurança
create policy "Usuários podem ver seus próprios perfis"
    on profiles for select
    using (auth.uid() = id);

create policy "Usuários podem atualizar seus próprios perfis"
    on profiles for update
    using (auth.uid() = id);

create policy "Perfil é criado automaticamente após signup"
    on profiles for insert
    with check (auth.uid() = id);

-- Cria função para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id)
    values (new.id);
    return new;
end;
$$;

-- Cria trigger para criar perfil automaticamente
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
