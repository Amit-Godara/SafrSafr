import React from 'react';
import { useRouter } from 'expo-router';
import { SplashScreen } from '@screens/auth/SplashScreen';

/**
 * Entry route — animated splash, then advances to onboarding.
 * (No persisted state yet; wiring "seen onboarding" comes with backend.)
 */
export default function Index() {
  const router = useRouter();
  return <SplashScreen onFinish={() => router.replace('/onboarding')} />;
}
