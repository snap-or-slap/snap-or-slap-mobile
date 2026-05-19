import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@ds/components';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type CreateChallengeFooterProps = {
  onBack?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
  canGoBack?: boolean;
  nextDisabled?: boolean;
  testID?: string;
};

export function CreateChallengeFooter({
  onBack,
  onNext,
  onSubmit,
  isLastStep = false,
  isLoading = false,
  canGoBack = true,
  nextDisabled = false,
  testID,
}: CreateChallengeFooterProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View testID={testID} style={styles.root}>
      {canGoBack && onBack ? (
        <Button
          title="Back"
          leftIcon={<ArrowCircleLeftIcon size={22} color={theme.colors.text.primary} variant="outline" />}
          variant="secondary"
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
        rightIcon={!isLastStep ? <ArrowCircleRightIcon size={22} color={theme.colors.text['on-brand']} variant="outline" /> : undefined}
        loading={isLoading}
        disabled={nextDisabled}
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
      gap: theme.spacing[12],
      paddingTop: theme.spacing[8],
    },
    backButton: {
      flex: 1,
    },
    nextButton: {
      flex: 1,
    },
  });
}
