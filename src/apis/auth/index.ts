import { apiPost } from '@/apis/_runtime/request';
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  NewPasswordRequest,
  NewPasswordResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './index.type';

function login(req: LoginRequest): Promise<LoginResponse> {
  return apiPost('/auth/login', req);
}

function logout(): Promise<LogoutResponse> {
  return apiPost('/auth/logout');
}

function register(req: RegisterRequest): Promise<RegisterResponse> {
  return apiPost('/auth/register', req);
}

function forgotPasswordEmail(req: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  return apiPost('/auth/forgot-password/email', req);
}

function forgotPasswordReset(req: NewPasswordRequest): Promise<NewPasswordResponse> {
  return apiPost('/auth/forgot-password/reset', req);
}

export const AuthApi = {
  login,
  logout,
  register,
  forgotPasswordEmail,
  forgotPasswordReset,
};
