import { InteractApi } from '@/domains/Resource/apis/InteractApi';
import type {
  IInteractService,
  RateRequest,
  RateResult,
  ToggleLikeRequest,
  ToggleLikeResult,
} from './index.type';

const toggleLike = async (params: ToggleLikeRequest): Promise<ToggleLikeResult> => {
  const res = await InteractApi.toggleLike({ resourceId: params.resourceId });
  return { liked: res.liked };
};

const rate = async (params: RateRequest): Promise<RateResult> => {
  const res = await InteractApi.rate({ resourceId: params.resourceId, score: params.score });
  return { userScore: res.userScore as number };
};

export const createInteractServices = (): IInteractService => ({
  toggleLike,
  rate,
});
