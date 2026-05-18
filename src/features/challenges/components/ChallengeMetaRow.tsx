import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { ReactNode } from 'react';

type ChallengeMetaRowProps = {
  icon: ReactNode;
  label: string;
  testID?: string;
};

export function ChallengeMetaRow({ icon, label, testID }: ChallengeMetaRowProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View testID={testID} style={styles.row}>
      <View style={styles.icon}>{icon}</View>
      <AppText variant="body" style={styles.label}>
        {label}
      </AppText>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    icon: {
      width: 20,
      alignItems: 'center',
    },
    label: {
      color: theme.colors.text.secondary,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: '500',
      flex: 1,
    },
  });
}
