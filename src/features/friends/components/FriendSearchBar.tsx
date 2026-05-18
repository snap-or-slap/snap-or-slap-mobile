import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { AppText } from '@ds/components';
import { SearchNormalIcon, CloseIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { Pressable } from 'react-native';

export type FriendSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  testID?: string;
};

export function FriendSearchBar({
  value,
  onChangeText,
  placeholder = 'Search',
  onClear,
  autoFocus = false,
  testID,
}: FriendSearchBarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.iconLeft}>
        <SearchNormalIcon size={18} color={theme.colors.icon.secondary} variant="outline" />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        returnKeyType="search"
        testID={testID ? `${testID}-input` : undefined}
      />
      {value.length > 0 && onClear ? (
        <Pressable
          onPress={onClear}
          hitSlop={8}
          accessibilityLabel="Clear search"
          style={styles.clearButton}
          testID={testID ? `${testID}-clear` : undefined}
        >
          <CloseIcon size={16} color={theme.colors.icon.secondary} variant="outline" />
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.bg.surface,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      minHeight: 48,
      paddingHorizontal: 12,
      gap: 8,
    },
    iconLeft: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      color: theme.colors.text.primary,
      fontSize: 15,
      paddingVertical: 0,
    },
    clearButton: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 4,
    },
  });
}
