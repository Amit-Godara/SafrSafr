import React from 'react';
import { useRouter } from 'expo-router';
import { HomeScreen } from '@screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();

  return (
    <HomeScreen
      onAIAgentPress={() => router.push('/ai-assistant')} // TODO: swap to merged Agent+Chat screen (Step 2)
      onActivateSOS={() => router.push('/sos')}
      onPlanRoute={() => router.push('/route-planner')}
      onNearbyTravelersPress={() => router.push('/nearby-travelers')}
      onNotificationsPress={() => {}} // TODO: build Notifications screen
      onSettingsPress={() => {}} // TODO: build Settings screen
    />
  );
}