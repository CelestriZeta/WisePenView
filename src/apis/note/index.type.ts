import type { Block, NoteInfoResponse } from '@/types/note';

export interface AddNoteRequest {
  title: string;
  initial_content?: Block[];
  source?: string;
}

export type AddNoteResponse = string;

export interface GetNoteInfoRequest {
  resourceId: string;
}

export type GetNoteInfoResponse = NoteInfoResponse;
