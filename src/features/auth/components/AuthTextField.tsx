import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';

interface AuthTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  subtext?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  leftIcon?: React.ReactNode;
}

export function AuthTextField({
  label,
  error,
  subtext,
  rightIcon,
  onRightIconPress,
  leftIcon,
  ...rest
}: AuthTextFieldProps) {
  const theme = useTheme();

  const borderColor = error ? theme.colors.border.error : theme.colors.border.default;
  const labelColor = error ? theme.colors.text.error : theme.colors.text.primary;

  return (
    <View style={styles.container}>
      <AppText variant="label" style={[styles.label, { color: labelColor }]}>
        {label} <AppText variant="label" style={{ color: theme.colors.text.error }}>*</AppText>
      </AppText>

      <View style={[
        styles.inputWrapper,
        {
          borderColor,
          backgroundColor: theme.colors.bg.surface,
          borderRadius: theme.radius.full,
        }
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text.primary, paddingLeft: leftIcon ? 8 : 16 },
          ]}
          placeholderTextColor={theme.colors.text.disabled}
          {...rest}
        />

        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon} hitSlop={8}>
            {rightIcon}
          </Pressable>
        )}
      </View>

      {error ? (
        <AppText variant="caption" style={[styles.errorText, { color: theme.colors.text.error }]}>
          {error}
        </AppText>
      ) : subtext ? (
        <AppText variant="caption" color="secondary" style={styles.subtext}>
          {subtext}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 8,
  },
  subtext: {
    marginTop: 6,
    marginLeft: 8,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 8,
  },
});
