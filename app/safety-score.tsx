// import React from 'react';
// import { useRouter } from 'expo-router';
// import { SafetyScoreScreen } from '@screens/SafetyScoreScreen';

// export default function SafetyScore() {
//   const router = useRouter();
//   return <SafetyScoreScreen onBack={() => router.back()} onAskAI={() => {}} />;
// }


import { SafetyScoreScreen } from '@screens/SafetyScoreScreen';
import { useRouter } from 'expo-router';

export default function SafetyScoreRoute() {
  const router = useRouter();
  return <SafetyScoreScreen onBack={() => router.back()} />;
}