import { notifyResourcePermissionRefresh } from '@/components/Drive/common/resourcePermissionRefreshEvent';
import UserSearchSelect from '@/components/User/UserSearchSelect';
import { useDocumentService, useNoteService, useResourceService } from '@/domains';
import {
  coerceResourceActions,
  normalizeResourceActions,
  type ResourceAction,
  type ResourceItem,
} from '@/domains/Resource';
import type { SearchableUser } from '@/domains/User';
import { parseErrorMessage } from '@/utils/error';
import { Alert, Avatar, Button, Checkbox, Modal, Popover, toast } from '@heroui/react';
import { useRequest } from 'ahooks';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import ResourceActionSelector from '../ResourceActionSelector';
import type { ResourcePermissionModalProps, ResourcePermissionUserRow } from './index.type';
import styles from './style.module.less';

interface ResourcePermissionConfig {
  overrideGrantedActions?: ResourceAction[] | null;
  specifiedUsersGrantedActions?: Record<string, ResourceAction[]> | null;
}

interface PermissionActionDropdownProps {
  value: ResourceAction[];
  onChange: (actions: ResourceAction[]) => void;
  isDisabled?: boolean;
  isMuted?: boolean;
  onDelete?: () => void;
}

const getUserDisplayName = (user: SearchableUser): string =>
  user.nickname?.trim() || user.realName?.trim() || user.id;

const getUserSubText = (user: SearchableUser): string | undefined => {
  const parts = [user.realName, user.id].filter(
    (value): value is string => typeof value === 'string' && value.trim() !== ''
  );
  return parts.join(' · ');
};

const buildFallbackUser = (userId: string): SearchableUser => ({
  id: userId,
  nickname: userId,
});

const mapPermissionConfigFromResource = (resourceInfo: ResourceItem): ResourcePermissionConfig => ({
  overrideGrantedActions: coerceResourceActions(
    resourceInfo.overrideGrantedActions as unknown[] | undefined
  ),
  specifiedUsersGrantedActions: resourceInfo.specifiedUsersGrantedActions ?? null,
});

const buildSpecifiedUserRows = (
  specifiedUsersGrantedActions?: Record<string, ResourceAction[]> | null
): ResourcePermissionUserRow[] =>
  Object.entries(specifiedUsersGrantedActions ?? {}).map(([userId, actions]) => ({
    user: buildFallbackUser(userId),
    actions: coerceResourceActions(actions as unknown[]),
  }));

const buildSpecifiedUsersGrantedActions = (
  rows: ResourcePermissionUserRow[]
): Record<string, ResourceAction[]> | null => {
  if (rows.length === 0) return null;
  return rows.reduce<Record<string, ResourceAction[]>>((acc, row) => {
    acc[row.user.id] = normalizeResourceActions(row.actions);
    return acc;
  }, {});
};

function PermissionActionDropdown({
  value,
  onChange,
  isDisabled = false,
  isMuted = false,
  onDelete,
}: PermissionActionDropdownProps) {
  const selectedActionCount = normalizeResourceActions(value).length;
  const triggerClassName = isMuted
    ? `${styles.permissionTrigger} ${styles.permissionTriggerMuted}`
    : styles.permissionTrigger;
  const trigger = (
    <Button
      size="sm"
      variant="secondary"
      className={triggerClassName}
      isDisabled={isDisabled}
      aria-label="选择资源权限"
    >
      <span>{selectedActionCount}项权限</span>
      <ChevronDown size={16} />
    </Button>
  );

  if (isDisabled) {
    return trigger;
  }

  return (
    <Popover>
      <Popover.Trigger>{trigger}</Popover.Trigger>
      <Popover.Content placement="bottom end">
        <Popover.Dialog className={styles.permissionDropdown}>
          <ResourceActionSelector value={value} onChange={onChange} layout="stack" />
          {onDelete ? (
            <div className={styles.permissionDropdownFooter}>
              <Button size="sm" variant="danger" className={styles.deleteButton} onPress={onDelete}>
                删除
              </Button>
            </div>
          ) : null}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}

function ResourcePermissionModal({
  isOpen,
  resourceId,
  resourceType,
  onOpenChange,
  onSuccess,
  fixedSearchGroupIds,
  showSearchGroupFilter = true,
}: ResourcePermissionModalProps) {
  const noteService = useNoteService();
  const documentService = useDocumentService();
  const resourceService = useResourceService();
  const [overrideGrantedActionsDraft, setOverrideGrantedActionsDraft] = useState<
    ResourceAction[] | null
  >(null);
  const [overrideEnabledDraft, setOverrideEnabledDraft] = useState<boolean | null>(null);
  const [specifiedUserRowsDraft, setSpecifiedUserRowsDraft] = useState<
    ResourcePermissionUserRow[] | null
  >(null);

  const {
    data: permissionConfig,
    loading,
    error,
  } = useRequest(
    async () => {
      if (resourceType === 'note') {
        return noteService.getNotePermissionConfig({ resourceId });
      }
      const docInfo = await documentService.getDocInfo(resourceId);
      return mapPermissionConfigFromResource(docInfo.resourceInfo);
    },
    {
      ready: isOpen && Boolean(resourceId),
      refreshDeps: [isOpen, resourceId, resourceType],
      onSuccess: () => {
        setOverrideGrantedActionsDraft(null);
        setOverrideEnabledDraft(null);
        setSpecifiedUserRowsDraft(null);
      },
    }
  );

  const loadedOverrideGrantedActions = useMemo(
    () => coerceResourceActions(permissionConfig?.overrideGrantedActions as unknown[] | undefined),
    [permissionConfig]
  );
  const loadedOverrideEnabled = permissionConfig?.overrideGrantedActions != null;
  const loadedSpecifiedUserRows = useMemo(
    () => buildSpecifiedUserRows(permissionConfig?.specifiedUsersGrantedActions),
    [permissionConfig]
  );
  const displayOverrideGrantedActions = overrideGrantedActionsDraft ?? loadedOverrideGrantedActions;
  const displayOverrideEnabled = overrideEnabledDraft ?? loadedOverrideEnabled;
  const displaySpecifiedUserRows = specifiedUserRowsDraft ?? loadedSpecifiedUserRows;
  const selectedUserIds = useMemo(
    () => displaySpecifiedUserRows.map((row) => row.user.id),
    [displaySpecifiedUserRows]
  );

  const resetFormDraft = () => {
    setOverrideGrantedActionsDraft(null);
    setOverrideEnabledDraft(null);
    setSpecifiedUserRowsDraft(null);
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) resetFormDraft();
    onOpenChange(open);
  };

  const { loading: saving, run: runSavePermission } = useRequest(
    async () =>
      resourceService.updateResourceActionPermission({
        resourceId,
        overrideGrantedActions: displayOverrideEnabled
          ? normalizeResourceActions(displayOverrideGrantedActions)
          : null,
        specifiedUsersGrantedActions: buildSpecifiedUsersGrantedActions(displaySpecifiedUserRows),
      }),
    {
      manual: true,
      onSuccess: () => {
        toast.success('权限配置已保存');
        notifyResourcePermissionRefresh({ resourceId, resourceType });
        onSuccess?.();
        handleModalOpenChange(false);
      },
      onError: (err) => {
        toast.danger(parseErrorMessage(err));
      },
    }
  );

  const handleSelectUser = (user: SearchableUser) => {
    if (displaySpecifiedUserRows.some((row) => row.user.id === user.id)) {
      toast.warning('该用户已在指定权限列表中');
      return;
    }
    setSpecifiedUserRowsDraft((prev) => [
      ...(prev ?? loadedSpecifiedUserRows),
      { user, actions: [] },
    ]);
  };

  const handleRemoveUser = (userId: string) => {
    setSpecifiedUserRowsDraft((prev) =>
      (prev ?? loadedSpecifiedUserRows).filter((row) => row.user.id !== userId)
    );
  };

  const handleUserActionsChange = (userId: string, actions: ResourceAction[]) => {
    setSpecifiedUserRowsDraft((prev) =>
      (prev ?? loadedSpecifiedUserRows).map((row) =>
        row.user.id === userId ? { ...row, actions } : row
      )
    );
  };

  const renderStatusAlert = (status: 'danger' | 'default' | 'warning', message: string) => (
    <Alert status={status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={handleModalOpenChange}>
      <Modal.Backdrop isDismissable={!saving}>
        <Modal.Container size="md" placement="center" className={styles.modalContainer}>
          <Modal.Dialog className={styles.modalDialog}>
            <Modal.Header>
              <Modal.Heading>资源权限配置</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className={styles.body}>
                {loading ? (
                  renderStatusAlert('default', '正在加载权限配置...')
                ) : error ? (
                  renderStatusAlert('danger', parseErrorMessage(error))
                ) : permissionConfig ? (
                  <>
                    <section className={styles.section}>
                      <div className={styles.overrideRow}>
                        <Checkbox
                          isSelected={displayOverrideEnabled}
                          onChange={(isSelected) => setOverrideEnabledDraft(isSelected)}
                          variant="secondary"
                        >
                          <Checkbox.Control>
                            <Checkbox.Indicator />
                          </Checkbox.Control>
                          <Checkbox.Content>
                            <span
                              className={
                                displayOverrideEnabled
                                  ? styles.overrideLabel
                                  : `${styles.overrideLabel} ${styles.overrideLabelMuted}`
                              }
                            >
                              默认权限覆盖
                            </span>
                          </Checkbox.Content>
                        </Checkbox>
                        <PermissionActionDropdown
                          value={displayOverrideGrantedActions}
                          isDisabled={!displayOverrideEnabled}
                          isMuted={!displayOverrideEnabled}
                          onChange={setOverrideGrantedActionsDraft}
                        />
                      </div>
                    </section>

                    <section className={styles.section}>
                      <div className={styles.sectionTitle}>设置指定用户权限</div>
                      <UserSearchSelect
                        selectedUserIds={selectedUserIds}
                        fixedGroupIds={fixedSearchGroupIds}
                        showGroupFilter={showSearchGroupFilter}
                        onSelect={handleSelectUser}
                      />
                      {displaySpecifiedUserRows.length > 0 ? (
                        <div className={styles.userList}>
                          {displaySpecifiedUserRows.map((row) => {
                            const displayName = getUserDisplayName(row.user);
                            return (
                              <div className={styles.userRow} key={row.user.id}>
                                <div className={styles.userHeader}>
                                  <div className={styles.userInfo}>
                                    <Avatar aria-label={displayName} className={styles.avatar}>
                                      {row.user.avatar ? (
                                        <Avatar.Image alt={displayName} src={row.user.avatar} />
                                      ) : null}
                                      <Avatar.Fallback>
                                        {displayName.charAt(0).toUpperCase()}
                                      </Avatar.Fallback>
                                    </Avatar>
                                    <div className={styles.userText}>
                                      <span className={styles.userName}>{displayName}</span>
                                      <span className={styles.userSubText}>
                                        {getUserSubText(row.user)}
                                      </span>
                                    </div>
                                  </div>
                                  <PermissionActionDropdown
                                    value={row.actions}
                                    onChange={(actions) =>
                                      handleUserActionsChange(row.user.id, actions)
                                    }
                                    onDelete={() => handleRemoveUser(row.user.id)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        renderStatusAlert('default', '暂无指定用户权限')
                      )}
                    </section>
                  </>
                ) : (
                  renderStatusAlert('default', '暂无权限配置')
                )}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                isDisabled={saving}
                onPress={() => handleModalOpenChange(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                isDisabled={loading || Boolean(error) || saving}
                onPress={runSavePermission}
              >
                {saving ? '保存中...' : '保存'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default ResourcePermissionModal;
