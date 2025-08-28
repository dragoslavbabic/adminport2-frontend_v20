export interface UserInfo {
  username: string;
  fullName: string;
  roles: string[];
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: UserInfo;
}
