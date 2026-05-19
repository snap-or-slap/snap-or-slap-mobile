import React from 'react';
import { SegmentedTabs } from '@shared/components';
import type { FriendRequestTab } from '../types';

export type { FriendRequestTab };

export type FriendRequestTabsProps = {
  activeTab: FriendRequestTab;
  onChangeTab: (tab: FriendRequestTab) => void;
  incomingCount?: number;
  outgoingCount?: number;
  testID?: string;
};

export function FriendRequestTabs({
  activeTab,
  onChangeTab,
  incomingCount,
  outgoingCount,
  testID,
}: FriendRequestTabsProps) {
  return (
    <SegmentedTabs
      items={[
        { key: 'incoming', label: 'Incoming', count: incomingCount },
        { key: 'outgoing', label: 'Outgoing', count: outgoingCount },
      ]}
      activeKey={activeTab}
      onChange={onChangeTab}
      testID={testID}
    />
  );
}
