import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, Pressable } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';
import { Icon, IconName } from '@components/ui/Icon';

export interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  leftIcon?: IconName;
  error?: string;
  /** Renders an eye toggle and masks input. */
  secure?: boolean;
}

/**
 * AuthInput — glass text field tuned for auth forms.
 * Handles focus ring, error state, and password visibility toggle.
 */
export function AuthInput({
  label,
  leftIcon,
  error,
  secure = false,
  onFocus,
  onBlur,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(secure);

  const borderColor = error
    ? colors.danger
    : focused
    ? colors.primary
    : colors.glassBorder;

  return (
    <View style={{ gap: spacing.sm, width: '100%' }}>
      {label && (
        <ThemedText variant="label" color={colors.textSecondary}>
          {label}
        </ThemedText>
      )}
      <View style={[styles.field, { borderColor }]}>
        {leftIcon && (
          <Icon name={leftIcon} size={20} color={focused ? colors.primary : colors.textMuted} />
        )}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          secureTextEntry={hidden}
          autoCapitalize="none"
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {secure && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Icon name={hidden ? 'eye-off' : 'eye'} size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {!!error && (
        <ThemedText variant="caption" color={colors.danger}>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.glass,
  },
  input: { flex: 1, color: colors.textPrimary, fontSize: 16, height: '100%' },
});

export default AuthInput;
