
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';

interface ChallengeSectionIntroProps {
  title: string;
  description: string;
}

export function ChallengeSectionIntro({ title, description }: ChallengeSectionIntroProps) {
  const theme = useTheme();

  return (
    <View style={styles.container} testID="challenge-section-intro">
      <AppText variant="titleMedium" style={{ color: theme.colors.text.primary, marginBottom: 4 }}>
        {title}
      </AppText>
      <AppText variant="bodySmall" style={{ color: theme.colors.text.secondary }}>
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
});
