import React, { useState } from 'react';
import { View, ScrollView, TextInput, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
// import { light, lightGradients } from '@constants/lightTheme';
import {light, lightGradients} from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { ScoreRing } from '@components/safety/ScoreRing';
import { FactorBar } from '@components/safety/FactorBar';
import { LightCard } from '@components/safety/LightCard';
import { MiniBarChart } from '@components/safety/MiniBarChart';

/** Dummy AI safety data (no backend / no AI). */
const DUMMY = {
  place: 'Connaught Place, New Delhi',
  score: 4.2,
  riskLevel: 'Moderately Safe',
  factors: [
    { label: 'Crime Rate', icon: 'alert' as const, value: 32, highIs: 'bad' as const, caption: 'Low' },
    { label: 'Crowd Density', icon: 'community' as const, value: 74, highIs: 'good' as const, caption: 'Busy' },
    { label: 'Lighting', icon: 'sparkles' as const, value: 82, highIs: 'good' as const, caption: 'Well lit' },
    { label: 'Police Presence', icon: 'shield' as const, value: 68, highIs: 'good' as const, caption: 'Nearby' },
  ],
  weekIncidents: [
    { label: 'Mon', value: 30 },
    { label: 'Tue', value: 22 },
    { label: 'Wed', value: 48 },
    { label: 'Thu', value: 35 },
    { label: 'Fri', value: 66, highlight: true },
    { label: 'Sat', value: 58 },
    { label: 'Sun', value: 40 },
  ],
  reports: [
    { id: '1', text: 'Well-lit and crowded till late evening.', time: '2 hrs ago', positive: true },
    { id: '2', text: 'Avoid inner lanes after 11 pm, quite dark.', time: '5 hrs ago', positive: false },
    { id: '3', text: 'Police patrol seen near the metro gate.', time: 'Yesterday', positive: true },
  ],
  reasons: [
    'Well-lit and usually crowded till late evening',
    'Active police patrolling reported this week',
    'Few incidents reported in inner lanes after 11 pm',
  ],
  recommendation:
    'Connaught Place is moderately safe at night. Stay in well-lit main blocks, avoid lonely inner lanes, and share your live location with a trusted contact.',
};

export interface SafetyScoreScreenProps {
  onBack?: () => void;
  onAskAI?: () => void;
}

/**
 * SafetyScoreScreen — AI Safety Score module (light purple mockup theme).
 * Search or use current location; shows animated score, factors, chart,
 * reports, reasons and a recommendation. Dummy data only.
 */
export function SafetyScoreScreen({ onBack, onAskAI }: SafetyScoreScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [place, setPlace] = useState(DUMMY.place);

  const search = () => {
    if (query.trim()) setPlace(query.trim());
  };

  return (
    <View style={styles.root}>
      {/* Purple header */}
      <LinearGradient colors={lightGradients.header} style={{ paddingTop: insets.top }}>
        <View style={styles.header}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
            <Icon name="chevron-left" size={24} color="#FFFFFF" />
          </Pressable>
          <ThemedText variant="title" color="#FFFFFF">
            AI Safety Score
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>

        {/* Search + current location */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Icon name="search" size={18} color={light.textMuted} />
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
          <Pressable
            style={styles.locBtn}
            onPress={() => setPlace('Your Current Location')}
          >
            <Icon name="navigation" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: insets.bottom + 100 }}
      >
        {/* Score card */}
        <FadeSlideView delay={40}>
          <LightCard style={{ alignItems: 'center', gap: 8 }} padding={24}>
            <View style={styles.placeRow}>
              <Icon name="map-pin" size={16} color={light.primary} />
              <ThemedText variant="label" color={light.textSecondary}>
                {place}
              </ThemedText>
            </View>
            <ScoreRing score={DUMMY.score} label={DUMMY.riskLevel} />
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
            {DUMMY.factors.map((f, i) => (
              <FactorBar key={f.label} {...f} delay={150 + i * 120} />
            ))}
          </LightCard>
        </FadeSlideView>

        {/* Chart */}
        <FadeSlideView delay={200}>
          <LightCard style={{ gap: 8 }}>
            <MiniBarChart title="Reported incidents this week" data={DUMMY.weekIncidents} />
          </LightCard>
        </FadeSlideView>

        {/* Recent reports */}
        <FadeSlideView delay={260}>
          <LightCard style={{ gap: 14 }}>
            <ThemedText variant="title" color={light.textPrimary}>
              Recent Reports
            </ThemedText>
            {DUMMY.reports.map((r) => (
              <View key={r.id} style={styles.report}>
                <View
                  style={[
                    styles.reportDot,
                    { backgroundColor: r.positive ? light.successSoft : light.dangerSoft },
                  ]}
                >
                  <Icon
                    name={r.positive ? 'check' : 'alert'}
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
            {DUMMY.reasons.map((reason) => (
              <View key={reason} style={styles.reason}>
                <Icon name="check" size={16} color={light.success} />
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
              <Icon name="sparkles" size={20} color={light.primary} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText variant="label" color={light.primary}>
                Safety Recommendation
              </ThemedText>
              <ThemedText variant="bodySm" color={light.textSecondary}>
                {DUMMY.recommendation}
              </ThemedText>
            </View>
          </View>
        </FadeSlideView>
      </ScrollView>

      {/* Ask AI floating button */}
      <View style={[styles.askWrap, { bottom: insets.bottom + 16 }]}>
        <Pressable onPress={onAskAI}>
          {({ pressed }) => (
            <LinearGradient
              colors={lightGradients.purple}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.askBtn, { transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            >
              <Icon name="sparkles" size={20} color="#FFFFFF" />
              <ThemedText variant="label" color="#FFFFFF">
                Ask AI about this area
              </ThemedText>
            </LinearGradient>
          )}
        </Pressable>
      </View>
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
