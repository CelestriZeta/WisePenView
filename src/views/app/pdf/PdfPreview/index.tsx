import EntryIcon from '@/components/Common/EntryIcon';
import { ResultState, Spin } from '@/components/Common/Feedback';
import IconText from '@/components/Common/IconText';
import PdfViewer from '@/components/Pdf/PdfViewer/index';
import ResourceInteractBar from '@/components/Resource/ResourceInteractBar';
import ResourceInteractFooter from '@/components/Resource/ResourceInteractFooter';
import ResourcePermissionModal from '@/components/Resource/ResourcePermissionModal';
import ResourceViewerHeader from '@/components/Resource/ResourceViewerHeader';
import rvhStyles from '@/components/Resource/ResourceViewerHeader/style.module.less';
import { useDocumentService, useResourceService, useUserService } from '@/domains';
import { RESOURCE_TYPE } from '@/domains/Resource';
import { parseErrorMessage } from '@/utils/error';
import { Button, Dropdown } from '@heroui/react';
import { useRequest } from 'ahooks';
import { useState, type Key } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './style.module.less';

function PdfPreview() {
  const { resourceId } = useParams<{ resourceId: string }>();
  const [viewerErrorMap, setViewerErrorMap] = useState<Record<string, unknown>>({});
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const documentService = useDocumentService();
  const resourceService = useResourceService();
  const userService = useUserService();
  const {
    data: docInfo,
    error: docInfoError,
    loading: isDocInfoLoading,
    refresh: refreshDocInfo,
  } = useRequest(
    async () => {
      return await documentService.getDocInfo(resourceId as string);
    },
    {
      ready: Boolean(resourceId),
      refreshDeps: [resourceId],
    }
  );

  // 进入页面时上报阅读
  useRequest(() => resourceService.interactRead(resourceId as string), {
    ready: Boolean(resourceId),
    refreshDeps: [resourceId],
  });

  const resourceInfo = docInfo?.resourceInfo;
  const { data: currentUser } = useRequest(() => userService.getUserInfo(), {
    ready: Boolean(resourceInfo?.ownerId),
    refreshDeps: [resourceInfo?.ownerId],
  });
  const canManageDocumentPermission =
    Boolean(resourceInfo?.ownerId) && currentUser?.id === resourceInfo?.ownerId;

  const currentResourceId = resourceId ?? '';
  const viewerError = viewerErrorMap[currentResourceId];
  const handleViewerLoadError = (error: unknown) => {
    if (!currentResourceId) {
      return;
    }
    setViewerErrorMap((prev) => ({
      ...prev,
      [currentResourceId]: error,
    }));
  };

  const handleMoreAction = (key: Key) => {
    if (key === 'permission' && canManageDocumentPermission) {
      setIsPermissionModalOpen(true);
    }
  };

  if (!resourceId) {
    return (
      <div className={styles.container}>
        <ResourceViewerHeader />
        <div className={styles.statesBelowHeader}>
          <div className={styles.middleOverlay}>
            <div className={styles.middleOverlayInner}>
              <ResultState
                status="warning"
                title="无法打开文档"
                extra={
                  <Link to="/app/drive">
                    <Button variant="secondary">返回云盘</Button>
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (docInfoError) {
    return (
      <div className={styles.container}>
        <ResourceViewerHeader />
        <div className={styles.statesBelowHeader}>
          <div className={styles.middleOverlay}>
            <div className={styles.middleOverlayInner}>
              <ResultState
                status="warning"
                title="无法打开文档"
                subTitle={parseErrorMessage(docInfoError)}
                extra={
                  <Link to="/app/drive">
                    <Button variant="secondary">返回云盘</Button>
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 仅在初次加载（尚无数据）时展示全页 spinner；refresh 时保留旧 docInfo，不触发全页 loading
  if (isDocInfoLoading && !docInfo) {
    return (
      <div className={styles.container}>
        <ResourceViewerHeader />
        <div className={styles.statesBelowHeader}>
          <div className={styles.middleOverlay} aria-busy="true" aria-live="polite">
            <div className={styles.middleOverlayLoading}>
              <Spin size="large" />
              <span className={styles.middleOverlayText}>正在加载文档信息...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className={styles.container}>
        <ResourceViewerHeader />
        <div className={styles.statesBelowHeader}>
          <div className={styles.middleOverlay}>
            <div className={styles.middleOverlayInner}>
              <ResultState
                status="warning"
                title="无法打开文档"
                subTitle="文档信息为空，请稍后重试"
                extra={
                  <Link to="/app/drive">
                    <Button variant="secondary">返回云盘</Button>
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewerError) {
    return (
      <div className={styles.container}>
        <ResourceViewerHeader
          inlineTitle={
            <IconText
              className={rvhStyles.inlineTitleText}
              icon={
                <EntryIcon
                  entryType="resource"
                  resourceType={docInfo.resourceInfo.resourceType ?? RESOURCE_TYPE.FILE}
                />
              }
              iconSize={18}
              gap="var(--space-sm)"
              ellipsis
            >
              {docInfo.resourceInfo.resourceName}
            </IconText>
          }
        />
        <div className={styles.statesBelowHeader}>
          <div className={styles.middleOverlay}>
            <div className={styles.middleOverlayInner}>
              <ResultState
                status="warning"
                title="文档预览失败"
                subTitle={parseErrorMessage(viewerError)}
                extra={
                  <Link to="/app/drive">
                    <Button variant="secondary">返回云盘</Button>
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ResourceViewerHeader
        inlineTitle={
          <IconText
            className={rvhStyles.inlineTitleText}
            icon={
              <EntryIcon
                entryType="resource"
                resourceType={docInfo.resourceInfo.resourceType ?? RESOURCE_TYPE.FILE}
              />
            }
            iconSize={18}
            gap="var(--space-sm)"
            ellipsis
          >
            {docInfo.resourceInfo.resourceName}
          </IconText>
        }
        extra={
          <Dropdown>
            <Dropdown.Trigger>
              <Button variant="secondary" size="sm" aria-label="更多">
                更多
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu aria-label="文档更多操作" onAction={handleMoreAction}>
                <Dropdown.Item
                  id="permission"
                  textValue="权限配置"
                  isDisabled={!canManageDocumentPermission}
                >
                  权限配置
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        }
      />
      <div className={styles.content}>
        <div className={styles.root}>
          <ResourceInteractBar resourceId={resourceId as string} />
          <PdfViewer key={resourceId} resourceId={resourceId} onLoadError={handleViewerLoadError} />
          <ResourceInteractFooter
            resourceId={resourceId as string}
            onRateSuccess={() => void refreshDocInfo()}
          />
        </div>
      </div>
      <ResourcePermissionModal
        isOpen={isPermissionModalOpen}
        resourceId={resourceId as string}
        resourceType="document"
        onOpenChange={setIsPermissionModalOpen}
        onSuccess={() => void refreshDocInfo()}
      />
    </div>
  );
}

export default PdfPreview;
