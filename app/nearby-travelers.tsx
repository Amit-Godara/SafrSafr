import React from 'react';
import { useRouter } from 'expo-router';
import { NearbyTravelersScreen } from '@screens/NearbyTravelersScreen';

export default function NearbyTravelersRoute() {
  const router = useRouter();
  return (
    <NearbyTravelersScreen
      onBack={() => router.back()}
      onChatWithTraveler={(traveler) => router.push(`/(tabs)/chat/${traveler.id}`)}
    />
  );
}