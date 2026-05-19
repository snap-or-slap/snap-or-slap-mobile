import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, Button } from '@ds/components';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';

type NumericStepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  error?: string;
  helperText?: string;
  allowManualInput?: boolean;
  testID?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function NumericStepper({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  error,
  helperText,
  allowManualInput = true,
  testID,
}: NumericStepperProps) {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [draftValue, setDraftValue] = useState(String(value));

  const displayValue = useMemo(() => String(value), [value]);
  const manualError = draftValue.trim() === ''
    ? undefined
    : Number.isInteger(Number(draftValue)) && Number(draftValue) >= min && Number(draftValue) <= max
      ? undefined
      : `${label} must be between ${min} and ${max}.`;
  const visibleError = error ?? manualError;

  const commitManualValue = () => {
    const parsed = Number(draftValue);
    if (!Number.isInteger(parsed)) {
      setDraftValue(displayValue);
      return;
    }

    const next = clamp(parsed, min, max);
    setDraftValue(String(next));
    onChange(next);
  };

  const adjust = (delta: number) => {
    const next = clamp(value + delta, min, max);
    setDraftValue(String(next));
    onChange(next);
  };

  return (
    <View style={styles.root} testID={testID}>
      <View style={styles.labelRow}>
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
        {helperText ? (
          <AppText variant="caption" style={styles.helper}>
            {helperText}
          </AppText>
        ) : null}
      </View>

      <View style={styles.controlRow}>
        <Button
          title="-"
          variant="secondary"
          size="md"
          disabled={value <= min}
          onPress={() => adjust(-step)}
          style={styles.stepButton}
          accessibilityLabel={`Decrease ${label}`}
          testID={`${testID ?? 'numeric-stepper'}-decrease`}
        />
        {allowManualInput ? (
          <TextInput
            value={draftValue}
            onChangeText={setDraftValue}
            onBlur={commitManualValue}
            onSubmitEditing={commitManualValue}
            keyboardType="number-pad"
            placeholder={displayValue}
            placeholderTextColor={theme.colors.text.tertiary}
            style={[styles.input, visibleError && styles.inputError]}
            testID={`${testID ?? 'numeric-stepper'}-input`}
          />
        ) : (
          <View style={styles.valueBox}>
            <AppText variant="title" style={styles.valueText}>
              {displayValue}
            </AppText>
          </View>
        )}
        <Button
          title="+"
          variant="secondary"
          size="md"
          disabled={value >= max}
          onPress={() => adjust(step)}
          style={styles.stepButton}
          accessibilityLabel={`Increase ${label}`}
          testID={`${testID ?? 'numeric-stepper'}-increase`}
        />
      </View>

      {visibleError ? (
        <AppText variant="caption" style={styles.errorText}>
          {visibleError}
        </AppText>
      ) : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      gap: theme.spacing[8],
    },
    labelRow: {
      gap: theme.spacing[4],
    },
    label: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    helper: {
      color: theme.colors.text.tertiary,
    },
    controlRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing[8],
    },
    stepButton: {
      width: 48,
    },
    input: {
      flex: 1,
      minHeight: 48,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing[16],
      paddingVertical: theme.spacing[12],
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      color: theme.colors.text.primary,
      fontSize: theme.typography.body.large.fontSize,
      textAlign: 'center',
      fontWeight: '700',
    },
    inputError: {
      borderColor: theme.colors.border.error,
    },
    valueBox: {
      flex: 1,
      minHeight: 48,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.bg.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    valueText: {
      color: theme.colors.text.primary,
      fontWeight: '800',
    },
    errorText: {
      color: theme.colors.text.error,
      fontWeight: '500',
    },
  });
}
