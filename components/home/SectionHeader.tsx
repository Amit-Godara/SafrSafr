import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@components/ui/Typography';
import { colors, spacing } from '@constants/index';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** SectionHeader — title + optional "See all" affordance. */
export function SectionHeader({ title, actionLabel = 'See all', onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <ThemedText variant="h3" color={colors.textPrimary}>
        {title}
      </ThemedText>
      {onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <ThemedText variant="label" color={colors.accent}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

export default SectionHeader;
