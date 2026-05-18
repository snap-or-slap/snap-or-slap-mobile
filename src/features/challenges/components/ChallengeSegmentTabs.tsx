import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeSegment } from '../types';

type ChallengeSegmentTabsProps = {
  activeSegment: ChallengeSegment;
  onSegmentChange: (segment: ChallengeSegment) => void;
};

const TABS: Array<{
  key: ChallengeSegment;
  label: string;
}> = [
    { key: 'formation', label: 'Formation' },
    { key: 'active', label: 'Active' },
    { key: 'history', label: 'History' },
  ];

export function ChallengeSegmentTabs({
  activeSegment,
  onSegmentChange,
}: ChallengeSegmentTabsProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} testID="challenge-segment-tabs">
        {TABS.map((tab) => {
          const isActive = activeSegment === tab.key;

          return (
            <Pressable
              key={tab.key}
              testID={`challenge-segment-${tab.key}`}
              onPress={() => onSegmentChange(tab.key)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <AppText
                variant="body"
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  wrapper: {
    paddingHorizontal: theme.spacing[24],
    marginBottom: theme.spacing[24],
  },

  container: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 6,
    borderRadius: theme.radius.full,

    backgroundColor: theme.colors.bg['brand-subtle'],
    borderWidth: 1.5,
    borderColor: theme.colors.border.subtle,
  },

  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.full,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: theme.spacing[12],
  },

  activeTab: {
    backgroundColor: theme.colors.bg['brand-subtle-hover'],
  },

  tabText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: theme.colors.text.secondary,
  },

  activeTabText: {
    color: theme.colors.text.brand,
  },
  });
}
