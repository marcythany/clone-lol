-- First, drop any existing foreign key constraints
ALTER TABLE ranked_info DROP CONSTRAINT IF EXISTS fk_ranked_info_profile;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can read own ranked info" ON ranked_info;
DROP POLICY IF EXISTS "Users can update own ranked info" ON ranked_info;
DROP POLICY IF EXISTS "Users can delete own ranked info" ON ranked_info;

-- Recreate the foreign key with a more specific name
ALTER TABLE ranked_info 
    ADD CONSTRAINT fk_ranked_info_profile_id 
    FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) 
    ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE ranked_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own ranked info"
    ON ranked_info FOR SELECT
    USING (profile_id IN (
        SELECT id FROM profiles 
        WHERE id = auth.uid()
    ));

CREATE POLICY "Users can update own ranked info"
    ON ranked_info FOR UPDATE
    USING (profile_id IN (
        SELECT id FROM profiles 
        WHERE id = auth.uid()
    ));

CREATE POLICY "Users can delete own ranked info"
    ON ranked_info FOR DELETE
    USING (profile_id IN (
        SELECT id FROM profiles 
        WHERE id = auth.uid()
    ));
