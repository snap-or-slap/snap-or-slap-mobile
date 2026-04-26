import React, { useState } from 'react';
import { OnboardingScreen } from '../features/onboarding';
import { HomeScreen } from '../features/home';

export const AppNavigator = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);

  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={() => setOnboardingDone(true)}
      />
    );
  }

  return <HomeScreen />;
};
