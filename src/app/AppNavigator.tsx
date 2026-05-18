import React, { useState } from 'react';
import { OnboardingScreen } from '../features/onboarding';
import { HomeScreen } from '../features/home';
import { AuthNavigator } from '../navigation/AuthNavigator';

export const AppNavigator = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={() => setOnboardingDone(true)}
        onLogin={() => setOnboardingDone(true)}
        onCreateAccount={() => setOnboardingDone(true)}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthNavigator onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return <HomeScreen />;
};
