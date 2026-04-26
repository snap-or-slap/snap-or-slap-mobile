import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, AppText, Card, Button, Badge } from '../design-system/components';
import { OnboardingScreen } from '../features/onboarding';

/**
 * Temporary home placeholder shown after onboarding completes.
 * TODO: Replace with real MainTabs / HomeScreen navigation.
 */
function HomePlaceholder() {
  return (
    <Screen padded>
      <View style={{ gap: 16, paddingTop: 40 }}>
        <AppText variant="displaySmall">SnapOrSlap</AppText>
        <AppText variant="bodyLarge" color="secondary">
          Welcome! Onboarding complete.
        </AppText>

        <Card variant="elevated">
          <View style={{ gap: 12 }}>
            <AppText variant="titleMedium">Home Screen Placeholder</AppText>
            <Badge tone="success">Active</Badge>
            <AppText variant="bodyMedium" color="tertiary">
              Challenges / Friends / Profile — coming soon.
            </AppText>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

export const AppNavigator = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);

  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={() => setOnboardingDone(true)}
      />
    );
  }

  return <HomePlaceholder />;
};
