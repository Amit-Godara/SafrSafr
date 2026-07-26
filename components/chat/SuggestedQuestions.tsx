import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { light } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';

export interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

/**
 * SuggestedQuestions — horizontal row of tappable example-question chips.
 */
export function SuggestedQuestions({ questions, onSelect, disabled }: SuggestedQuestionsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {questions.map((q) => (
        <Pressable
          key={q}
          disabled={disabled}
          onPress={() => onSelect(q)}
          style={({ pressed }) => [styles.chip, pressed && !disabled && styles.chipPressed]}
        >
          <ThemedText variant="caption" color={light.primary} style={styles.chipText}>
            {q}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: light.primarySoft,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  chipPressed: { opacity: 0.7 },
  chipText: { fontWeight: '600' },
});

export default SuggestedQuestions;