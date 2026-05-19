import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type ProfileSettingRowProps = {
  label: string;
  value?: string;
  helperText?: string;
  children?: React.ReactNode;
};

export function ProfileSettingRow({ label, value, helperText, children }: ProfileSettingRowProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
        {value ? (
          <AppText variant="body" style={styles.value}>
            {value}
          </AppText>
        ) : null}
        {helperText ? (
          <AppText variant="caption" style={styles.helper}>
            {helperText}
          </AppText>
        ) : null}
      </View>
      {children ? <View style={styles.action}>{children}</View> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing[12],
      paddingVertical: theme.spacing[8],
    },
    copy: {
      flex: 1,
      gap: theme.spacing[4],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    value: {
      color: theme.colors.text.primary,
    },
    helper: {
      color: theme.colors.text.tertiary,
      lineHeight: 18,
    },
    action: {
      flexShrink: 0,
    },
  });
}
