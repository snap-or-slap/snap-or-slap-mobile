import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { AppText, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
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
  const theme = useTheme();
  const styles = createStyles(theme);

  const tabs: Array<{ key: FriendRequestTab; label: string; count?: number }> = [
    { key: 'incoming', label: 'Incoming', count: incomingCount },
    { key: 'outgoing', label: 'Outgoing', count: outgoingCount },
  ];

  return (
    <View style={styles.container} testID={testID}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.tab, isActive && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            testID={testID ? `${testID}-${tab.key}` : undefined}
          >
            <AppText
              variant="label"
              style={[styles.label, isActive && styles.labelActive]}
            >
              {tab.label}
            </AppText>
            {tab.count !== undefined && tab.count > 0 ? (
              <Badge
                variant={isActive ? 'brand' : 'neutral'}
                size="sm"
              >
                {String(tab.count)}
              </Badge>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.colors.bg.surface,
      borderRadius: theme.radius.lg,
      padding: 4,
      gap: 4,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: theme.radius.md,
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    tabActive: {
      backgroundColor: theme.colors.bg['surface-elevated'],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '600',
    },
    labelActive: {
      color: theme.colors.text.primary,
      fontWeight: '700',
    },
  });
}
