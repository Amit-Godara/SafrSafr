// import React from 'react';
// import { View, ViewProps, StyleSheet } from 'react-native';
// import { light } from '@constants/lightTheme';

// export interface LightCardProps extends ViewProps {
//   children: React.ReactNode;
//   padding?: number;
// }

// /** LightCard — white rounded card matching the mockup (soft shadow, 20r). */
// export function LightCard({ children, padding = 16, style, ...rest }: LightCardProps) {
//   return (
//     <View style={[styles.card, { padding }, style]} {...rest}>
//       {children}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: light.surface,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: light.border,
//     shadowColor: '#0F172A',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 3,
//   },
// });

// export default LightCard;



import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export interface LightCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  intensity?: number;
}

/**
 * LightCard — reusable glassmorphism card.
 * Frosted-glass blur + soft border + shadow, tuned for the light theme.
 */
export function LightCard({ children, style, padding = 20, intensity = 40 }: LightCardProps) {
  return (
    <View style={[styles.wrap, style]}>
      <BlurView intensity={intensity} tint="light" style={StyleSheet.absoluteFillObject} />
      <View style={styles.tint} />
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'rgba(255,255,255,0.55)',
    ...Platform.select({
      ios: {
        shadowColor: '#4C3A8C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: { elevation: 3 },
    }),
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});

export default LightCard;