import type { DriveNode } from '@/domains/Drive';

export interface NodeIconProps {
  /** 渲染对应类型的图标；loadMore 渲染为 null */
  node: DriveNode;
  size?: number;
  /** 覆盖默认 color；默认 folder→warning，resource/link/trash→text-secondary */
  color?: string;
}
