import React from 'react';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '@screens/auth/OnboardingScreen';

export default function Onboarding() {
  const router = useRouter();
  const goToAuth = () => router.replace('/(auth)/login');
  return <OnboardingScreen onDone={goToAuth} onSkip={goToAuth} />;
}
