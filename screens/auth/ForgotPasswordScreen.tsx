import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthScaffold, AuthHeader, AuthInput } from '@components/auth';
import { Button } from '@components/ui/Button';
import { ThemedText } from '@components/ui/Typography';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { Icon } from '@components/ui/Icon';
import { colors, spacing, radius, shadow } from '@constants/index';
import { validateEmail } from '@utils/validation';

export interface ForgotPasswordScreenProps {
  onSubmit?: (email: string) => void;
  onBack?: () => void;
  loading?: boolean;
}

/**
 * ForgotPasswordScreen — request a reset link.
 * Shows a success confirmation state after submit. Front-end only.
 */
export function ForgotPasswordScreen({ onSubmit, onBack, loading = false }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  const submit = () => {
    const err = validateEmail(email);
    setError(err);
    if (!err) {
      setSent(true);
      onSubmit?.(email.trim());
    }
  };

  if (sent) {
    return (
      <AuthScaffold onBack={onBack}>
        <FadeSlideView delay={60} style={styles.doneWrap}>
          <View style={styles.successBadge}>
            <Icon name="check" size={56} color={colors.background} />
          </View>
          <View style={{ gap: spacing.md, alignItems: 'center' }}>
            <ThemedText variant="h1" style={{ textAlign: 'center' }}>
              Check your email
            </ThemedText>
            <ThemedText variant="bodyLg" color={colors.textMuted} style={{ textAlign: 'center' }}>
              We've sent a password reset link to{'\n'}
              <ThemedText variant="label" color={colors.accent}>
                {email.trim()}
              </ThemedText>
            </ThemedText>
          </View>
          <Button label="Back to Sign In" onPress={onBack} />
          <ThemedText
            variant="label"
            color={colors.textMuted}
            onPress={() => setSent(false)}
            suppressHighlighting
          >
            Use a different email
          </ThemedText>
        </FadeSlideView>
      </AuthScaffold>
    );
  }

  return (
    <AuthScaffold onBack={onBack}>
      <FadeSlideView delay={80}>
        <AuthHeader
          title="Forgot password?"
          subtitle="Enter your email and we'll send you a link to reset it."
        />
      </FadeSlideView>

      <FadeSlideView delay={160} style={{ gap: spacing.lg }}>
        <AuthInput
          label="Email"
          leftIcon="mail"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={error}
        />
        <Button label="Send Reset Link" onPress={submit} loading={loading} rightIcon="arrow-right" />
      </FadeSlideView>

      <FadeSlideView delay={240}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
          <ThemedText variant="body" color={colors.textMuted}>
            Remembered it?
          </ThemedText>
          <ThemedText variant="label" color={colors.primary} onPress={onBack} suppressHighlighting>
            Sign in
          </ThemedText>
        </View>
      </FadeSlideView>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing['2xl'] },
  successBadge: {
    width: 110,
    height: 110,
    borderRadius: radius.full,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glowTeal,
  },
});

export default ForgotPasswordScreen;
