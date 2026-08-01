import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { light } from '@constants/lightTheme';
import { TravelersProvider } from '../contexts/TravelersContext';
import { NotificationsProvider } from '../contexts/NotificationsContext';

/**
 * Root layout — providers + a headerless stack.
 * Flow: splash -> onboarding -> (auth) -> (tabs). Screens slide between each other.
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TravelersProvider>
          <NotificationsProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: light.background },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ animation: 'fade' }} />
              <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
              <Stack.Screen name="(auth)" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="safety-score" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="ai-assistant" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="sos" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="nearby-travelers" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="route-planner" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="navigation" options={{ animation: 'fade' }} />
              <Stack.Screen name="my-trips" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="emergency-contacts" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="privacy" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="old-notifications" options={{ animation: 'slide_from_right' }} />
            </Stack>
          </NotificationsProvider>
        </TravelersProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}