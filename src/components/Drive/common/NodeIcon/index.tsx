import FileTypeIcon from '@/components/Common/FileTypeIcon';
import { AiOutlineFolder, AiOutlineLink } from 'react-icons/ai';
import { LuTrash2 } from 'react-icons/lu';
import type { NodeIconProps } from './index.type';

const COLOR_SECONDARY = 'var(--ant-color-text-secondary)';
const COLOR_FOLDER = 'var(--ant-color-warning)';

/**
 * DriveNode 图标统一入口：按 node.type 分发。
 * - folder：文件夹（黄）
 * - resource：复用 FileTypeIcon（note→笔，其余→文件）
 * - link：链接
 * - trash：回收站
 * - loadMore：null（占位行不渲染图标）
 */
function NodeIcon({ node, size = 18, color }: NodeIconProps) {
  switch (node.type) {
    case 'folder':
      return <AiOutlineFolder size={size} color={color ?? COLOR_FOLDER} />;
    case 'resource':
      return (
        <FileTypeIcon
          resourceType={node.resourceType}
          size={size}
          color={color ?? COLOR_SECONDARY}
        />
      );
    case 'link':
      return <AiOutlineLink size={size} color={color ?? COLOR_SECONDARY} />;
    case 'trash':
      return <LuTrash2 size={size} color={color ?? COLOR_SECONDARY} />;
    case 'loadMore':
      return null;
  }
}

export default NodeIcon;
