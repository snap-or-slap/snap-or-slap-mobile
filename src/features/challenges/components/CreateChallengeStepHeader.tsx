import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { TickCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { CreateChallengeFieldErrors, CreateChallengeStep } from '../types/createChallenge.types';
import { STEP_LABELS, STEP_NUMBERS, CREATE_CHALLENGE_STEPS } from '../types/createChallenge.types';
import { getCreateChallengeStepFields } from '../utils/createChallengeValidation';

type CreateChallengeStepHeaderProps = {
  currentStep: CreateChallengeStep;
  completedSteps?: CreateChallengeStep[];
  fieldErrors?: CreateChallengeFieldErrors;
  testID?: string;
};

const TOTAL_STEPS = CREATE_CHALLENGE_STEPS.length;

export function CreateChallengeStepHeader({
  currentStep,
  completedSteps = [],
  fieldErrors = {},
  testID,
}: CreateChallengeStepHeaderProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const stepNumber = STEP_NUMBERS[currentStep];

  return (
    <View testID={testID} style={styles.root}>
      <View style={styles.progressRow}>
        {CREATE_CHALLENGE_STEPS.map((step, index) => {
          const stepNum = index + 1;
          const hasError = getCreateChallengeStepFields(step).some((field) => Boolean(fieldErrors[field]));
          const isDone = completedSteps.includes(step) && stepNum < stepNumber && !hasError;
          const isActive = step === currentStep;
          const isPending = !isDone && !isActive && !hasError;
          return (
            <View
              key={step}
              style={[
                styles.stepItem,
                isDone && styles.stepItemDone,
                isActive && styles.stepItemActive,
                hasError && styles.stepItemError,
                isPending && styles.stepItemPending,
              ]}
            >
              <View
                style={[
                  styles.marker,
                  isDone && styles.markerDone,
                  isActive && styles.markerActive,
                  hasError && styles.markerError,
                ]}
              >
                {isDone ? (
                  <TickCircleIcon size={16} color={theme.colors.text['on-brand']} variant="bold" />
                ) : (
                  <AppText
                    variant="caption"
                    style={[
                      styles.markerText,
                      isActive && !hasError && styles.markerTextActive,
                      hasError && styles.markerTextError,
                    ]}
                  >
                    {stepNum}
                  </AppText>
                )}
              </View>
              <AppText
                variant="caption"
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                  hasError && styles.stepLabelError,
                ]}
                numberOfLines={1}
              >
                {STEP_LABELS[step]}
              </AppText>
            </View>
          );
        })}
      </View>
      <AppText variant="caption" style={styles.counter}>
        Step {stepNumber} of {TOTAL_STEPS}
      </AppText>
      <AppText variant="heading" style={styles.title}>
        {STEP_LABELS[currentStep]}
      </AppText>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing[8],
    },
    progressRow: {
      flexDirection: 'row',
      gap: theme.spacing[8],
    },
    stepItem: {
      flex: 1,
      gap: theme.spacing[4],
      minWidth: 0,
    },
    stepItemDone: {
      opacity: 1,
    },
    stepItemActive: {
      opacity: 1,
    },
    stepItemPending: {
      opacity: 0.7,
    },
    stepItemError: {
      opacity: 1,
    },
    marker: {
      height: 24,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      backgroundColor: theme.colors.bg.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerDone: {
      backgroundColor: theme.colors.bg.brand,
      borderColor: theme.colors.bg.brand,
    },
    markerActive: {
      backgroundColor: theme.colors.bg.brand,
      borderColor: theme.colors.bg.brand,
    },
    markerError: {
      backgroundColor: theme.colors.bg['error-subtle'],
      borderColor: theme.colors.border.error,
    },
    markerText: {
      color: theme.colors.text.tertiary,
      fontWeight: '800',
    },
    markerTextActive: {
      color: theme.colors.text['on-brand'],
    },
    markerTextError: {
      color: theme.colors.text.error,
    },
    stepLabel: {
      color: theme.colors.text.tertiary,
      fontWeight: '600',
      textAlign: 'center',
    },
    stepLabelActive: {
      color: theme.colors.text.brand,
    },
    stepLabelError: {
      color: theme.colors.text.error,
    },
    counter: {
      color: theme.colors.text.tertiary,
      fontWeight: '600',
    },
    title: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
  });
}
