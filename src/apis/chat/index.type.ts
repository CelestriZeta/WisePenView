import type { Model as BackendModel } from '@/types/model';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant';
  model_id?: number | string | null;
  content?: string;
  parts?: MessagePartResponse[];
  tool_calls?: unknown[] | null;
  createdAt?: string;
  created_at?: string;
}

export interface MessagePartResponse {
  type: string;
  text: string | null;
  state: string | null;
  toolCallId: string | null;
  input: unknown;
  output: unknown;
}

export interface PageResult<T> {
  list: T[];
  total: number;
  page: number;
  size: number;
  total_page: number;
}

export interface ListModelsResponse {
  standard_models: BackendModel[];
  advanced_models: BackendModel[];
  other_models: BackendModel[];
}
export type CreateSessionRequest = { title?: string };
export type CreateSessionResponse = ChatSession;
export type RenameSessionRequest = { sessionId: string; newTitle?: string };
export type RenameSessionResponse = ChatSession;
export type DeleteSessionRequest = { sessionId: string };
export type DeleteSessionResponse = null;
export type ListSessionsRequestQuery = { page?: number; size?: number };
export type ListSessionsResponse = PageResult<ChatSession>;
export type ListHistoryMessagesRequestQuery = { sessionId: string; page?: number; size?: number };
export type ListHistoryMessagesResponse = PageResult<MessageResponse>;
