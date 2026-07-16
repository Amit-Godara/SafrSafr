import React, { useState } from 'react';
import { View } from 'react-native';
import {
  AuthScaffold,
  AuthHeader,
  AuthInput,
  SocialButton,
  Divider,
} from '@components/auth';
import { Button } from '@components/ui/Button';
import { ThemedText } from '@components/ui/Typography';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { BrandLogo } from '@components/ui/BrandLogo';
import { colors, spacing } from '@constants/index';
import { validateEmail, validatePassword } from '@utils/validation';

export interface LoginScreenProps {
  onLogin?: (data: { email: string; password: string }) => void;
  onGoogle?: () => void;
  onForgot?: () => void;
  onRegister?: () => void;
  onBack?: () => void;
  loading?: boolean;
}

/**
 * LoginScreen — email/password sign in with Google option.
 * Front-end only: validates locally and surfaces the values via callbacks.
 */
export function LoginScreen({
  onLogin,
  onGoogle,
  onForgot,
  onRegister,
  onBack,
  loading = false,
}: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    if (!next.email && !next.password) onLogin?.({ email: email.trim(), password });
  };

  return (
    <AuthScaffold onBack={onBack}>
      <FadeSlideView delay={40}>
        <View style={{ alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.sm }}>
          <BrandLogo size={112} glow />
        </View>
      </FadeSlideView>

      <FadeSlideView delay={80}>
        <AuthHeader title="Welcome back" subtitle="Sign in to continue staying safe." />
      </FadeSlideView>

      <FadeSlideView delay={160} style={{ gap: spacing.lg }}>
        <AuthInput
          label="Email"
          leftIcon="mail"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <AuthInput
          label="Password"
          leftIcon="lock"
          placeholder="Your password"
          secure
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />
        <View style={{ alignItems: 'flex-end' }}>
          <ThemedText
            variant="label"
            color={colors.accent}
            onPress={onForgot}
            suppressHighlighting
          >
            Forgot password?
          </ThemedText>
        </View>
      </FadeSlideView>

      <FadeSlideView delay={240} style={{ gap: spacing.lg }}>
        <Button label="Sign In" onPress={submit} loading={loading} rightIcon="arrow-right" />
        <Divider label="or continue with" />
        <SocialButton label="Continue with Google" icon="google" onPress={onGoogle} />
      </FadeSlideView>

      <FadeSlideView delay={320}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
          <ThemedText variant="body" color={colors.textMuted}>
            Don't have an account?
          </ThemedText>
          <ThemedText
            variant="label"
            color={colors.primary}
            onPress={onRegister}
            suppressHighlighting
          >
            Sign up
          </ThemedText>
        </View>
      </FadeSlideView>
    </AuthScaffold>
  );
}

export default LoginScreen;
