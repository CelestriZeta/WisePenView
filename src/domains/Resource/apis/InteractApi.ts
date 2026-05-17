import { apiPost } from '@/apis/request';
import type { InteractApiResponse, RateApiRequest, ToggleLikeApiRequest } from './InteractApi.type';

function toggleLike(req: ToggleLikeApiRequest): Promise<InteractApiResponse> {
  return apiPost('/resource/interact/toggleLike', req);
}

function rate(req: RateApiRequest): Promise<InteractApiResponse> {
  return apiPost('/resource/interact/rate', req);
}

export const InteractApi = { toggleLike, rate };
