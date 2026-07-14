import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';

export interface DividerProps {
  label?: string;
}

/** Divider — horizontal rule with optional centered label ("or"). */
export function Divider({ label }: DividerProps) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      {label && (
        <ThemedText variant="caption" color={colors.textMuted}>
          {label}
        </ThemedText>
      )}
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.glassBorder },
});

export default Divider;
