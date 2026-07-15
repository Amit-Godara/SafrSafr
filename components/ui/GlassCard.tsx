import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing, shadow } from '@constants/index';

export interface GlassCardProps extends ViewProps {
  padding?: keyof typeof spacing;
  radiusToken?: keyof typeof radius;
  intensity?: number;
  /** Adds a soft coloured glow behind the card. */
  glow?: 'none' | 'teal' | 'cyan';
  children: React.ReactNode;
}

/**
 * GlassCard — "liquid glass" surface.
 * Layers: blur → translucent fill → diagonal sheen highlight → hairline border.
 * The stacked gradients give the frosted, liquid look on the dark theme.
 */
export function GlassCard({
  padding = 'xl',
  radiusToken = 'lg',
  intensity = 40,
  glow = 'none',
  style,
  children,
  ...rest
}: GlassCardProps) {
  const br = radius[radiusToken];
  const glowStyle =
    glow === 'teal' ? shadow.glowTeal : glow === 'cyan' ? shadow.glowCyan : shadow.md;

  return (
    <View style={[{ borderRadius: br }, glowStyle, style]} {...rest}>
      <View style={[styles.clip, { borderRadius: br, padding: spacing[padding] }]}>
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
        {/* base translucent fill */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(30,41,59,0.55)' }]}
        />
        {/* diagonal liquid sheen */}
        <LinearGradient
          colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.02)', 'rgba(34,211,238,0.06)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* hairline border */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: br, borderWidth: 1, borderColor: colors.glassBorder },
          ]}
        />
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
});

export default GlassCard;
