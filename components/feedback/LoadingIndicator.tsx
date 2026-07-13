import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing } from '@constants/index';
import { ThemedText } from '../ui/Typography';

export interface LoadingIndicatorProps {
  label?: string;
  size?: 'small' | 'large';
  color?: string;
  fullscreen?: boolean;
}

/**
 * LoadingIndicator — spinner with optional caption; can fill its parent.
 */
export function LoadingIndicator({
  label,
  size = 'large',
  color = colors.primary,
  fullscreen = false,
}: LoadingIndicatorProps) {
  return (
    <View style={[styles.wrap, fullscreen && styles.fullscreen]}>
      <ActivityIndicator size={size} color={color} />
      {label && (
        <ThemedText variant="bodySm" color={colors.textMuted}>
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  fullscreen: { flex: 1, backgroundColor: colors.background },
});

export default LoadingIndicator;
