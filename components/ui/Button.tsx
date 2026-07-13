import React from 'react';
import {
  Pressable,
  PressableProps,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, radius, spacing, shadow } from '@constants/index';
import { ThemedText } from './Typography';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: IconName;
  rightIcon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
}

const heights: Record<ButtonSize, number> = { sm: 42, md: 52, lg: 60 };
const padding: Record<ButtonSize, number> = { sm: spacing.lg, md: spacing.xl, lg: spacing['2xl'] };

/**
 * Button — primary interactive control.
 * Gradient fill for primary/danger, outlined for secondary, transparent for ghost.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = true,
  disabled,
  ...rest
}: ButtonProps) {
  const isGradient = variant === 'primary' || variant === 'danger';
  const gradientColors = variant === 'danger' ? gradients.danger : gradients.brand;

  const textColor =
    variant === 'ghost'
      ? colors.primary
      : variant === 'secondary'
      ? colors.textPrimary
      : colors.textPrimary;

  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon && <Icon name={leftIcon} size={20} color={textColor} />}
          <ThemedText variant="label" color={textColor}>
            {label}
          </ThemedText>
          {rightIcon && <Icon name={rightIcon} size={20} color={textColor} />}
        </>
      )}
    </View>
  );

  const base = {
    height: heights[size],
    paddingHorizontal: padding[size],
    borderRadius: radius.pill,
    width: fullWidth ? '100%' as const : undefined,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable disabled={disabled || loading} {...rest}>
      {({ pressed }) => {
        const pressStyle = { transform: [{ scale: pressed ? 0.98 : 1 }] };

        if (isGradient) {
          return (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.center,
                base,
                variant === 'danger' ? shadow.glowDanger : shadow.glowTeal,
                pressStyle,
              ]}
            >
              {content}
            </LinearGradient>
          );
        }

        return (
          <View
            style={[
              styles.center,
              base,
              variant === 'secondary'
                ? { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' }
                : { backgroundColor: 'transparent' },
              pressStyle,
            ]}
          >
            {content}
          </View>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

export default Button;
