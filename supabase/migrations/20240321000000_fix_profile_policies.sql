-- Drop existing policies
drop policy if exists "Usuários podem ver seus próprios perfis" on profiles;
drop policy if exists "Usuários podem atualizar seus próprios perfis" on profiles;
drop policy if exists "Perfil é criado automaticamente após signup" on profiles;

-- Create new policies with proper format
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Make sure RLS is enabled
alter table profiles force row level security;
