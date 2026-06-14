import type { ResourceAction } from '@/domains/Resource';

export interface ResourceActionSelectorProps {
  value: ResourceAction[];
  onChange: (actions: ResourceAction[]) => void;
  label?: string;
  isDisabled?: boolean;
  layout?: 'inline' | 'stack';
  className?: string;
}
