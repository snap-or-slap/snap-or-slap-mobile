import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { CreateChallengeStep } from '../types/createChallenge.types';
import { STEP_LABELS, STEP_NUMBERS, CREATE_CHALLENGE_STEPS } from '../types/createChallenge.types';

type CreateChallengeStepHeaderProps = {
  currentStep: CreateChallengeStep;
  testID?: string;
};

const TOTAL_STEPS = CREATE_CHALLENGE_STEPS.length;

export function CreateChallengeStepHeader({
  currentStep,
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
          const isDone = stepNum < stepNumber;
          const isActive = step === currentStep;
          return (
            <View
              key={step}
              style={[
                styles.dot,
                isDone && styles.dotDone,
                isActive && styles.dotActive,
              ]}
            />
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
      gap: 8,
    },
    progressRow: {
      flexDirection: 'row',
      gap: 6,
    },
    dot: {
      flex: 1,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.border.subtle,
    },
    dotDone: {
      backgroundColor: theme.colors.bg.brand,
      opacity: 0.4,
    },
    dotActive: {
      backgroundColor: theme.colors.bg.brand,
      opacity: 1,
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
