import {
  actionsToPermissionCode,
  getResourceActionImpliedActions,
  getResourceActionImpliedMask,
  hasResourceAction,
  normalizeResourceActions,
  permissionCodeToActions,
  RESOURCE_ACTION,
  type ResourceAction,
} from '@/domains/Resource';
import { Checkbox } from '@heroui/react';
import { useMemo, useState } from 'react';
import type { ResourceActionSelectorProps } from './index.type';
import styles from './style.module.less';

function ResourceActionSelector({
  value,
  onChange,
  label,
  isDisabled = false,
  layout = 'inline',
  className,
}: ResourceActionSelectorProps) {
  const [hoveredAction, setHoveredAction] = useState<ResourceAction | null>(null);
  const selectedActions = useMemo(() => normalizeResourceActions(value), [value]);
  const selectedActionSet = useMemo(() => new Set(selectedActions), [selectedActions]);
  const actionHighlightSet = hoveredAction
    ? new Set([hoveredAction, ...getResourceActionImpliedActions(hoveredAction)])
    : null;

  const handleActionToggle = (action: ResourceAction, checked: boolean) => {
    const current = normalizeResourceActions(value);
    if (checked) {
      const nextCode = actionsToPermissionCode([...current, action]);
      onChange(permissionCodeToActions(nextCode));
      return;
    }
    const next = normalizeResourceActions(
      current.filter((item) => !hasResourceAction(getResourceActionImpliedMask(item), action))
    );
    onChange(next);
  };

  const rootClassName = [
    styles.actionGroup,
    layout === 'stack' ? styles.actionGroupStack : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {label ? <div className={styles.selectHint}>{label}</div> : null}
      <div className={styles.actionList}>
        {RESOURCE_ACTION.options.map((item) => {
          const action = item.value as ResourceAction;
          const isHighlighted = actionHighlightSet?.has(action);
          return (
            <div
              key={item.key}
              className={
                isHighlighted
                  ? `${styles.actionItem} ${styles.actionItemHighlight}`
                  : styles.actionItem
              }
              onMouseEnter={() => setHoveredAction(action)}
              onMouseLeave={() => setHoveredAction(null)}
            >
              <Checkbox
                isSelected={selectedActionSet.has(action)}
                isDisabled={isDisabled}
                onChange={(isSelected) => handleActionToggle(action, isSelected)}
                variant="secondary"
              >
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <span data-slot="label" className={styles.actionLabel}>
                    {item.label}
                  </span>
                </Checkbox.Content>
              </Checkbox>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResourceActionSelector;
