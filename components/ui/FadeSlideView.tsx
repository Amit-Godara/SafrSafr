import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

export interface FadeSlideViewProps {
  children: React.ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  /** Initial vertical offset in px (slides up to 0). */
  offset?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * FadeSlideView — mounts children with a fade + slide-up.
 * Uses the built-in Animated API (no Reanimated dependency) so it works
 * with the current Babel config. Great for staggered form entrances.
 */
export function FadeSlideView({
  children,
  delay = 0,
  offset = 24,
  duration = 500,
  style,
}: FadeSlideViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(offset)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, delay, duration]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export default FadeSlideView;
