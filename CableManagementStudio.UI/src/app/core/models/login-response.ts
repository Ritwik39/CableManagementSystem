export interface LoginResponse {
  token: string;
  refreshToken: string;
  userId: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
}