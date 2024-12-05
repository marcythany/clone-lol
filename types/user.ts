import { User } from "@supabase/supabase-js"

export type UserWithProfile = User & { 
  profile: {
    profile_icon_id?: number | null;
    [key: string]: any;
  } | null 
}
export type Profile = NonNullable<UserWithProfile['profile']>;
