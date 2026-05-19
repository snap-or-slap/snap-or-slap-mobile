import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { IconButton } from './IconButton';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  testID?: string;
};

/**
 * Standard page header with brand-color title.
 * leftAction / rightAction accept IconButton nodes.
 */
export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  leftAction,
  rightAction,
  testID,
}: AppHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.leftSlot}>
        {leftAction ??
          (showBack && onBack ? (
            <IconButton
              accessibilityLabel="Go back"
              onPress={onBack}
              variant="ghost"
              icon={
                <ArrowCircleLeftIcon
                  size={26}
                  color={theme.colors.text.brand}
                  variant="outline"
                />
              }
            />
          ) : null)}
      </View>
      <View style={styles.center}>
        <AppText variant="heading" style={styles.title}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={styles.rightSlot}>{rightAction ?? null}</View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 52,
      marginBottom: 16,
      gap: 8,
    },
    leftSlot: {
      minWidth: 40,
      alignItems: 'flex-start',
    },
    center: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
    },
    rightSlot: {
      minWidth: 40,
      alignItems: 'flex-end',
    },
    title: {
      color: theme.colors.text.brand,
      fontWeight: '800',
    },
    subtitle: {
      color: theme.colors.text.secondary,
    },
  });
}
