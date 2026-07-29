import React from 'react';
import { useRouter } from 'expo-router';
import { MyTripsScreen } from '@screens/MyTripsScreen';

export default function MyTripsRoute() {
  const router = useRouter();
  return <MyTripsScreen onBack={() => router.back()} />;
}