import { apiPost } from '@/apis/_runtime/request';
import type { ImageUploadRequest, ImageUploadResponse } from './index.type';

function imageUpload(body: ImageUploadRequest, timeout?: number): Promise<ImageUploadResponse> {
  return apiPost('/storage/imageUpload', body, timeout ? { timeout } : undefined);
}

export const StorageApi = {
  imageUpload,
};
