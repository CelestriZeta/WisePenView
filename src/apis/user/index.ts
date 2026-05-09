import { apiGet, apiPost, apiPut } from '@/apis/_runtime/request';
import type {
  ChangeUserInfoRequest,
  ChangeUserProfileRequest,
  CheckEmailVerifyRequest,
  GetUserInfoResponse,
  InitiateEmailVerifyRequest,
  InitiateFudanUISVerifyRequest,
  ListTransactionsRequest,
  RedeemVoucherRequest,
  TransferTokenBetweenGroupAndUserRequest,
} from './index.type';

/** User API: /user/* */

function getUserInfo(): Promise<GetUserInfoResponse> {
  return apiGet('/user/getUserInfo');
}

function initiateEmailVerify(req: InitiateEmailVerifyRequest): Promise<void> {
  return apiPost('/user/verify/initiateEmailVerify', null, { params: req });
}

function initiateFudanUISVerify(req: InitiateFudanUISVerifyRequest): Promise<void> {
  return apiPost('/user/verify/initiateFudanUISVerify', null, { params: req });
}

function checkFudanUISVerify(): Promise<unknown> {
  return apiGet('/user/verify/checkFudanUISVerify');
}

function checkEmailVerify(req: CheckEmailVerifyRequest): Promise<void> {
  return apiGet('/user/verify/checkEmailVerify', { params: req });
}

function changeUserInfo(req: ChangeUserInfoRequest): Promise<unknown> {
  return apiPut('/user/changeUserInfo', req);
}

function changeUserProfile(req: ChangeUserProfileRequest): Promise<unknown> {
  return apiPut('/user/changeUserProfile', req);
}

export const UserApi = {
  getUserInfo,
  initiateEmailVerify,
  initiateFudanUISVerify,
  checkFudanUISVerify,
  checkEmailVerify,
  changeUserInfo,
  changeUserProfile,
};

/** User Wallet API: /user/wallet/* */

function getUserWalletInfo(): Promise<Record<string, unknown>> {
  return apiGet('/user/wallet/getUserWalletInfo');
}

function redeemVoucher(req: RedeemVoucherRequest): Promise<void> {
  return apiPost('/user/wallet/redeemVoucher', req);
}

function listTransactions(req: ListTransactionsRequest): Promise<Record<string, unknown>> {
  return apiGet('/user/wallet/listTransactions', { params: req });
}

function transferTokenBetweenGroupAndUser(
  req: TransferTokenBetweenGroupAndUserRequest
): Promise<void> {
  return apiPost('/user/wallet/transferTokenBetweenGroupAndUser', req);
}

export const UserWalletApi = {
  getUserWalletInfo,
  redeemVoucher,
  listTransactions,
  transferTokenBetweenGroupAndUser,
};
