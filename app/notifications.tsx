import React from 'react';
import { useRouter } from 'expo-router';
import { NotificationsScreen } from '../screens/NotificationsScreen';

export default function NotificationsRoute() {
  const router = useRouter();
  return (
    <NotificationsScreen
      onBack={() => router.back()}
      onViewOld={() => router.push('/old-notifications')}
    />
  );
}