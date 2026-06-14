import type {
  FudanUISVerifyStatusData,
  IUserService,
  SearchUsersRequest,
  SearchUsersResult,
  User,
  UserAccountProfile,
} from '@/domains/User';
import { mockGroupUserIds, mockSearchableUsers } from '@/domains/_shared/mockUserDirectory';
import type { GetUserInfoApiResponse } from '../apis/UserApi.type';
import { UserServicesMap } from '../mapper/UserServices.map';
import mockdata from './mockdata.json';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fullUserInfo = mockdata as GetUserInfoApiResponse;

const getUserInfo = async (_options?: { forceRefresh?: boolean }): Promise<User> => {
  await delay(200);
  const { userInfo } = fullUserInfo;
  return {
    id: fullUserInfo.userId?.toString() ?? '',
    username: userInfo.username,
    nickname: userInfo.nickname ?? undefined,
    avatar: userInfo.avatar ?? undefined,
    identityType: userInfo.identityType,
  };
};

const getFullUserInfo = async (): Promise<UserAccountProfile> => {
  await delay(200);
  return UserServicesMap.mapAccountProfileFromApi(fullUserInfo);
};

const searchUsers = async (params: SearchUsersRequest): Promise<SearchUsersResult> => {
  await delay(200);
  const keyword = params.keyword?.trim().toLowerCase() ?? '';
  const groupScopedIds = params.groupIds?.length
    ? new Set(params.groupIds.flatMap((groupId) => mockGroupUserIds[groupId] ?? []))
    : null;
  const groupScopedUsers = groupScopedIds
    ? mockSearchableUsers.filter((user) => groupScopedIds.has(user.id))
    : mockSearchableUsers;
  const filtered = keyword
    ? groupScopedUsers.filter((user) =>
        [user.id, user.nickname, user.realName]
          .filter((value): value is string => typeof value === 'string')
          .some((value) => value.toLowerCase().includes(keyword))
      )
    : groupScopedUsers;
  const start = (params.page - 1) * params.size;
  const list = filtered.slice(start, start + params.size);
  return {
    list,
    total: filtered.length,
    page: params.page,
    size: params.size,
    totalPage: Math.ceil(filtered.length / params.size),
  };
};

const sendEmailVerify = async (): Promise<void> => {
  await delay(200);
};

const initiateUISVerify = async (): Promise<void> => {
  await delay(200);
  mockUisPollCount = 0;
};

/**
 * 模拟：前两次未完成 → 第三次返回二维码但 completed 仍为 false（需继续轮询）
 * → 第四次 completed 为 true 结束
 */
let mockUisPollCount = 0;

/** 1×1 透明 PNG 的 base64，与线上一致：仅返回图片字符编码、无 data: 前缀 */
const MOCK_UIS_QR_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const checkFudanUISVerify = async (): Promise<FudanUISVerifyStatusData> => {
  await delay(100);
  mockUisPollCount += 1;
  if (mockUisPollCount < 3) {
    return {
      completed: false,
      requireAction: false,
      actionPayload: '',
      message: '',
    };
  }
  if (mockUisPollCount === 3) {
    return {
      completed: false,
      requireAction: true,
      actionPayload: MOCK_UIS_QR_PNG_BASE64,
      message: 'Mock：请扫码（未完成，将继续每 2 秒查询）',
    };
  }
  return {
    completed: true,
    requireAction: false,
    actionPayload: '',
    message: 'Mock：认证已完成',
  };
};

const confirmEmailVerify = async (): Promise<void> => {
  await delay(200);
};

const updateUserInfo = async (
  params: Parameters<IUserService['updateUserInfo']>[0]
): Promise<void> => {
  await delay(200);
  const {
    nickname,
    realName,
    avatar,
    sex,
    university,
    college,
    major,
    className,
    enrollmentYear,
    degreeLevel,
    academicTitle,
  } = params;
  Object.assign(fullUserInfo.userInfo, {
    ...(nickname !== undefined && { nickname }),
    ...(realName !== undefined && { realName }),
    ...(avatar !== undefined && { avatar }),
  });
  Object.assign(fullUserInfo.userProfile, {
    ...(sex !== undefined && { sex }),
    ...(university !== undefined && { university }),
    ...(college !== undefined && { college }),
    ...(major !== undefined && { major }),
    ...(className !== undefined && { className }),
    ...(enrollmentYear !== undefined && { enrollmentYear }),
    ...(degreeLevel !== undefined && { degreeLevel }),
    ...(academicTitle !== undefined && { academicTitle }),
  });
};

const clearUserCache = (): void => {};

export const UserServicesMock: IUserService = {
  getFullUserInfo,
  getUserInfo,
  searchUsers,
  updateUserInfo,
  sendEmailVerify,
  initiateUISVerify,
  checkFudanUISVerify,
  confirmEmailVerify,
  clearUserCache,
};
