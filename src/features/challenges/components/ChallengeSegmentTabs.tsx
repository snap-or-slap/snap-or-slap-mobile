import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
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
                variant="bodyLarge"
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

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },

  container: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 6,
    borderRadius: 999,

    backgroundColor: '#FFF0EA',
    borderWidth: 1.5,
    borderColor: '#E2C8BE',
  },

  tab: {
    flex: 1,
    minHeight: 44,
    borderRadius: 999,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 12,
  },

  activeTab: {
    backgroundColor: '#FFD7C8',
  },

  tabText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#5F504B',
  },

  activeTabText: {
    color: '#B53A00',
  },
});