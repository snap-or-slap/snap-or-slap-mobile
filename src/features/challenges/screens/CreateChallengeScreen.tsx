import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AppText, Button, Card, Screen } from '@ds/components';
import { ArrowCircleLeftIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import type { AppTheme } from '@ds/theme';
import { AppHeader, IconButton } from '@shared/components';
import type { CreateChallengeFormValues, CreateChallengeStep } from '../types/createChallenge.types';
import { CREATE_CHALLENGE_STEPS } from '../types/createChallenge.types';
import {
  mapBackendCreateChallengeErrors,
  validateCreateChallengeField,
  validateCreateChallengeStep,
  validateCreateChallengeFull,
} from '../utils/createChallengeValidation';
import { mapFormToCreatePayload } from '../utils/createChallengeMapper';
import { CreateChallengeStepHeader } from '../components/CreateChallengeStepHeader';
import { CreateChallengeFooter } from '../components/CreateChallengeFooter';
import { CreateChallengeFriendPicker } from '../components/CreateChallengeFriendPicker';
import { CreateChallengeReviewCard } from '../components/CreateChallengeReviewCard';
import { ChallengeInfoCard } from '../components/ChallengeInfoCard';
import { NumericStepper } from '../components/NumericStepper';
import type { FriendOption } from '../data/challenges.mock';
import { challengesService } from '../services/challenges.service';
import { friendsService } from '@features/friends/services';
import { ApiError } from '@services/api';

type CreateChallengeScreenProps = {
  onBack?: () => void;
  onCreated?: (challengeId: string) => void;
};

const INITIAL_VALUES: CreateChallengeFormValues = {
  title: '',
  description: '',
  taskInstruction: '',
  coverUrl: '',
  durationDays: 14,
  frequency: 'daily',
  frequencyDays: [],
  resetTime: '05:00',
  startAt: null,
  totalHearts: 3,
  maxMembers: 10,
  isPrivate: false,
  invitedFriendIds: [],
};

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

type PickerState =
  | { field: 'startAt'; mode: 'date' | 'time' | 'datetime' }
  | { field: 'resetTime'; mode: 'time' }
  | null;

function formatTimeValue(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function dateFromResetTime(resetTime: string): Date {
  const [hours = '5', minutes = '0'] = resetTime.split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
}

function formatStartAt(date: Date | null): string {
  if (!date) return 'Choose start date and time';
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
  const [friends, setFriends] = useState<FriendOption[]>([]);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<CreateChallengeStep[]>([]);
  const [pickerState, setPickerState] = useState<PickerState>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const validFriendIds = friends.map((friend) => friend.id);

  const patchValues = (patch: Partial<CreateChallengeFormValues>) => {
    const nextValues = { ...values, ...patch };
    setValues(nextValues);
    setSubmitError(null);

    const clearedKeys = Object.keys(patch) as Array<keyof CreateChallengeFormValues>;
    setFieldErrors((prev) => {
      const next = { ...prev };
      clearedKeys.forEach((field) => {
        const error = validateCreateChallengeField(field, nextValues, validFriendIds);
        if (error) {
          next[field] = error;
        } else {
          delete next[field];
        }
      });
      return next;
    });
    setCompletedSteps((prev) =>
      prev.filter((step) => validateCreateChallengeStep(step, nextValues, validFriendIds).isValid),
    );
  };

  const loadFriends = useCallback(async () => {
    setIsLoadingFriends(true);
    try {
      const response = await friendsService.listFriends({ limit: 50 });
      setFriends(
        response.friends.map((friend) => ({
          id: friend.id,
          name: friend.displayName || friend.username,
          username: friend.username,
        })),
      );
    } catch {
      setFriends([]);
    } finally {
      setIsLoadingFriends(false);
    }
  }, []);

  useEffect(() => {
    void loadFriends();
  }, [loadFriends]);

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
    const { isValid, errors } = validateCreateChallengeStep(currentStep, values, validFriendIds);
    if (!isValid) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      setCompletedSteps((prev) => prev.filter((step) => step !== currentStep));
      return;
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      Object.keys(errors).forEach((field) => delete next[field as keyof CreateChallengeFormValues]);
      return next;
    });
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));

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

  const handleSubmit = async () => {
    const { isValid, errors } = validateCreateChallengeFull(values, validFriendIds);
    if (!isValid) {
      setFieldErrors(errors);
      setSubmitError('Please fix all errors before creating the challenge.');
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      const payload = mapFormToCreatePayload(values);
      const response = await challengesService.createChallenge<{
        challenge?: { id?: string };
      }>(payload);
      const createdId = response.challenge?.id;
      if (!createdId) {
        throw new Error('Challenge was created but the response did not include an id.');
      }
      onCreated?.(createdId);
    } catch (error) {
      if (error instanceof ApiError) {
        const mapped = mapBackendCreateChallengeErrors(error);
        if (Object.keys(mapped.fieldErrors).length) {
          setFieldErrors((prev) => ({ ...prev, ...mapped.fieldErrors }));
        }
        setSubmitError(mapped.formError);
      } else {
        setSubmitError('Could not create the challenge. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed' || !pickerState) {
      setPickerState(null);
      return;
    }

    if (!selectedDate) return;

    if (pickerState.field === 'resetTime') {
      patchValues({ resetTime: formatTimeValue(selectedDate) });
      if (Platform.OS !== 'ios') setPickerState(null);
      return;
    }

    if (pickerState.mode === 'datetime') {
      patchValues({ startAt: selectedDate });
      return;
    }

    if (pickerState.mode === 'date') {
      const base = values.startAt ?? new Date();
      const next = new Date(base);
      next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      if (Platform.OS === 'android') {
        patchValues({ startAt: next });
        setPickerState({ field: 'startAt', mode: 'time' });
      } else {
        patchValues({ startAt: next });
      }
      return;
    }

    const base = values.startAt ?? new Date();
    const next = new Date(base);
    next.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
    patchValues({ startAt: next });
    setPickerState(null);
  };

  const isLastStep = currentStep === 'invite';
  const stepIndex = CREATE_CHALLENGE_STEPS.indexOf(currentStep);
  const isFirstStep = stepIndex === 0;
  const currentStepHasErrors = Object.keys(
    validateCreateChallengeStep(currentStep, values, validFriendIds).errors,
  ).some((field) => Boolean(fieldErrors[field as keyof CreateChallengeFormValues]));

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
        <View style={styles.topHeader}>
          <AppHeader
            title="Create Challenge"
            leftAction={
              onBack ? (
                <IconButton
                  accessibilityLabel="Cancel create challenge"
                  onPress={onBack}
                  icon={<ArrowCircleLeftIcon size={26} color={theme.colors.text.brand} variant="outline" />}
                  testID="create-challenge-back-button"
                />
              ) : undefined
            }
            testID="create-challenge-header"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Step header ── */}
          <View style={styles.stepHeaderWrap}>
            <CreateChallengeStepHeader
              currentStep={currentStep}
              completedSteps={completedSteps}
              fieldErrors={fieldErrors}
            />
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
                setPickerState={setPickerState}
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
                friends={friends}
                isLoadingFriends={isLoadingFriends}
                errors={fieldErrors}
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
                friends={friends}
              />
            </View>
          ) : null}

          {/* ── Error message ── */}
          {submitError ? (
            <ChallengeInfoCard variant="error" message={submitError} testID="create-challenge-submit-error" />
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
              nextDisabled={isLoading || currentStepHasErrors}
            />
          </View>
        </ScrollView>
        {pickerState ? (
          <View style={Platform.OS === 'ios' ? styles.iosPickerPanel : undefined}>
            <DateTimePicker
              value={
                pickerState.field === 'resetTime'
                  ? dateFromResetTime(values.resetTime)
                  : values.startAt ?? new Date()
              }
              mode={pickerState.mode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={pickerState.field === 'startAt' && pickerState.mode !== 'time' ? new Date() : undefined}
              onChange={handleDateTimeChange}
            />
            {Platform.OS === 'ios' ? (
              <View style={styles.iosPickerActions}>
                <Button
                  title="Done"
                  variant="primary"
                  size="md"
                  onPress={() => setPickerState(null)}
                  fullWidth
                />
              </View>
            ) : null}
          </View>
        ) : null}
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
        error={errors.description}
        multiline
        styles={styles}
        theme={theme}
        testID="input-description"
      />
      <FieldInput
        label="Cover image URL"
        value={values.coverUrl ?? ''}
        onChangeText={(v) => patchValues({ coverUrl: v })}
        placeholder="https://example.com/cover.jpg"
        error={errors.coverUrl}
        helperText="Paste an image URL to customize your challenge cover."
        styles={styles}
        theme={theme}
        testID="input-cover-url"
      />
      <FieldInput
        label="Task instruction"
        value={values.taskInstruction ?? ''}
        onChangeText={(v) => patchValues({ taskInstruction: v })}
        placeholder="What must members do each step?"
        error={errors.taskInstruction}
        multiline
        styles={styles}
        theme={theme}
        testID="input-task-instruction"
      />
    </Card>
  );
}

type ScheduleStepProps = StepProps & {
  setPickerState: (state: PickerState) => void;
};

function ScheduleStep({ values, errors, patchValues, styles, theme, setPickerState }: ScheduleStepProps) {
  const toggleFrequencyDay = (day: number) => {
    const current = values.frequencyDays;
    patchValues({
      frequencyDays: current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day].sort((a, b) => a - b),
    });
  };

  return (
    <>
      <Card style={styles.card}>
          <DateTimeField
          label="Start date/time"
          value={formatStartAt(values.startAt)}
          helperText="Optional. If set, the challenge starts at this time."
          error={errors.startAt}
          onPress={() => setPickerState({ field: 'startAt', mode: Platform.OS === 'ios' ? 'datetime' : 'date' })}
          styles={styles}
        />
        <View style={styles.twoColumn}>
          <DateTimeField
            label="Reset time *"
            value={values.resetTime}
            error={errors.resetTime}
            onPress={() => setPickerState({ field: 'resetTime', mode: 'time' })}
            styles={styles}
          />
          <NumericStepper
            label="Duration"
            value={values.durationDays}
            min={1}
            max={365}
            step={1}
            helperText="1-365 days"
            error={errors.durationDays}
            onChange={(durationDays) => patchValues({ durationDays })}
            testID="input-duration-days"
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText variant="label" style={styles.inputLabel}>
            Frequency *
          </AppText>
          <View style={styles.segmentRow}>
            <Button
              title="Daily"
              variant={values.frequency === 'daily' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => patchValues({ frequency: 'daily', frequencyDays: [] })}
              style={styles.segmentButton}
              testID="frequency-daily"
            />
            <Button
              title="Custom"
              variant={values.frequency === 'custom' ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => patchValues({ frequency: 'custom', frequencyDays: values.frequencyDays })}
              style={styles.segmentButton}
              testID="frequency-custom"
            />
          </View>
          {values.frequency === 'custom' ? (
            <View style={styles.weekdayRow}>
              {WEEKDAY_OPTIONS.map((day) => {
                const selected = values.frequencyDays.includes(day.value);
                return (
                  <Button
                    key={day.value}
                    title={day.label}
                    variant={selected ? 'primary' : 'secondary'}
                    size="sm"
                    onPress={() => toggleFrequencyDay(day.value)}
                    style={styles.weekdayButton}
                    testID={`frequency-day-${day.value}`}
                  />
                );
              })}
            </View>
          ) : null}
          {errors.frequency || errors.frequencyDays ? (
            <AppText variant="caption" style={styles.errorText}>
              {errors.frequency ?? errors.frequencyDays}
            </AppText>
          ) : null}
        </View>
      </Card>
      <ChallengeInfoCard
        variant="info"
        message="At reset time, the group is evaluated for the current cycle. Missing a cycle costs 1 heart."
      />
    </>
  );
}

function RulesStep({ values, errors, patchValues, styles, theme }: StepProps) {
  return (
    <>
      <Card style={styles.card}>
        <NumericStepper
          label="Total hearts"
          value={values.totalHearts}
          min={1}
          max={99}
          helperText="1-99 hearts"
          error={errors.totalHearts}
          onChange={(totalHearts) => patchValues({ totalHearts })}
          testID="input-total-hearts"
        />
        <NumericStepper
          label="Max members"
          value={values.maxMembers}
          min={2}
          max={50}
          helperText="2-50 members"
          error={errors.maxMembers}
          onChange={(maxMembers) => patchValues({ maxMembers })}
          testID="input-max-members"
        />
        <View style={styles.inputGroup}>
          <AppText variant="label" style={styles.inputLabel}>
            Privacy
          </AppText>
          <View style={styles.segmentRow}>
            <Button
              title="Public"
              variant={!values.isPrivate ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => patchValues({ isPrivate: false })}
              style={styles.segmentButton}
              testID="privacy-public"
            />
            <Button
              title="Private"
              variant={values.isPrivate ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => patchValues({ isPrivate: true })}
              style={styles.segmentButton}
              testID="privacy-private"
            />
          </View>
        </View>
      </Card>
      <ChallengeInfoCard
        variant="warning"
        message="If anyone in the squad misses a cycle at reset time, the whole squad loses 1 heart. Reach 0 hearts and the challenge ends."
      />
    </>
  );
}

type InviteStepProps = StepProps & {
  friends: FriendOption[];
  isLoadingFriends: boolean;
};

function InviteStep({
  values,
  patchValues,
  friends,
  isLoadingFriends,
  errors,
  styles,
  theme,
}: InviteStepProps) {
  const selectedCount = values.invitedFriendIds.length;
  const remainingSlots = Math.max(0, values.maxMembers - 1);

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.inviteHeader}>
          <AppText variant="subtitle" style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Invite friends
          </AppText>
          {selectedCount > 0 ? (
            <AppText variant="caption" style={{ color: theme.colors.text.brand, fontWeight: '700' }}>
              {selectedCount}/{remainingSlots} selected
            </AppText>
          ) : null}
        </View>
        <AppText variant="caption" style={styles.helperText}>
          Choose exactly who receives an invitation. The host uses one slot, so {remainingSlots} invite slots remain.
        </AppText>
        <CreateChallengeFriendPicker
          friends={friends}
          selectedIds={values.invitedFriendIds}
          onToggle={(id) => {
            const current = values.invitedFriendIds;
            if (!current.includes(id) && current.length >= remainingSlots) {
              patchValues({ invitedFriendIds: current });
              return;
            }
            patchValues({
              invitedFriendIds: current.includes(id)
                ? current.filter((fid) => fid !== id)
                : [...current, id],
            });
          }}
        />
        {isLoadingFriends ? (
          <AppText variant="caption" style={{ color: theme.colors.text.tertiary }}>
            Loading friends...
          </AppText>
        ) : null}
        {errors.invitedFriendIds ? (
          <AppText variant="caption" style={styles.errorText}>
            {errors.invitedFriendIds}
          </AppText>
        ) : null}
      </Card>
      <ChallengeInfoCard
        variant="info"
        message="You can invite friends now or skip and share the challenge link later."
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
  helperText?: string;
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
  helperText,
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
      ) : helperText ? (
        <AppText variant="caption" style={styles.helperText}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

function DateTimeField({
  label,
  value,
  onPress,
  error,
  helperText,
  styles,
}: {
  label: string;
  value: string;
  onPress: () => void;
  error?: string;
  helperText?: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.inputGroup}>
      <AppText variant="label" style={styles.inputLabel}>
        {label}
      </AppText>
      <Button
        title={value}
        variant="secondary"
        size="md"
        onPress={onPress}
        style={[styles.dateButton, error && styles.dateButtonError]}
        textStyle={styles.dateButtonText}
      />
      {error ? (
        <AppText variant="caption" style={styles.errorText}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" style={styles.helperText}>
          {helperText}
        </AppText>
      ) : null}
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
    },
    scrollContent: {
      paddingHorizontal: theme.spacing[24],
      paddingBottom: 100,
      gap: theme.spacing[16],
    },
    stepHeaderWrap: {
      marginBottom: theme.spacing[4],
    },
    stepContent: {
      gap: theme.spacing[12],
    },
    card: {
      padding: theme.spacing[16],
      gap: theme.spacing[16],
    },
    twoColumn: {
      flexDirection: 'row',
      gap: theme.spacing[12],
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
      gap: theme.spacing[8],
    },
    inputLabel: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    input: {
      minHeight: 48,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing[16],
      paddingVertical: theme.spacing[12],
      backgroundColor: theme.colors.bg.surface,
      borderWidth: 1,
      borderColor: theme.colors.border.subtle,
      color: theme.colors.text.primary,
      fontSize: theme.typography.body.large.fontSize,
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
    helperText: {
      color: theme.colors.text.tertiary,
      lineHeight: 18,
    },
    dateButton: {
      alignSelf: 'stretch',
    },
    dateButtonError: {
      borderColor: theme.colors.border.error,
    },
    dateButtonText: {
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    segmentRow: {
      flexDirection: 'row',
      gap: theme.spacing[8],
    },
    segmentButton: {
      flex: 1,
    },
    weekdayRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing[8],
    },
    weekdayButton: {
      minWidth: 62,
    },
    reviewWrap: {
      gap: theme.spacing[8],
    },
    reviewTitle: {
      color: theme.colors.text.secondary,
      fontWeight: '700',
    },
    footerWrap: {
      marginTop: theme.spacing[8],
    },
    iosPickerPanel: {
      backgroundColor: theme.colors.bg.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.subtle,
      paddingBottom: theme.spacing[16],
    },
    iosPickerActions: {
      paddingHorizontal: theme.spacing[24],
    },
  });
}
