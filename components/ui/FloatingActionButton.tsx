import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients, radius, shadow } from '@constants/index';
import { Icon, IconName } from './Icon';

export interface FloatingActionButtonProps {
  icon?: IconName;
  onPress?: () => void;
  size?: number;
  tone?: 'brand' | 'danger';
}

/**
 * FloatingActionButton — circular gradient action, elevated with a glow.
 */
export function FloatingActionButton({
  icon = 'plus',
  onPress,
  size = 60,
  tone = 'brand',
}: FloatingActionButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <LinearGradient
          colors={tone === 'danger' ? gradients.danger : gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.fab,
            { width: size, height: size, borderRadius: radius.full },
            tone === 'danger' ? shadow.glowDanger : shadow.glowTeal,
            { transform: [{ scale: pressed ? 0.94 : 1 }] },
          ]}
        >
          <Icon name={icon} size={size * 0.42} color="#FFFFFF" />
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: { alignItems: 'center', justifyContent: 'center' },
});

export default FloatingActionButton;
