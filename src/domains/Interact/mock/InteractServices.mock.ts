import type {
  IInteractService,
  RateRequest,
  RateResult,
  ToggleLikeRequest,
  ToggleLikeResult,
} from '@/domains/Interact';

const toggleLike = async (_params: ToggleLikeRequest): Promise<ToggleLikeResult> => {
  return Promise.resolve({ liked: true });
};

const rate = async (_params: RateRequest): Promise<RateResult> => {
  return Promise.resolve({ userScore: _params.score });
};

export const InteractServicesMock: IInteractService = {
  toggleLike,
  rate,
};
