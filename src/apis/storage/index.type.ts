export type ImageUploadRequest = FormData;
export interface ImageUploadResponse {
  fileId?: number;
  domain: string;
  objectKey: string;
  md5?: string;
  size?: number;
}
