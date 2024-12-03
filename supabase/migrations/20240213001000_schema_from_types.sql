-- Drop existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table based on types/supabase.ts
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    puuid TEXT,
    summoner_name TEXT,
    tag_line TEXT,
    region TEXT,
    profile_icon_id INTEGER,
    summoner_level INTEGER,
    ranked_info JSONB,
    mastery_score JSONB,
    challenges JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    CONSTRAINT unique_puuid UNIQUE (puuid)
);

-- Create matches table based on types/supabase.ts
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
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
    
    CONSTRAINT unique_match_id UNIQUE (match_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

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

-- Matches policies
CREATE POLICY "Matches are viewable by everyone"
    ON matches FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can insert matches"
    ON matches FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

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
