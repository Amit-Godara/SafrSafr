import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

function ProfileIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={3.6} stroke={light.primary} strokeWidth={1.6} fill="none" />
      <Path
        d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2"
        stroke={light.primary}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

/** ProfileTab — placeholder until account & settings features are built. */
export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 24 }]}>
      <View style={styles.iconWrap}>
        <ProfileIcon />
      </View>
      <ThemedText variant="title" color={light.textPrimary}>
        Profile
      </ThemedText>
      <ThemedText variant="bodySm" color={light.textMuted} style={{ textAlign: 'center', marginTop: 6 }}>
        Your account & safety settings arrive here.
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