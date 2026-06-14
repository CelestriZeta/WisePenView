import type { SearchableUser } from '@/domains/User';

export interface UserMultiSearchSelectProps {
  value: SearchableUser[];
  onChange: (users: SearchableUser[]) => void;
  fixedGroupIds?: string[];
  showGroupFilter?: boolean;
  allowedUserIds?: string[];
  pageSize?: number;
  placeholder?: string;
  className?: string;
}
