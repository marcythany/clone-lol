-- Add foreign key references
ALTER TABLE ranked_info
ADD CONSTRAINT fk_ranked_info_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE champion_mastery
ADD CONSTRAINT fk_champion_mastery_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE honor
ADD CONSTRAINT fk_honor_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE profile_banners
ADD CONSTRAINT fk_profile_banners_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE profile_banners
ADD CONSTRAINT fk_profile_banners_banner
FOREIGN KEY (banner_id)
REFERENCES banners(id)
ON DELETE CASCADE;

ALTER TABLE profile_titles
ADD CONSTRAINT fk_profile_titles_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE profile_titles
ADD CONSTRAINT fk_profile_titles_title
FOREIGN KEY (title_id)
REFERENCES titles(id)
ON DELETE CASCADE;

ALTER TABLE profile_trophies
ADD CONSTRAINT fk_profile_trophies_profile
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

ALTER TABLE profile_trophies
ADD CONSTRAINT fk_profile_trophies_trophy
FOREIGN KEY (trophy_id)
REFERENCES trophies(id)
ON DELETE CASCADE;
