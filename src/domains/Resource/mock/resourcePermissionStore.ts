import { RESOURCE_ACTION, type ResourceAction, type ResourceItem } from '@/domains/Resource';
import type { UpdateResourceActionPermissionRequest } from '@/domains/Resource/service/index.type';

interface MockResourcePermissionConfig {
  overrideGrantedActions: ResourceAction[] | null;
  specifiedUsersGrantedActions: Record<string, ResourceAction[]> | null;
}

const mockPermissionMap = new Map<string, MockResourcePermissionConfig>();

const getDefaultPermissionConfig = (resourceId: string): MockResourcePermissionConfig => {
  const existing = mockPermissionMap.get(resourceId);
  if (existing) {
    return existing;
  }

  const initial: MockResourcePermissionConfig = {
    overrideGrantedActions: [RESOURCE_ACTION.DISCOVER, RESOURCE_ACTION.VIEW],
    specifiedUsersGrantedActions: {
      '4': [RESOURCE_ACTION.DISCOVER, RESOURCE_ACTION.VIEW, RESOURCE_ACTION.EDIT],
      '5': [RESOURCE_ACTION.DISCOVER, RESOURCE_ACTION.VIEW, RESOURCE_ACTION.DOWNLOAD_WATERMARK],
    },
  };
  mockPermissionMap.set(resourceId, initial);
  return initial;
};

export const getMockResourcePermissionConfig = (resourceId: string): MockResourcePermissionConfig =>
  getDefaultPermissionConfig(resourceId);

export const updateMockResourcePermissionConfig = (
  params: UpdateResourceActionPermissionRequest
): void => {
  mockPermissionMap.set(params.resourceId, {
    overrideGrantedActions: params.overrideGrantedActions ?? null,
    specifiedUsersGrantedActions: params.specifiedUsersGrantedActions ?? null,
  });
};

export const applyMockResourcePermissionConfig = (resourceInfo: ResourceItem): ResourceItem => {
  const config = getDefaultPermissionConfig(resourceInfo.resourceId);
  return {
    ...resourceInfo,
    currentActions: config.overrideGrantedActions,
    overrideGrantedActions: config.overrideGrantedActions,
    specifiedUsersGrantedActions: config.specifiedUsersGrantedActions,
  };
};
