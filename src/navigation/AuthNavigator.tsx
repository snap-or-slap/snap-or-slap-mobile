import React, { useState } from 'react';
import { LoginScreen, RegisterScreen } from '../features/auth';

interface AuthNavigatorProps {
  onAuthSuccess: () => void;
}

export const AuthNavigator = ({ onAuthSuccess }: AuthNavigatorProps) => {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('login');

  if (currentScreen === 'register') {
    return (
      <RegisterScreen 
        onBack={() => setCurrentScreen('login')}
        onNavigateLogin={() => setCurrentScreen('login')}
        onRegisterSuccess={() => {
          // Typically registration logs you in or takes you to login
          onAuthSuccess(); 
        }}
      />
    );
  }

  return (
    <LoginScreen 
      onNavigateRegister={() => setCurrentScreen('register')}
      onLoginSuccess={() => onAuthSuccess()}
    />
  );
};