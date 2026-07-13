import React, { useState } from 'react';
import { View } from 'react-native';
import {
  ScreenContainer,
  ThemedText,
  Button,
  Card,
  Input,
  SearchBar,
  Avatar,
  Badge,
  FloatingActionButton,
} from '@components/ui';
import {
  LoadingIndicator,
  Skeleton,
  ProgressBar,
  CircularProgress,
} from '@components/feedback';
import { Header } from '@components/navigation';
import { colors, spacing } from '@constants/index';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={{ gap: spacing.lg, marginBottom: spacing['3xl'] }}>
    <ThemedText variant="h3" color={colors.textPrimary}>
      {title}
    </ThemedText>
    {children}
  </View>
);

/**
 * DesignSystemScreen — living style guide.
 * Demonstrates every reusable component. Phase-1 landing screen.
 */
export function DesignSystemScreen() {
  const [query, setQuery] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="SafeSafr UI" rightAction={{ icon: 'settings' }} />
      <ScreenContainer scroll>
        <View style={{ marginBottom: spacing['2xl'] }}>
          <ThemedText variant="h1">Design System</ThemedText>
          <ThemedText variant="body" color={colors.textMuted}>
            Premium, travel-inspired components.
          </ThemedText>
        </View>

        <Section title="Typography">
          <ThemedText variant="display">Display</ThemedText>
          <ThemedText variant="h2">Heading 2</ThemedText>
          <ThemedText variant="title">Title</ThemedText>
          <ThemedText variant="body">Body — keep travellers safe, everywhere.</ThemedText>
          <ThemedText variant="caption" color={colors.textMuted}>
            Caption text
          </ThemedText>
        </Section>

        <Section title="Buttons">
          <Button label="Primary Action" variant="primary" leftIcon="shield" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Emergency SOS" variant="danger" leftIcon="alert" />
          <Button label="Loading" variant="primary" loading />
        </Section>

        <Section title="Search & Inputs">
          <SearchBar value={query} onChangeText={setQuery} onClear={() => setQuery('')} placeholder="Search places…" />
          <Input label="Full name" placeholder="Jane Traveller" leftIcon="profile" />
          <Input label="Phone" placeholder="+91 00000 00000" leftIcon="phone" />
        </Section>

        <Section title="Cards">
          <Card variant="solid">
            <ThemedText variant="title">Solid Card</ThemedText>
            <ThemedText variant="bodySm" color={colors.textMuted}>
              Rounded surface with a soft shadow.
            </ThemedText>
          </Card>
          <Card variant="glass">
            <ThemedText variant="title">Glass Card</ThemedText>
            <ThemedText variant="bodySm" color={colors.textSecondary}>
              Blurred glassmorphism surface.
            </ThemedText>
          </Card>
          <Card variant="outlined">
            <ThemedText variant="title">Outlined Card</ThemedText>
          </Card>
        </Section>

        <Section title="Avatars & Badges">
          <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
            <Avatar name="Jane Traveller" ring />
            <Avatar name="Rohit Kumar" />
            <Badge label="Location live" tone="success" dot />
            <Badge label="Verified" tone="primary" />
          </View>
        </Section>

        <Section title="Progress & Loading">
          <ProgressBar progress={0.65} />
          <View style={{ flexDirection: 'row', gap: spacing['2xl'], alignItems: 'center' }}>
            <CircularProgress progress={0.75} />
            <LoadingIndicator label="Locating…" />
          </View>
          <Skeleton height={20} />
          <Skeleton width="70%" height={20} />
        </Section>

        <Section title="Floating Action">
          <View style={{ flexDirection: 'row', gap: spacing.xl }}>
            <FloatingActionButton icon="plus" tone="brand" />
            <FloatingActionButton icon="alert" tone="danger" />
          </View>
        </Section>
      </ScreenContainer>
    </View>
  );
}

export default DesignSystemScreen;
