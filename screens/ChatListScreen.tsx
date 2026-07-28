import React, { useState } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { useTravelers } from '../contexts/TravelersContext';

const C = {
  page: '#F7F8FC',
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
  success: '#22C55E',
};

function SearchIcon({ size = 17, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={1.9} fill="none" />
      <Path d="M20 20l-4.3-4.3" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export interface ChatListScreenProps {
  onOpenChat?: (travelerId: string) => void;
}

/**
 * ChatListScreen — bottom "Chat" tab. Shows everyone you're connected
 * with; tapping a person opens a 1:1 chat with them. No AI, no backend —
 * conversations live in TravelersContext for this session.
 */
export function ChatListScreen({ onOpenChat }: ChatListScreenProps) {
  const insets = useSafeAreaInsets();
  const { travelers, messages } = useTravelers();
  const [query, setQuery] = useState('');

  const connections = travelers
    .filter((t) => t.connected)
    .filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800' }}>
          Chat
        </ThemedText>
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search conversations…"
            placeholderTextColor={C.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: insets.bottom + 24 }}
      >
        {connections.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center' }}>
              No conversations yet. Connect with a nearby traveler to start chatting.
            </ThemedText>
          </View>
        ) : (
          connections.map((t) => {
            const thread = messages[t.id] ?? [];
            const last = thread[thread.length - 1];
            return (
              <Pressable key={t.id} onPress={() => onOpenChat?.(t.id)} style={styles.row}>
                <View style={[styles.avatar, { backgroundColor: t.avatarColor }]}>
                  <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '800' }}>
                    {t.initials}
                  </ThemedText>
                  {t.online && <View style={styles.onlineDot} />}
                </View>

                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                    {t.name}
                  </ThemedText>
                  <ThemedText variant="caption" color={C.textMuted} numberOfLines={1}>
                    {last ? (last.fromMe ? 'You: ' : '') + last.text : 'Say hi 👋'}
                  </ThemedText>
                </View>

                <ChevronRightIcon />
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  header: {
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#F3F4F8',
  },
  searchInput: { flex: 1, color: C.textPrimary, fontSize: 15 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: C.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emptyState: { padding: 32, alignItems: 'center' },
});

export default ChatListScreen;