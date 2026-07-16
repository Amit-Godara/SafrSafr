import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { colors, radius, shadow } from '@constants/index';

export interface BrandLogoProps {
  /** Rendered square size in px. */
  size?: number;
  /** Adds the glowing ring treatment around the logo. */
  glow?: boolean;
  rounded?: boolean;
}

/**
 * BrandLogo — single source of truth for the app logo.
 * Swap assets/images/logo.png to update branding everywhere
 * (login, splash, headers) in one shot.
 */
export function BrandLogo({ size = 96, glow = false, rounded = true }: BrandLogoProps) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: rounded ? size * 0.28 : 0 },
        glow && { ...shadow.glowCyan, backgroundColor: colors.background },
        styles.wrap,
      ]}
    >
      <Image
        source={require('../../assets/images/logo.png')}
        style={{ width: size, height: size, borderRadius: rounded ? size * 0.28 : 0 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
});

export default BrandLogo;
