import React from 'react';
import { useRouter } from 'expo-router';
import { RoutePlannerScreen, type RouteType } from '@screens/RoutePlannerScreen';

export default function RoutePlannerRoute() {
  const router = useRouter();
  return (
    <RoutePlannerScreen
      onBack={() => router.back()}
      onViewRoute={(type: RouteType, source: string, destination: string) =>
        router.push({
          pathname: '/navigation',
          params: { type, source, destination },
        })
      }
    />
  );
}