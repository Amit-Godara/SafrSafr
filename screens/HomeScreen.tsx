// import React, { useState } from 'react';
// import { View, ScrollView, StyleSheet } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { colors, spacing } from '@constants/index';
// import { SearchBar } from '@components/ui/SearchBar';
// import { FadeSlideView } from '@components/ui/FadeSlideView';
// import {
//   WelcomeHeader,
//   SafetyScoreCard,
//   QuickActionsGrid,
//   LiveMapPreview,
//   RecommendationCard,
//   NearbySafePlaces,
//   RecentSearches,
//   SectionHeader,
// } from '@components/home';

// export interface HomeScreenProps {
//   onQuickAction?: (key: string) => void;
//   onOpenMap?: () => void;
// }

// /**
//  * HomeScreen — SafeSafr dashboard.
//  * Composes the home sections with staggered fade/slide entrance animations.
//  * Presentational only: demo data lives here, callbacks bubble intents up.
//  */
// export function HomeScreen({ onQuickAction, onOpenMap }: HomeScreenProps) {
//   const insets = useSafeAreaInsets();
//   const [query, setQuery] = useState('');

//   return (
//     <View style={styles.root}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingTop: insets.top + spacing.md,
//           paddingBottom: spacing['5xl'],
//           paddingHorizontal: spacing.xl,
//           gap: spacing['2xl'],
//         }}
//       >
//         <FadeSlideView delay={40}>
//           <WelcomeHeader />
//         </FadeSlideView>

//         <FadeSlideView delay={100}>
//           <SearchBar
//             value={query}
//             onChangeText={setQuery}
//             onClear={() => setQuery('')}
//             placeholder="Search places, routes, people…"
//           />
//         </FadeSlideView>

//         <FadeSlideView delay={160}>
//           <SafetyScoreCard score={82} area="Connaught Place" />
//         </FadeSlideView>

//         <FadeSlideView delay={220} style={{ gap: spacing.lg }}>
//           <SectionHeader title="Quick Actions" onAction={() => onQuickAction?.('all')} />
//           <QuickActionsGrid onPress={onQuickAction} />
//         </FadeSlideView>

//         <FadeSlideView delay={280}>
//           <LiveMapPreview travelers={12} onPress={onOpenMap} />
//         </FadeSlideView>

//         <FadeSlideView delay={340} style={{ gap: spacing.lg }}>
//           <SectionHeader title="For You" actionLabel="" />
//           <RecommendationCard />
//         </FadeSlideView>

//         <FadeSlideView delay={400} style={{ gap: spacing.lg }}>
//           <SectionHeader title="Nearby Safe Places" onAction={() => onQuickAction?.('places')} />
//           <NearbySafePlaces onPress={onQuickAction} />
//         </FadeSlideView>

//         <FadeSlideView delay={460}>
//           <RecentSearches onSelect={setQuery} onClear={() => {}} />
//         </FadeSlideView>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: colors.background },
// });

// export default HomeScreen;


// import React from 'react';
// import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
// import { light, lightGradients } from '@constants/lightTheme';
// import { ThemedText } from '@components/ui/Typography';
// import { Icon } from '@components/ui/Icon';
// import { FadeSlideView } from '@components/ui/FadeSlideView';
// import { LightCard } from '@components/safety/LightCard';

// /** Dummy user + status data (no backend). */
// const USER_NAME = 'Arjun';
// const HAS_UNREAD_NOTIFICATIONS = true;

// type QuickAction = {
//   key: string;
//   icon: Parameters<typeof Icon>[0]['name'];
//   iconBg: string;
//   title: string;
//   subtitle: string;
//   onPress?: () => void;
// };

// const QUICK_ACTIONS: QuickAction[] = [
//   {
//     key: 'sos',
//     icon: 'alert' as any,
//     iconBg: '#EF4444',
//     title: 'Emergency SOS',
//     subtitle: 'Tap to alert your contacts',
//   },
//   {
//     key: 'nearby',
//     icon: 'shield' as any,
//     iconBg: '#3B82F6',
//     title: 'Nearby Help',
//     subtitle: 'Police, Hospitals & more',
//   },
//   {
//     key: 'routes',
//     icon: 'map-pin' as any,
//     iconBg: '#22C55E',
//     title: 'Safe Routes',
//     subtitle: 'Find safer routes to your destination',
//   },
//   {
//     key: 'ai',
//     icon: 'message-circle' as any,
//     iconBg: light.primary,
//     title: 'AI Assistant',
//     subtitle: 'Ask anything, get safety tips',
//   },
// ];

// export interface HomeScreenProps {
//   onQuickAction?: (key: string) => void;
//   onNotificationsPress?: () => void;
//   onSafeZonePress?: () => void;
// }

// /**
//  * HomeScreen — main dashboard tab (light purple mockup theme).
//  * Greeting + notification bell, promo banner, 2x2 quick actions grid,
//  * and a live safe-zone status strip. Dummy data only, no backend.
//  */
// export function HomeScreen({ onQuickAction, onNotificationsPress, onSafeZonePress }: HomeScreenProps) {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={styles.root}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           padding: 16,
//           paddingTop: insets.top + 16,
//           paddingBottom: insets.bottom + 100,
//           gap: 20,
//         }}
//       >
//         {/* Greeting header */}
//         <FadeSlideView delay={0}>
//           <View style={styles.headerRow}>
//             <View style={{ gap: 4 }}>
//               <ThemedText variant="title" color={light.textPrimary} style={styles.greeting}>
//                 Hello, {USER_NAME} 👋
//               </ThemedText>
//               <ThemedText variant="bodySm" color={light.textMuted}>
//                 Stay alert, stay safe!
//               </ThemedText>
//             </View>

//             <Pressable onPress={onNotificationsPress} hitSlop={10} style={styles.bellBtn}>
//               <Icon name={'bell' as any} size={20} color={light.textPrimary} />
//               {HAS_UNREAD_NOTIFICATIONS && <View style={styles.bellDot} />}
//             </Pressable>
//           </View>
//         </FadeSlideView>

//         {/* Promo banner */}
//         <FadeSlideView delay={80}>
//           <LinearGradient
//             colors={lightGradients.purple}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.banner}
//           >
//             {/* Decorative background shield mark */}
//             <Icon
//               name={'shield' as any}
//               size={72}
//               color="rgba(255,255,255,0.12)"
//               // style={styles.bannerWatermark}
//             />

//             <View style={styles.bannerText}>
//               <ThemedText variant="title" color="#FFFFFF" style={styles.bannerHeading}>
//                 Trusted by Travelers Everywhere
//               </ThemedText>
//               <ThemedText variant="bodySm" color="rgba(255,255,255,0.85)">
//                 You're in safe hands with SafeSafar.
//               </ThemedText>
//             </View>

//             {/* TODO: replace with a real illustration asset, e.g.:
//                 <Image source={require('@assets/images/traveler.png')} style={styles.bannerArt} /> */}
//             <View style={styles.bannerArtPlaceholder}>
//               <Icon name={'check' as any} size={40} color="#FFFFFF" />
//             </View>
//           </LinearGradient>
//         </FadeSlideView>

//         {/* Quick Actions */}
//         <FadeSlideView delay={140}>
//           <View style={{ gap: 12 }}>
//             <ThemedText variant="title" color={light.textPrimary}>
//               Quick Actions
//             </ThemedText>

//             <View style={styles.grid}>
//               {QUICK_ACTIONS.map((action, i) => (
//                 <FadeSlideView key={action.key} delay={180 + i * 80} style={styles.gridItem}>
//                   <Pressable onPress={() => onQuickAction?.(action.key)}>
//                     <LightCard style={{ gap: 12 }}>
//                       <View style={[styles.actionIconWrap, { backgroundColor: action.iconBg }]}>
//                         <Icon name={action.icon} size={22} color="#FFFFFF" />
//                       </View>

//                       <View style={{ gap: 2 }}>
//                         <ThemedText variant="label" color={light.textPrimary} style={styles.actionTitle}>
//                           {action.title}
//                         </ThemedText>
//                         <ThemedText variant="caption" color={light.textMuted}>
//                           {action.subtitle}
//                         </ThemedText>
//                       </View>

//                       <View style={styles.actionArrowWrap}>
//                         <Icon name={'chevron-right' as any} size={16} color={light.primary} />
//                       </View>
//                     </LightCard>
//                   </Pressable>
//                 </FadeSlideView>
//               ))}
//             </View>
//           </View>
//         </FadeSlideView>

//         {/* Safe zone status strip */}
//         <FadeSlideView delay={420}>
//           <Pressable onPress={onSafeZonePress} style={styles.safeZone}>
//             <View style={styles.safeZoneIcon}>
//               <Icon name={'shield' as any} size={18} color={light.success} />
//             </View>
//             <View style={{ flex: 1, gap: 2 }}>
//               <ThemedText variant="label" color={light.success}>
//                 You are in Safe Zone
//               </ThemedText>
//               <ThemedText variant="caption" color={light.textMuted}>
//                 No active alerts
//               </ThemedText>
//             </View>
//             <Icon name={'chevron-right' as any} size={18} color={light.success} />
//           </Pressable>
//         </FadeSlideView>
//       </ScrollView>
//     </View>
//   );
// }

// const CARD_GAP = 12;

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: light.background },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//   },
//   greeting: { fontSize: 22, fontWeight: '700' },
//   bellBtn: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#EEF0F5',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   bellDot: {
//     position: 'absolute',
//     top: 8,
//     right: 9,
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#EF4444',
//     borderWidth: 1.5,
//     borderColor: '#FFFFFF',
//   },
//   banner: {
//     borderRadius: 24,
//     padding: 24,
//     minHeight: 170,
//     overflow: 'hidden',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   bannerWatermark: { position: 'absolute', top: 12, right: 12 },
//   bannerText: { flex: 1, gap: 10, paddingRight: 12 },
//   bannerHeading: { fontSize: 20, lineHeight: 26 },
//   bannerArtPlaceholder: {
//     width: 84,
//     height: 84,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.16)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: CARD_GAP,
//   },
//   gridItem: {
//     width: `${(100 - 4) / 2}%` as unknown as number, // ~48% — two columns with gap
//   },
//   actionIconWrap: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   actionTitle: { fontSize: 15, fontWeight: '700' },
//   actionArrowWrap: {
//     position: 'absolute',
//     right: 16,
//     bottom: 16,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: light.primarySoft,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   safeZone: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     padding: 16,
//     borderRadius: 18,
//     backgroundColor: light.successSoft,
//   },
//   safeZoneIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: '#FFFFFF',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default HomeScreen;





import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { light, lightGradients } from '@constants/lightTheme';
import { ThemedText } from '@components/ui/Typography';
import { Icon } from '@components/ui/Icon';
import { FadeSlideView } from '@components/ui/FadeSlideView';
import { LightCard } from '@components/safety/LightCard';

/** Dummy user + status data (no backend). */
const USER_NAME = 'Arjun';
const HAS_UNREAD_NOTIFICATIONS = true;

type QuickAction = {
  key: string;
  icon: Parameters<typeof Icon>[0]['name'];
  iconBg: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    key: 'sos',
    icon: 'alert' as any,
    iconBg: '#EF4444',
    title: 'Emergency SOS',
    subtitle: 'Tap to alert your contacts',
  },
  {
    key: 'nearby',
    icon: 'shield' as any,
    iconBg: '#3B82F6',
    title: 'Nearby Help',
    subtitle: 'Police, Hospitals & more',
  },
  {
    key: 'routes',
    icon: 'map-pin' as any,
    iconBg: '#22C55E',
    title: 'Safe Routes',
    subtitle: 'Find safer routes to your destination',
  },
  {
    key: 'ai',
    // was 'message-circle' — that icon name doesn't exist in Icon.tsx,
    // which is why the card rendered as an empty purple square.
    icon: 'sparkles' as any,
    iconBg: light.primary,
    title: 'AI Assistant',
    subtitle: 'Ask anything, get safety tips',
  },
];

export interface HomeScreenProps {
  onQuickAction?: (key: string) => void;
  onNotificationsPress?: () => void;
  onSafeZonePress?: () => void;
}

/**
 * HomeScreen — main dashboard tab (light purple mockup theme).
 * Greeting + notification bell, promo banner, 2x2 quick actions grid,
 * and a live safe-zone status strip. Dummy data only, no backend.
 */
export function HomeScreen({ onQuickAction, onNotificationsPress, onSafeZonePress }: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          gap: 20,
        }}
      >
        {/* Greeting header */}
        <FadeSlideView delay={0}>
          <View style={styles.headerRow}>
            <View style={{ gap: 4 }}>
              <ThemedText variant="title" color={light.textPrimary} style={styles.greeting}>
                Hello, {USER_NAME} 👋
              </ThemedText>
              <ThemedText variant="bodySm" color={light.textMuted}>
                Stay alert, stay safe!
              </ThemedText>
            </View>

            <Pressable onPress={onNotificationsPress} hitSlop={10} style={styles.bellBtn}>
              <Icon name={'bell' as any} size={20} color={light.textPrimary} />
              {HAS_UNREAD_NOTIFICATIONS && <View style={styles.bellDot} />}
            </Pressable>
          </View>
        </FadeSlideView>

        {/* Promo banner */}
        <FadeSlideView delay={80}>
          <LinearGradient
            colors={lightGradients.purple}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            {/* Decorative background shield mark */}
            <Icon
              name={'shield' as any}
              size={72}
              color="rgba(255,255,255,0.12)"
              style={styles.bannerWatermark}
            />

            <View style={styles.bannerText}>
              <ThemedText variant="title" color="#FFFFFF" style={styles.bannerHeading}>
                Trusted by Travelers Everywhere
              </ThemedText>
              <ThemedText variant="bodySm" color="rgba(255,255,255,0.85)">
                You're in safe hands with SafeSafar.
              </ThemedText>
            </View>

            {/* TODO: replace with a real illustration asset, e.g.:
                <Image source={require('@assets/images/traveler.png')} style={styles.bannerArt} /> */}
            <View style={styles.bannerArtPlaceholder}>
              <Icon name={'check' as any} size={40} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </FadeSlideView>

        {/* Quick Actions */}
        <FadeSlideView delay={140}>
          <View style={{ gap: 12 }}>
            <ThemedText variant="title" color={light.textPrimary}>
              Quick Actions
            </ThemedText>

            <View style={styles.grid}>
              {QUICK_ACTIONS.map((action, i) => (
                <FadeSlideView key={action.key} delay={180 + i * 80} style={styles.gridItem}>
                  <Pressable onPress={() => onQuickAction?.(action.key)}>
                    <LightCard style={{ gap: 12 }}>
                      <View style={[styles.actionIconWrap, { backgroundColor: action.iconBg }]}>
                        <Icon name={action.icon} size={22} color="#FFFFFF" />
                      </View>

                      <View style={{ gap: 2 }}>
                        <ThemedText variant="label" color={light.textPrimary} style={styles.actionTitle}>
                          {action.title}
                        </ThemedText>
                        <ThemedText variant="caption" color={light.textMuted}>
                          {action.subtitle}
                        </ThemedText>
                      </View>

                      <View style={styles.actionArrowWrap}>
                        <Icon name={'chevron-right' as any} size={16} color={light.primary} />
                      </View>
                    </LightCard>
                  </Pressable>
                </FadeSlideView>
              ))}
            </View>
          </View>
        </FadeSlideView>

        {/* Safe zone status strip */}
        <FadeSlideView delay={420}>
          <Pressable onPress={onSafeZonePress} style={styles.safeZone}>
            <View style={styles.safeZoneIcon}>
              <Icon name={'shield' as any} size={18} color={light.success} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <ThemedText variant="label" color={light.success}>
                You are in Safe Zone
              </ThemedText>
              <ThemedText variant="caption" color={light.textMuted}>
                No active alerts
              </ThemedText>
            </View>
            <Icon name={'chevron-right' as any} size={18} color={light.success} />
          </Pressable>
        </FadeSlideView>
      </ScrollView>
    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: light.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  greeting: { fontSize: 22, fontWeight: '700' },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  banner: {
    borderRadius: 24,
    padding: 24,
    minHeight: 170,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerWatermark: { position: 'absolute', top: 12, right: 12 },
  bannerText: { flex: 1, gap: 10, paddingRight: 12 },
  bannerHeading: { fontSize: 20, lineHeight: 26 },
  bannerArtPlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  gridItem: {
    width: `${(100 - 4) / 2}%` as unknown as number, // ~48% — two columns with gap
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: { fontSize: 15, fontWeight: '700' },
  actionArrowWrap: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeZone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: light.successSoft,
  },
  safeZoneIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;