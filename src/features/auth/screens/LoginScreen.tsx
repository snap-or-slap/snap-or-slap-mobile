import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText, Button, Screen } from '@ds/components';
import { ArrowCircleLeftIcon, EyeIcon, EyeSlashIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import { ApiError } from '@services/api';
import { AuthTextField } from '../components/AuthTextField';
import { AuthAnimatedContainer } from '../components/AuthAnimatedContainer';
import { useLoginMutation } from '@store/api/authApi';

interface LoginScreenProps {
  onBack?: () => void;
  onLoginSuccess?: () => void;
  onNavigateRegister?: () => void;
}

export function LoginScreen({ onBack, onLoginSuccess, onNavigateRegister }: LoginScreenProps) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (isLoading) return;

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(undefined);

    try {
      await login({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();
      onLoginSuccess?.();
    } catch (err) {
      // RTK Query wraps errors — extract the original error from .data
      const originalError = (err as { data?: unknown })?.data ?? err;
      setError(getLoginErrorMessage(originalError));
    }
  };

  return (
    <Screen style={styles.container} safeArea="top">
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <AuthAnimatedContainer>
            {/* Header */}
            <View style={styles.header}>
              {onBack && (
                <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={8}>
                  <ArrowCircleLeftIcon size={24} color={theme.colors.text.brand} />
                </TouchableOpacity>
              )}
              <AppText variant="heading" style={{ color: theme.colors.text.brand }}>Log in</AppText>
            </View>

            <View style={styles.formContainer}>
              <AuthTextField
                label="Email"
                placeholder="example@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AuthTextField
                label="Password"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                rightIcon={
                  showPassword ? (
                    <EyeSlashIcon size={20} color={theme.colors.icon.brand} />
                  ) : (
                    <EyeIcon size={20} color={theme.colors.icon.brand} />
                  )
                }
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={error}
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <AppText variant="caption" style={{ color: theme.colors.text.brand, fontWeight: '600' }}>
                  Forgot password?
                </AppText>
              </TouchableOpacity>

              <Button
                variant="primary"
                size="lg"
                title="Log in"
                fullWidth
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submitButton}
              />

              {/* <View style={styles.dividerContainer}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
                <AppText variant="caption" color="secondary" style={styles.dividerText}>
                  Or continue with
                </AppText>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.border.default }]} />
              </View>

              <Button
                variant="secondary"
                size="lg"
                title="Google"
                fullWidth
                onPress={() => {}}
                disabled={isLoading}
                style={[styles.googleButton, {borderColor: theme.colors.border.default }]}
                textStyle={{ color: theme.colors.text.brand }}
              /> */}

              <View style={styles.footerContainer}>
                <AppText variant="body" color="secondary">Don't have any account? </AppText>
                <TouchableOpacity onPress={onNavigateRegister}>
                  <AppText variant="body" style={{ color: theme.colors.text.brand, fontWeight: 'bold' }}>
                    Sign Up
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </AuthAnimatedContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function getLoginErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    const message = err.message.toLowerCase();

    if (err.status === 401 || message.includes('invalid')) {
      return 'Email or password is incorrect.';
    }

    if (err.status === 403 || message.includes('disabled') || message.includes('inactive')) {
      return 'This account is disabled. Contact support if you think this is a mistake.';
    }
  }

  if (err instanceof TypeError) {
    return 'Could not reach the server. Check your connection and try again.';
  }

  return 'Could not log in. Please try again.';
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
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
  googleButton: {
    marginBottom: 32,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 48,
  },
});
