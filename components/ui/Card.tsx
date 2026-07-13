import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing, shadow } from '@constants/index';

export type CardVariant = 'solid' | 'glass' | 'outlined';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  padding?: keyof typeof spacing;
  radiusToken?: keyof typeof radius;
  elevated?: boolean;
  children: React.ReactNode;
}

/**
 * Card — rounded surface container.
 * `glass` uses a blur + translucent overlay for glassmorphism.
 */
export function Card({
  variant = 'solid',
  padding = 'xl',
  radiusToken = 'lg',
  elevated = true,
  style,
  children,
  ...rest
}: CardProps) {
  const br = radius[radiusToken];
  const base = {
    borderRadius: br,
    padding: spacing[padding],
    overflow: 'hidden' as const,
  };

  if (variant === 'glass') {
    return (
      <View style={[base, elevated && shadow.md, style]} {...rest}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.glass, borderRadius: br, borderWidth: 1, borderColor: colors.glassBorder },
          ]}
        />
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        base,
        variant === 'outlined'
          ? { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border }
          : { backgroundColor: colors.surface },
        elevated && variant === 'solid' && shadow.md,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

export default Card;
