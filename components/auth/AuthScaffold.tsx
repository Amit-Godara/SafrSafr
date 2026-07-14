import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthBackground } from './AuthBackground';
import { Icon } from '@components/ui/Icon';
import { colors, spacing } from '@constants/index';

export interface AuthScaffoldProps {
  children: React.ReactNode;
  onBack?: () => void;
}

/**
 * AuthScaffold — shared shell for form screens.
 * Premium background + keyboard avoidance + scrollable content + back button.
 */
export function AuthScaffold({ children, onBack }: AuthScaffoldProps) {
  const insets = useSafeAreaInsets();

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing['3xl'] },
          ]}
        >
          {onBack && (
            <Pressable onPress={onBack} hitSlop={10} style={styles.back}>
              <Icon name="chevron-left" size={26} color={colors.textPrimary} />
            </Pressable>
          )}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, gap: spacing.xl, flexGrow: 1 },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
});

export default AuthScaffold;
