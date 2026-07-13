import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { colors, radius } from '@constants/index';
import { ThemedText } from './Typography';

export interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  ring?: boolean;
}

/**
 * Avatar — circular image with initials fallback and optional teal ring.
 */
export function Avatar({ source, name, size = 52, ring = false }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?';

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          borderWidth: ring ? 2 : 0,
          borderColor: colors.primary,
        },
      ]}
    >
      {source ? (
        <Image source={source} style={{ width: '100%', height: '100%' }} />
      ) : (
        <ThemedText variant="label" color={colors.textPrimary}>
          {initials}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
  },
});

export default Avatar;
