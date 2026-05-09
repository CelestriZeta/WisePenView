import { apiGet, apiPost } from '@/apis/_runtime/request';
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  DeleteSessionRequest,
  DeleteSessionResponse,
  ListHistoryMessagesRequestQuery,
  ListHistoryMessagesResponse,
  ListModelsResponse,
  ListSessionsRequestQuery,
  ListSessionsResponse,
  RenameSessionRequest,
  RenameSessionResponse,
} from './index.type';

/** Chat API: /chat/* */

function listModels(): Promise<ListModelsResponse> {
  return apiGet('/chat/model/listModels');
}

export const ChatApi = {
  listModels,
};

/** Chat Session API: /chat/session/* */

function createSession(req: CreateSessionRequest): Promise<CreateSessionResponse> {
  return apiPost('/chat/session/createSession', req);
}

function renameSession(req: RenameSessionRequest): Promise<RenameSessionResponse> {
  return apiPost(
    '/chat/session/renameSession',
    { new_title: req.newTitle },
    { params: { session_id: req.sessionId } }
  );
}

function deleteSession(req: DeleteSessionRequest): Promise<DeleteSessionResponse> {
  return apiPost('/chat/session/deleteSession', undefined, {
    params: { session_id: req.sessionId },
  });
}

function listSessions(req: ListSessionsRequestQuery): Promise<ListSessionsResponse> {
  return apiGet('/chat/session/listSessions', { params: req });
}

function listHistoryMessages(
  req: ListHistoryMessagesRequestQuery
): Promise<ListHistoryMessagesResponse> {
  return apiGet('/chat/session/listHistoryMessages', {
    params: { session_id: req.sessionId, page: req.page, size: req.size },
  });
}

export const ChatSessionApi = {
  createSession,
  renameSession,
  deleteSession,
  listSessions,
  listHistoryMessages,
};
