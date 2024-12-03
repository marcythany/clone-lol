-- Adiciona função para deletar todos os dados do perfil
create or replace function delete_profile_data(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  -- Deleta dados de ranked
  delete from ranked_info where profile_id = p_user_id;
  
  -- Deleta dados de maestria
  delete from champion_mastery where profile_id = p_user_id;
  
  -- Deleta dados de honra
  delete from honor where profile_id = p_user_id;
  
  -- Deleta dados de troféus
  delete from profile_trophies where profile_id = p_user_id;
  
  -- Deleta dados de banners
  delete from profile_banners where profile_id = p_user_id;
  
  -- Deleta dados de títulos
  delete from profile_titles where profile_id = p_user_id;
  
  -- Por fim, deleta o perfil
  delete from profiles where id = p_user_id;
end;
$$;

-- Adiciona políticas de segurança
grant execute on function delete_profile_data to authenticated;

-- Revoga permissões diretas nas tabelas
revoke delete on ranked_info from authenticated;
revoke delete on champion_mastery from authenticated;
revoke delete on honor from authenticated;
revoke delete on profile_trophies from authenticated;
revoke delete on profile_banners from authenticated;
revoke delete on profile_titles from authenticated;
