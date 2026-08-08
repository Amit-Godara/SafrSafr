import React, { useState } from 'react';
import { Modal, View, Pressable, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';
import { useAppLock } from '@contexts/AppLockContext';

const C = {
  card: '#FFFFFF',
  primary: '#3A63F3',
  danger: '#E53935',
  success: '#22C55E',
  textPrimary: '#101828',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  border: '#E7ECF4',
  inputBg: '#F3F4F8',
};

function LockIcon({ size = 22, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={10} width={14} height={10} rx={2} stroke={color} strokeWidth={1.7} fill="none" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function PinField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View style={{ gap: 6 }}>
      <ThemedText variant="caption" color={C.textSecondary} style={{ fontWeight: '700' }}>
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
        style={styles.input}
      />
    </View>
  );
}

export interface ChangePinModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * ChangePinModal — Current PIN / New PIN / Confirm New PIN, wired to
 * AppLockContext.changePin(). Fully self-contained: manages its own
 * field state, validation, loading, and success/error messaging so it
 * can be dropped into the Privacy screen with a single mount + two props.
 */
export function ChangePinModal({ visible, onClose }: ChangePinModalProps) {
  const { changePin } = useAppLock();

  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = async () => {
    setError(null);

    if (currentPin.length !== 4) {
      setError('Enter your current 4-digit PIN.');
      return;
    }
    if (newPin.length !== 4) {
      setError('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PIN and confirmation do not match.');
      return;
    }
    if (newPin === currentPin) {
      setError('New PIN must be different from your current PIN.');
      return;
    }

    setIsSaving(true);
    try {
      await changePin(currentPin, newPin);
      setSuccess(true);
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to change PIN. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconWrap}>
            <LockIcon />
          </View>

          <ThemedText variant="title" color={C.textPrimary} style={{ fontWeight: '800', marginTop: 12 }}>
            Change PIN
          </ThemedText>
          <ThemedText variant="caption" color={C.textMuted} style={{ textAlign: 'center', marginTop: 4, marginBottom: 18 }}>
            Enter your current PIN and choose a new one.
          </ThemedText>

          <View style={{ width: '100%', gap: 14 }}>
            <PinField label="Current PIN" value={currentPin} onChangeText={setCurrentPin} />
            <PinField label="New PIN" value={newPin} onChangeText={setNewPin} />
            <PinField label="Confirm New PIN" value={confirmPin} onChangeText={setConfirmPin} />
          </View>

          {error && (
            <ThemedText variant="caption" color={C.danger} style={{ marginTop: 12, textAlign: 'center' }}>
              {error}
            </ThemedText>
          )}
          {success && (
            <ThemedText variant="caption" color={C.success} style={{ marginTop: 12, textAlign: 'center', fontWeight: '700' }}>
              PIN changed successfully.
            </ThemedText>
          )}

          <View style={styles.actions}>
            <Pressable onPress={handleClose} style={styles.cancelBtn} disabled={isSaving}>
              <ThemedText variant="label" color={C.textSecondary} style={{ fontWeight: '700' }}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveBtn} disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                  Save
                </ThemedText>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(16,24,40,0.5)',
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
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: C.inputBg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: C.textPrimary,
    letterSpacing: 4,
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChangePinModal;  