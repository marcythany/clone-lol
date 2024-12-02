-- Adiciona o campo profile_icon_id na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_icon_id INTEGER;
