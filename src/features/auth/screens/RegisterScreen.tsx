import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText, Button, Screen } from '@ds/components';
import {
  ArrowCircleLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  TickCircleIcon,
} from '@ds/icons';
import { useTheme } from '@ds/theme';
import { ApiError } from '@services/api';
import { AuthTextField } from '../components/AuthTextField';
import { AuthAnimatedContainer } from '../components/AuthAnimatedContainer';
import { authService } from '../services';

interface RegisterScreenProps {
  onBack?: () => void;
  onRegisterSuccess?: () => void;
  onNavigateLogin?: () => void;
}

export function RegisterScreen({ onBack, onRegisterSuccess, onNavigateLogin }: RegisterScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | undefined>();
  const [checkingUsername, setCheckingUsername] = useState(false);

  const isLengthValid = username.length >= 4 && username.length <= 20;
  const isCharValid = /^[a-z0-9_]*$/.test(username) && username.length > 0;
  const isUnique = usernameAvailable === true;
  const progressWidth = Math.min((username.length / 4) * 100, 100);

  useEffect(() => {
    const normalized = username.trim().toLowerCase();
    setUsernameAvailable(undefined);
    setUsernameError(undefined);

    if (!isLengthValid || !isCharValid) {
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    const timeoutId = setTimeout(async () => {
      try {
        const result = await authService.checkUsername(normalized);
        (result.available);
        setUsernameError(result.available ? undefined : 'Username is already taken.');
      } catch {
        setUsernameAvailable(undefined);
      } finally {
        setCheckingUsername(false);
      }
    }, 350);setUsernameAvailable

    return () => clearTimeout(timeoutId);
  }, [isCharValid, isLengthValid, username]);

  const handleRegister = async () => {
    if (isLoading) return;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    setEmailError(undefined);
    setUsernameError(undefined);
    setPasswordError(undefined);
    setFormError(undefined);

    if (!normalizedEmail || !password || !confirmPassword || !normalizedUsername) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (!isLengthValid || !isCharValid) {
      setUsernameError('Username must be 4-20 lowercase letters, numbers, or underscores.');
      return;
    }

    if (usernameAvailable === false) {
      setUsernameError('Username is already taken.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Password does not match');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register({
        email: normalizedEmail,
        password,
        username: normalizedUsername,
      });
      onRegisterSuccess?.();
    } catch (err) {
      const nextErrors = getRegisterErrors(err);
      setEmailError(nextErrors.email);
      setUsernameError(nextErrors.username);
      setPasswordError(nextErrors.password);
      setFormError(nextErrors.form);
    } finally {
      setIsLoading(false);
    }
  };

  const CheckItem = ({ text, checked }: { text: string; checked: boolean }) => (
    <View style={styles.checkItem}>
      <View style={[
        styles.checkBox,
        {
          backgroundColor: checked ? theme.colors.text.brand : 'transparent',
          borderColor: checked ? theme.colors.text.brand : theme.colors.border.default,
          borderWidth: checked ? 0 : 1
        }
      ]}>
        {checked && <TickCircleIcon size={12} color={theme.colors.text['on-brand']} variant="bold" />}
      </View>
      <AppText variant="caption" style={{ color: checked ? theme.colors.text.brand : theme.colors.text.disabled, fontWeight: checked ? 'bold' : 'normal' }}>
        {text}
      </AppText>
    </View>
  );

  const PasswordVisibilityToggle = ({
    visible,
    onPress,
    label,
  }: {
    visible: boolean;
    onPress: () => void;
    label: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.passwordToggle}
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      accessibilityRole="button"
      accessibilityLabel={visible ? `Hide ${label}` : `Show ${label}`}
    >
      {visible ? (
        <EyeSlashIcon size={20} color={theme.colors.text.secondary} />
      ) : (
        <EyeIcon size={20} color={theme.colors.text.secondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container} safeArea="top">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <AuthAnimatedContainer>
            {/* Header */}
            <View style={styles.header}>
              {/* {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={8}>
                  <ArrowCircleLeftIcon size={24} color={theme.colors.text.brand} />
                </TouchableOpacity>
              )} */}
              <AppText variant="heading" style={{ color: theme.colors.text.brand }}>Register</AppText>
            </View>

            <View style={styles.formContainer}>
              <AuthTextField
                label="Email"
                placeholder="example@email.com"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setEmailError(undefined);
                  setFormError(undefined);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
              />
              <AppText variant="caption" color="secondary" style={styles.subtextBelow}>Must be at least 8 characters</AppText>

              <AuthTextField
                label="Password"
                placeholder="********"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  setPasswordError(undefined);
                  setFormError(undefined);
                }}
                secureTextEntry={!isPasswordVisible}
                rightIcon={
                  <PasswordVisibilityToggle
                    visible={isPasswordVisible}
                    onPress={() => setIsPasswordVisible((prev) => !prev)}
                    label="password"
                  />
                }
              />

              <AuthTextField
                label="Confirm Password"
                placeholder="********"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  setPasswordError(undefined);
                  setFormError(undefined);
                }}
                secureTextEntry={!isConfirmPasswordVisible}
                error={passwordError}
                rightIcon={
                  <PasswordVisibilityToggle
                    visible={isConfirmPasswordVisible}
                    onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                    label="confirm password"
                  />
                }
              />

              <AuthTextField
                label="User Name"
                placeholder="huangfu_1204"
                value={username}
                onChangeText={(value) => {
                  setUsername(value.toLowerCase());
                  setFormError(undefined);
                }}
                autoCapitalize="none"
                error={usernameError}
              />

              <View style={styles.validationSection}>
                <AppText variant="caption" color="secondary" style={styles.usernameSubtext}>
                  Friends will use this to find you
                </AppText>

                <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.border.subtle }]}>
                  <View style={[styles.progressBarFill, { backgroundColor: theme.colors.bg.success, width: `${progressWidth}%` }]} />
                </View>

                <CheckItem text="Must be 4-20 characters" checked={isLengthValid} />
                <CheckItem text="Only lowercase letters, numbers, and underscores" checked={isCharValid} />
                <CheckItem text={checkingUsername ? 'Checking availability' : 'Is unique'} checked={isUnique} />
              </View>

              {formError ? (
                <AppText variant="caption" style={{ color: theme.colors.text.error, marginBottom: 16, textAlign: 'center' }}>
                  {formError}
                </AppText>
              ) : null}

              <View style={styles.termsContainer}>
                <AppText variant="caption" color="secondary" style={styles.termsText}>
                  By continuing, you agree to our{' '}
                  <AppText variant="caption" style={styles.termsLink}>Terms</AppText>
                  {' '}and{' '}
                  <AppText variant="caption" style={styles.termsLink}>Privacy Policy</AppText>
                </AppText>
              </View>

              <Button
                variant="primary"
                size="lg"
                title="Create account"
                fullWidth
                onPress={handleRegister}
                loading={isLoading}
                disabled={isLoading || checkingUsername}
                style={styles.submitButton}
              />

              {/* <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
                <AppText variant="caption" color="secondary" style={styles.dividerText}>
                  Or continue with
                </AppText>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
              </View> */}

              {onNavigateLogin && (
                <View style={styles.footerContainer}>
                  <AppText variant="body" color="secondary">Already have an account? </AppText>
                  <TouchableOpacity onPress={onNavigateLogin}>
                    <AppText variant="body" style={{ color: theme.colors.text.brand, fontWeight: 'bold' }}>
                      Log in
                    </AppText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </AuthAnimatedContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function getRegisterErrors(err: unknown): {
  email?: string;
  username?: string;
  password?: string;
  form?: string;
} {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase();

    if (err.status === 409 || message.includes('already') || message.includes('taken') || message.includes('exists')) {
      if (message.includes('email')) return { email: 'Email is already registered.' };
      if (message.includes('username')) return { username: 'Username is already taken.' };
      return { form: 'Email or username is already in use.' };
    }

    if (Array.isArray(err.details)) {
      return err.details.reduce((errors, detail) => {
        if (!detail || typeof detail !== 'object') return errors;
        const item = detail as { field?: unknown; path?: unknown; message?: unknown };
        const field = String(item.field ?? item.path ?? '');
        const detailMessage = typeof item.message === 'string' ? item.message : 'Please check this field.';

        if (field.includes('email')) errors.email = detailMessage;
        else if (field.includes('username')) errors.username = detailMessage;
        else if (field.includes('password')) errors.password = detailMessage;
        else errors.form = detailMessage;

        return errors;
      }, {} as { email?: string; username?: string; password?: string; form?: string });
    }
  }

  if (err instanceof TypeError) {
    return { form: 'Could not reach the server. Check your connection and try again.' };
  }

  return { form: 'Could not create your account. Please try again.' };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  formContainer: {
    flex: 1,
  },
  subtextBelow: {
    marginTop: -8,
    marginBottom: 16,
    marginLeft: 8,
  },
  validationSection: {
    marginTop: -8,
    marginBottom: 24,
  },
  usernameSubtext: {
    marginLeft: 8,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  checkBox: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  termsText: {
    textAlign: 'center',
  },
  termsLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  submitButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 12,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
