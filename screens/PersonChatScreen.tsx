import React, { useState, useRef } from 'react';
import { View, ScrollView, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { useTravelers } from '../contexts/TravelersContext';

const C = {
  page: '#F7F8FC',
  card: '#FFFFFF',
  primary: '#3A63F3',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
  success: '#22C55E',
  inputBg: '#F3F4F8',
};

function ChevronLeftIcon({ size = 22, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SendIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 11.5L20.5 3 12.5 20.5 10 13 3 11.5z" fill={color} />
    </Svg>
  );
}

export interface PersonChatScreenProps {
  travelerId: string;
  onBack?: () => void;
}

/**
 * PersonChatScreen — 1:1 conversation with a specific connected traveler.
 * No AI, no backend: your messages are stored in TravelersContext and a
 * short canned reply comes back for a lived-in feel.
 */
export function PersonChatScreen({ travelerId, onBack }: PersonChatScreenProps) {
  const insets = useSafeAreaInsets();
  const { getTraveler, messages, sendMessage } = useTravelers();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const traveler = getTraveler(travelerId);
  const thread = messages[travelerId] ?? [];

  const scrollToEnd = () => requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

  const send = () => {
    if (!input.trim()) return;
    sendMessage(travelerId, input);
    setInput('');
    scrollToEnd();
  };

  if (!traveler) {
    return (
      <View style={styles.root}>
        <ThemedText variant="bodySm" color={C.textMuted} style={{ margin: 24 }}>
          This traveler is no longer available.
        </ThemedText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
          <ChevronLeftIcon />
        </Pressable>

        <View style={[styles.avatar, { backgroundColor: traveler.avatarColor }]}>
          <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '800' }}>
            {traveler.initials}
          </ThemedText>
        </View>

        <View style={{ flex: 1 }}>
          <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
            {traveler.name}
          </ThemedText>
          <ThemedText variant="caption" color={traveler.online ? C.success : C.textMuted}>
            {traveler.online ? 'Online now' : 'Offline'}
          </ThemedText>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        onContentSizeChange={scrollToEnd}
        showsVerticalScrollIndicator={false}
      >
        {thread.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center' }}>
              Say hi to {traveler.name.split(' ')[0]} 👋
            </ThemedText>
          </View>
        ) : (
          thread.map((m) => (
            <View key={m.id} style={[styles.bubbleRow, m.fromMe ? styles.rowRight : styles.rowLeft]}>
              <View style={[styles.bubble, m.fromMe ? styles.bubbleMine : styles.bubbleTheirs]}>
                <ThemedText variant="bodySm" color={m.fromMe ? '#FFFFFF' : C.textPrimary}>
                  {m.text}
                </ThemedText>
              </View>
              <ThemedText variant="caption" color={C.textMuted} style={styles.time}>
                {m.time}
              </ThemedText>
            </View>
          ))
        )}
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={`Message ${traveler.name.split(' ')[0]}…`}
          placeholderTextColor={C.textMuted}
          style={styles.input}
          multiline
          onSubmitEditing={send}
        />
        <Pressable onPress={send} disabled={!input.trim()} style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}>
          <SendIcon color={input.trim() ? '#FFFFFF' : C.textMuted} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.card,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bubbleRow: { maxWidth: '78%', gap: 3 },
  rowLeft: { alignSelf: 'flex-start' },
  rowRight: { alignSelf: 'flex-end' },
  bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleTheirs: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: C.border, borderBottomLeftRadius: 4 },
  bubbleMine: { backgroundColor: C.primary, borderBottomRightRadius: 4, alignSelf: 'flex-end' },
  time: { marginHorizontal: 4 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.inputBg,
    color: C.textPrimary,
    fontSize: 15,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: C.inputBg },
});

export default PersonChatScreen;