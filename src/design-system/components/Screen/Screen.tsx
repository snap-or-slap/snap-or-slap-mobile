import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme';
import { ScreenProps } from './Screen.types';
import { createScreenStyles } from './Screen.styles';

export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  padded = false,
  background,
  style,
  contentStyle,
  testID,
}) => {
  const theme = useTheme();
  const styles = createScreenStyles(theme, padded, background);

  const Inner = () => <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.screen, style]} testID={testID}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} style={{ flex: 1 }}>
          {children}
        </ScrollView>
      ) : (
        <Inner />
      )}
    </SafeAreaView>
  );
};
