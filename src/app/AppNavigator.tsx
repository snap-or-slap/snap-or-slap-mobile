import React, { useEffect } from 'react';
import { OnboardingScreen } from '../features/onboarding';
import { HomeScreen } from '../features/home';
import { AuthNavigator } from '../navigation/AuthNavigator';
import { CompleteProfileScreen, SetupPermissionsScreen } from '../features/profile';
import { getSetupFlags } from '../features/profile/services';
import { AppText, Screen } from '../design-system/components';
import { session } from '../services/api';
import {
  useAppSelector,
  useAppDispatch,
  restoreSession,
  setSetupStage,
  setAuthenticated,
  setGuest,
  completeOnboarding,
} from '../store';
import type { SetupStage } from '../store';

export const AppNavigator = () => {
  const dispatch = useAppDispatch();
  const { status, setupStage, onboardingDone } = useAppSelector((state) => state.auth);

  // ── Bootstrap: restore session from AsyncStorage ────────────
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // ── After auth: check setup flags ──────────────────────────
  useEffect(() => {
    if (status !== 'authenticated' || setupStage !== 'checking') return;

    let mounted = true;

    getSetupFlags()
      .then((flags) => {
        if (!mounted) return;

        if (!flags.profileSetupCompleted) {
          dispatch(setSetupStage('profile'));
          return;
        }

        if (!flags.permissionsSetupCompleted) {
          dispatch(setSetupStage('permissions'));
          return;
        }

        dispatch(setSetupStage('done'));
      })
      .catch(() => {
        if (mounted) {
          dispatch(setSetupStage('profile'));
        }
      });

    return () => {
      mounted = false;
    };
  }, [status, setupStage, dispatch]);

  // ── Loading states ─────────────────────────────────────────
  if (status === 'unknown') {
    return (
      <Screen padding="md" testID="app-bootstrapping-screen">
        <AppText variant="body" color="secondary">
          Loading...
        </AppText>
      </Screen>
    );
  }

  // ── Onboarding ─────────────────────────────────────────────
  if (!onboardingDone) {
    return (
      <OnboardingScreen
        onComplete={() => {
          dispatch(completeOnboarding());
        }}
        onLogin={() => {
          dispatch(completeOnboarding());
        }}
        onCreateAccount={() => {
          dispatch(completeOnboarding());
        }}
      />
    );
  }

  // ── Auth ───────────────────────────────────────────────────
  if (status === 'guest') {
    return (
      <AuthNavigator
        onAuthSuccess={(nextStage) => {
          // Auth state is now set by the login/register mutations via onQueryStarted
          // We only need to handle the setup stage if passed explicitly
          if (nextStage) {
            dispatch(setSetupStage(nextStage));
          }
        }}
      />
    );
  }

  // ── Setup stages ───────────────────────────────────────────
  if (setupStage === 'profile') {
    return (
      <CompleteProfileScreen
        onBack={() => {
          session.clearSession();
          dispatch(setGuest());
        }}
        onComplete={() => dispatch(setSetupStage('permissions'))}
      />
    );
  }

  if (setupStage === 'permissions') {
    return (
      <SetupPermissionsScreen
        onBack={() => dispatch(setSetupStage('profile'))}
        onComplete={() => dispatch(setSetupStage('done'))}
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

  // ── Main app ───────────────────────────────────────────────
  return (
    <HomeScreen
      onSignedOut={() => {
        dispatch(setGuest());
      }}
    />
  );
};