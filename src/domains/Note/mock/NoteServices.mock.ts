import type {
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteNoteRequest,
  GetNoteInfoRequest,
  GetNotePermissionConfigRequest,
  INoteService,
  NoteInfoDisplayData,
  NotePermissionConfig,
  SyncTitleRequest,
} from '@/domains/Note';
import { RESOURCE_ACTION } from '@/domains/Resource';
import { applyMockResourcePermissionConfig } from '@/domains/Resource/mock/resourcePermissionStore';
import { useResourceDisplayNameStore } from '@/store';

/** Mock 占位：与实现层一致，同步更新展示名 store */
const syncTitle = async (params: SyncTitleRequest): Promise<void> => {
  useResourceDisplayNameStore.getState().setDisplayName(params.resourceId, params.newName);
  return Promise.resolve();
};

const createNote = async (_params: CreateNoteRequest): Promise<CreateNoteResponse> => {
  return { resourceId: '123' };
};

const deleteNote = async (_params: DeleteNoteRequest): Promise<void> => {
  return Promise.resolve();
};

const buildMockNoteResourceInfo = (resourceId: string) =>
  applyMockResourcePermissionConfig({
    resourceId,
    resourceName: useResourceDisplayNameStore.getState().byResourceId[resourceId] ?? '未命名笔记',
    resourceType: 'NOTE',
    ownerId: '1',
    ownerInfo: {
      nickname: 'Mock User',
      realName: '张三',
      avatar: '',
      identityType: 1,
    },
    currentActions: [
      RESOURCE_ACTION.DISCOVER,
      RESOURCE_ACTION.VIEW,
      RESOURCE_ACTION.EDIT,
      RESOURCE_ACTION.DOWNLOAD_WATERMARK,
      RESOURCE_ACTION.DOWNLOAD_ORIGINAL,
    ],
  });

const getNoteInfoDisplay = async (params: GetNoteInfoRequest): Promise<NoteInfoDisplayData> => {
  const resourceInfo = buildMockNoteResourceInfo(params.resourceId);
  return {
    noteTitle: resourceInfo.resourceName,
    ownerId: resourceInfo.ownerId,
    authors: [],
    lastEditedAtText: '暂无',
    canCollaborativeEdit: true,
    resourceInfo,
  };
};

const getNotePermissionConfig = async (
  params: GetNotePermissionConfigRequest
): Promise<NotePermissionConfig> => {
  const resourceInfo = buildMockNoteResourceInfo(params.resourceId);
  return {
    resourceId: params.resourceId,
    overrideGrantedActions: resourceInfo.overrideGrantedActions,
    specifiedUsersGrantedActions: resourceInfo.specifiedUsersGrantedActions,
  };
};

export const NoteServicesMock: INoteService = {
  syncTitle,
  createNote,
  deleteNote,
  getNoteInfoDisplay,
  getNotePermissionConfig,
};
