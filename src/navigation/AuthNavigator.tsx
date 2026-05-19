import React, { useState } from 'react';
import { LoginScreen, RegisterScreen } from '../features/auth';

interface AuthNavigatorProps {
  onAuthSuccess: (nextStage?: 'profile' | 'permissions' | 'done') => void;
}

export const AuthNavigator = ({ onAuthSuccess }: AuthNavigatorProps) => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  if (currentScreen === 'register') {
    return (
      <RegisterScreen 
        onBack={() => setCurrentScreen('login')}
        onNavigateLogin={() => setCurrentScreen('login')}
        onRegisterSuccess={() => {
          onAuthSuccess('profile');
        }}
      />
    );
  }

  return (
    <LoginScreen 
      onNavigateRegister={() => setCurrentScreen('register')}
      onLoginSuccess={() => onAuthSuccess('done')}
    />
  );
};
