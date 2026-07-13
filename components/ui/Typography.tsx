import React from 'react';
import { Text, TextProps } from 'react-native';
import { textVariants, TextVariant } from '@constants/index';
import { colors } from '@constants/index';
import { cn } from '@utils/index';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * ThemedText — typography primitive.
 * Applies a design-system text variant + default white color.
 */
export function ThemedText({
  variant = 'body',
  color = colors.textPrimary,
  style,
  className,
  children,
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      className={cn(className)}
      style={[textVariants[variant], { color }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export default ThemedText;
