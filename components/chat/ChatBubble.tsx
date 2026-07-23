import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import type { ChatMessage } from '../../services/aiAgent';

function AvatarMark() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l1.9 4.2L18 8l-4.1 1.8L12 14l-1.9-4.2L6 8l4.1-1.8L12 2z"
        fill="#FFFFFF"
      />
      <Path
        d="M18.5 14l.95 2.1L21.5 17l-2.05.9L18.5 20l-.95-2.1L15.5 17l2.05-.9L18.5 14z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

export interface ChatBubbleProps {
  message: ChatMessage;
}

/**
 * ChatBubble — a single chat message. AI messages align left with a small
 * avatar; user messages align right with a solid brand-color bubble.
 */
export function ChatBubble({ message }: ChatBubbleProps) {
  const isAI = message.role === 'ai';

  return (
    <View style={[styles.row, isAI ? styles.rowLeft : styles.rowRight]}>
      {isAI && (
        <View style={styles.avatar}>
          <AvatarMark />
        </View>
      )}

      <View style={{ maxWidth: '78%', gap: 4 }}>
        <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>
          <ThemedText
            variant="bodySm"
            color={isAI ? light.textPrimary : '#FFFFFF'}
            style={styles.text}
          >
            {message.text}
          </ThemedText>
        </View>
        <ThemedText
          variant="caption"
          color={light.textMuted}
          style={isAI ? styles.timeLeft : styles.timeRight}
        >
          {message.time}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F5',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: light.primary,
    borderBottomRightRadius: 4,
  },
  text: { lineHeight: 20 },
  timeLeft: { marginLeft: 4 },
  timeRight: { marginRight: 4, textAlign: 'right' },
});

export default ChatBubble;