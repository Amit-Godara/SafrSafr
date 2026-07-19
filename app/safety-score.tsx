import React from 'react';
import { useRouter } from 'expo-router';
import { SafetyScoreScreen } from '@screens/SafetyScoreScreen';

export default function SafetyScore() {
  const router = useRouter();
  return <SafetyScoreScreen onBack={() => router.back()} onAskAI={() => {}} />;
}
