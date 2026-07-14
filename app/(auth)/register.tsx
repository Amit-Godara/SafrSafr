import React from 'react';
import { useRouter } from 'expo-router';
import { RegisterScreen } from '@screens/auth/RegisterScreen';

export default function Register() {
  const router = useRouter();
  return (
    <RegisterScreen
      onRegister={() => router.replace('/(tabs)')}
      onGoogle={() => router.replace('/(tabs)')}
      onLogin={() => router.back()}
      onBack={() => router.back()}
    />
  );
}
