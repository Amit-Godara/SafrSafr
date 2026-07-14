import React from 'react';
import { View } from 'react-native';
import { colors, spacing } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

/** AuthHeader — title + supporting copy block for auth forms. */
export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View style={{ gap: spacing.sm, marginBottom: spacing.md }}>
      <ThemedText variant="h1" color={colors.textPrimary}>
        {title}
      </ThemedText>
      {subtitle && (
        <ThemedText variant="bodyLg" color={colors.textMuted}>
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

export default AuthHeader;
