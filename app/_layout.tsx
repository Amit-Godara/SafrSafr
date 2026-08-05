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
 *
 * IMPORTANT: full-screen destinations (SOS, Settings, individual chat
 * conversations, etc.) live here at the root Stack level, NOT nested
 * inside (tabs)/. Anything nested inside a tab's own stack keeps the
 * bottom tab bar visible; anything pushed at this root level replaces
 * the whole screen with no tab bar, which is what apps like WhatsApp do
 * for an open conversation.
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
<<<<<<< HEAD
              <Stack.Screen name="conversation/[id]" options={{ animation: 'slide_from_right' }} />
=======
              <Stack.Screen
                name="conversation/[id]"
                options={{ animation: 'slide_from_right' }}
              />
>>>>>>> feature/profile
            </Stack>
          </NotificationsProvider>
        </TravelersProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}