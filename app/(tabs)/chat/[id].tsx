import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PersonChatScreen } from '@screens/PersonChatScreen';

export default function PersonChatRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  return <PersonChatScreen travelerId={id} onBack={() => router.back()} />;
}