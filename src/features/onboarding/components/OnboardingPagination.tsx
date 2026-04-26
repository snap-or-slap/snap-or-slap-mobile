import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@ds/theme';

interface OnboardingPaginationProps {
  total: number;
  activeIndex: number;
  testID?: string;
}

export function OnboardingPagination({
  total,
  activeIndex,
  testID = 'onboarding-pagination',
}: OnboardingPaginationProps) {
  const theme = useTheme();
  const activeBg = theme.colors.bg.brand;
  const inactiveBg = theme.colors.border.subtle;

  return (
    <View style={styles.container} testID={testID}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          testID={`onboarding-pagination-dot-${i}`}
          style={[
            styles.dot,
            {
              width: i === activeIndex ? 24 : 8,
              backgroundColor: i === activeIndex ? activeBg : inactiveBg,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
