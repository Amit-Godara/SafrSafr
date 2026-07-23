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
//     // was 'message-circle' — that icon name doesn't exist in Icon.tsx,
//     // which is why the card rendered as an empty purple square.
//     icon: 'sparkles' as any,
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
//               style={styles.bannerWatermark}
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
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { FadeSlideView } from '@components/ui/FadeSlideView';

/**
 * Local "Guardian" palette for this screen only. Deliberately not pulled
 * from constants/lightTheme.ts (the purple palette used by the Safety
 * Score / AI Assistant screens) — this Home redesign uses its own blue +
 * red brand direction per the latest mockup.
 */
const C = {
  // Background
  page: '#F7F8FC',

  // Cards
  card: '#FFFFFF',

  // Primary Blue
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',

  // Text
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',

  // Grey Card
  reportBg: '#F4F6FB',

  // SOS
  emergency: '#ff0008',
  emergencyDark: '#ff000d',

  // Border
  border: '#E7ECF4',

  // Bottom Navigation
  navInactive: '#8D96B5',
  navActive: '#3A63F3',
};

/* ---------------------------------------------------------------------- */
/* Inline icons — self-contained SVGs so this file has zero dependency on */
/* the shared Icon component's registered name set.                      */
/* ---------------------------------------------------------------------- */

function ShieldCheckIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z"
        fill={color}
        opacity={0.95}
      />
      <Path
        d="M9 12l2 2 4-4"
        stroke="#2F6FED"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function BellIcon({ size = 20, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3a5 5 0 0 0-5 5v3.2c0 .6-.2 1.2-.6 1.7L5 15.5h14l-1.4-2.6a2.8 2.8 0 0 1-.6-1.7V8a5 5 0 0 0-5-5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9.5 18.5a2.5 2.5 0 0 0 5 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function SettingsIcon({ size = 20, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} fill="none" />
      <Path
        d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10.7A1.7 1.7 0 0 0 11.7 4.5V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10.7c.2.6.7 1 1.3 1.1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function PinIcon({ size = 14, color = C.textSecondary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21s-6.5-5.7-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.3-6.5 11-6.5 11z"
        stroke={color}
        strokeWidth={1.8}
        fill="none"
      />
      <SvgCircle cx={12} cy={10} r={2.2} stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function AlertTriangleIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3.5l9.5 16.5H2.5L12 3.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function MapIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9 4.5v13M15 6.5v13" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function ChatIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.5h16v10H9l-4 3.5v-3.5H4v-10z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function LightbulbIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18h6M10 21h4M8 10a4 4 0 1 1 8 0c0 1.8-1 2.7-1.7 3.6-.5.6-.8 1-.8 1.9H10.5c0-.9-.3-1.3-.8-1.9C9 12.7 8 11.8 8 10z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */

/** Dummy status data (no backend). */
const LOCATION = 'Delhi';
const SAFETY_STATUS = 'Good';
const NEARBY_TRAVELERS_COUNT = 24;
const LATEST_REPORT = 'Reports of heavy crowd at Market St';
const HAS_UNREAD_NOTIFICATIONS = true;

export interface HomeScreenProps {
  onActivateSOS?: () => void;
  onAIAgentPress?: () => void;
  onPlanRoute?: () => void;
  onNearbyTravelersPress?: () => void;
  onNotificationsPress?: () => void;
  onSettingsPress?: () => void;
}

/**
 * HomeScreen — "Guardian" dashboard redesign.
 * Header, location + safety status, Smart SOS banner, AI Agent / Smart
 * Route cards, Nearby Travelers card, and a nightly precautions tip.
 * Dummy data only, no backend.
 */
export function HomeScreen({
  onActivateSOS,
  onAIAgentPress,
  onPlanRoute,
  onNearbyTravelersPress,
  onNotificationsPress,
  onSettingsPress,
}: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          gap: 16,
        }}
      >
        {/* Header */}
        <FadeSlideView delay={0}>
          <View style={styles.headerRow}>
            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <ShieldCheckIcon size={20} />
              </View>
              <ThemedText variant="title" color={C.textPrimary} style={styles.brandText}>
                Amit
              </ThemedText>
            </View>

            <View style={styles.headerActions}>
              <Pressable onPress={onNotificationsPress} hitSlop={10} style={styles.iconBtn}>
                <BellIcon />
                {HAS_UNREAD_NOTIFICATIONS && <View style={styles.notifDot} />}
              </Pressable>
              <Pressable onPress={onSettingsPress} hitSlop={10} style={styles.iconBtn}>
                <SettingsIcon />
              </Pressable>
            </View>
          </View>
        </FadeSlideView>

        {/* Location + status */}
        <FadeSlideView delay={60}>
          <View style={{ gap: 4 }}>
            <View style={styles.locRow}>
              <PinIcon />
              <ThemedText variant="caption" color={C.textSecondary}>
                Current location
              </ThemedText>
            </View>
            <ThemedText variant="title" color={C.textPrimary} style={styles.locationText}>
              {LOCATION}
            </ThemedText>
            <ThemedText variant="bodySm" color={C.textSecondary}>
              Safety score around you is{' '}
              <ThemedText variant="bodySm" color={C.primary} style={{ fontWeight: '700' }}>
                {SAFETY_STATUS}
              </ThemedText>
            </ThemedText>
          </View>
        </FadeSlideView>

        {/* Smart SOS banner */}
        <FadeSlideView delay={120}>
          <LinearGradient
            colors={['#ff0000', '#fd0000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sosCard}
          >
            <View style={styles.sosTopRow}>
              <View style={styles.sosIconWrap}>
                <AlertTriangleIcon size={18} />
              </View>
              <ThemedText variant="caption" color="#FFFFFF" style={styles.sosLabel}>
                EMERGENCY
              </ThemedText>
            </View>

            <ThemedText variant="title" color="#FFFFFF" style={styles.sosTitle}>
              Smart SOS
            </ThemedText>
            <ThemedText variant="bodySm" color="rgba(255,255,255,0.9)" style={{ marginBottom: 16 }}>
              One tap to alert emergency contacts and services.
            </ThemedText>

            <Pressable
              onPress={onActivateSOS}
              style={({ pressed }) => [styles.sosBtn, pressed && { opacity: 0.9 }]}
            >
              <ThemedText variant="label" color="rgb(255, 0, 0)" style={{ fontWeight: '700', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12,width: '100%', textAlign: 'center' }}>
                Activate SOS
              </ThemedText>
            </Pressable>
          </LinearGradient>
        </FadeSlideView>

        {/* AI Agent / Smart Route */}
        <FadeSlideView delay={180}>
          <View style={styles.grid}>
            <Pressable onPress={onAIAgentPress} style={styles.gridItem}>
              <View style={styles.card}>
                <View style={styles.cardIconWrap}>
                  <ShieldCheckIcon size={18} color={C.primary} />
                </View>
                <ThemedText variant="label" color={C.textPrimary} style={[styles.cardTitle]}>
                  AI Agent
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  Predicts safety score for any location
                </ThemedText>
              </View>
            </Pressable>

            <View style={styles.gridItem}>
              <View style={styles.card}>
                <View style={styles.cardIconWrap}>
                  <MapIcon size={18} />
                </View>
                <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                  Smart Route
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  Safest path, not just shortest
                </ThemedText>
                <Pressable onPress={onPlanRoute} style={styles.planRouteRow}>
                  <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700' }}>
                    Plan a route
                  </ThemedText>
                  <ChevronRightIcon size={13} />
                </Pressable>
              </View>
            </View>
          </View>
        </FadeSlideView>

        {/* Nearby Travelers */}
        <FadeSlideView delay={240}>
          <Pressable onPress={onNearbyTravelersPress} style={styles.card}>
            <View style={styles.travelersRow}>
              <View style={styles.cardIconWrap}>
                <ChatIcon size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                  Nearby Travelers
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  {NEARBY_TRAVELERS_COUNT} travelers nearby
                </ThemedText>
              </View>
              <View style={styles.chevronBtn}>
                <ChevronRightIcon size={16} />
              </View>
            </View>

            <View style={styles.reportBox}>
              <ThemedText variant="caption" color={C.textSecondary}>
                "{LATEST_REPORT}"
              </ThemedText>
            </View>
          </Pressable>
        </FadeSlideView>

        {/* Precautions */}
        <FadeSlideView delay={300}>
          <View style={[styles.card, styles.precautionsRow]}>
            <View style={styles.cardIconWrap}>
              <LightbulbIcon size={18} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="label" color={C.textPrimary} style={styles.cardTitle}>
                Precautions for tonight
              </ThemedText>
              <ThemedText variant="caption" color={C.textSecondary}>
                Stay alert and keep your phone charged.
              </ThemedText>
            </View>
          </View>
        </FadeSlideView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { fontSize: 25, fontWeight: '800' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  notifDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.primary,
  },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontSize: 26, fontWeight: '800' },
  sosCard: { borderRadius: 24, padding: 22 },
  sosTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sosIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosLabel: { fontWeight: '700', letterSpacing: 1 },
  sosTitle: { fontSize: 24, fontWeight: '800', marginBottom: 6 },
  sosBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  grid: { flexDirection: 'row', gap: 12 },
  gridItem: { flex: 1 },
  card: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    gap: 6,
    shadowColor: '#27338e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.75,
    shadowRadius: 14,
    elevation: 2,
  },
  cardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 20, fontWeight: '700' },
  planRouteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  travelersRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBox: {
    marginTop: 14,
    backgroundColor: C.reportBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  precautionsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});

export default HomeScreen;