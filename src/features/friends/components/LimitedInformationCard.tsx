import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Card } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

export type LimitedInformationCardProps = {
  title: string;
  message: string;
  testID?: string;
};

export function LimitedInformationCard({ title, message, testID }: LimitedInformationCardProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Card style={styles.card} testID={testID}>
      <View style={styles.row}>
        <InfoCircleIcon size={20} color={theme.colors.text.info} variant="outline" />
        <View style={styles.textWrap}>
          <AppText variant="label" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="body" style={styles.message}>
            {message}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.bg['info-subtle'],
      borderWidth: 1,
      borderColor: theme.colors.border.info,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
    },
    textWrap: {
      flex: 1,
      gap: 4,
    },
    title: {
      color: theme.colors.text.info,
      fontWeight: '700',
    },
    message: {
      color: theme.colors.text.info,
      lineHeight: 20,
    },
  });
}
