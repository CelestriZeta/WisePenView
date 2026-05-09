import type { ResourceItem } from '@/types/resource';

export interface ResourceListPageResponse {
  list: ResourceItem[];
  total: number;
  page: number;
  size: number;
  totalPage: number;
}

export interface ListResourceItemsRequest {
  page: number;
  size: number;
  sortBy: string;
  sortDir: string;
  resourceType?: string;
  tagIds?: string[];
  tagQueryLogicMode?: string;
  groupId?: string;
}

export interface RenameResourceRequest {
  resourceId: string;
  newName: string;
}

export interface ChangeResourceTagsRequest {
  resourceId: string;
  tagIds: string[];
  groupId?: string;
}

export interface RemoveResourcesRequest {
  resourceIds: string[];
}

export interface AddTagRequest {
  groupId?: string;
  parentId?: string;
  tagName: string;
  tagDesc?: string;
  visibilityMode?: string;
  specifiedUsers?: string[];
}

export interface ChangeTagRequest {
  groupId?: string;
  tagName?: string;
  tagDesc?: string;
  visibilityMode?: string;
  specifiedUsers?: string[];
  targetTagId: string;
}

export interface RemoveTagRequest {
  groupId?: string;
  targetTagId: string;
}

export interface MoveTagRequest {
  groupId?: string;
  targetTagId: string;
  newParentId?: string;
}

export interface GetTagTreeRequest {
  groupId?: string;
}

export interface TagTreeResponse {
  tagId: string;
  tagName: string;
  groupId?: string;
  tagDesc?: string;
  visibilityMode?: string;
  specifiedUsers?: string[];
  parentId?: string;
  children?: TagTreeResponse[];
}

export type GetTagTreeResponse = TagTreeResponse[];
