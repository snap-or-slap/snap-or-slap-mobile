import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { HeartIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ChallengeHeartsProps = {
  heartsLeft?: number;
  totalHearts?: number;
  /** Formatted label override, e.g. "2/3" or "4 total". */
  label?: string;
  tone?: 'brand' | 'danger' | 'muted';
  /** @deprecated Use tone instead. Kept for backward compat. */
  variant?: 'filled' | 'outline';
  withBackground?: boolean;
  testID?: string;
};

function resolveTone(heartsLeft?: number, totalHearts?: number): 'brand' | 'danger' | 'muted' {
  if (heartsLeft == null || totalHearts == null) return 'brand';
  const ratio = heartsLeft / totalHearts;
  if (ratio <= 0.33) return 'danger';
  return 'brand';
}

function getToneColor(theme: AppTheme, tone: 'brand' | 'danger' | 'muted'): string {
  switch (tone) {
    case 'brand':
      return theme.colors.bg.brand;
    case 'danger':
      return theme.colors.bg.error;
    case 'muted':
      return theme.colors.text.tertiary;
  }
}

export function ChallengeHearts({
  heartsLeft,
  totalHearts,
  label,
  tone,
  withBackground = false,
  testID,
}: ChallengeHeartsProps) {
  const theme = useTheme();
  const resolvedTone = tone ?? resolveTone(heartsLeft, totalHearts);
  const color = getToneColor(theme, resolvedTone);
  const styles = createStyles(theme);
  const displayLabel =
    label ?? (heartsLeft != null && totalHearts != null ? `${heartsLeft}/${totalHearts}` : null);

  if (displayLabel == null) return null;

  return (
    <View
      testID={testID}
      style={[styles.root, withBackground ? styles.withBackground : null]}
    >
      <HeartIcon
        variant={resolvedTone !== 'muted' ? 'bold' : 'outline'}
        size={24}
        color={color}
      />
      <AppText variant="body" style={[styles.label, { color }]}>
        {displayLabel}
      </AppText>
    </View>
  );
}

// Legacy alias
export { ChallengeHearts as HeartCountBadge };

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      minHeight: 32,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    withBackground: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: theme.colors.bg['surface-elevated'],
    },
    label: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '800',
    },
  });
}
