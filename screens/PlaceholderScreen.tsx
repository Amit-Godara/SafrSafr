import React from 'react';
import { View } from 'react-native';
import { ScreenContainer, ThemedText } from '@components/ui';
import { Header } from '@components/navigation';
import { Icon, IconName } from '@components/ui/Icon';
import { colors, spacing } from '@constants/index';

export interface PlaceholderScreenProps {
  title: string;
  icon: IconName;
  subtitle?: string;
}

/**
 * PlaceholderScreen — empty-state page for tabs not yet built.
 */
export function PlaceholderScreen({ title, icon, subtitle }: PlaceholderScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title={title} />
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
          <Icon name={icon} size={56} color={colors.primary} />
          <ThemedText variant="h3">{title}</ThemedText>
          <ThemedText variant="body" color={colors.textMuted}>
            {subtitle ?? 'Coming soon.'}
          </ThemedText>
        </View>
      </ScreenContainer>
    </View>
  );
}

export default PlaceholderScreen;
