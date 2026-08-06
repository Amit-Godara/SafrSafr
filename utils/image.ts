import * as ImagePicker from 'expo-image-picker';

export type ImagePickerErrorCode = 'permission_denied' | 'unavailable' | 'unknown';

export class ImagePickerError extends Error {
  code: ImagePickerErrorCode;
  constructor(code: ImagePickerErrorCode, message: string) {
    super(message);
    this.name = 'ImagePickerError';
    this.code = code;
  }
}

async function ensureCameraPermission(): Promise<void> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.status === ImagePicker.PermissionStatus.GRANTED) return;

  const requested = await ImagePicker.requestCameraPermissionsAsync();
  if (requested.status !== ImagePicker.PermissionStatus.GRANTED) {
    throw new ImagePickerError('permission_denied', 'Camera permission was denied.');
  }
}

async function ensureGalleryPermission(): Promise<void> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.status === ImagePicker.PermissionStatus.GRANTED) return;

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (requested.status !== ImagePicker.PermissionStatus.GRANTED) {
    throw new ImagePickerError('permission_denied', 'Photo library permission was denied.');
  }
}

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true, // square crop UI
  aspect: [1, 1],
  quality: 1, // high quality
  allowsMultipleSelection: false,
};

/**
 * captureFromCamera — requests camera permission only if not already
 * granted, then opens the camera. Returns the captured image's local
 * URI, or null if the user cancelled (cancelling is not an error).
 */
export async function captureFromCamera(): Promise<string | null> {
  await ensureCameraPermission();

  let result: ImagePicker.ImagePickerResult;
  try {
    result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  } catch {
    throw new ImagePickerError('unavailable', 'The camera is unavailable on this device.');
  }

  if (result.canceled) return null;
  return result.assets?.[0]?.uri ?? null;
}

/**
 * pickFromGallery — requests photo library permission only if not
 * already granted, then opens the gallery for a single square crop.
 * Returns the selected image's local URI, or null if cancelled.
 */
export async function pickFromGallery(): Promise<string | null> {
  await ensureGalleryPermission();

  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled) return null;
  return result.assets?.[0]?.uri ?? null;
}