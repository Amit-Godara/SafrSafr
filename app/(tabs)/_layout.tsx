import React from 'react';
import { View } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { BottomNavigation } from '@components/navigation';
import { TABS } from '@navigation/tabs';
import { colors } from '@constants/index';

/**
 * Tab group layout.
 * Uses Expo Router <Tabs> for routing but renders the custom glass
 * BottomNavigation from the design system as the tab bar.
 */
export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeKey =
    TABS.find((t) => (t.key === 'index' ? pathname === '/' : pathname.includes(t.key)))?.key ?? 'index';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={() => (
          <BottomNavigation
            items={TABS}
            activeKey={activeKey}
            onChange={(key) => router.replace(key === 'index' ? '/(tabs)' : (`/(tabs)/${key}` as never))}
          />
        )}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="community" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}
