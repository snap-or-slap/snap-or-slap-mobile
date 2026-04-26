import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

type ScreenProps = {
  children: React.ReactNode;
  padded?: boolean;
  scroll?: boolean;
  testID?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  ignoreTopSafeArea?: boolean;
  ignoreBottomSafeArea?: boolean;
} & Pick<ScrollViewProps, 'keyboardShouldPersistTaps'>;

export function Screen({
  children,
  padded = false,
  scroll = false,
  testID,
  style,
  contentStyle,
  ignoreTopSafeArea = false,
  ignoreBottomSafeArea = false,
  keyboardShouldPersistTaps = 'handled',
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = theme.colors.bg.page;

  const horizontalPadding = padded ? 24 : 0;

  const rootStyle = [
    styles.root,
    {
      backgroundColor,
      paddingTop: ignoreTopSafeArea ? 0 : insets.top,
      paddingBottom: !scroll && !ignoreBottomSafeArea ? insets.bottom : 0,
    },
    style,
  ];

  if (scroll) {
    return (
      <View testID={testID} style={rootStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: ignoreBottomSafeArea ? 24 : insets.bottom + 24,
            },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        rootStyle,
        padded && { paddingHorizontal: horizontalPadding },
        contentStyle,
      ]}
    >
      {children}
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