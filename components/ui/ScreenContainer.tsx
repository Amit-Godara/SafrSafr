import React from 'react';
import { View, ScrollView, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, spacing } from '@constants/index';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  gradient?: boolean;
  padded?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * ScreenContainer — base page wrapper: navy background (or brand-tinted
 * gradient) with optional scrolling and horizontal padding.
 */
export function ScreenContainer({
  children,
  scroll = false,
  gradient = false,
  padded = true,
  contentStyle,
}: ScreenContainerProps) {
  const inner = (
    <View style={[padded && { paddingHorizontal: spacing.xl }, styles.flex, contentStyle]}>
      {children}
    </View>
  );

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[{ paddingBottom: spacing['4xl'] }, padded && { paddingHorizontal: spacing.xl }, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    inner
  );

  if (gradient) {
    return (
      <LinearGradient colors={gradients.navy} style={styles.flex}>
        {body}
      </LinearGradient>
    );
  }

  return <View style={[styles.flex, { backgroundColor: colors.background }]}>{body}</View>;
}

const styles = StyleSheet.create({ flex: { flex: 1 } });

export default ScreenContainer;
