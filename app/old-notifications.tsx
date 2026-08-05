import React from 'react';
import { useRouter } from 'expo-router';
import { OldNotificationsScreen } from '@screens/OldNotificationsScreen';

export default function OldNotificationsRoute() {
  const router = useRouter();
  return <OldNotificationsScreen onBack={() => router.back()} />;
}