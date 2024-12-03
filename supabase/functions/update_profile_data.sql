create or replace function update_profile_data(
  p_user_id uuid,
  p_summoner_data jsonb,
  p_ranked_data jsonb,
  p_mastery_data jsonb,
  p_honor_data jsonb
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_profile_id uuid;
  v_result jsonb;
begin
  -- Atualizar perfil básico
  update profiles
  set
    summoner_level = (p_summoner_data->>'summoner_level')::int,
    profile_icon_id = (p_summoner_data->>'profile_icon_id')::int,
    updated_at = now()
  where id = p_user_id
  returning id into v_profile_id;

  -- Limpar dados antigos
  delete from ranked_info where profile_id = v_profile_id;
  delete from champion_mastery where profile_id = v_profile_id;
  delete from honor where profile_id = v_profile_id;

  -- Inserir novos dados de ranked
  insert into ranked_info (
    profile_id,
    queue_type,
    tier,
    division,
    league_points,
    wins,
    losses,
    veteran,
    inactive,
    fresh_blood,
    hot_streak
  )
  select
    v_profile_id,
    (ranked->>'queue_type')::queue_type,
    (ranked->>'tier')::tier,
    (ranked->>'division')::division,
    (ranked->>'league_points')::int,
    (ranked->>'wins')::int,
    (ranked->>'losses')::int,
    (ranked->>'veteran')::boolean,
    (ranked->>'inactive')::boolean,
    (ranked->>'fresh_blood')::boolean,
    (ranked->>'hot_streak')::boolean
  from jsonb_array_elements(p_ranked_data) as ranked;

  -- Inserir novos dados de maestria
  with mastery_data as (
    select
      v_profile_id as profile_id,
      (champ->>'champion_id')::int as champion_id,
      (champ->>'champion_level')::int as champion_level,
      (champ->>'champion_points')::int as champion_points,
      (champ->>'last_play_time')::timestamp with time zone as last_play_time,
      (champ->>'tokens_earned')::int as tokens_earned
    from jsonb_array_elements((p_mastery_data->>'champions')::jsonb) as champ
  )
  insert into champion_mastery (
    profile_id,
    champion_id,
    champion_level,
    champion_points,
    last_play_time,
    tokens_earned
  )
  select * from mastery_data;

  -- Inserir/atualizar dados de honra
  insert into honor (
    profile_id,
    level,
    checkpoint
  )
  values (
    v_profile_id,
    (p_honor_data->>'level')::int,
    (p_honor_data->>'checkpoint')::int
  )
  on conflict (profile_id)
  do update set
    level = excluded.level,
    checkpoint = excluded.checkpoint,
    updated_at = now();

  -- Retornar dados atualizados
  select jsonb_build_object(
    'profile', p,
    'ranked_info', ri,
    'mastery_score', ms,
    'honor', h
  ) into v_result
  from (
    select row_to_json(profiles.*) as p
    from profiles
    where id = v_profile_id
  ) p,
  (
    select jsonb_agg(row_to_json(ranked_info.*)) as ri
    from ranked_info
    where profile_id = v_profile_id
  ) ri,
  (
    select jsonb_build_object(
      'total', (p_mastery_data->>'total_score')::int,
      'champions', jsonb_agg(row_to_json(champion_mastery.*))
    ) as ms
    from champion_mastery
    where profile_id = v_profile_id
  ) ms,
  (
    select row_to_json(honor.*) as h
    from honor
    where profile_id = v_profile_id
  ) h;

  return v_result;
end;
$$;
