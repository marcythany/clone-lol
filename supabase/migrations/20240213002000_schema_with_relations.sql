-- Drop existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS ranked_info CASCADE;
DROP TABLE IF EXISTS champion_masteries CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    puuid TEXT,
    summoner_name TEXT,
    tag_line TEXT,
    region TEXT,
    profile_icon_id INTEGER,
    summoner_level INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_puuid UNIQUE (puuid)
);

-- Create ranked_info table
CREATE TABLE ranked_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    queue_type TEXT NOT NULL,
    tier TEXT,
    division TEXT,
    league_points INTEGER,
    wins INTEGER,
    losses INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_profile_queue UNIQUE (profile_id, queue_type)
);

-- Create champion_masteries table
CREATE TABLE champion_masteries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    champion_id INTEGER NOT NULL,
    champion_level INTEGER NOT NULL,
    champion_points INTEGER NOT NULL,
    last_play_time BIGINT,
    champion_points_since_last_level INTEGER,
    champion_points_until_next_level INTEGER,
    chest_granted BOOLEAN,
    tokens_earned INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_profile_champion UNIQUE (profile_id, champion_id)
);

-- Create matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id TEXT NOT NULL,
    queue_type TEXT NOT NULL,
    game_creation BIGINT NOT NULL,
    game_duration INTEGER NOT NULL,
    game_end_timestamp BIGINT NOT NULL,
    game_mode TEXT NOT NULL,
    game_type TEXT NOT NULL,
    game_version TEXT NOT NULL,
    map_id INTEGER NOT NULL,
    platform_id TEXT NOT NULL,
    queue_id INTEGER NOT NULL,
    participants JSONB NOT NULL,
    teams JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_match_id UNIQUE (match_id)
);

-- Create challenges table
CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id TEXT NOT NULL,
    category_id TEXT,
    value INTEGER,
    level TEXT,
    percentile FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_profile_challenge UNIQUE (profile_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranked_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE champion_masteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
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

-- Ranked info policies
CREATE POLICY "Public ranked info is viewable by everyone"
    ON ranked_info FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own ranked info"
    ON ranked_info FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = ranked_info.profile_id
        AND profiles.id = auth.uid()
    ));

CREATE POLICY "Users can update own ranked info"
    ON ranked_info FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = ranked_info.profile_id
        AND profiles.id = auth.uid()
    ));

-- Champion masteries policies
CREATE POLICY "Public champion masteries are viewable by everyone"
    ON champion_masteries FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own champion masteries"
    ON champion_masteries FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = champion_masteries.profile_id
        AND profiles.id = auth.uid()
    ));

CREATE POLICY "Users can update own champion masteries"
    ON champion_masteries FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = champion_masteries.profile_id
        AND profiles.id = auth.uid()
    ));

-- Matches policies
CREATE POLICY "Matches are viewable by everyone"
    ON matches FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert matches"
    ON matches FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Challenges policies
CREATE POLICY "Public challenges are viewable by everyone"
    ON challenges FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own challenges"
    ON challenges FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = challenges.profile_id
        AND profiles.id = auth.uid()
    ));

CREATE POLICY "Users can update own challenges"
    ON challenges FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = challenges.profile_id
        AND profiles.id = auth.uid()
    ));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id)
    VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
