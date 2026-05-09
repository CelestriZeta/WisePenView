import type { ResourceItem } from '@/types/resource';
import type { DocumentResourceType } from '@/constants/document';

export interface UploadDocRequest {
  filename: string;
  extension: string;
  md5: string;
  expectedSize: number;
}

export interface UploadDocResponse {
  documentId: string;
  putUrl: string | null;
  callbackHeader: string | null;
  objectKey: string;
  flashUploaded: boolean;
}

export interface DocumentIdRequest {
  documentId: string;
}

export interface GetDocInfoRequest {
  resourceId: string;
}

export interface DocumentUploadMeta {
  documentName: string;
  uploaderId: number | null;
  fileType: DocumentResourceType;
  size: number;
}

export interface PendingDocumentStatus {
  status: string;
}

export interface DocMetaInfo {
  uploadMeta: DocumentUploadMeta;
  documentStatus: PendingDocumentStatus;
  maxPreviewPages: number | null;
}

export interface PendingDocItem extends DocMetaInfo {
  documentId?: string;
}

export type ListPendingDocsResponse = PendingDocItem[];

export interface GetDocInfoResponse {
  docMetaInfo: DocMetaInfo;
  resourceInfo: ResourceItem;
}
