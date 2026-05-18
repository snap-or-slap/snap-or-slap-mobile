import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Badge } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ChallengeStatus, ChallengeStatusTone } from '../types/challenge.types';
import { statusToTone, statusLabel } from '../utils/challengeStatus';

type StatusConfig = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  dotColor?: string;
};

function getStatusConfig(theme: AppTheme): Record<ChallengeStatusTone, StatusConfig> {
  return {
    active: {
      label: 'Active',
      backgroundColor: theme.colors.bg.brand,
      borderColor: theme.colors.bg.brand,
      textColor: theme.colors.text['on-brand'],
    },
    formation: {
      label: 'Formation',
      backgroundColor: theme.colors.bg['surface-inverse'],
      borderColor: theme.colors.bg['surface-inverse'],
      textColor: theme.colors.text.inverse,
    },
    invited: {
      label: 'Invited',
      backgroundColor: theme.colors.bg['brand-subtle'],
      borderColor: theme.colors.border.brand,
      textColor: theme.colors.text.brand,
    },
    'on-track': {
      label: 'On track',
      backgroundColor: theme.colors.bg['success-subtle'],
      borderColor: theme.colors.border.success,
      textColor: theme.colors.text.success,
      dotColor: theme.colors.bg.success,
    },
    danger: {
      label: 'Danger',
      backgroundColor: theme.colors.bg['error-subtle'],
      borderColor: theme.colors.border.error,
      textColor: theme.colors.text.error,
      dotColor: theme.colors.bg.error,
    },
    success: {
      label: 'Finished',
      backgroundColor: theme.colors.bg.success,
      borderColor: theme.colors.border.success,
      textColor: theme.colors.text['on-success'],
    },
    'game-over': {
      label: 'Game Over',
      backgroundColor: theme.colors.bg.error,
      borderColor: theme.colors.border.error,
      textColor: theme.colors.text['on-error'],
    },
    cancelled: {
      label: 'Cancelled',
      backgroundColor: theme.colors.bg.disabled,
      borderColor: theme.colors.border.disabled,
      textColor: theme.colors.text.disabled,
    },
  };
}

type ChallengeStatusBadgeProps =
  | {
      tone: ChallengeStatusTone;
      status?: never;
      label?: string;
      showDot?: boolean;
      testID?: string;
    }
  | {
      status: ChallengeStatus;
      tone?: never;
      label?: string;
      showDot?: boolean;
      testID?: string;
    };

export function ChallengeStatusBadge({
  tone,
  status,
  label,
  showDot,
  testID,
}: ChallengeStatusBadgeProps) {
  const theme = useTheme();
  const resolvedTone: ChallengeStatusTone = tone ?? statusToTone(status!);
  const config = getStatusConfig(theme)[resolvedTone];
  const resolvedLabel = label ?? (status ? statusLabel(status) : config.label);
  const shouldShowDot =
    showDot ?? (resolvedTone === 'on-track' || resolvedTone === 'danger');

  return (
    <Badge
      testID={testID}
      size="md"
      style={[
        styles.root,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      {shouldShowDot && config.dotColor ? (
        <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      ) : null}
      <AppText
        variant="caption"
        style={[styles.label, { color: config.textColor }]}
      >
        {resolvedLabel}
      </AppText>
    </Badge>
  );
}

// ─── Legacy alias for backward compat ───
export { ChallengeStatusBadge as ChallengeStatusPill };

const styles = StyleSheet.create({
  root: {
    minHeight: 32,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  label: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
});
