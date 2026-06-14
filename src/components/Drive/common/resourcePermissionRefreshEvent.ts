import type { ResourceItem } from '@/domains/Resource';

export interface ResourcePermissionRefreshPayload {
  resourceId: string;
  resourceType: ResourceItem['resourceType'];
}

type ResourcePermissionRefreshListener = (payload: ResourcePermissionRefreshPayload) => void;

const listeners = new Set<ResourcePermissionRefreshListener>();

export const notifyResourcePermissionRefresh = (
  payload: ResourcePermissionRefreshPayload
): void => {
  listeners.forEach((listener) => listener(payload));
};

export const subscribeResourcePermissionRefresh = (
  listener: ResourcePermissionRefreshListener
): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
