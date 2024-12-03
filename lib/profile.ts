import { createClient } from '@/utils/supabase/server'
import { ProfileWithRanked, ProfileUpdateData } from '@/types/profile'

export async function updateProfileData(userId: string, data: ProfileUpdateData) {
  const supabase = await createClient()
  const { summoner, rankedInfo, masteryScore, challenges } = data

  const { data: profile, error: profileError } = await supabase.rpc('update_profile_data', {
    p_user_id: userId,
    p_summoner_data: {
      summoner_level: summoner.summonerLevel,
      profile_icon_id: summoner.profileIconId,
    },
    p_ranked_data: rankedInfo.map(rank => ({
      queue_type: rank.queueType,
      tier: rank.tier,
      division: rank.division,
      league_points: rank.leaguePoints,
      wins: rank.wins,
      losses: rank.losses,
      veteran: rank.veteran,
      inactive: rank.inactive,
      fresh_blood: rank.freshBlood,
      hot_streak: rank.hotStreak,
    })),
    p_mastery_data: {
      total_score: masteryScore.total,
      champions: masteryScore.champions.map(champ => ({
        champion_id: champ.championId,
        champion_level: champ.championLevel,
        champion_points: champ.championPoints,
        last_play_time: new Date(champ.lastPlayTime).toISOString(),
        tokens_earned: champ.tokensEarned,
      })),
    },
    p_honor_data: {
      level: Math.min(5, Math.floor(challenges.categoryPoints.VETERANCY / 2500)),
      checkpoint: Math.floor((challenges.categoryPoints.VETERANCY % 2500) / 625),
    }
  })

  if (profileError) {
    console.error('Error updating profile data:', profileError)
    throw new Error(`Failed to update profile: ${profileError.message}`)
  }

  return profile as ProfileWithRanked
}

export async function getProfileData(userId: string): Promise<ProfileWithRanked | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      ranked_info (*),
      champion_mastery (*),
      honor (*),
      profile_trophies (
        trophy:trophies (
          id,
          name,
          description,
          image_url
        )
      ),
      profile_banners (
        banner:banners (
          id,
          name,
          image_url,
          rarity
        ),
        equipped
      ),
      profile_titles (
        title:titles (
          id,
          name,
          description,
          rarity
        ),
        equipped
      )
    `)
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile data:', error)
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return data as ProfileWithRanked
}

export async function updateEquippedBanner(userId: string, bannerId: string) {
  const supabase = await createClient()

  // Primeiro, desativa todos os banners equipados
  await supabase
    .from('profile_banners')
    .update({ equipped: false })
    .eq('profile_id', userId)

  // Depois, ativa o banner selecionado
  const { error } = await supabase
    .from('profile_banners')
    .update({ equipped: true })
    .eq('profile_id', userId)
    .eq('banner_id', bannerId)

  if (error) {
    console.error('Error updating equipped banner:', error)
    throw new Error(`Failed to update equipped banner: ${error.message}`)
  }
}

export async function updateEquippedTitle(userId: string, titleId: string) {
  const supabase = await createClient()

  // Primeiro, desativa todos os títulos equipados
  await supabase
    .from('profile_titles')
    .update({ equipped: false })
    .eq('profile_id', userId)

  // Depois, ativa o título selecionado
  const { error } = await supabase
    .from('profile_titles')
    .update({ equipped: true })
    .eq('profile_id', userId)
    .eq('title_id', titleId)

  if (error) {
    console.error('Error updating equipped title:', error)
    throw new Error(`Failed to update equipped title: ${error.message}`)
}
}