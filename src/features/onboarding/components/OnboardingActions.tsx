import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@ds/components';
import { ArrowCircleRightIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';

interface OnboardingActionsProps {
  primaryLabel: string;
  secondaryLabel?: string;
  showRightArrow?: boolean;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

export function OnboardingActions({
  primaryLabel,
  secondaryLabel,
  showRightArrow = false,
  onPrimaryPress,
  onSecondaryPress,
}: OnboardingActionsProps) {
  const theme = useTheme();
  const brandColor = theme.colors?.text?.brand ?? '#A83900';

  return (
    <View style={styles.container}>
      <Button
        intent="primary"
        variant="solid"
        size="lg"
        fullWidth
        title={primaryLabel}
        rightIcon={
          showRightArrow ? (
            <ArrowCircleRightIcon variant="bold" size={20} color="#FFFFFF" />
          ) : undefined
        }
        onPress={onPrimaryPress}
        testID="onboarding-primary-button"
      />

      {secondaryLabel && onSecondaryPress && (
        <Button
          intent="subtle"
          variant="ghost"
          size="md"
          fullWidth
          title={secondaryLabel}
          onPress={onSecondaryPress}
          testID="onboarding-secondary-button"
          textStyle={{ color: brandColor, fontWeight: '600' }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    gap: 4,
  },
});
