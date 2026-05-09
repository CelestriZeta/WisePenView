import type { Group, GroupFileOrgLogic } from '@/types/group';

export interface ListGroupRequest {
  groupRoleFilter: 'JOINED' | 'MANAGED';
  page: number;
  size: number;
}

export interface ListGroupResponse {
  total: number;
  list: Group[];
}

export interface GetGroupInfoRequest {
  groupId: string;
}

export type GetGroupInfoResponse = Group;
export type GetGroupBaseInfoResponse = Group;
export type AddGroupRequest = {
  groupName: string;
  groupType: number;
  groupDesc: string;
  groupCoverUrl?: string;
};
export type AddGroupResponse = string | number;
export type ChangeGroupRequest = {
  groupId: string;
  groupName: string;
  groupDesc: string;
  groupCoverUrl: string;
  groupType: number;
};
export interface RemoveGroupRequest {
  groupId: string;
}

export interface GetGroupConfigRequest {
  groupId: string;
}

export interface GetGroupConfigResponse {
  groupId?: string | number;
  fileOrgLogic?: GroupFileOrgLogic | string;
}

export interface ChangeGroupConfigRequest {
  groupId: string;
  fileOrgLogic: GroupFileOrgLogic;
}

export interface JoinGroupRequest {
  inviteCode: string;
}

export interface GroupMemberBaseInfo {
  nickname: string;
  realName: string | null;
  avatar: string | null;
  identityType: number;
}

export interface GroupMemberRawResponse {
  role: number;
  joinTime: string;
  tokenLimit: number;
  tokenUsed: number;
  groupId: string;
  memberId: string;
  memberInfo: GroupMemberBaseInfo;
}

export interface FetchGroupMembersResponse {
  total: string;
  page: number;
  size: number;
  totalPage: number;
  list: GroupMemberRawResponse[];
}

export interface ListMemberRequest {
  groupId: string | number;
  page: number;
  size: number;
}

export interface GroupRoleResponse {
  role: number;
}

export interface QuitGroupRequest {
  groupId: string;
}

export interface ChangeRoleRequest {
  groupId: string;
  targetUserIds: string[];
  role: number;
}

export interface KickMemberRequest {
  groupId: string;
  targetUserIds: string[];
}

export interface GetGroupTokenRequest {
  groupId: string | number;
}

export interface ChangeTokenLimitRequest {
  groupId: string;
  targetUserIds: string[];
  newTokenLimit: number;
}

export interface GetAllMyGroupTokenInfoRequest {
  page: number;
  size: number;
}
