-- Drop existing tables and related objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS match_history CASCADE;
DROP TABLE IF EXISTS ranked_info CASCADE;
DROP TABLE IF EXISTS champion_masteries CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table (core user data)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Riot Account Data
    puuid TEXT UNIQUE,
    summoner_name TEXT,
    tag_line TEXT,
    region TEXT,
    profile_icon_id INTEGER,
    summoner_level INTEGER,
    
    -- Game Stats
    total_mastery_score INTEGER DEFAULT 0,
    total_mastery_level INTEGER DEFAULT 0,
    
    -- Preferences
    preferred_role TEXT, -- TOP, JUNGLE, MID, BOT, SUPPORT
    preferred_champions INTEGER[], -- Array of champion IDs
    
    CONSTRAINT valid_region CHECK (region IN ('BR1', 'EUN1', 'EUW1', 'JP1', 'KR', 'LA1', 'LA2', 'NA1', 'OC1', 'TR1', 'RU'))
);

-- Create champion_masteries table
CREATE TABLE champion_masteries (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    champion_id INTEGER NOT NULL,
    champion_level INTEGER NOT NULL,
    champion_points INTEGER NOT NULL,
    last_play_time BIGINT,
    champion_points_since_last_level INTEGER,
    champion_points_until_next_level INTEGER,
    chest_granted BOOLEAN,
    tokens_earned INTEGER,
    
    UNIQUE(profile_id, champion_id)
);

-- Create ranked_info table
CREATE TABLE ranked_info (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    queue_type TEXT NOT NULL, -- RANKED_SOLO_5x5, RANKED_FLEX_SR
    tier TEXT, -- IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER, CHALLENGER
    rank TEXT, -- I, II, III, IV
    league_points INTEGER,
    wins INTEGER,
    losses INTEGER,
    veteran BOOLEAN,
    inactive BOOLEAN,
    fresh_blood BOOLEAN,
    hot_streak BOOLEAN,
    
    UNIQUE(profile_id, queue_type),
    CONSTRAINT valid_queue_type CHECK (queue_type IN ('RANKED_SOLO_5x5', 'RANKED_FLEX_SR')),
    CONSTRAINT valid_tier CHECK (tier IN ('IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'))
);

-- Create match_history table for future use
CREATE TABLE match_history (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    match_id TEXT NOT NULL,
    queue_id INTEGER,
    game_creation BIGINT,
    game_duration INTEGER,
    champion_id INTEGER,
    position TEXT,
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
    win BOOLEAN,
    
    UNIQUE(profile_id, match_id)
);

-- Create challenges table
CREATE TABLE challenges (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    category_id TEXT,
    value INTEGER,
    level TEXT, -- NONE, IRON, BRONZE, SILVER, GOLD, PLATINUM, DIAMOND, MASTER, GRANDMASTER, CHALLENGER
    percentile FLOAT,
    
    UNIQUE(profile_id, challenge_id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE champion_masteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranked_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Champion masteries policies
CREATE POLICY "Champion masteries are viewable by everyone"
    ON champion_masteries FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own champion masteries"
    ON champion_masteries FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own champion masteries"
    ON champion_masteries FOR UPDATE
    USING (auth.uid() = profile_id);

-- Ranked info policies
CREATE POLICY "Ranked info is viewable by everyone"
    ON ranked_info FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own ranked info"
    ON ranked_info FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own ranked info"
    ON ranked_info FOR UPDATE
    USING (auth.uid() = profile_id);

-- Match history policies
CREATE POLICY "Match history is viewable by everyone"
    ON match_history FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own match history"
    ON match_history FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own match history"
    ON match_history FOR UPDATE
    USING (auth.uid() = profile_id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone"
    ON challenges FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own challenges"
    ON challenges FOR INSERT
    WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own challenges"
    ON challenges FOR UPDATE
    USING (auth.uid() = profile_id);

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
