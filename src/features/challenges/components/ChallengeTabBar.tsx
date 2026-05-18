import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeSegment } from '../types/challenge.types';

type Tab = {
  key: ChallengeSegment;
  label: string;
};

const TABS: Tab[] = [
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
    <View testID={testID} style={styles.wrapper}>
      <View style={styles.container} testID="challenge-segment-tabs">
        {TABS.map((tab) => {
          const isActive = activeSegment === tab.key;
          return (
            <TabItem
              key={tab.key}
              tab={tab}
              isActive={isActive}
              onPress={() => onSegmentChange(tab.key)}
              styles={styles}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  isActive,
  onPress,
  styles,
}: {
  tab: Tab;
  isActive: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[{ flex: 1 }, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        testID={`challenge-segment-${tab.key}`}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.tab, isActive && styles.activeTab]}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <AppText
          variant="body"
          style={[styles.tabText, isActive && styles.activeTabText]}
        >
          {tab.label}
        </AppText>
      </Pressable>
    </Animated.View>
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
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderWidth: 1.5,
      borderColor: theme.colors.border.subtle,
    },
    tab: {
      flex: 1,
      minHeight: 42,
      borderRadius: theme.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing[8],
    },
    activeTab: {
      backgroundColor: theme.colors.bg['brand-subtle-hover'],
    },
    tabText: {
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '600',
      color: theme.colors.text.secondary,
    },
    activeTabText: {
      color: theme.colors.text.brand,
      fontWeight: '700',
    },
  });
}
