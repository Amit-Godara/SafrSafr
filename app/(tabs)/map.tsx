import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

function MapIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={light.primary}
        strokeWidth={1.6}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9 4.5v13M15 6.5v13" stroke={light.primary} strokeWidth={1.6} />
    </Svg>
  );
}

/** MapTab — placeholder until the Safe Routes / live map feature is built. */
export default function MapTab() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <View style={styles.iconWrap}>
        <MapIcon />
      </View>
      <ThemedText variant="title" color={light.textPrimary}>
        Map
      </ThemedText>
      <ThemedText variant="bodySm" color={light.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
        Live map & safe routes arrive here.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: light.background, alignItems: 'center', paddingHorizontal: 32 },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});