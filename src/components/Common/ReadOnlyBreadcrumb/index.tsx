import { ROOT_DISPLAY } from '@/components/Drive/common/constants';
import { useTagService } from '@/domains';
import type { TagTreeNode } from '@/domains/Tag/service/index.type';
import React, { useMemo } from 'react';
import type { ReadOnlyBreadcrumbProps } from './index.type';
import styles from './style.module.less';

const getDisplayName = (node: TagTreeNode, mode: 'folder' | 'tag'): string => {
  if (mode === 'folder') {
    if (node.tagName === '/') return ROOT_DISPLAY;
    return node.tagName.startsWith('/') ? node.tagName.slice(1) : node.tagName;
  }
  return node.tagName;
};

function ReadOnlyBreadcrumb({ node, mode, groupId }: ReadOnlyBreadcrumbProps) {
  const tagService = useTagService();

  const breadcrumbPath = useMemo(() => {
    if (!node) return [];

    const path: TagTreeNode[] = [];
    let current: TagTreeNode | undefined = node;

    while (current) {
      path.unshift(current);
      if (!current.parentId) break;
      current =
        mode === 'folder'
          ? tagService.getRawTagById(current.parentId, groupId)
          : tagService.getTagById(current.parentId, groupId);
    }

    return path;
  }, [node, mode, groupId, tagService]);

  if (breadcrumbPath.length === 0) return null;

  const sep = mode === 'tag' ? '>' : '/';

  return (
    <div className={styles.breadcrumb}>
      {breadcrumbPath.map((n, i) => (
        <React.Fragment key={n.tagId}>
          {i > 0 && <span className={styles.sep}>{sep}</span>}
          <span className={styles.item}>{getDisplayName(n, mode)}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

export default ReadOnlyBreadcrumb;
