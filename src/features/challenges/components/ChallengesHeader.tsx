
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import { Setting2Icon, NotificationBingIcon } from '@ds/icons';

export function ChallengesHeader() {
  const theme = useTheme();

  return (
    <View style={styles.container} testID="challenges-header">
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        leftIcon={<Setting2Icon size={24} color={theme.colors.text.brand} variant="outline" />}
        accessibilityLabel="Challenge settings"
      />
      <AppText variant="title" style={{ color: theme.colors.text.brand }}>
        Challenges
      </AppText>
      <View style={styles.iconButton}>
        <Button
          variant="ghost"
          size="sm"
          iconOnly
          leftIcon={<NotificationBingIcon size={24} color={theme.colors.text.brand} variant="outline" />}
          accessibilityLabel="Challenge notifications"
        />
        <View style={[styles.dot, { backgroundColor: theme.colors.bg.error }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
