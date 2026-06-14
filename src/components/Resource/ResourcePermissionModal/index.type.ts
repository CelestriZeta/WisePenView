import type { ResourceAction } from '@/domains/Resource';
import type { SearchableUser } from '@/domains/User';

export type ResourcePermissionModalResourceType = 'note' | 'document';

export interface ResourcePermissionModalProps {
  isOpen: boolean;
  resourceId: string;
  resourceType: ResourcePermissionModalResourceType;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess?: () => void;
  fixedSearchGroupIds?: string[];
  showSearchGroupFilter?: boolean;
}

export interface ResourcePermissionUserRow {
  user: SearchableUser;
  actions: ResourceAction[];
}
