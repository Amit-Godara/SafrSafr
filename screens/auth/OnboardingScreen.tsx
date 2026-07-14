import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  Pressable,
  ViewToken,
} from 'react-native';
import { AuthBackground } from '@components/auth';
import { ThemedText } from '@components/ui/Typography';
import { Button } from '@components/ui/Button';
import { Icon, IconName } from '@components/ui/Icon';
import { colors, spacing, radius, shadow } from '@constants/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Slide {
  key: string;
  icon: IconName;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    key: '1',
    icon: 'shield',
    title: 'Your safety, always on',
    subtitle: 'One tap sends an SOS with your live location to trusted contacts.',
  },
  {
    key: '2',
    icon: 'map-pin',
    title: 'Share your journey',
    subtitle: 'Let people you trust follow your route in real time, wherever you go.',
  },
  {
    key: '3',
    icon: 'community',
    title: 'A community that cares',
    subtitle: 'Connect with nearby travellers and get help when you need it most.',
  },
];

export interface OnboardingScreenProps {
  onDone?: () => void;
  onSkip?: () => void;
}

/**
 * OnboardingScreen — 3 swipeable slides with animated dots and a
 * primary CTA that advances / finishes.
 */
export function OnboardingScreen({ onDone, onSkip }: OnboardingScreenProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const onViewRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setIndex(viewableItems[0].index ?? 0);
  });

  const isLast = index === SLIDES.length - 1;

  const next = () => {
    if (isLast) return onDone?.();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <AuthBackground>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.skipRow}>
          <Pressable onPress={onSkip} hitSlop={10}>
            <ThemedText variant="label" color={colors.textMuted}>
              Skip
            </ThemedText>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s.key}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width }]}>
              <View style={styles.iconBadge}>
                <Icon name={item.icon} size={72} color={colors.primary} />
              </View>
              <View style={{ gap: spacing.md, alignItems: 'center' }}>
                <ThemedText variant="h1" color={colors.textPrimary} style={{ textAlign: 'center' }}>
                  {item.title}
                </ThemedText>
                <ThemedText
                  variant="bodyLg"
                  color={colors.textMuted}
                  style={{ textAlign: 'center' }}
                >
                  {item.subtitle}
                </ThemedText>
              </View>
            </View>
          )}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === index
                    ? { width: 28, backgroundColor: colors.primary }
                    : { width: 8, backgroundColor: colors.surfaceAlt },
                ]}
              />
            ))}
          </View>
          <Button
            label={isLast ? 'Get Started' : 'Next'}
            rightIcon="arrow-right"
            onPress={next}
          />
        </View>
      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: spacing.xl, paddingVertical: spacing.md },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing['4xl'], paddingHorizontal: spacing['2xl'] },
  iconBadge: {
    width: 160,
    height: 160,
    borderRadius: radius.full,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.glowTeal,
  },
  footer: { paddingHorizontal: spacing.xl, gap: spacing['2xl'] },
  dots: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
  dot: { height: 8, borderRadius: radius.pill },
});

export default OnboardingScreen;
