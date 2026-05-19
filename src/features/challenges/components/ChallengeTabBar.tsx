import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SegmentedTabs } from '@shared/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeSegment } from '../types/challenge.types';

const TABS: Array<{ key: ChallengeSegment; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'formation', label: 'Formation' },
  { key: 'history', label: 'History' },
];

type ChallengeTabBarProps = {
  activeSegment: ChallengeSegment;
  onSegmentChange: (segment: ChallengeSegment) => void;
  testID?: string;
};

export function ChallengeTabBar({
  activeSegment,
  onSegmentChange,
  testID,
}: ChallengeTabBarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.wrapper}>
      <SegmentedTabs
        items={TABS}
        activeKey={activeSegment}
        onChange={onSegmentChange}
        testID={testID ?? 'challenge-segment-tabs'}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrapper: {
      paddingHorizontal: theme.spacing[24],
      marginBottom: theme.spacing[24],
    },
  });
}
