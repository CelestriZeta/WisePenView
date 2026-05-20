import type { ResourceItem } from '@/domains/Resource';
import { useCallback } from 'react';
import { useNavigateResource } from './useNavigateResource';

export interface UseClickFileParams {
  /** 点击发起方所在的 Drive scope（undefined 表示个人云盘） */
  groupId?: string;
}

/**
 * 列表点击文件的统一入口：按 resourceType 路由到笔记编辑器或 PDF 预览。
 */
export const useClickFile = (params?: UseClickFileParams) => {
  const navigateResource = useNavigateResource(params?.groupId);

  return useCallback(
    (item: ResourceItem) => {
      if (!item.resourceId) return;
      navigateResource(item.resourceId, item.resourceType);
    },
    [navigateResource]
  );
};
