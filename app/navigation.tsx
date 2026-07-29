import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NavigationScreen } from '@screens/NavigationScreen';
import type { RouteType } from '@screens/RoutePlannerScreen';

export default function NavigationRoute() {
  const { type, source, destination } = useLocalSearchParams<{
    type: RouteType;
    source?: string;
    destination?: string;
  }>();
  const router = useRouter();

  return (
    <NavigationScreen
      type={type ?? 'safest'}
      source={source}
      destination={destination}
      onEnd={() => router.back()}
    />
  );
}