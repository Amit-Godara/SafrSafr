import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { light } from '@constants/lightTheme';

function MicIcon({ color, active }: { color: string; active?: boolean }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
      <Path
        d="M5 11a7 7 0 0 0 14 0"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M12 18v3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function SendIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 11.5L20.5 3 12.5 20.5 10 13 3 11.5z"
        fill={color}
      />
    </Svg>
  );
}

export interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled?: boolean;
}

/**
 * ChatInputBar — text input + voice button (UI only, no real speech
 * recognition) + send button. Uses inline SVG icons so it doesn't depend
 * on the shared Icon component's name set.
 */
export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  isRecording,
  onToggleRecording,
  disabled,
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onToggleRecording}
        style={[styles.micBtn, isRecording && styles.micBtnActive]}
      >
        <MicIcon color={isRecording ? '#FFFFFF' : light.textSecondary} active={isRecording} />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask about safety, routes, hotels…"
        placeholderTextColor={light.textMuted}
        style={styles.input}
        multiline
        onSubmitEditing={canSend ? onSend : undefined}
      />

      <Pressable
        onPress={onSend}
        disabled={!canSend}
        style={[styles.sendBtn, canSend ? styles.sendBtnActive : styles.sendBtnInactive]}
      >
        <SendIcon color={canSend ? '#FFFFFF' : light.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEF0F5',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F1FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: { backgroundColor: '#EF4444' },
  input: {
    flex: 1,
    maxHeight: 100,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F3F1FB',
    color: light.textPrimary,
    fontSize: 15,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: light.primary },
  sendBtnInactive: { backgroundColor: '#F3F1FB' },
});

export default ChatInputBar;