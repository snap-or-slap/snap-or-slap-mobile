import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { InfoCircleIcon, TickCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ChallengeInfoCardVariant = 'info' | 'warning' | 'error' | 'success';

type ChallengeInfoCardProps = {
  variant?: ChallengeInfoCardVariant;
  title?: string;
  message: string;
  testID?: string;
};

function getVariantColors(theme: AppTheme, variant: ChallengeInfoCardVariant) {
  const colorKey = variant === 'error' ? 'error' : variant;
  return {
    background: theme.colors.bg[`${colorKey}-subtle`],
    border: theme.colors.border[colorKey],
    text: theme.colors.text[colorKey],
  };
}

export function ChallengeInfoCard({
  variant = 'info',
  title,
  message,
  testID,
}: ChallengeInfoCardProps) {
  const theme = useTheme();
  const colors = getVariantColors(theme, variant);
  const styles = createStyles(theme, variant);
  const Icon = variant === 'success' ? TickCircleIcon : InfoCircleIcon;

  return (
    <Card variant="outlined" padding="sm" style={styles.card} testID={testID}>
      <Icon size={18} color={colors.text} variant="outline" />
      <View style={styles.content}>
        {title ? (
          <AppText variant="label" style={styles.title}>
            {title}
          </AppText>
        ) : null}
        <AppText variant="caption" style={styles.message}>
          {message}
        </AppText>
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme, variant: ChallengeInfoCardVariant) {
  const colors = getVariantColors(theme, variant);

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing[8],
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    content: {
      flex: 1,
      gap: theme.spacing[4],
    },
    title: {
      color: colors.text,
      fontWeight: '700',
    },
    message: {
      color: colors.text,
      lineHeight: 18,
    },
  });
}
