import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';
import { colors, radius } from '@constants/index';

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  radiusToken?: keyof typeof radius;
  style?: StyleProp<ViewStyle>;
}

/**
 * Skeleton — shimmering placeholder block for loading states.
 */
export function Skeleton({ width = '100%', height = 16, radiusToken = 'sm', style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius: radius[radiusToken], backgroundColor: colors.surfaceAlt, opacity },
        style,
      ]}
    />
  );
}

export default Skeleton;
