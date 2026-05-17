/** IInteractService 接口及相关类型 */

export interface IInteractService {
  /** 点赞 / 取消点赞；返回操作后的最新状态 */
  toggleLike(params: ToggleLikeRequest): Promise<ToggleLikeResult>;
  /** 评分（1–5），支持覆盖；返回最新评分 */
  rate(params: RateRequest): Promise<RateResult>;
}

export interface ToggleLikeRequest {
  resourceId: string;
}

export interface ToggleLikeResult {
  /** 操作后的最新点赞状态 */
  liked: boolean;
}

export interface RateRequest {
  resourceId: string;
  /** 1–5 整数 */
  score: number;
}

export interface RateResult {
  /** 本次提交后的最新评分 */
  userScore: number;
}
