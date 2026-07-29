import React, { useState } from 'react';
import { View, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@components/ui/Typography';

/** Light "Guardian" palette — UI chrome matches Home; map canvas is dark. */
const C = {
  mapBg: '#0E1526',
  mapGrid: 'rgba(255,255,255,0.06)',
  mapRoad: 'rgba(255,255,255,0.14)',
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  danger: '#E53935',
  dangerSoft: 'rgba(229,57,53,0.18)',
  safe: '#22C55E',
  safeSoft: 'rgba(34,197,94,0.16)',
  police: '#3A63F3',
  hospital: '#E53935',
  report: '#F59E0B',
};

/* ---------------------------------------------------------------------- */
/* Inline icons — self-contained, no dependency on the shared Icon set.   */
/* ---------------------------------------------------------------------- */

function CrosshairIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={5} stroke={color} strokeWidth={1.9} fill="none" />
      <Line x1={12} y1={2} x2={12} y2={6} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={12} y1={18} x2={12} y2={22} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={2} y1={12} x2={6} y2={12} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Line x1={18} y1={12} x2={22} y2={12} stroke={color} strokeWidth={1.9} strokeLinecap="round" />
    </Svg>
  );
}

function AlertIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.5l9.5 16.5H2.5L12 3.5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M12 9.5v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={17} r={1} fill={color} />
    </Svg>
  );
}

function LayersIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3l9 5-9 5-9-5 9-5z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
      <Path d="M3 13l9 5 9-5" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function NavigationIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 19-7-4-7 4 7-19z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function ShieldIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
    </Svg>
  );
}

function CrossIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
    </Svg>
  );
}

function ReportIcon({ size = 16, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 5.5h16v9H10l-3.5 3v-3H4v-9z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill="none"
      />
      <Line x1={12} y1={9} x2={12} y2={11.5} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <SvgCircle cx={12} cy={13.5} r={0.9} fill={color} />
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

function PhoneIcon({ size = 15, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z"
        fill={color}
      />
    </Svg>
  );
}

function CheckIcon({ size = 15, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Mock data — no backend                                                */
/* ---------------------------------------------------------------------- */

type PinCategory = 'police' | 'hospital' | 'report';

interface Pin {
  id: string;
  category: PinCategory;
  x: number; // % of screen width
  y: number; // % of screen height
  name: string;
  subtitle: string;
  distance: string;
}

interface Zone {
  id: string;
  category: 'safe' | 'danger';
  x: number;
  y: number;
  radius: number;
  label: string;
}

const PINS: Pin[] = [
  { id: 'p1', category: 'police', x: 28, y: 34, name: 'Vidhayak Nagar Police Station', subtitle: '24/7 • 1.2 km away', distance: '1.2 km' },
  { id: 'p2', category: 'police', x: 70, y: 62, name: 'Central Police Outpost', subtitle: '24/7 • 2.4 km away', distance: '2.4 km' },
  { id: 'h1', category: 'hospital', x: 60, y: 30, name: 'City Care Hospital', subtitle: 'Emergency • 1.8 km away', distance: '1.8 km' },
  { id: 'h2', category: 'hospital', x: 22, y: 66, name: 'Sunrise Multispeciality', subtitle: 'Emergency • 2.1 km away', distance: '2.1 km' },
  { id: 'r1', category: 'report', x: 48, y: 48, name: 'Heavy crowd reported', subtitle: 'Market St • 20 min ago', distance: '0.4 km' },
  { id: 'r2', category: 'report', x: 78, y: 40, name: 'Poor lighting reported', subtitle: 'Old Bridge Rd • 1 hr ago', distance: '1.6 km' },
];

const ZONES: Zone[] = [
  { id: 'z1', category: 'safe', x: 32, y: 46, radius: 70, label: 'Safe Zone' },
  { id: 'z2', category: 'danger', x: 76, y: 68, radius: 55, label: 'Danger Zone' },
];

const CURRENT_LOCATION = { x: 48, y: 55, name: 'Connaught Place, Delhi' };

const LAYER_OPTIONS: { key: PinCategory | 'safe' | 'danger'; label: string; color: string }[] = [
  { key: 'police', label: 'Police', color: C.police },
  { key: 'hospital', label: 'Hospitals', color: C.hospital },
  { key: 'report', label: 'Reports', color: C.report },
  { key: 'safe', label: 'Safe Zones', color: C.safe },
  { key: 'danger', label: 'Danger Zones', color: C.danger },
];

/* ---------------------------------------------------------------------- */
/* Small reusable pieces (kept local to this screen)                     */
/* ---------------------------------------------------------------------- */

function PressScale({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={[style, animStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.92, { damping: 14, stiffness: 300 }))}
        onPressOut={() => (scale.value = withSpring(1, { damping: 12, stiffness: 260 }))}
        style={StyleSheet.absoluteFillObject}
      />
      {children}
    </Animated.View>
  );
}

function PulsingDot() {
  const pulse = useSharedValue(0.6);
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.8, { duration: 1600, easing: Easing.out(Easing.ease) }), -1, false);
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 1 - (pulse.value - 0.6) / 1.2,
  }));
  return (
    <View style={styles.currentLocWrap}>
      <Animated.View style={[styles.currentLocPulse, style]} />
      <View style={styles.currentLocDot} />
    </View>
  );
}

const CATEGORY_ICON: Record<PinCategory, (props: { size?: number; color?: string }) => React.ReactElement> = {
  police: ShieldIcon,
  hospital: CrossIcon,
  report: ReportIcon,
};
const CATEGORY_COLOR: Record<PinCategory, string> = {
  police: C.police,
  hospital: C.hospital,
  report: C.report,
};

/* ======================================================================= */

export interface MapScreenProps {
  onSOS?: () => void;
  onPlanRoute?: () => void;
}

/**
 * MapScreen — mocked full-screen map (dark canvas, illustrated roads/grid
 * via SVG) with police/hospital/report pins, safe/danger zone overlays,
 * floating action buttons, and a bottom info card. No real maps SDK, no
 * backend — everything is static dummy data, but pins are interactive
 * and update the bottom card.
 */
export function MapScreen({ onSOS, onPlanRoute }: MapScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [visible, setVisible] = useState<Set<string>>(
    new Set(['police', 'hospital', 'report', 'safe', 'danger']),
  );

  const px = (pct: number) => (pct / 100) * width;
  const py = (pct: number) => (pct / 100) * height;

  const toggleLayer = (key: string) => {
    setVisible((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <View style={styles.root}>
      {/* Dark map canvas */}
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        {/* grid */}
        {Array.from({ length: Math.ceil(width / 40) }).map((_, i) => (
          <Line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={height} stroke={C.mapGrid} strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(height / 40) }).map((_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * 40} x2={width} y2={i * 40} stroke={C.mapGrid} strokeWidth={1} />
        ))}

        {/* illustrative "roads" */}
        <Path
          d={`M0,${py(20)} C ${px(25)},${py(15)} ${px(35)},${py(40)} ${px(55)},${py(35)} S ${px(85)},${py(50)} ${width},${py(45)}`}
          stroke={C.mapRoad}
          strokeWidth={4}
          fill="none"
        />
        <Path
          d={`M${px(15)},0 C ${px(20)},${py(30)} ${px(40)},${py(55)} ${px(45)},${height}`}
          stroke={C.mapRoad}
          strokeWidth={3}
          fill="none"
        />
        <Path
          d={`M${px(80)},0 L ${px(65)},${py(40)} L ${px(78)},${height}`}
          stroke={C.mapRoad}
          strokeWidth={3}
          fill="none"
        />

        {/* zones */}
        {ZONES.filter((z) => visible.has(z.category)).map((z) => (
          <SvgCircle
            key={z.id}
            cx={px(z.x)}
            cy={py(z.y)}
            r={z.radius}
            fill={z.category === 'safe' ? C.safeSoft : C.dangerSoft}
            stroke={z.category === 'safe' ? C.safe : C.danger}
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
        ))}
      </Svg>

      {/* Zone labels */}
      {ZONES.filter((z) => visible.has(z.category)).map((z) => (
        <View
          key={`${z.id}-label`}
          pointerEvents="none"
          style={[styles.zoneLabel, { left: px(z.x) - 40, top: py(z.y) - z.radius - 22 }]}
        >
          <ThemedText
            variant="caption"
            color={z.category === 'safe' ? C.safe : C.danger}
            style={{ fontWeight: '700' }}
          >
            {z.label}
          </ThemedText>
        </View>
      ))}

      {/* Current location */}
      <View pointerEvents="none" style={{ position: 'absolute', left: px(CURRENT_LOCATION.x) - 22, top: py(CURRENT_LOCATION.y) - 22 }}>
        <PulsingDot />
      </View>

      {/* Pins */}
      {PINS.filter((p) => visible.has(p.category)).map((pin) => {
        const Icon = CATEGORY_ICON[pin.category];
        const color = CATEGORY_COLOR[pin.category];
        const isSelected = selectedPin?.id === pin.id;
        return (
          <PressScale
            key={pin.id}
            onPress={() => setSelectedPin(pin)}
            style={[
              styles.pin,
              {
                left: px(pin.x) - 16,
                top: py(pin.y) - 16,
                backgroundColor: color,
                borderColor: isSelected ? '#FFFFFF' : 'transparent',
                borderWidth: isSelected ? 3 : 0,
              },
            ]}
          >
            <Icon size={15} />
          </PressScale>
        );
      })}

      {/* Top current-location pill */}
      <View style={[styles.topPill, { top: insets.top + 12 }]}>
        <View style={styles.topPillDot} />
        <ThemedText variant="caption" color={C.textPrimary} style={{ fontWeight: '700' }}>
          {CURRENT_LOCATION.name}
        </ThemedText>
      </View>

      {/* Layers panel */}
      {layersOpen && (
        <View style={[styles.layersPanel, { top: insets.top + 60 }]}>
          {LAYER_OPTIONS.map((opt) => {
            const active = visible.has(opt.key);
            return (
              <Pressable key={opt.key} onPress={() => toggleLayer(opt.key)} style={styles.layerRow}>
                <View style={[styles.layerDot, { backgroundColor: opt.color, opacity: active ? 1 : 0.3 }]} />
                <ThemedText
                  variant="bodySm"
                  color={active ? C.textPrimary : C.textMuted}
                  style={{ flex: 1, fontWeight: '600' }}
                >
                  {opt.label}
                </ThemedText>
                <View style={[styles.toggle, active && styles.toggleActive]}>
                  <View style={[styles.toggleDot, active && styles.toggleDotActive]} />
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Floating action buttons */}
      <View style={[styles.fabColumn, { bottom: selectedPin ? 210 : 140 }]}>
        <PressScale onPress={() => setLayersOpen((o) => !o)} style={styles.fab}>
          <LayersIcon />
        </PressScale>
        <PressScale onPress={onPlanRoute} style={styles.fab}>
          <NavigationIcon />
        </PressScale>
        <PressScale onPress={() => setSelectedPin(null)} style={styles.fab}>
          <CrosshairIcon />
        </PressScale>
        <PressScale onPress={onSOS} style={[styles.fab, styles.sosFab]}>
          <AlertIcon />
        </PressScale>
      </View>

      {/* Bottom info card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.dragHandle} />
        {selectedPin ? (
          <>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: CATEGORY_COLOR[selectedPin.category] }]}>
                {React.createElement(CATEGORY_ICON[selectedPin.category], { size: 18 })}
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  {selectedPin.name}
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  {selectedPin.subtitle}
                </ThemedText>
              </View>
            </View>
            <View style={styles.cardActions}>
              <PressScale onPress={() => {}} style={[styles.actionBtn, { backgroundColor: C.primary }]}>
                <PhoneIcon />
                <ThemedText variant="caption" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Call
                </ThemedText>
              </PressScale>
              <PressScale onPress={() => setSelectedPin(null)} style={[styles.actionBtn, styles.actionBtnGhost]}>
                <ThemedText variant="caption" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  Close
                </ThemedText>
              </PressScale>
            </View>
          </>
        ) : (
          <>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.cardIconWrap, { backgroundColor: C.safe }]}>
                <CheckIcon />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" color={C.textPrimary} style={{ fontWeight: '700' }}>
                  You're in a Safe Zone
                </ThemedText>
                <ThemedText variant="caption" color={C.textSecondary}>
                  {CURRENT_LOCATION.name} • Score 78/100
                </ThemedText>
              </View>
              <ChevronRightIcon />
            </View>
            <ThemedText variant="caption" color={C.textMuted} style={{ marginTop: 10 }}>
              Tap a pin to see police stations, hospitals, and community reports nearby.
            </ThemedText>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.mapBg },
  currentLocWrap: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  currentLocPulse: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(58,99,243,0.35)',
  },
  currentLocDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: C.primary,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  pin: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  zoneLabel: {
    position: 'absolute',
    backgroundColor: 'rgba(14,21,38,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  topPill: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    alignSelf: 'flex-start',
  },
  topPillDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.primary },
  layersPanel: {
    position: 'absolute',
    right: 16,
    width: 190,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  layerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  layerDot: { width: 9, height: 9, borderRadius: 4.5 },
  toggle: {
    width: 34,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E7ECF4',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: C.primary },
  toggleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleDotActive: { alignSelf: 'flex-end' },
  fabColumn: {
    position: 'absolute',
    right: 16,
    gap: 12,
    alignItems: 'center',
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sosFab: { backgroundColor: C.danger },
  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E7ECF4',
    alignSelf: 'center',
    marginBottom: 14,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 12,
  },
  actionBtnGhost: { backgroundColor: C.primarySoft },
});

export default MapScreen;