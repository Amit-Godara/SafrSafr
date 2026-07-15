import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { colors, spacing, radius } from '@constants/index';

export interface RecentSearchesProps {
  items?: string[];
  onSelect?: (q: string) => void;
  onClear?: () => void;
}

const DEFAULT_ITEMS = ['Connaught Place', 'Metro Station', 'Hostel Zostel', 'Airport T3'];

/** RecentSearches — dismissible chips of prior queries. */
export function RecentSearches({ items = DEFAULT_ITEMS, onSelect, onClear }: RecentSearchesProps) {
  if (!items.length) return null;
  return (
    <View style={{ gap: spacing.md }}>
      <View style={styles.head}>
        <ThemedText variant="label" color={colors.textSecondary}>
          Recent Searches
        </ThemedText>
        <Pressable onPress={onClear} hitSlop={8}>
          <ThemedText variant="caption" color={colors.accent}>
            Clear
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.wrap}>
        {items.map((q) => (
          <Pressable key={q} onPress={() => onSelect?.(q)} style={styles.chip}>
            <Icon name="clock" size={14} color={colors.textMuted} />
            <ThemedText variant="bodySm" color={colors.textSecondary}>
              {q}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

export default RecentSearches;
