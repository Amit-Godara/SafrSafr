import React from 'react';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '@screens/ProfileScreen';

export default function ProfileTab() {
  const router = useRouter();

  return (
    <ProfileScreen
      onMyTrips={() => router.push('/my-trips')}
      onEmergencyContacts={() => router.push('/emergency-contacts')}
      onSettings={() => router.push('/settings')}
      onPrivacy={() => router.push('/privacy')}
      onHelp={() => {}} // TODO: build Help screen
      onLogout={() => router.replace('/')}
    />
  );
}