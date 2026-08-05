import React from 'react';
import { useRouter } from 'expo-router';
import { EmergencyContactsScreen } from '@screens/EmergencyContactsScreen';

export default function EmergencyContactsRoute() {
  const router = useRouter();

  return (
    <EmergencyContactsScreen
      onBack={() => router.back()}
    />
  );
}