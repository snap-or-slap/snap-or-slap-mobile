import React, { useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppText, Button, Card, Screen } from '@ds/components';
import { InfoCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import type { CreateChallengeFormValues, CreateChallengeStep } from '../types/createChallenge.types';
import { CREATE_CHALLENGE_STEPS } from '../types/createChallenge.types';
import { validateCreateChallengeStep, validateCreateChallengeFull } from '../utils/createChallengeValidation';
import { mapFormToCreatePayload } from '../utils/createChallengeMapper';
import { CreateChallengeStepHeader } from '../components/CreateChallengeStepHeader';
import { CreateChallengeFooter } from '../components/CreateChallengeFooter';
import { CreateChallengeFriendPicker } from '../components/CreateChallengeFriendPicker';
import { CreateChallengeReviewCard } from '../components/CreateChallengeReviewCard';
import { friendOptionsMock } from '../data/challenges.mock';

type CreateChallengeScreenProps = {
  onBack?: () => void;
  onCreated?: (challengeId: string) => void;
};

const INITIAL_VALUES: CreateChallengeFormValues = {
  title: '',
  description: '',
  taskInstruction: '',
  stepLengthDays: 1,
  resetTime: '05:00',
  startDate: '2026-05-25',
  endDate: '2026-06-07',
  totalHearts: 3,
  minMembers: 2,
  invitedFriendIds: [],
};

export function CreateChallengeScreen({
  onBack,
  onCreated,
}: CreateChallengeScreenProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [currentStep, setCurrentStep] = useState<CreateChallengeStep>('info');
  const [values, setValues] = useState<CreateChallengeFormValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateChallengeFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const patchValues = (patch: Partial<CreateChallengeFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    // Clear errors on change
    const clearedKeys = Object.keys(patch) as Array<keyof CreateChallengeFormValues>;
    if (clearedKeys.some((k) => fieldErrors[k])) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        clearedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const animateToNext = (onComplete: () => void) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete();
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    const { isValid, errors } = validateCreateChallengeStep(currentStep, values);
    if (!isValid) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    const stepIndex = CREATE_CHALLENGE_STEPS.indexOf(currentStep);
    const nextStep = CREATE_CHALLENGE_STEPS[stepIndex + 1];
    if (nextStep) {
      animateToNext(() => setCurrentStep(nextStep));
    }
  };

  const handleBack = () => {
    const stepIndex = CREATE_CHALLENGE_STEPS.indexOf(currentStep);
    if (stepIndex === 0) {
      onBack?.();
      return;
    }
    const prevStep = CREATE_CHALLENGE_STEPS[stepIndex - 1];
    animateToNext(() => setCurrentStep(prevStep));
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateCreateChallengeFull(values);
    if (!isValid) {
      setFieldErrors(errors);
      setSubmitError('Please fix all errors before creating the challenge.');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    // TODO: Replace with real API call using mapFormToCreatePayload(values)
    const payload = mapFormToCreatePayload(values);
    console.log('[CreateChallenge] Payload ready for backend:', payload);

    // Simulate async
    setTimeout(() => {
      setIsLoading(false);
      onCreated?.('formation-wake-up-9am');
    }, 800);
  };

  const isLastStep = currentStep === 'invite';
  const stepIndex = CREATE_CHALLENGE_STEPS.indexOf(currentStep);
  const isFirstStep = stepIndex === 0;

  return (
    <Screen
      testID="create-challenge-screen"
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Top header with Back ── */}
        <View style={styles.topHeader}>
          <Button
            title="Cancel"
            variant="ghost"
            size="sm"
            onPress={onBack}
            testID="create-challenge-back-button"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step header ── */}
          <View style={styles.stepHeaderWrap}>
            <CreateChallengeStepHeader currentStep={currentStep} />
          </View>

          {/* ── Step content ── */}
          <Animated.View
            style={[
              styles.stepContent,
              {
                opacity: slideAnim.interpolate({
                  inputRange: [-20, 0, 20],
                  outputRange: [0, 1, 0],
                }),
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {currentStep === 'info' && (
              <InfoStep
                values={values}
                errors={fieldErrors}
                patchValues={patchValues}
                styles={styles}
                theme={theme}
              />
            )}
            {currentStep === 'schedule' && (
              <ScheduleStep
                values={values}
                errors={fieldErrors}
                patchValues={patchValues}
                styles={styles}
                theme={theme}
              />
            )}
            {currentStep === 'rules' && (
              <RulesStep
                values={values}
                errors={fieldErrors}
                patchValues={patchValues}
                styles={styles}
                theme={theme}
              />
            )}
            {currentStep === 'invite' && (
              <InviteStep
                values={values}
                patchValues={patchValues}
                styles={styles}
                theme={theme}
              />
            )}
          </Animated.View>

          {/* ── Review card on last step ── */}
          {isLastStep ? (
            <View style={styles.reviewWrap}>
              <AppText variant="subtitle" style={styles.reviewTitle}>
                Review
              </AppText>
              <CreateChallengeReviewCard
                values={values}
                friends={friendOptionsMock}
              />
            </View>
          ) : null}

          {/* ── Error message ── */}
          {submitError ? (
            <AppText variant="caption" style={styles.submitError}>
              {submitError}
            </AppText>
          ) : null}

          {/* ── Footer ── */}
          <View style={styles.footerWrap}>
            <CreateChallengeFooter
              onBack={handleBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isLastStep={isLastStep}
              isLoading={isLoading}
              canGoBack={!isFirstStep || !!onBack}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// ─── Step sub-components ───────────────────────────────────────────────────────

type StepProps = {
  values: CreateChallengeFormValues;
  errors: Partial<Record<keyof CreateChallengeFormValues, string>>;
  patchValues: (patch: Partial<CreateChallengeFormValues>) => void;
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
};

function InfoStep({ values, errors, patchValues, styles, theme }: StepProps) {
  return (
    <Card style={styles.card}>
      <FieldInput
        label="Challenge name *"
        value={values.title}
        onChangeText={(v) => patchValues({ title: v })}
        placeholder="e.g. Wake Up 5AM"
        error={errors.title}
        styles={styles}
        theme={theme}
        testID="input-title"
      />
      <FieldInput
        label="Description"
        value={values.description ?? ''}
        onChangeText={(v) => patchValues({ description: v })}
        placeholder="What is this challenge about?"
        multiline
        styles={styles}
        theme={theme}
        testID="input-description"
      />
      <FieldInput
        label="Task instruction"
        value={values.taskInstruction ?? ''}
        onChangeText={(v) => patchValues({ taskInstruction: v })}
        placeholder="What must members do each step?"
        multiline
        styles={styles}
        theme={theme}
        testID="input-task-instruction"
      />
    </Card>
  );
}

function ScheduleStep({ values, errors, patchValues, styles, theme }: StepProps) {
  return (
    <>
      <Card style={styles.card}>
        <View style={styles.twoColumn}>
          <FieldInput
            label="Start date *"
            value={values.startDate}
            onChangeText={(v) => patchValues({ startDate: v })}
            placeholder="YYYY-MM-DD"
            error={errors.startDate}
            styles={styles}
            theme={theme}
            testID="input-start-date"
          />
          <FieldInput
            label="End date *"
            value={values.endDate}
            onChangeText={(v) => patchValues({ endDate: v })}
            placeholder="YYYY-MM-DD"
            error={errors.endDate}
            styles={styles}
            theme={theme}
            testID="input-end-date"
          />
        </View>
        <View style={styles.twoColumn}>
          <FieldInput
            label="Reset time *"
            value={values.resetTime}
            onChangeText={(v) => patchValues({ resetTime: v })}
            placeholder="HH:MM"
            error={errors.resetTime}
            styles={styles}
            theme={theme}
            testID="input-reset-time"
          />
          <FieldInput
            label="Days per step *"
            value={String(values.stepLengthDays)}
            onChangeText={(v) => patchValues({ stepLengthDays: Number(v) || 1 })}
            placeholder="1"
            keyboardType="number-pad"
            error={errors.stepLengthDays}
            styles={styles}
            theme={theme}
            testID="input-step-length"
          />
        </View>
      </Card>
      <InfoHint
        text="At reset time, the group is evaluated for the current step. Missing a step costs 1 heart."
        theme={theme}
        styles={styles}
      />
    </>
  );
}

function RulesStep({ values, errors, patchValues, styles, theme }: StepProps) {
  return (
    <>
      <Card style={styles.card}>
        <FieldInput
          label="Total hearts *"
          value={String(values.totalHearts)}
          onChangeText={(v) => patchValues({ totalHearts: Number(v) || 1 })}
          placeholder="3"
          keyboardType="number-pad"
          error={errors.totalHearts}
          styles={styles}
          theme={theme}
          testID="input-total-hearts"
        />
        <FieldInput
          label="Min. members to start *"
          value={String(values.minMembers)}
          onChangeText={(v) => patchValues({ minMembers: Number(v) || 2 })}
          placeholder="2"
          keyboardType="number-pad"
          error={errors.minMembers}
          styles={styles}
          theme={theme}
          testID="input-min-members"
        />
      </Card>
      <InfoHint
        text="If anyone in the squad misses a step at reset time, the whole squad loses 1 heart. Reach 0 hearts = Game Over."
        theme={theme}
        styles={styles}
      />
    </>
  );
}

type InviteStepProps = Omit<StepProps, 'errors'>;

function InviteStep({ values, patchValues, styles, theme }: InviteStepProps) {
  const selectedCount = values.invitedFriendIds.length;

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.inviteHeader}>
          <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Invite friends
          </AppText>
          {selectedCount > 0 ? (
            <AppText variant="caption" style={{ color: theme.colors.text.brand, fontWeight: '700' }}>
              {selectedCount} selected
            </AppText>
          ) : null}
        </View>
        <CreateChallengeFriendPicker
          friends={friendOptionsMock}
          selectedIds={values.invitedFriendIds}
          onToggle={(id) => {
            const current = values.invitedFriendIds;
            patchValues({
              invitedFriendIds: current.includes(id)
                ? current.filter((fid) => fid !== id)
                : [...current, id],
            });
          }}
        />
      </Card>
      <InfoHint
        text="You can invite friends now or skip and share the challenge link later."
        theme={theme}
        styles={styles}
      />
    </>
  );
}

// ─── Shared sub-components ───────────────────────────────────────────────────

type FieldInputProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
  styles: ReturnType<typeof createStyles>;
  theme: AppTheme;
  testID?: string;
};

function FieldInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  keyboardType = 'default',
  styles,
  theme,
  testID,
}: FieldInputProps) {
  return (
    <View style={styles.inputGroup}>
      <AppText variant="label" style={styles.inputLabel}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          !!error && styles.inputError,
        ]}
        testID={testID}
      />
      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

function InfoHint({
  text,
  theme,
  styles,
}: {
  text: string;
  theme: AppTheme;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.hintRow}>
      <InfoCircleIcon size={16} color={theme.colors.text.tertiary} variant="outline" />
      <AppText variant="caption" style={styles.hintText}>
        {text}
      </AppText>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    keyboardView: {
      flex: 1,
    },
    topHeader: {
      paddingHorizontal: theme.spacing[16],
      paddingTop: theme.spacing[8],
      paddingBottom: theme.spacing[4],
      alignItems: 'flex-start',
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 100,
      gap: 16,
    },
    stepHeaderWrap: {
      marginBottom: 4,
    },
    stepContent: {
      gap: 12,
    },
    card: {
      padding: 16,
      gap: 14,
    },
    twoColumn: {
      flexDirection: 'row',
      gap: 10,
    },
    inviteHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontWeight: '700',
    },
    inputGroup: {
      flex: 1,
      gap: 8,
    },
    inputLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    input: {
      minHeight: 48,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      color: theme.colors.text.primary,
      fontSize: 16,
    },
    inputMultiline: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    inputError: {
      borderColor: theme.colors.border.error,
    },
    errorText: {
      color: theme.colors.text.error,
      fontWeight: '500',
    },
    hintRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      paddingHorizontal: 4,
    },
    hintText: {
      color: theme.colors.text.tertiary,
      flex: 1,
      lineHeight: 18,
    },
    reviewWrap: {
      gap: 8,
    },
    reviewTitle: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    submitError: {
      color: theme.colors.text.error,
      textAlign: 'center',
    },
    footerWrap: {
      marginTop: 8,
    },
  });
}
