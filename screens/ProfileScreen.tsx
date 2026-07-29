import React from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Rect } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';

const C = {
  page: '#F7F8FC',
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
  success: '#22C55E',
  successSoft: '#DCFCE7',
  danger: '#E53935',
  dangerSoft: '#FDECEC',
  amber: '#F59E0B',
  amberSoft: '#FEF3C7',
};

/* ---------------------------------------------------------------------- */
/* Inline icons                                                          */
/* ---------------------------------------------------------------------- */

function UserIcon({ size = 40, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={8} r={4} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M4 20c0-4 3.6-6.8 8-6.8s8 2.8 8 6.8" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function CameraIcon({ size = 14, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <SvgCircle cx={12} cy={13} r={3.3} stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function MapTripIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4.5L4 6.5v13l5-2 6 2 5-2v-13l-5 2-6-2z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function ShieldIcon({ size = 18, color = C.success }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

function AlertIcon({ size = 18, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" fill="none" />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function ScoreIcon({ size = 18, color = C.amber }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l2.9 6.3 6.9.7-5.2 4.7 1.6 6.8L12 17l-6.2 3.5 1.6-6.8-5.2-4.7 6.9-.7L12 2z" fill={color} />
    </Svg>
  );
}

function TripsMenuIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={4} y={5} width={16} height={15} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M4 9.5h16M8 3v3M16 3v3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function ContactsIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function SettingsIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4.5a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H10.7A1.7 1.7 0 0 0 11.7 4.5V4.5a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V10.7c.2.6.7 1 1.3 1.1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function LockIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={10} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function HelpIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.7} fill="none" />
      <Path
        d="M9.5 9.3a2.5 2.5 0 1 1 3.7 2.2c-.8.5-1.2 1-1.2 1.9"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
      />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function LogoutIcon({ size = 18, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l5 4-5 4M21 12H9"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

function ChevronRightIcon({ size = 16, color = C.textMuted }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Reusable cards                                                        */
/* ---------------------------------------------------------------------- */

function StatCard({
  icon,
  value,
  label,
  accent,
  accentSoft,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
  accentSoft: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconWrap, { backgroundColor: accentSoft }]}>{icon}</View>
      <ThemedText variant="title" color={C.textPrimary} style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText variant="caption" color={C.textMuted}>
        {label}
      </ThemedText>
    </View>
  );
}

function MenuRow({
  icon,
  label,
  onPress,
  danger,
  isLast,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  isLast?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.menuRow, !isLast && styles.menuRowBorder]}>
      <View style={[styles.menuIconWrap, { backgroundColor: danger ? C.dangerSoft : C.primarySoft }]}>{icon}</View>
      <ThemedText
        variant="bodySm"
        color={danger ? C.danger : C.textPrimary}
        style={{ flex: 1, fontWeight: '600' }}
      >
        {label}
      </ThemedText>
      {!danger && <ChevronRightIcon />}
    </Pressable>
  );
}

/* ---------------------------------------------------------------------- */

const USER = {
  name: 'Amit Sharma',
  email: 'amit.sharma@email.com',
  tripsCompleted: 24,
  safeTrips: 22,
  sosUsed: 2,
  safetyScore: 86,
};

export interface ProfileScreenProps {
  onMyTrips?: () => void;
  onEmergencyContacts?: () => void;
  onSettings?: () => void;
  onPrivacy?: () => void;
  onHelp?: () => void;
  onLogout?: () => void;
  onEditPicture?: () => void;
}

/**
 * ProfileScreen — profile header, stats grid, and settings menu.
 * Light theme matching Home. Dummy data only, no backend.
 */
export function ProfileScreen({
  onMyTrips,
  onEmergencyContacts,
  onSettings,
  onPrivacy,
  onHelp,
  onLogout,
  onEditPicture,
}: ProfileScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24, gap: 16 }}
      >
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <UserIcon />
            </View>
            <Pressable onPress={onEditPicture} style={styles.cameraBadge}>
              <CameraIcon />
            </Pressable>
          </View>
          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 12 }}>
            {USER.name}
          </ThemedText>
          <ThemedText variant="bodySm" color={C.textMuted}>
            {USER.email}
          </ThemedText>
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon={<MapTripIcon />}
            value={String(USER.tripsCompleted)}
            label="Trips Completed"
            accent={C.primary}
            accentSoft={C.primarySoft}
          />
          <StatCard
            icon={<ShieldIcon />}
            value={String(USER.safeTrips)}
            label="Safe Trips"
            accent={C.success}
            accentSoft={C.successSoft}
          />
          <StatCard
            icon={<AlertIcon />}
            value={String(USER.sosUsed)}
            label="SOS Used"
            accent={C.danger}
            accentSoft={C.dangerSoft}
          />
          <StatCard
            icon={<ScoreIcon />}
            value={`${USER.safetyScore}`}
            label="Safety Score"
            accent={C.amber}
            accentSoft={C.amberSoft}
          />
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          <MenuRow icon={<TripsMenuIcon />} label="My Trips" onPress={onMyTrips} />
          <MenuRow icon={<ContactsIcon />} label="Emergency Contacts" onPress={onEmergencyContacts} />
          <MenuRow icon={<SettingsIcon />} label="Settings" onPress={onSettings} />
          <MenuRow icon={<LockIcon />} label="Privacy" onPress={onPrivacy} />
          <MenuRow icon={<HelpIcon />} label="Help" onPress={onHelp} isLast />
        </View>

        <View style={styles.menuCard}>
          <MenuRow icon={<LogoutIcon />} label="Logout" onPress={onLogout} danger isLast />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.page },
  profileHeader: { alignItems: 'center' },
  avatarWrap: { width: 96, height: 96 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: C.page,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: {
    width: '47%',
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    gap: 4,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  menuCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  menuIconWrap: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
});

export default ProfileScreen;