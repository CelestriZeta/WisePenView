import { apiGet, apiPost } from '@/apis/_runtime/request';
import type {
  AddNoteRequest,
  AddNoteResponse,
  GetNoteInfoRequest,
  GetNoteInfoResponse,
} from './index.type';

function addNote(req: AddNoteRequest): Promise<AddNoteResponse> {
  return apiPost('/note/addNote', req);
}

function getNoteInfo(req: GetNoteInfoRequest): Promise<GetNoteInfoResponse> {
  return apiGet('/note/getNoteInfo', { params: req });
}

export const NoteApi = {
  addNote,
  getNoteInfo,
};
