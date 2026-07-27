import React from 'react';
import { useRouter } from 'expo-router';
import { SOSScreen } from '@screens/SOSScreen';

export default function SOSRoute() {
  const router = useRouter();
  return <SOSScreen onClose={() => router.back()} />;
}