import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { useAppLock } from '@contexts/AppLockContext';
import { ForgotPinModal } from '@components/lock/ForgotPinModal';

const C = {
  bg: '#101828',
  primary: '#3A63F3',
  danger: '#E53935',
  textPrimary: '#FFFFFF',
  textMuted: '#98A2B3',
};

function ShieldIcon({ size = 40, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l7 3v6c0 4.8-3 8.7-7 10-4-1.3-7-5.2-7-10V5l7-3z" fill={color} opacity={0.95} />
      <Path d="M9 12l2 2 4-4" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function FingerprintIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4a8 8 0 0 1 8 8v2M4 12a8 8 0 0 1 4-6.9M8 20.5A8 8 0 0 1 4 14v-2M12 8a4 4 0 0 1 4 4v3.5M12 8a4 4 0 0 0-4 4v1M12 12v5.5M15 19a10 10 0 0 0 1-4"
        stroke={color}
        strokeWidth={1.7}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function BackspaceIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5h10a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M12 10l5 5M17 10l-5 5" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'];

/**
 * AppLockOverlay — renders on top of everything (mounted once in the
 * root layout) whenever AppLockContext says the app should be locked.
 * Tries biometrics automatically if enabled/available; always offers
 * the PIN pad as a fallback.
 */
export function AppLockOverlay() {
  const insets = useSafeAreaInsets();
  const { isLocked, biometricEnabled, biometricAvailable, verifyPin, attemptBiometricUnlock, error, clearError } =
    useAppLock();
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [forgotPinVisible, setForgotPinVisible] = useState(false);

  useEffect(() => {
    if (isLocked && biometricEnabled && biometricAvailable) {
      attemptBiometricUnlock();
    }
    if (!isLocked) setPin('');
  }, [isLocked]);

  if (!isLocked) return null;

  const handleDigit = async (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      const ok = await verifyPin(next);
      if (!ok) {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setTimeout(() => setPin(''), 250);
      }
    }
  };

  const handleBackspace = () => {
    clearError();
    setPin((p) => p.slice(0, -1));
  };

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.root, { paddingTop: insets.top + 40 }]}>
      <View style={styles.header}>
        <ShieldIcon />
        <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 14 }}>
          SafeSafar Locked
        </ThemedText>
        <ThemedText variant="bodySm" color={C.textMuted} style={{ marginTop: 4 }}>
          Enter your PIN to continue
        </ThemedText>
      </View>

      <View style={[styles.dotsRow, shake && styles.dotsRowShake]}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>

      {error && (
        <ThemedText variant="caption" color={C.danger} style={{ textAlign: 'center', marginTop: 12 }}>
          {error}
        </ThemedText>
      )}

      <View style={styles.keypad}>
        {KEYPAD.map((key, i) => {
          if (key === '') return <View key={`empty-${i}`} style={styles.key} />;
          if (key === 'back') {
            return (
              <Pressable key="back" onPress={handleBackspace} style={styles.key}>
                <BackspaceIcon />
              </Pressable>
            );
          }
          return (
            <Pressable key={key} onPress={() => handleDigit(key)} style={styles.key}>
              <ThemedText variant="title" color={C.textPrimary} style={{ fontSize: 26, fontWeight: '600' }}>
                {key}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {biometricEnabled && biometricAvailable && (
        <Pressable onPress={attemptBiometricUnlock} style={styles.biometricBtn}>
          <FingerprintIcon />
          <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600' }}>
            Use Biometrics
          </ThemedText>
        </Pressable>
      )}

      <Pressable onPress={() => setForgotPinVisible(true)} style={styles.forgotBtn}>
        <ThemedText variant="caption" color={C.textMuted} style={{ fontWeight: '600' }}>
          Forgot PIN?
        </ThemedText>
      </Pressable>

      <ForgotPinModal visible={forgotPinVisible} onClose={() => setForgotPinVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: C.bg, alignItems: 'center', zIndex: 999, elevation: 999 },
  header: { alignItems: 'center' },
  dotsRow: { flexDirection: 'row', gap: 16, marginTop: 32 },
  dotsRowShake: { marginLeft: 4 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: C.textMuted },
  dotFilled: { backgroundColor: C.primary, borderColor: C.primary },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 264,
    marginTop: 28,
    justifyContent: 'center',
  },
  key: { width: 88, height: 72, alignItems: 'center', justifyContent: 'center' },
  biometricBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  forgotBtn: { marginTop: 18, paddingVertical: 6 },
});

export default AppLockOverlay;