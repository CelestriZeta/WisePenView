import { apiGet, apiPost } from '@/apis/_runtime/request';
import type {
  AddGroupRequest,
  AddGroupResponse,
  ChangeGroupConfigRequest,
  ChangeGroupRequest,
  ChangeRoleRequest,
  ChangeTokenLimitRequest,
  FetchGroupMembersResponse,
  GetAllMyGroupTokenInfoRequest,
  GetGroupBaseInfoResponse,
  GetGroupConfigRequest,
  GetGroupConfigResponse,
  GetGroupInfoRequest,
  GetGroupInfoResponse,
  GetGroupTokenRequest,
  GroupRoleResponse,
  JoinGroupRequest,
  KickMemberRequest,
  ListMemberRequest,
  ListGroupRequest,
  ListGroupResponse,
  QuitGroupRequest,
  RemoveGroupRequest,
} from './index.type';

/** Group API: /group/* */
function listGroups(req: ListGroupRequest): Promise<ListGroupResponse> {
  return apiGet('/group/list', { params: req });
}

function getGroupDetailInfo(req: GetGroupInfoRequest): Promise<GetGroupInfoResponse> {
  return apiGet('/group/getGroupDetailInfo', { params: req });
}

function getGroupBaseInfo(req: GetGroupInfoRequest): Promise<GetGroupBaseInfoResponse> {
  return apiGet('/group/getGroupBaseInfo', { params: req });
}

function addGroup(req: AddGroupRequest): Promise<AddGroupResponse> {
  return apiPost('/group/addGroup', req);
}

function changeGroup(req: ChangeGroupRequest): Promise<void> {
  return apiPost('/group/changeGroup', req);
}

function removeGroup(req: RemoveGroupRequest): Promise<void> {
  return apiPost('/group/removeGroup', req);
}

function joinGroup(req: JoinGroupRequest): Promise<void> {
  return apiPost('/group/joinGroup', req);
}

export const GroupApi = {
  list: listGroups,
  getGroupDetailInfo,
  getGroupBaseInfo,
  addGroup,
  changeGroup,
  removeGroup,
  joinGroup,
};

/** Group Config API: /resource/groupConfig/* */

function getConfig(req: GetGroupConfigRequest): Promise<GetGroupConfigResponse> {
  return apiGet('/resource/groupConfig/getConfig', { params: req });
}

function changeConfig(req: ChangeGroupConfigRequest): Promise<void> {
  return apiPost('/resource/groupConfig/changeConfig', req);
}

export const GroupResConfigApi = {
  getConfig,
  changeConfig,
};

/** Group Member API: /group/member/* */

function listMembers(req: ListMemberRequest): Promise<FetchGroupMembersResponse> {
  return apiGet('/group/member/list', { params: req });
}

function getMyRole(groupId: string): Promise<number | GroupRoleResponse> {
  return apiGet('/group/member/getMyRole', { params: { groupId } });
}

function quit(req: QuitGroupRequest): Promise<void> {
  return apiPost('/group/member/quit', req);
}

function changeRole(req: ChangeRoleRequest): Promise<void> {
  return apiPost('/group/member/changeRole', req);
}

function kick(req: KickMemberRequest): Promise<void> {
  return apiPost('/group/member/kick', req);
}

function getGroupToken(
  req: GetGroupTokenRequest
): Promise<{ TokenUsed?: number; TokenLimit?: number }> {
  return apiGet('/group/member/getGroupToken', { params: req });
}

function changeTokenLimit(req: ChangeTokenLimitRequest): Promise<void> {
  return apiPost('/group/member/changeTokenLimit', req);
}

function getAllMyGroupTokenInfo(
  req: GetAllMyGroupTokenInfoRequest
): Promise<Record<string, unknown>> {
  return apiGet('/group/member/getAllMyGroupTokenInfo', { params: req });
}

export const GroupMemberApi = {
  list: listMembers,
  getMyRole,
  quit,
  changeRole,
  kick,
  getGroupToken,
  changeTokenLimit,
  getAllMyGroupTokenInfo,
};
