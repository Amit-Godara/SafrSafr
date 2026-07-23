import React, { useState, useRef, useCallback } from 'react';
import { View, ScrollView, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { light, lightGradients } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { ChatBubble } from '../components/chat/ChatBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { SuggestedQuestions } from '../components/chat/SuggestedQuestions';
import { ChatInputBar } from '../components/chat/ChatInputBar';
import {
  type ChatMessage,
  SUGGESTED_QUESTIONS,
  createMessage,
  getAIResponse,
  getInitialGreeting,
} from '../services/aiAgent';

function HeaderAvatarMark() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l1.9 4.2L18 8l-4.1 1.8L12 14l-1.9-4.2L6 8l4.1-1.8L12 2z" fill="#FFFFFF" />
      <Path d="M18.5 14l.95 2.1L21.5 17l-2.05.9L18.5 20l-.95-2.1L15.5 17l2.05-.9L18.5 14z" fill="#FFFFFF" />
    </Svg>
  );
}

export interface AIAssistantScreenProps {
  onBack?: () => void;
}

/**
 * AIAssistantScreen — premium AI Safety Agent chatbot UI.
 *
 * No real AI, ML, or network calls — getAIResponse() in
 * services/aiAgent.ts simulates a "thinking" delay and returns a
 * hardcoded keyword-matched answer. Swapping in a real AI backend later
 * only requires editing that one function; this screen and its
 * components don't need to change.
 */
export function AIAssistantScreen({ onBack }: AIAssistantScreenProps) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [getInitialGreeting()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || isTyping) return;

      const userMsg = createMessage('user', text);
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);
      scrollToEnd();

      const answer = await getAIResponse(text);

      setMessages((prev) => [...prev, createMessage('ai', answer)]);
      setIsTyping(false);
      scrollToEnd();
    },
    [isTyping, scrollToEnd],
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={insets.top}
    >
      {/* Header */}
      <LinearGradient colors={lightGradients.header} style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <Icon name={'chevron-left' as any} size={24} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerCenter}>
            <View style={styles.headerAvatar}>
              <HeaderAvatarMark />
            </View>
            <View>
              <ThemedText variant="label" color="#FFFFFF" style={styles.headerTitle}>
                AI Safety Assistant
              </ThemedText>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <ThemedText variant="caption" color="rgba(255,255,255,0.85)">
                  Always here to help
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.messages}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToEnd}
      >
        {messages.map((msg, i) => (
          <FadeSlideView key={msg.id} delay={i === messages.length - 1 ? 0 : 0}>
            <ChatBubble message={msg} />
          </FadeSlideView>
        ))}

        {isTyping && (
          <FadeSlideView delay={0}>
            <TypingIndicator />
          </FadeSlideView>
        )}
      </ScrollView>

      {/* Suggested questions */}
      <SuggestedQuestions
        questions={SUGGESTED_QUESTIONS}
        onSelect={(q) => send(q)}
        disabled={isTyping}
      />

      {/* Input bar */}
      <View style={{ paddingBottom: insets.bottom }}>
        <ChatInputBar
          value={input}
          onChangeText={setInput}
          onSend={() => send(input)}
          isRecording={isRecording}
          onToggleRecording={() => setIsRecording((r) => !r)}
          disabled={isTyping}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  messages: { padding: 16, gap: 14, flexGrow: 1 },
});

export default AIAssistantScreen;