import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText, Button, Screen } from '@ds/components';
import { ArrowCircleLeftIcon, FingerScanIcon, TickCircleIcon } from '@ds/icons';
import { useTheme } from '@ds/theme';
import { AuthTextField } from '../components/AuthTextField';
import { AuthAnimatedContainer } from '../components/AuthAnimatedContainer';

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
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();

  const isLengthValid = username.length >= 4 && username.length <= 20;
  const isCharValid = /^[a-z0-9_]*$/.test(username) && username.length > 0;
  const isUnique = username.length > 0; // Simulated
  const progressWidth = Math.min((username.length / 4) * 100, 100);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setPasswordError('Password does not match');
      return;
    }
    setPasswordError(undefined);
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    }, 1000);
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
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AppText variant="caption" color="secondary" style={styles.subtextBelow}>Must be at least 8 characters</AppText>

              <AuthTextField
                label="Password"
                placeholder="********"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <AuthTextField
                label="Comfirm Password"
                placeholder="Placeholder Text"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={passwordError}
              />

              <AuthTextField
                label="User Name"
                placeholder="huangfu-1204"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
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
                <CheckItem text="Is unique" checked={isUnique} />
              </View>

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
                disabled={isLoading}
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
