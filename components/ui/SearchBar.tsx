import React from 'react';
import { View, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { Icon } from './Icon';

export interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  onClear?: () => void;
  value?: string;
}

/**
 * SearchBar — pill search field with leading search glyph and clear affordance.
 */
export function SearchBar({ onClear, value, placeholder = 'Search…', ...rest }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Icon name="search" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        {...rest}
      />
      {!!value && (
        <Pressable onPress={onClear} hitSlop={8}>
          <Icon name="close" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, color: colors.textPrimary, fontSize: 16, height: '100%' },
});

export default SearchBar;
