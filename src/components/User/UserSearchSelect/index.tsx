import { useGroupService, useUserService } from '@/domains';
import type { Group } from '@/domains/Group';
import type { SearchableUser } from '@/domains/User';
import { parseErrorMessage } from '@/utils/error';
import { Avatar, Button, Checkbox, Input, Popover, TextField, Tooltip, toast } from '@heroui/react';
import { useDebounce, useRequest } from 'ahooks';
import { Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { UserSearchSelectProps } from './index.type';
import styles from './style.module.less';

const DEFAULT_PAGE_SIZE = 20;
const GROUP_PAGE_SIZE = 20;
const LOAD_MORE_THRESHOLD_PX = 40;

const getUserDisplayName = (user: SearchableUser): string =>
  user.nickname?.trim() || user.realName?.trim() || user.id;

const getUserSubText = (user: SearchableUser): string | undefined => {
  const parts = [user.realName, user.id].filter(
    (value): value is string => typeof value === 'string' && value.trim() !== ''
  );
  return parts.join(' · ');
};

const uniqueById = <T extends { id?: string; groupId?: string }>(items: T[]): T[] => {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const id = item.id ?? item.groupId;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    result.push(item);
  }
  return result;
};

function UserSearchSelect({
  onSelect,
  selectedUserIds = [],
  fixedGroupIds,
  showGroupFilter = true,
  pageSize = DEFAULT_PAGE_SIZE,
  className,
}: UserSearchSelectProps) {
  const userService = useUserService();
  const groupService = useGroupService();
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<SearchableUser[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [groupOpen, setGroupOpen] = useState(false);
  const [groupPage, setGroupPage] = useState(1);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupTotalPage, setGroupTotalPage] = useState(0);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const debouncedKeyword = useDebounce(keyword, { wait: 400 });
  const selectedUserIdSet = useMemo(() => new Set(selectedUserIds), [selectedUserIds]);
  const effectiveGroupIds = fixedGroupIds?.length ? fixedGroupIds : selectedGroupIds;
  const effectiveGroupIdsKey = effectiveGroupIds.join(',');
  const canShowGroupFilter = showGroupFilter && !fixedGroupIds?.length;
  const hasMoreUsers = totalPage === 0 || page < totalPage;
  const hasMoreGroups = groupTotalPage === 0 || groupPage < groupTotalPage;

  const { loading } = useRequest(
    () =>
      userService.searchUsers({
        keyword: debouncedKeyword,
        groupIds: effectiveGroupIds,
        page,
        size: pageSize,
      }),
    {
      ready: open,
      refreshDeps: [open, debouncedKeyword, effectiveGroupIdsKey, page, pageSize],
      onSuccess: (data) => {
        setTotalPage(data.totalPage);
        setUsers((prev) => (page === 1 ? data.list : uniqueById([...prev, ...data.list])));
      },
      onError: (err) => {
        toast.danger(parseErrorMessage(err));
      },
    }
  );

  const { loading: groupsLoading } = useRequest(
    () =>
      groupService.fetchGroupList({
        groupRoleFilter: 'JOINED',
        page: groupPage,
        size: GROUP_PAGE_SIZE,
      }),
    {
      ready: groupOpen && canShowGroupFilter,
      refreshDeps: [groupOpen, groupPage, canShowGroupFilter],
      onSuccess: (data) => {
        const pageCount = Math.ceil(data.total / GROUP_PAGE_SIZE);
        setGroupTotalPage(pageCount);
        setGroups((prev) =>
          groupPage === 1 ? data.groups : uniqueById([...prev, ...data.groups])
        );
      },
      onError: (err) => {
        toast.danger(parseErrorMessage(err));
      },
    }
  );

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setOpen(true);
    setPage(1);
  };

  const handleUserListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < LOAD_MORE_THRESHOLD_PX;
    if (nearBottom && !loading && hasMoreUsers) {
      setPage((current) => current + 1);
    }
  };

  const handleGroupListScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const nearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < LOAD_MORE_THRESHOLD_PX;
    if (nearBottom && !groupsLoading && hasMoreGroups) {
      setGroupPage((current) => current + 1);
    }
  };

  const handleSelectUser = (user: SearchableUser) => {
    if (selectedUserIdSet.has(user.id)) {
      return;
    }
    onSelect(user);
    setKeyword('');
    setOpen(false);
    setPage(1);
  };

  const handleGroupOpenChange = (nextOpen: boolean) => {
    setGroupOpen(nextOpen);
    if (nextOpen) {
      setGroupPage(1);
    }
  };

  const handleToggleGroup = (groupId: string, isSelected: boolean) => {
    setSelectedGroupIds((prev) =>
      isSelected ? [...prev, groupId] : prev.filter((item) => item !== groupId)
    );
    setPage(1);
  };

  const handleWrapperBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setOpen(false);
  };

  return (
    <div
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
      onBlur={handleWrapperBlur}
    >
      <div className={styles.searchRow}>
        <TextField
          className={styles.searchField}
          aria-label="查找用户"
          value={keyword}
          onChange={handleKeywordChange}
        >
          <Input
            placeholder="查找用户"
            onFocus={() => {
              setOpen(true);
              setPage(1);
            }}
          />
        </TextField>
        {canShowGroupFilter ? (
          <Popover isOpen={groupOpen} onOpenChange={handleGroupOpenChange}>
            <Tooltip>
              <Tooltip.Trigger>
                <Popover.Trigger>
                  <Button
                    className={styles.groupButton}
                    variant={selectedGroupIds.length > 0 ? 'primary' : 'secondary'}
                    isIconOnly
                    aria-label="在小组中搜索"
                  >
                    <Users size={16} />
                  </Button>
                </Popover.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Content>在小组中搜索</Tooltip.Content>
            </Tooltip>
            <Popover.Content placement="bottom end">
              <Popover.Dialog className={styles.groupDialog}>
                <div className={styles.groupTitle}>选择搜索小组</div>
                <div className={styles.groupList} onScroll={handleGroupListScroll}>
                  {groups.map((group) => (
                    <div className={styles.groupItem} key={group.groupId}>
                      <Checkbox
                        isSelected={selectedGroupIds.includes(group.groupId)}
                        onChange={(isSelected) => handleToggleGroup(group.groupId, isSelected)}
                        variant="secondary"
                      >
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>{group.groupName}</Checkbox.Content>
                      </Checkbox>
                    </div>
                  ))}
                  {groupsLoading ? <div className={styles.groupFooter}>正在加载小组...</div> : null}
                  {!groupsLoading && groups.length === 0 ? (
                    <div className={styles.groupFooter}>暂无可选小组</div>
                  ) : null}
                </div>
              </Popover.Dialog>
            </Popover.Content>
          </Popover>
        ) : null}
      </div>

      {open ? (
        <div className={styles.dropdown} onScroll={handleUserListScroll}>
          {users.map((user) => {
            const displayName = getUserDisplayName(user);
            const disabled = selectedUserIdSet.has(user.id);
            return (
              <button
                key={user.id}
                type="button"
                className={
                  disabled ? `${styles.userItem} ${styles.userItemDisabled}` : styles.userItem
                }
                disabled={disabled}
                onClick={() => handleSelectUser(user)}
              >
                <Avatar aria-label={displayName} className={styles.avatar}>
                  {user.avatar ? <Avatar.Image alt={displayName} src={user.avatar} /> : null}
                  <Avatar.Fallback>{displayName.charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar>
                <span className={styles.userText}>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={styles.userSubText}>{getUserSubText(user)}</span>
                </span>
              </button>
            );
          })}
          {loading ? <div className={styles.stateRow}>正在查找用户...</div> : null}
          {!loading && users.length === 0 ? (
            <div className={styles.stateRow}>未找到用户</div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default UserSearchSelect;
