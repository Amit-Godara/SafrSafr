import React, { useState } from 'react';
import { Modal, View, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import { ThemedText } from '@components/ui/Typography';

const C = {
  card: '#FFFFFF',
  primary: '#3A63F3',
  primarySoft: '#EEF3FF',
  danger: '#E53935',
  dangerSoft: '#FDECEC',
  textPrimary: '#101828',
  textSecondary: '#667085',
  border: '#E7ECF4',
};

/* ---------------------------------------------------------------------- */

function EyeIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke={color} strokeWidth={1.7} fill="none" />
      <SvgCircle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function CameraIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth={1.7}
        strokeLinejoin="round"
        fill="none"
      />
      <SvgCircle cx={12} cy={13} r={3.3} stroke={color} strokeWidth={1.7} fill="none" />
    </Svg>
  );
}

function GalleryIcon({ size = 18, color = C.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 5h16v14H4V5z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" fill="none" />
      <SvgCircle cx={9} cy={10} r={1.6} stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M4 16l5-4 4 3 3-2 4 4" stroke={color} strokeWidth={1.6} strokeLinejoin="round" fill="none" />
    </Svg>
  );
}

function TrashIcon({ size = 18, color = C.danger }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-8 0v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}

function CloseIcon({ size = 22, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

/* ---------------------------------------------------------------------- */

function SheetRow({
  icon,
  label,
  onPress,
  danger,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={[styles.iconWrap, danger && { backgroundColor: C.dangerSoft }]}>{icon}</View>
      <ThemedText variant="bodySm" color={danger ? C.danger : C.textPrimary} style={{ fontWeight: '600' }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export interface ProfilePhotoActionSheetProps {
  visible: boolean;
  onClose: () => void;
  hasPhoto: boolean;
  imageUri: string | null;
  isSaving: boolean;
  onTakePhoto: () => void;
  onChooseFromGallery: () => void;
  onRemovePhoto: () => void;
}

/**
 * ProfilePhotoActionSheet — bottom sheet with View/Take/Choose/Remove/
 * Cancel, plus a simple full-screen photo preview for "View Photo".
 * Purely new UI — does not modify or wrap the existing Profile screen.
 */
export function ProfilePhotoActionSheet({
  visible,
  onClose,
  hasPhoto,
  imageUri,
  isSaving,
  onTakePhoto,
  onChooseFromGallery,
  onRemovePhoto,
}: ProfilePhotoActionSheetProps) {
  const [previewing, setPreviewing] = useState(false);

  const runThenClose = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />

            {hasPhoto && <SheetRow icon={<EyeIcon />} label="View Photo" onPress={() => setPreviewing(true)} />}

            <SheetRow icon={<CameraIcon />} label="Take Photo" onPress={() => runThenClose(onTakePhoto)} disabled={isSaving} />
            <SheetRow
              icon={<GalleryIcon />}
              label="Choose from Gallery"
              onPress={() => runThenClose(onChooseFromGallery)}
              disabled={isSaving}
            />

            {hasPhoto && (
              <SheetRow icon={<TrashIcon />} label="Remove Photo" danger onPress={() => runThenClose(onRemovePhoto)} disabled={isSaving} />
            )}

            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <ThemedText variant="label" color={C.textSecondary} style={{ fontWeight: '700' }}>
                Cancel
              </ThemedText>
            </Pressable>

            {isSaving && (
              <View style={styles.savingOverlay}>
                <ActivityIndicator color={C.primary} />
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={previewing} transparent animationType="fade" onRequestClose={() => setPreviewing(false)}>
        <View style={styles.previewBackdrop}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />}
          <Pressable
            onPress={() => {
              setPreviewing(false);
              onClose();
            }}
            style={styles.previewCloseBtn}
          >
            <CloseIcon />
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(16,24,40,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 28,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  rowDisabled: { opacity: 0.5 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: C.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    marginTop: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  previewBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center' },
  previewImage: { width: '90%', height: '70%' },
  previewCloseBtn: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProfilePhotoActionSheet;