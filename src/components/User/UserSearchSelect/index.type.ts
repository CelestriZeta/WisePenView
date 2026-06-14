import type { SearchableUser } from '@/domains/User';

export interface UserSearchSelectProps {
  onSelect: (user: SearchableUser) => void;
  selectedUserIds?: string[];
  fixedGroupIds?: string[];
  showGroupFilter?: boolean;
  pageSize?: number;
  className?: string;
}
