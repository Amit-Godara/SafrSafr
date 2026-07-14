import React from 'react';
import { Stack } from 'expo-router';
import { colors } from '@constants/index';

/** Auth stack — login / register / forgot-password. */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
