import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '@constants/index';
import { ThemedText } from '@components/ui/Typography';
import { Avatar } from '@components/ui/Avatar';
import { Icon } from '@components/ui/Icon';

export interface WelcomeHeaderProps {
  name?: string;
  location?: string;
  avatar?: any;
  unread?: number;
  onBell?: () => void;
  onAvatar?: () => void;
}

/** WelcomeHeader — greeting, location, notification bell + avatar. */
export function WelcomeHeader({
  name = 'Jane',
  location = 'New Delhi, India',
  avatar,
  unread = 2,
  onBell,
  onAvatar,
}: WelcomeHeaderProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={styles.row}>
      <View style={{ gap: 2 }}>
        <ThemedText variant="bodySm" color={colors.textMuted}>
          {greeting},
        </ThemedText>
        <ThemedText variant="h2" color={colors.textPrimary}>
          {name} 👋
        </ThemedText>
        <View style={styles.loc}>
          <Icon name="map-pin" size={14} color={colors.accent} />
          <ThemedText variant="caption" color={colors.textSecondary}>
            {location}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onBell} style={styles.bell} hitSlop={8}>
          <Icon name="bell" size={22} color={colors.textPrimary} />
          {unread > 0 && (
            <View style={styles.badge}>
              <ThemedText variant="caption" color={colors.textPrimary} style={{ fontSize: 10 }}>
                {unread}
              </ThemedText>
            </View>
          )}
        </Pressable>
        <Pressable onPress={onAvatar} hitSlop={6}>
          <Avatar name={name} size={48} ring source={avatar} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bell: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WelcomeHeader;
