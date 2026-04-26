
import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import { Setting2Icon, NotificationBingIcon } from '@ds/icons';

export function ChallengesHeader() {
  const theme = useTheme();

  return (
    <View style={styles.container} testID="challenges-header">
      <Pressable style={styles.iconButton}>
        <Setting2Icon size={24} color={theme.colors.text.primary} variant="outline" />
      </Pressable>
      <AppText variant="titleLarge" style={{ color: theme.colors.text.primary }}>
        Challenges
      </AppText>
      <Pressable style={styles.iconButton}>
        <NotificationBingIcon size={24} color={theme.colors.text.primary} variant="outline" />
        <View style={[styles.dot, { backgroundColor: theme.colors.bg.error }]} />
      </Pressable>
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
