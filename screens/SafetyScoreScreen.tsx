import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { light, lightGradients } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { ScoreRing } from '@components/safety/ScoreRing';
import { FactorBar } from '@components/safety/FactorBar';
import { LightCard } from '@components/safety/LightCard';
import { MiniBarChart } from '@components/safety/MiniBarChart';
import { getSafetyScore, type SafetyScoreData } from '../services/safetyScore';

export interface SafetyScoreScreenProps {
  onBack?: () => void;
  onAskAI?: () => void;
}

/**
 * SafetyScoreScreen — AI Safety Score module (UI only).
 *
 * No AI model, no ML, no real network calls — getSafetyScore() below is a
 * mock service that simulates latency and returns hardcoded data. Swapping
 * in a real API later only requires changing services/safetyScore.ts; this
 * screen and its child components don't need to change.
 */
export function SafetyScoreScreen({ onBack, onAskAI }: SafetyScoreScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<SafetyScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (place: string) => {
    setLoading(true);
    const result = await getSafetyScore(place);
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    load('');
  }, [load]);

  const search = () => {
    if (query.trim()) load(query.trim());
  };

  const useCurrentLocation = () => load('current location');

  return (
    <View style={styles.root}>
      {/* Purple header */}
      <LinearGradient colors={lightGradients.header} style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <Icon name={'chevron-left' as any} size={24} color="#FFFFFF" />
          </Pressable>
          <ThemedText variant="title" color="#FFFFFF">
            AI Safety Score
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Search + current location */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon name={'search' as any} size={18} color={light.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={search}
              returnKeyType="search"
              placeholder="Search a place…"
              placeholderTextColor={light.textMuted}
              style={styles.searchInput}
            />
          </View>
          <Pressable style={styles.locBtn} onPress={useCurrentLocation}>
            <Icon name={'navigation' as any} size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>

      {loading || !data ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={light.primary} />
          <ThemedText variant="bodySm" color={light.textMuted} style={{ marginTop: 12 }}>
            Checking safety info…
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 100 }}
        >
          {/* Score card */}
          <FadeSlideView delay={40}>
            <LightCard style={{ alignItems: 'center', gap: 8 }} padding={24}>
              <View style={styles.placeRow}>
                <Icon name={'map-pin' as any} size={16} color={light.primary} />
                <ThemedText variant="label" color={light.textSecondary}>
                  {data.place}
                </ThemedText>
              </View>
              <ScoreRing score={data.score} riskLevel={data.riskLevel} />
              <ThemedText variant="caption" color={light.textMuted} style={{ textAlign: 'center' }}>
                Help improve this score by sharing your experience.
              </ThemedText>
            </LightCard>
          </FadeSlideView>

          {/* Factors */}
          <FadeSlideView delay={120}>
            <LightCard style={{ gap: 16 }}>
              <ThemedText variant="title" color={light.textPrimary}>
                Safety Factors
              </ThemedText>
              {data.factors.map((f, i) => (
                <FactorBar key={f.id} {...f} delay={150 + i * 120} />
              ))}
            </LightCard>
          </FadeSlideView>

          {/* Chart */}
          <FadeSlideView delay={200}>
            <LightCard style={{ gap: 8 }}>
              <MiniBarChart title="Reported incidents this week" data={data.weekIncidents} />
            </LightCard>
          </FadeSlideView>

          {/* Recent reports */}
          <FadeSlideView delay={260}>
            <LightCard style={{ gap: 14 }}>
              <ThemedText variant="title" color={light.textPrimary}>
                Recent Reports
              </ThemedText>
              {data.reports.map((r) => (
                <View key={r.id} style={styles.report}>
                  <View
                    style={[
                      styles.reportDot,
                      { backgroundColor: r.positive ? light.successSoft : light.dangerSoft },
                    ]}
                  >
                    <Icon
                      name={(r.positive ? 'check' : 'alert') as any}
                      size={14}
                      color={r.positive ? light.success : light.danger}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText variant="bodySm" color={light.textSecondary}>
                      {r.text}
                    </ThemedText>
                    <ThemedText variant="caption" color={light.textMuted}>
                      {r.time}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </LightCard>
          </FadeSlideView>

          {/* Why this score */}
          <FadeSlideView delay={320}>
            <LightCard style={{ gap: 12 }}>
              <ThemedText variant="title" color={light.textPrimary}>
                Why this score?
              </ThemedText>
              {data.reasons.map((reason) => (
                <View key={reason} style={styles.reason}>
                  <Icon name={'check' as any} size={16} color={light.success} />
                  <ThemedText variant="bodySm" color={light.textSecondary} style={{ flex: 1 }}>
                    {reason}
                  </ThemedText>
                </View>
              ))}
            </LightCard>
          </FadeSlideView>

          {/* Recommendation */}
          <FadeSlideView delay={380}>
            <View style={styles.recoCard}>
              <View style={styles.recoIcon}>
                <Icon name={'sparkles' as any} size={20} color={light.primary} />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText variant="label" color={light.primary}>
                  Safety Recommendation
                </ThemedText>
                <ThemedText variant="bodySm" color={light.textSecondary}>
                  {data.recommendation}
                </ThemedText>
              </View>
            </View>
          </FadeSlideView>
        </ScrollView>
      )}

      {/* Ask AI floating button (UI only — no functionality) */}
      {!loading && data && (
        <View style={[styles.askWrap, { bottom: insets.bottom + 16 }]}>
          <Pressable onPress={onAskAI}>
            {({ pressed }) => (
              <LinearGradient
                colors={lightGradients.purple}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.askBtn, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
              >
                <Icon name={'sparkles' as any} size={20} color="#FFFFFF" />
                <ThemedText variant="label" color="#FFFFFF">
                  Ask AI about this area
                </ThemedText>
              </LinearGradient>
            )}
          </Pressable>
        </View>
      )}
    </View>
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
  searchWrap: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingBottom: 18 },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  searchInput: { flex: 1, color: light.textPrimary, fontSize: 15, height: '100%' },
  locBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  report: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  reportDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reason: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  recoCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: light.primarySoft,
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  recoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askWrap: { position: 'absolute', left: 16, right: 16 },
  askBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 999,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
});

export default SafetyScoreScreen;