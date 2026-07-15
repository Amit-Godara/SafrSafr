import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { Badge } from '@components/ui/Badge';
import { colors, spacing, radius, shadow } from '@constants/index';

export interface LiveMapPreviewProps {
  travelers?: number;
  onPress?: () => void;
}

/**
 * LiveMapPreview — stylised map card (no real map/backend).
 * Faux streets via layered lines + a pulsing "you" marker area.
 */
export function LiveMapPreview({ travelers = 12, onPress }: LiveMapPreviewProps) {
  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View style={[styles.card, shadow.md, { transform: [{ scale: pressed ? 0.99 : 1 }] }]}>
          <LinearGradient colors={['#12324A', '#0F172A']} style={StyleSheet.absoluteFill} />
          {/* faux roads */}
          <View style={[styles.road, { top: 40, transform: [{ rotate: '-18deg' }] }]} />
          <View style={[styles.road, { top: 110, transform: [{ rotate: '8deg' }] }]} />
          <View style={[styles.roadV, { left: 90 }]} />
          <View style={[styles.roadV, { left: 220 }]} />
          {/* river */}
          <View style={styles.river} />

          {/* markers */}
          <View style={[styles.marker, { top: 70, left: 60, backgroundColor: colors.accent }]} />
          <View style={[styles.marker, { top: 120, left: 240, backgroundColor: colors.primary }]} />
          <View style={styles.you}>
            <View style={styles.youDot} />
          </View>

          {/* overlay chrome */}
          <View style={styles.top}>
            <Badge label="Live" tone="danger" dot />
            <Badge label={`${travelers} nearby`} tone="accent" />
          </View>
          <View style={styles.bottom}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <Icon name="map-pin" size={18} color={colors.accent} />
              <ThemedText variant="label" color={colors.textPrimary}>
                Live Map
              </ThemedText>
            </View>
            <View style={styles.openBtn}>
              <ThemedText variant="caption" color={colors.background}>
                Open
              </ThemedText>
              <Icon name="arrow-right" size={14} color={colors.background} />
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 190,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  road: { position: 'absolute', left: -40, right: -40, height: 8, backgroundColor: 'rgba(148,163,184,0.15)' },
  roadV: { position: 'absolute', top: -40, bottom: -40, width: 8, backgroundColor: 'rgba(148,163,184,0.12)' },
  river: { position: 'absolute', right: -30, top: 20, width: 60, bottom: -20, backgroundColor: 'rgba(34,211,238,0.12)', transform: [{ rotate: '20deg' }] },
  marker: { position: 'absolute', width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#0F172A' },
  you: {
    position: 'absolute',
    top: 95,
    left: 150,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(20,184,166,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  youDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary, borderWidth: 2, borderColor: '#fff' },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  openBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
});

export default LiveMapPreview;
