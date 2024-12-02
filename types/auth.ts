export interface RiotTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface RiotAuthResponse {
  code: string;
  state: string;
}
