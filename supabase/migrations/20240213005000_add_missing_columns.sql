-- Add missing columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS mastery_score INTEGER,
ADD COLUMN IF NOT EXISTS challenges JSONB;

-- Create champion_masteries table if it doesn't exist
CREATE TABLE IF NOT EXISTS champion_masteries (
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

-- Enable RLS on champion_masteries if not already enabled
ALTER TABLE champion_masteries ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'champion_masteries' 
        AND policyname = 'Users can read own champion masteries'
    ) THEN
        CREATE POLICY "Users can read own champion masteries"
            ON champion_masteries FOR SELECT
            USING (profile_id IN (
                SELECT id FROM profiles 
                WHERE id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'champion_masteries' 
        AND policyname = 'Users can update own champion masteries'
    ) THEN
        CREATE POLICY "Users can update own champion masteries"
            ON champion_masteries FOR UPDATE
            USING (profile_id IN (
                SELECT id FROM profiles 
                WHERE id = auth.uid()
            ));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'champion_masteries' 
        AND policyname = 'Users can delete own champion masteries'
    ) THEN
        CREATE POLICY "Users can delete own champion masteries"
            ON champion_masteries FOR DELETE
            USING (profile_id IN (
                SELECT id FROM profiles 
                WHERE id = auth.uid()
            ));
    END IF;
END $$;
