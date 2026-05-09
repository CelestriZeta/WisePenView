export interface LoginRequest {
  account: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface ResetPasswordRequest {
  campusNum: string;
}

export interface NewPasswordRequest {
  newPassword: string;
  token: string;
}

export type LoginResponse = void;
export type LogoutResponse = void;
export type RegisterResponse = void;
export type ResetPasswordResponse = void;
export type NewPasswordResponse = void;
