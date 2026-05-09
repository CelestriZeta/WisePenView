import { apiGet, apiPost } from '@/apis/_runtime/request';
import type {
  DocumentIdRequest,
  GetDocInfoRequest,
  GetDocInfoResponse,
  ListPendingDocsResponse,
  UploadDocRequest,
  UploadDocResponse,
} from './index.type';

function uploadDoc(req: UploadDocRequest): Promise<UploadDocResponse> {
  return apiPost('/document/uploadDoc', req, { timeout: 30_000 });
}

function retryDocConvert(req: DocumentIdRequest): Promise<void> {
  return apiPost('/document/retryDocConvert', null, { params: req });
}

function listPendingDocs(): Promise<ListPendingDocsResponse> {
  return apiGet('/document/listPendingDocs');
}

function syncDocStatus(req: DocumentIdRequest): Promise<void> {
  return apiPost('/document/syncDocStatus', null, { params: req });
}

function retryDocProcess(req: DocumentIdRequest): Promise<void> {
  return apiPost('/document/retryDocProcess', null, { params: req });
}

function cancelDocProcess(req: DocumentIdRequest): Promise<void> {
  return apiPost('/document/cancelDocProcess', null, { params: req });
}

function getDocInfo(req: GetDocInfoRequest): Promise<GetDocInfoResponse> {
  return apiGet('/document/getDocInfo', { params: req });
}

export const DocumentApi = {
  uploadDoc,
  retryDocConvert,
  listPendingDocs,
  syncDocStatus,
  retryDocProcess,
  cancelDocProcess,
  getDocInfo,
};
