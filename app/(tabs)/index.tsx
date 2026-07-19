import React from 'react';
import { useRouter } from 'expo-router';
import { HomeScreen } from '@screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();
  return (
    <HomeScreen
      onQuickAction={(key) => {
        if (key === 'score') router.push('/safety-score');
      }}
    />
  );
}
