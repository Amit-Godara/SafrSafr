import React from 'react';
import { useRouter } from 'expo-router';
import { HomeScreen } from '@screens/HomeScreen';

export default function HomeTab() {
  const router = useRouter();

  return (
    <HomeScreen
      onAIAgentPress={() => router.push('/ai-assistant')} // TODO: swap to merged Agent+Chat screen (Step 2)
      onActivateSOS={() => {}} // TODO: build dedicated SOS flow (Step 3)
      onPlanRoute={() => {}} // TODO: build Plan Route screen (Step 3)
      onNearbyTravelersPress={() => {}} // TODO: build Nearby Travelers screen (Step 3)
      onNotificationsPress={() => {}} // TODO: build Notifications screen (Step 3)
      onSettingsPress={() => {}} // TODO: build Settings screen (Step 3)
    />
  );
}