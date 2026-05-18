import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type CreateChallengeFooterProps = {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
  canGoBack?: boolean;
  testID?: string;
};

export function CreateChallengeFooter({
  onBack,
  onNext,
  onSubmit,
  isLastStep = false,
  isLoading = false,
  canGoBack = true,
  testID,
}: CreateChallengeFooterProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View testID={testID} style={styles.root}>
      {canGoBack && onBack ? (
        <Button
          title="Back"
          variant="ghost"
          size="md"
          onPress={onBack}
          style={styles.backButton}
          testID="create-challenge-back-step"
        />
      ) : null}
      <Button
        title={isLastStep ? 'Create Challenge' : 'Continue'}
        variant="primary"
        size="md"
        loading={isLoading}
        onPress={isLastStep ? onSubmit : onNext}
        style={styles.nextButton}
        fullWidth={!canGoBack || !onBack}
        testID={isLastStep ? 'create-challenge-submit-button' : 'create-challenge-next-step'}
      />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 8,
    },
    backButton: {
      minWidth: 90,
    },
    nextButton: {
      flex: 1,
    },
  });
}
