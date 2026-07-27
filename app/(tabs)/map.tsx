import React from 'react';
import { useRouter } from 'expo-router';
import { MapScreen } from '@screens/MapScreen';

export default function MapTab() {
  const router = useRouter();
  return <MapScreen onSOS={() => router.push('/sos')} />;
}