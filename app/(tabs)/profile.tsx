import React from 'react';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '@screens/ProfileScreen';

export default function ProfileTab() {
  const router = useRouter();

  return (
    <ProfileScreen
<<<<<<< HEAD
      onMyTrips={() => {}} // TODO: build My Trips screen
      onEmergencyContacts={() => {}} // TODO: build Emergency Contacts screen
      onSettings={() => {}} // TODO: build Settings screen
=======
      onMyTrips={() => router.push('/my-trips')}
      onEmergencyContacts={() => router.push('/emergency-contacts')}
      onSettings={() => router.push('/settings')}
>>>>>>> 60a96b4 (feat(profile) implemented setting page of profile)
      onPrivacy={() => {}} // TODO: build Privacy screen
      onHelp={() => {}} // TODO: build Help screen
      onLogout={() => router.replace('/')}
    />
  );
}