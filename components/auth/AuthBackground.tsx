import React from 'react';
import { View, StyleSheet, ImageBackground, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@constants/index';

export interface AuthBackgroundProps {
  children: React.ReactNode;
  /** Optional real photo. Drop a require('...') here to swap the gradient. */
  image?: ImageSourcePropType;
}

/**
 * AuthBackground — full-bleed premium backdrop for auth screens.
 * Navy base + teal/cyan radial-style glows. Pass `image` to layer a photo
 * beneath the dark scrim without touching the screens.
 */
export function AuthBackground({ children, image }: AuthBackgroundProps) {
  const content = (
    <>
      {/* Decorative glows */}
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />
      <LinearGradient
        colors={['rgba(15,23,42,0.6)', 'rgba(15,23,42,0.92)', '#0F172A']}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </>
  );

  if (image) {
    return (
      <ImageBackground source={image} style={styles.root} resizeMode="cover">
        {content}
      </ImageBackground>
    );
  }

  return <View style={[styles.root, { backgroundColor: colors.background }]}>{content}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glow: { position: 'absolute', borderRadius: 999, opacity: 0.35 },
  glowTop: {
    width: 340,
    height: 340,
    top: -120,
    right: -100,
    backgroundColor: colors.accent,
  },
  glowBottom: {
    width: 300,
    height: 300,
    bottom: -110,
    left: -90,
    backgroundColor: colors.primary,
  },
});

export default AuthBackground;
