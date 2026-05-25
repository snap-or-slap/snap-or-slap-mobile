import { useEffect, useState } from 'react';
import { LoginScreen, RegisterScreen } from '../features/auth';

type AuthScreen = 'login' | 'register';

type AuthNavigatorProps = {
  initialScreen?: AuthScreen;
  onAuthSuccess: (nextStage?: 'profile' | 'permissions' | 'done' | 'checking') => void;
};

export function AuthNavigator({
  initialScreen = 'login',
  onAuthSuccess,
}: AuthNavigatorProps) {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(initialScreen);

  useEffect(() => {
    setCurrentScreen(initialScreen);
  }, [initialScreen]);

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegisterSuccess={() => {
          onAuthSuccess('profile');
        }}
        onNavigateLogin={() => setCurrentScreen('login')}
      />
    );
  }

  return (
    <LoginScreen
      onLoginSuccess={() => {
        onAuthSuccess('done');
      }}
      onNavigateRegister={() => setCurrentScreen('register')}
    />
  );
}