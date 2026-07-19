import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { light } from '@constants/lightTheme';

export interface LightCardProps extends ViewProps {
  children: React.ReactNode;
  padding?: number;
}

/** LightCard — white rounded card matching the mockup (soft shadow, 20r). */
export function LightCard({ children, padding = 16, style, ...rest }: LightCardProps) {
  return (
    <View style={[styles.card, { padding }, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: light.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: light.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});

export default LightCard;
