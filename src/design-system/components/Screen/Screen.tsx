import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { ScreenProps } from './Screen.types';

export function Screen({
  children,
  scrollable = false,
  safeArea = 'both',
  padding = 'none',
  background,
  keyboardAvoiding = false,
  keyboardShouldPersistTaps = 'handled',
  contentStyle,
  style,
  testID,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = background 
    ? ((theme.colors.bg as any)[background] || background) 
    : theme.colors.bg.page;

  const padMap = { none: 0, md: 16, lg: 24 };
  const horizontalPadding = padMap[padding] || 0;

  const paddingTop = safeArea === 'both' || safeArea === 'top' ? insets.top : 0;
  const paddingBottom = (!scrollable && (safeArea === 'both' || safeArea === 'bottom')) ? insets.bottom : 0;

  const rootStyle = [
    styles.root,
    {
      backgroundColor,
      paddingTop,
      paddingBottom,
    },
    style,
  ];

  let content = (
    <View style={[styles.root, padding !== 'none' && { paddingHorizontal: horizontalPadding }, contentStyle]}>
      {children}
    </View>
  );

  if (scrollable) {
    content = (
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: horizontalPadding,
            paddingBottom: (safeArea === 'both' || safeArea === 'bottom') ? insets.bottom + 24 : 24,
          },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    );
  }

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={rootStyle}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        testID={testID}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={rootStyle} testID={testID}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});