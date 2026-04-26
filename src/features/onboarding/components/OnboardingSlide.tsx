import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@ds/components';

interface OnboardingSlideProps {
  title: string;
  description: string;
  testID?: string;
}

export function OnboardingSlide({
  title,
  description,
  testID = 'onboarding-slide',
}: OnboardingSlideProps) {
  return (
    <View style={styles.container} testID={testID}>
      <AppText
        variant="headlineMedium"
        testID="onboarding-title"
        style={styles.title}
      >
        {title}
      </AppText>
      <AppText
        variant="bodyLarge"
        color="secondary"
        testID="onboarding-description"
        style={styles.description}
      >
        {description}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
  },
  title: {
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
});
