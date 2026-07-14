import React, { useState } from 'react';
import { View } from 'react-native';
import {
  AuthScaffold,
  AuthHeader,
  AuthInput,
  SocialButton,
  Divider,
  PasswordStrength,
} from '@components/auth';
import { Button } from '@components/ui/Button';
import { ThemedText } from '@components/ui/Typography';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { colors, spacing } from '@constants/index';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '@utils/validation';

export interface RegisterScreenProps {
  onRegister?: (data: { name: string; email: string; password: string }) => void;
  onGoogle?: () => void;
  onLogin?: () => void;
  onBack?: () => void;
  loading?: boolean;
}

/**
 * RegisterScreen — create account with name/email/password + confirm.
 * Includes a live password-strength meter. Front-end only.
 */
export function RegisterScreen({
  onRegister,
  onGoogle,
  onLogin,
  onBack,
  loading = false,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const submit = () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validateConfirmPassword(password, confirm),
    };
    setErrors(next);
    if (!next.name && !next.email && !next.password && !next.confirm) {
      onRegister?.({ name: name.trim(), email: email.trim(), password });
    }
  };

  return (
    <AuthScaffold onBack={onBack}>
      <FadeSlideView delay={80}>
        <AuthHeader title="Create account" subtitle="Join SafeSafr and travel with confidence." />
      </FadeSlideView>

      <FadeSlideView delay={160} style={{ gap: spacing.lg }}>
        <AuthInput
          label="Full name"
          leftIcon="user"
          placeholder="Jane Traveller"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <AuthInput
          label="Email"
          leftIcon="mail"
          placeholder="you@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />
        <View style={{ gap: spacing.md }}>
          <AuthInput
            label="Password"
            leftIcon="lock"
            placeholder="Create a password"
            secure
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />
          <PasswordStrength password={password} />
        </View>
        <AuthInput
          label="Confirm password"
          leftIcon="lock"
          placeholder="Re-enter password"
          secure
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
        />
      </FadeSlideView>

      <FadeSlideView delay={240} style={{ gap: spacing.lg }}>
        <Button label="Create Account" onPress={submit} loading={loading} rightIcon="arrow-right" />
        <Divider label="or sign up with" />
        <SocialButton label="Continue with Google" icon="google" onPress={onGoogle} />
      </FadeSlideView>

      <FadeSlideView delay={320}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.xs }}>
          <ThemedText variant="body" color={colors.textMuted}>
            Already have an account?
          </ThemedText>
          <ThemedText variant="label" color={colors.primary} onPress={onLogin} suppressHighlighting>
            Sign in
          </ThemedText>
        </View>
      </FadeSlideView>
    </AuthScaffold>
  );
}

export default RegisterScreen;
