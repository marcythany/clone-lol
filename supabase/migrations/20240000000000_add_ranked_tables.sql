-- Create enum types
CREATE TYPE tier AS ENUM (
  'IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'
);

CREATE TYPE division AS ENUM ('I', 'II', 'III', 'IV', 'V');

CREATE TYPE queue_type AS ENUM ('RANKED_SOLO_5x5', 'RANKED_FLEX_SR', 'RANKED_DUO');

CREATE TYPE rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- Create ranked_info table
CREATE TABLE ranked_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  queue_type queue_type NOT NULL,
  tier tier NOT NULL,
  division division NOT NULL,
  league_points INTEGER NOT NULL DEFAULT 0,
  wins INTEGER NOT NULL DEFAULT 0,
  losses INTEGER NOT NULL DEFAULT 0,
  veteran BOOLEAN NOT NULL DEFAULT false,
  inactive BOOLEAN NOT NULL DEFAULT false,
  fresh_blood BOOLEAN NOT NULL DEFAULT false,
  hot_streak BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, queue_type)
);

-- Create season_ranks table
CREATE TABLE season_ranks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  queue_type queue_type NOT NULL,
  tier tier NOT NULL,
  division division NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, season, queue_type)
);

-- Create honor table
CREATE TABLE honor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 2,
  checkpoint INTEGER NOT NULL DEFAULT 0,
  rewards JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id)
);

-- Create champion_mastery table
CREATE TABLE champion_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  champion_id INTEGER NOT NULL,
  champion_level INTEGER NOT NULL DEFAULT 0,
  champion_points INTEGER NOT NULL DEFAULT 0,
  last_play_time TIMESTAMP WITH TIME ZONE,
  tokens_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, champion_id)
);

-- Create trophies table
CREATE TABLE trophies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profile_trophies table (junction table)
CREATE TABLE profile_trophies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trophy_id UUID REFERENCES trophies(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, trophy_id)
);

-- Create banners table
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  rarity rarity NOT NULL DEFAULT 'COMMON',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profile_banners table (junction table)
CREATE TABLE profile_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  banner_id UUID REFERENCES banners(id) ON DELETE CASCADE,
  equipped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, banner_id)
);

-- Create titles table
CREATE TABLE titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rarity rarity NOT NULL DEFAULT 'COMMON',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create profile_titles table (junction table)
CREATE TABLE profile_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title_id UUID REFERENCES titles(id) ON DELETE CASCADE,
  equipped BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(profile_id, title_id)
);

-- Add trigger to ensure only one banner is equipped at a time
CREATE OR REPLACE FUNCTION ensure_single_equipped_banner()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.equipped THEN
    UPDATE profile_banners
    SET equipped = false
    WHERE profile_id = NEW.profile_id
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_equipped_banner
  BEFORE INSERT OR UPDATE ON profile_banners
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_equipped_banner();

-- Add trigger to ensure only one title is equipped at a time
CREATE OR REPLACE FUNCTION ensure_single_equipped_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.equipped THEN
    UPDATE profile_titles
    SET equipped = false
    WHERE profile_id = NEW.profile_id
      AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_equipped_title
  BEFORE INSERT OR UPDATE ON profile_titles
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_equipped_title();
