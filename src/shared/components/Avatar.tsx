import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';

type AvatarProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
  testID?: string;
};

export function Avatar({
  name,
  avatarUrl,
  size = 52,
  testID,
}: AvatarProps) {
  const theme = useTheme();
  const initial = (name?.trim().charAt(0) || '?').toUpperCase();
  const borderRadius = size / 2;

  if (avatarUrl) {
    return (
      <Image
        testID={testID}
        source={{ uri: avatarUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius,
            backgroundColor: theme.colors.bg['surface-elevated'],
          },
        ]}
      />
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: theme.colors.bg['brand-subtle'],
        },
      ]}
    >
      <AppText
        variant="subtitle"
        style={[
          styles.initial,
          {
            color: theme.colors.text.brand,
            fontSize: Math.max(18, size * 0.38),
            lineHeight: Math.max(22, size * 0.44),
          },
        ]}
      >
        {initial}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '800',
  },
});
