import React, { useState } from 'react';
import { Modal, View, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { useAppLock } from '@contexts/AppLockContext';
import { useUserProfile } from '@contexts/UserProfileContext';
import { requestOtp, verifyOtp, type OtpMethod } from '@services/otp';

const C = {
  card: '#1D2939',
  primary: '#3A63F3',
  danger: '#E53935',
  success: '#22C55E',
  textPrimary: '#FFFFFF',
  textMuted: '#98A2B3',
  inputBg: 'rgba(255,255,255,0.08)',
  border: 'rgba(255,255,255,0.12)',
};

/* ---------------------------------------------------------------------- */

function MailIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M4 6.5l8 6 8-6" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function PhoneIcon({ size = 20, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={7} y={2.5} width={10} height={19} rx={2.2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M10.5 18.5h3" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon({ size = 22, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={10} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function ChevronLeftIcon({ size = 20, color = C.textPrimary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 6l-6 6 6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */

type Step = 'method' | 'contact' | 'otp' | 'newPin';

export interface ForgotPinModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * ForgotPinModal — Forgot PIN flow launched from the lock screen.
 * Method (email/phone) -> contact detail -> OTP -> new PIN, then calls
 * AppLockContext.resetPin(). All "sending"/"verifying" goes through
 * services/otp.ts, the single swap point for a real backend later.
 */
export function ForgotPinModal({ visible, onClose }: ForgotPinModalProps) {
  const { resetPin } = useAppLock();
  const { email: profileEmail } = useUserProfile();

  const [step, setStep] = useState<Step>('method');
  const [method, setMethod] = useState<OtpMethod | null>(null);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setStep('method');
    setMethod(null);
    setContact('');
    setOtp('');
    setDevOtp(null);
    setNewPin('');
    setConfirmPin('');
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const selectMethod = (m: OtpMethod) => {
    setMethod(m);
    setContact(m === 'email' ? profileEmail : '');
    setError(null);
    setStep('contact');
  };

  const sendOtp = async () => {
    if (!method) return;
    if (!contact.trim()) {
      setError(method === 'email' ? 'Enter your email address.' : 'Enter your phone number.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { devOtp: code } = await requestOtp(method, contact.trim());
      setDevOtp(code); // demo-only — a real backend would never return this
      setStep('otp');
    } catch {
      setError('Failed to send the code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmOtp = async () => {
    if (!method) return;
    if (otp.length !== 6) {
      setError('Enter the 6-digit code.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const ok = await verifyOtp(method, contact.trim(), otp);
      if (!ok) {
        setError('Incorrect or expired code. Please try again.');
        return;
      }
      setStep('newPin');
    } finally {
      setIsLoading(false);
    }
  };

  const submitNewPin = async () => {
    setError(null);
    if (newPin.length !== 4) {
      setError('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PIN and confirmation do not match.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPin(newPin);
      setSuccess(true);
      setTimeout(() => {
        reset();
        onClose();
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to reset PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {step !== 'method' && !success && (
            <Pressable
              onPress={() => {
                setError(null);
                if (step === 'contact') setStep('method');
                else if (step === 'otp') setStep('contact');
                else if (step === 'newPin') setStep('otp');
              }}
              style={styles.backBtn}
            >
              <ChevronLeftIcon />
            </Pressable>
          )}

          {success ? (
            <View style={{ alignItems: 'center', paddingVertical: 12 }}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(34,197,94,0.15)' }]}>
                <LockIcon color={C.success} />
              </View>
              <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 14 }}>
                PIN Reset
              </ThemedText>
              <ThemedText variant="bodySm" color={C.textMuted} style={{ marginTop: 4 }}>
                Your new PIN is ready to use.
              </ThemedText>
            </View>
          ) : (
            <>
              {step === 'method' && (
                <>
                  <View style={styles.iconWrap}>
                    <LockIcon />
                  </View>
                  <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 12 }}>
                    Forgot PIN?
                  </ThemedText>
                  <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 4, marginBottom: 20 }}>
                    Choose how you'd like to verify it's you.
                  </ThemedText>

                  <Pressable onPress={() => selectMethod('email')} style={styles.methodRow}>
                    <MailIcon />
                    <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600', flex: 1 }}>
                      Verify with Email
                    </ThemedText>
                  </Pressable>
                  <Pressable onPress={() => selectMethod('phone')} style={styles.methodRow}>
                    <PhoneIcon />
                    <ThemedText variant="bodySm" color={C.textPrimary} style={{ fontWeight: '600', flex: 1 }}>
                      Verify with Phone
                    </ThemedText>
                  </Pressable>
                </>
              )}

              {step === 'contact' && method && (
                <>
                  <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 6 }}>
                    {method === 'email' ? 'Confirm Email' : 'Confirm Phone Number'}
                  </ThemedText>
                  <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 4, marginBottom: 18 }}>
                    We'll send a 6-digit code to verify it's you.
                  </ThemedText>
                  <TextInput
                    value={contact}
                    onChangeText={setContact}
                    placeholder={method === 'email' ? 'you@example.com' : '+91 00000 00000'}
                    placeholderTextColor={C.textMuted}
                    keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
                    autoCapitalize="none"
                    style={styles.input}
                  />
                  <PrimaryButton label="Send Code" loading={isLoading} onPress={sendOtp} />
                </>
              )}

              {step === 'otp' && (
                <>
                  <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 6 }}>
                    Enter Code
                  </ThemedText>
                  <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 4 }}>
                    Sent to {contact}
                  </ThemedText>
                  {devOtp && (
                    <ThemedText variant="caption" color={C.primary} style={{ textAlign: 'center', marginTop: 6 }}>
                      Demo mode — your code is {devOtp}
                    </ThemedText>
                  )}
                  <TextInput
                    value={otp}
                    onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="••••••"
                    placeholderTextColor={C.textMuted}
                    style={[styles.input, { marginTop: 16, letterSpacing: 6, textAlign: 'center' }]}
                  />
                  <PrimaryButton label="Verify Code" loading={isLoading} onPress={confirmOtp} />
                  <Pressable onPress={sendOtp} disabled={isLoading} style={{ marginTop: 12 }}>
                    <ThemedText variant="caption" color={C.primary} style={{ fontWeight: '700', textAlign: 'center' }}>
                      Resend Code
                    </ThemedText>
                  </Pressable>
                </>
              )}

              {step === 'newPin' && (
                <>
                  <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 6 }}>
                    Set New PIN
                  </ThemedText>
                  <ThemedText variant="bodySm" color={C.textMuted} style={{ textAlign: 'center', marginTop: 4, marginBottom: 18 }}>
                    Choose a new 4-digit PIN.
                  </ThemedText>
                  <View style={{ width: '100%', gap: 14 }}>
                    <PinField label="New PIN" value={newPin} onChangeText={setNewPin} />
                    <PinField label="Confirm New PIN" value={confirmPin} onChangeText={setConfirmPin} />
                  </View>
                  <PrimaryButton label="Reset PIN" loading={isLoading} onPress={submitNewPin} />
                </>
              )}

              {error && (
                <ThemedText variant="caption" color={C.danger} style={{ marginTop: 14, textAlign: 'center' }}>
                  {error}
                </ThemedText>
              )}
            </>
          )}

          {!success && (
            <Pressable onPress={handleClose} style={{ marginTop: 16 }}>
              <ThemedText variant="caption" color={C.textMuted} style={{ textAlign: 'center' }}>
                Cancel
              </ThemedText>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function PrimaryButton({ label, onPress, loading }: { label: string; onPress: () => void; loading: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={[styles.primaryBtn, { marginTop: 18 }]}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

function PinField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (t: string) => void }) {
  return (
    <View style={{ gap: 6 }}>
      <ThemedText variant="caption" color={C.textMuted} style={{ fontWeight: '700' }}>
        {label}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 4))}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        placeholder="••••"
        placeholderTextColor={C.textMuted}
        style={[styles.input, { letterSpacing: 4 }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: C.card,
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  backBtn: { alignSelf: 'flex-start', padding: 4, marginBottom: 4 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(58,99,243,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    backgroundColor: C.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  input: {
    width: '100%',
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: C.textPrimary,
    borderWidth: 1,
    borderColor: C.border,
  },
  primaryBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotPinModal;