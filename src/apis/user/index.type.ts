import type { DegreeLevel, UserVerificationMode } from '@/constants/user';

export interface GetUserInfoResponseUserInfo {
  id?: string;
  nickname: string | null;
  realName: string | null;
  avatar: string | null;
  identityType: number;
  username: string;
  campusNo: string;
  email: string | null;
  mobile: string | null;
  verificationMode: UserVerificationMode | null;
  status: number;
}

export interface GetUserInfoResponseUserProfile {
  sex: number;
  university: string | null;
  college: string | null;
  major: string | null;
  className: string | null;
  enrollmentYear: string | null;
  degreeLevel: DegreeLevel | null;
  academicTitle: string | null;
}

export interface GetUserInfoResponse {
  userInfo: GetUserInfoResponseUserInfo;
  userProfile: GetUserInfoResponseUserProfile;
  readonlyFields: string[] | null;
}

export interface ChangeUserInfoRequest {
  nickname?: string;
  realName?: string;
  avatar?: string;
}

export interface ChangeUserProfileRequest {
  sex?: number;
  university?: string | null;
  college?: string;
  major?: string;
  className?: string;
  enrollmentYear?: string;
  degreeLevel?: DegreeLevel;
  academicTitle?: string;
}

export interface InitiateEmailVerifyRequest {
  email: string;
}

export interface InitiateFudanUISVerifyRequest {
  uisAccount: string;
  uisPassword: string;
}

export interface CheckEmailVerifyRequest {
  token: string;
}

export interface RedeemVoucherRequest {
  voucherCode: string;
}

export type ListTransactionsRequest = Record<string, string | number | undefined>;

export interface TransferTokenBetweenGroupAndUserRequest {
  groupId: string;
  tokenCount: number;
  tokenTransferType: 1 | 2;
}
