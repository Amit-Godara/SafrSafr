import React from 'react';
import { useRouter } from 'expo-router';
import { MyTripsScreen } from '@screens/MyTripsScreen';

export default function MyTripsRoute() {
  const router = useRouter();

  return (
    <MyTripsScreen
      onBack={() => router.back()}
      onNavigateRoute={(route) =>
        router.push({
          pathname: '/navigation',
          params: {
            type: 'safest',
            source: route.source,
            destination: route.destination,
          },
        })
      }
    />
  );
}