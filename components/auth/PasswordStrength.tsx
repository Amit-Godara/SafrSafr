import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';

export interface PasswordStrengthProps {
  password: string;
}

function score(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const TINTS = [colors.danger, colors.danger, colors.warning, colors.accent, colors.success];

/** PasswordStrength — 4-segment meter with a descriptive label. */
export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;
  const s = score(password);
  const tint = TINTS[s];

  return (
    <View style={{ gap: spacing.sm }}>
      <View style={styles.row}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.seg, { backgroundColor: i < s ? tint : colors.surfaceAlt }]}
          />
        ))}
      </View>
      <ThemedText variant="caption" color={tint}>
        {LABELS[s]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  seg: { flex: 1, height: 5, borderRadius: radius.pill },
});

export default PasswordStrength;
