import React from 'react';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '@screens/ProfileScreen';

export default function ProfileTab() {
  const router = useRouter();

  return (
    <ProfileScreen
      onMyTrips={() => {}} // TODO: build My Trips screen
      onEmergencyContacts={() => {}} // TODO: build Emergency Contacts screen
      onSettings={() => {}} // TODO: build Settings screen
      onPrivacy={() => {}} // TODO: build Privacy screen
      onHelp={() => {}} // TODO: build Help screen
      onLogout={() => router.replace('/')}
    />
  );
}