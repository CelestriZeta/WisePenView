import { apiGet, apiPost } from '@/apis/_runtime/request';
import { serializeRepeatKeyQuery } from '@/utils/serializeRepeatKeyQuery';
import type {
  AddTagRequest,
  ChangeResourceTagsRequest,
  ChangeTagRequest,
  GetTagTreeRequest,
  GetTagTreeResponse,
  ListResourceItemsRequest,
  MoveTagRequest,
  RemoveResourcesRequest,
  RemoveTagRequest,
  RenameResourceRequest,
  ResourceListPageResponse,
} from './index.type';

// /resource/item/*

function listResources(req: ListResourceItemsRequest): Promise<ResourceListPageResponse> {
  return apiGet('/resource/item/listResources', {
    params: req,
    paramsSerializer: serializeRepeatKeyQuery,
  });
}

function renameResource(req: RenameResourceRequest): Promise<void> {
  return apiPost('/resource/item/renameResource', req);
}

function changeResourceTags(req: ChangeResourceTagsRequest): Promise<void> {
  return apiPost('/resource/item/changeResourceTags', req);
}

function removeResources(req: RemoveResourcesRequest): Promise<void> {
  return apiPost('/resource/item/removeResources', null, {
    params: req,
    paramsSerializer: serializeRepeatKeyQuery,
  });
}

export const ResourceItemApi = {
  listResources,
  renameResource,
  changeResourceTags,
  removeResources,
};

// /resource/tag/*
function getTagTree(req?: GetTagTreeRequest): Promise<GetTagTreeResponse> {
  return apiGet('/resource/tag/getTagTree', { params: req });
}

function addTag(req: AddTagRequest): Promise<string> {
  return apiPost('/resource/tag/addTag', req);
}

function changeTag(req: ChangeTagRequest): Promise<void> {
  return apiPost('/resource/tag/changeTag', req);
}

function removeTag(req: RemoveTagRequest): Promise<void> {
  return apiPost('/resource/tag/removeTag', req);
}

function moveTag(req: MoveTagRequest): Promise<void> {
  return apiPost('/resource/tag/moveTag', req);
}

export const ResourceTagApi = {
  getTagTree,
  addTag,
  changeTag,
  removeTag,
  moveTag,
};
