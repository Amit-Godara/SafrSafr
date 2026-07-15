import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@constants/index';
import { SearchBar } from '@components/ui/SearchBar';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import {
  WelcomeHeader,
  SafetyScoreCard,
  QuickActionsGrid,
  LiveMapPreview,
  RecommendationCard,
  NearbySafePlaces,
  RecentSearches,
  SectionHeader,
} from '@components/home';

export interface HomeScreenProps {
  onQuickAction?: (key: string) => void;
  onOpenMap?: () => void;
}

/**
 * HomeScreen — SafeSafr dashboard.
 * Composes the home sections with staggered fade/slide entrance animations.
 * Presentational only: demo data lives here, callbacks bubble intents up.
 */
export function HomeScreen({ onQuickAction, onOpenMap }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing['5xl'],
          paddingHorizontal: spacing.xl,
          gap: spacing['2xl'],
        }}
      >
        <FadeSlideView delay={40}>
          <WelcomeHeader />
        </FadeSlideView>

        <FadeSlideView delay={100}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder="Search places, routes, people…"
          />
        </FadeSlideView>

        <FadeSlideView delay={160}>
          <SafetyScoreCard score={82} area="Connaught Place" />
        </FadeSlideView>

        <FadeSlideView delay={220} style={{ gap: spacing.lg }}>
          <SectionHeader title="Quick Actions" onAction={() => onQuickAction?.('all')} />
          <QuickActionsGrid onPress={onQuickAction} />
        </FadeSlideView>

        <FadeSlideView delay={280}>
          <LiveMapPreview travelers={12} onPress={onOpenMap} />
        </FadeSlideView>

        <FadeSlideView delay={340} style={{ gap: spacing.lg }}>
          <SectionHeader title="For You" actionLabel="" />
          <RecommendationCard />
        </FadeSlideView>

        <FadeSlideView delay={400} style={{ gap: spacing.lg }}>
          <SectionHeader title="Nearby Safe Places" onAction={() => onQuickAction?.('places')} />
          <NearbySafePlaces onPress={onQuickAction} />
        </FadeSlideView>

        <FadeSlideView delay={460}>
          <RecentSearches onSelect={setQuery} onClear={() => {}} />
        </FadeSlideView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});

export default HomeScreen;
