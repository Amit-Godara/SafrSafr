import React from 'react';
import { useRouter } from 'expo-router';
import { ChatListScreen } from '@screens/ChatListScreen';

export default function ChatListRoute() {
  const router = useRouter();
  return <ChatListScreen onOpenChat={(id) => router.push(`/(tabs)/chat/${id}`)} />;
}