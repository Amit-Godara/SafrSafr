import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { AuthBackground } from '@components/auth';
import { ThemedText } from '@components/ui/Typography';
import { BrandLogo } from '@components/ui/BrandLogo';
import { colors, spacing, radius, shadow } from '@constants/index';

export interface SplashScreenProps {
  /** Called once the intro animation finishes. */
  onFinish?: () => void;
}

/**
 * SplashScreen — animated brand reveal. Logo scales/fades in, then
 * calls onFinish so the router can move to onboarding/login.
 */
export function SplashScreen({ onFinish }: SplashScreenProps) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      ]),
      Animated.delay(700),
    ]).start(() => onFinish?.());

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity, scale, pulse, onFinish]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <AuthBackground>
      <View style={styles.center}>
        <View style={styles.logoWrap}>
          <Animated.View
            style={[styles.ring, { transform: [{ scale: ringScale }], opacity: ringOpacity }]}
          />
          <Animated.View style={[styles.logo, { opacity, transform: [{ scale }] }]}>
            <BrandLogo size={120} rounded />
          </Animated.View>
        </View>
        <Animated.View style={{ opacity, alignItems: 'center', gap: spacing.xs }}>
          <ThemedText variant="display" color={colors.textPrimary}>
            SafeSafr
          </ThemedText>
          <ThemedText variant="bodyLg" color={colors.accent}>
            Travel safe, everywhere.
          </ThemedText>
        </Animated.View>
      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing['2xl'] },
  logoWrap: { alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glowTeal,
  },
});

export default SplashScreen;
