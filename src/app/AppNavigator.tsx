import React, { useEffect, useState } from 'react';
import { OnboardingScreen } from '../features/onboarding';
import { HomeScreen } from '../features/home';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { CompleteProfileScreen, SetupPermissionsScreen } from '../features/profile';
import { getSetupFlags } from '../features/profile/services';
import { AppText, Screen } from '../design-system/components';

type SetupStage = 'checking' | 'profile' | 'permissions' | 'done';

export const AppNavigator = () => {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [setupStage, setSetupStage] = useState<SetupStage>('checking');

  useEffect(() => {
    if (!isAuthenticated) return;

    let mounted = true;

    getSetupFlags()
      .then((flags) => {
        if (!mounted) return;

        if (!flags.profileSetupCompleted) {
          setSetupStage('profile');
          return;
        }

        if (!flags.permissionsSetupCompleted) {
          setSetupStage('permissions');
          return;
        }

        setSetupStage('done');
      })
      .catch(() => {
        if (mounted) setSetupStage('profile');
      });

    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

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
    return (
      <AuthNavigator
        onAuthSuccess={() => {
          setSetupStage('checking');
          setIsAuthenticated(true);
        }}
      />
    );
  }

  if (setupStage === 'profile') {
    return (
      <CompleteProfileScreen
        initialDisplayName="SnapOrSlap User"
        onBack={() => {
          setIsAuthenticated(false);
          setSetupStage('checking');
        }}
        onComplete={() => setSetupStage('permissions')}
      />
    );
  }

  if (setupStage === 'permissions') {
    return (
      <SetupPermissionsScreen
        onBack={() => setSetupStage('profile')}
        onComplete={() => setSetupStage('done')}
      />
    );
  }

  if (setupStage === 'checking') {
    return (
      <Screen padding="md" testID="setup-checking-screen">
        <AppText variant="body" color="secondary">
          Loading setup...
        </AppText>
      </Screen>
    );
  }

  return <HomeScreen />;
};
