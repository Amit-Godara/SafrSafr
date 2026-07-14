import React from 'react';
import { useRouter } from 'expo-router';
import { LoginScreen } from '@screens/auth/LoginScreen';

export default function Login() {
  const router = useRouter();
  return (
    <LoginScreen
      onLogin={() => router.replace('/(tabs)')}
      onGoogle={() => router.replace('/(tabs)')}
      onForgot={() => router.push('/(auth)/forgot-password')}
      onRegister={() => router.push('/(auth)/register')}
      onBack={() => router.replace('/onboarding')}
    />
  );
}
