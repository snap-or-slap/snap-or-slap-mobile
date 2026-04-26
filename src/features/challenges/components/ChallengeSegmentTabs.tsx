
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import { ChallengeSegment } from '../types';

interface ChallengeSegmentTabsProps {
  activeSegment: ChallengeSegment;
  onSegmentChange: (segment: ChallengeSegment) => void;
}

export function ChallengeSegmentTabs({ activeSegment, onSegmentChange }: ChallengeSegmentTabsProps) {
  const theme = useTheme();

  const segments: { key: ChallengeSegment; label: string }[] = [
    { key: 'formation', label: 'Formation' },
    { key: 'active', label: 'Active' },
    { key: 'history', label: 'History' },
  ];

  return (
    <View style={styles.container} testID="challenge-segment-tabs">
      {segments.map((segment) => {
        const isActive = activeSegment === segment.key;
        return (
          <Pressable
            key={segment.key}
            style={[
              styles.tab,
              isActive && { backgroundColor: theme.colors.bg['brand-subtle'] },
            ]}
            onPress={() => onSegmentChange(segment.key)}
            testID={`challenge-segment-${segment.key}`}
          >
            <AppText
              variant="labelLarge"
              style={{
                color: isActive ? theme.colors.text.brand : theme.colors.text.secondary,
              }}
            >
              {segment.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginRight: 8,
  },
});
