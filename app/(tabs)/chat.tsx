import React from 'react';
import { useRouter } from 'expo-router';
import { ChatListScreen } from '@screens/ChatListScreen';

export default function ChatTab() {
  const router = useRouter();
  return <ChatListScreen onOpenChat={(id) => router.push(`/conversation/${id}`)} />;
}