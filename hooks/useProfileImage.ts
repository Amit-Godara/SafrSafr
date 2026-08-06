import { useState, useEffect, useCallback, useRef } from 'react';
import { captureFromCamera, pickFromGallery, ImagePickerError } from '@utils/image';
import { getProfileImage, saveProfileImage, removeProfileImage } from '@services/profileImage';

export interface UseProfileImageResult {
  imageUri: string | null;
  /** True only during the initial load from storage on mount. */
  isLoading: boolean;
  /** True while a pick/save/remove operation is in progress. */
  isSaving: boolean;
  error: string | null;
  takePhoto: () => Promise<void>;
  chooseFromGallery: () => Promise<void>;
  removePhoto: () => Promise<void>;
  clearError: () => void;
}

/**
 * useProfileImage — single hook the Profile screen needs. Loads the
 * saved photo on mount, exposes memoized actions (stable references, so
 * passing them as props doesn't cause unnecessary re-renders of children
 * like the action sheet), and normalizes errors into a plain string.
 */
export function useProfileImage(): UseProfileImageResult {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    (async () => {
      try {
        const saved = await getProfileImage();
        if (isMounted.current) setImageUri(saved);
      } catch {
        if (isMounted.current) setError('Could not load your saved photo.');
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    })();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const runPicker = useCallback(async (picker: () => Promise<string | null>) => {
    setError(null);
    setIsSaving(true);
    try {
      const uri = await picker();
      if (uri === null) return; // user cancelled — not an error, nothing to do
      await saveProfileImage(uri);
      if (isMounted.current) setImageUri(uri);
    } catch (err) {
      if (err instanceof ImagePickerError) {
        if (err.code === 'permission_denied') {
          setError('Permission denied. Enable camera/photo access in your device settings to continue.');
        } else if (err.code === 'unavailable') {
          setError('Camera is not available on this device.');
        } else {
          setError('Something went wrong picking that photo.');
        }
      } else {
        setError('Failed to save your photo. Please try again.');
      }
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  }, []);

  const takePhoto = useCallback(() => runPicker(captureFromCamera), [runPicker]);
  const chooseFromGallery = useCallback(() => runPicker(pickFromGallery), [runPicker]);

  const removePhoto = useCallback(async () => {
    setError(null);
    setIsSaving(true);
    try {
      await removeProfileImage();
      if (isMounted.current) setImageUri(null);
    } catch {
      setError('Failed to remove your photo. Please try again.');
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { imageUri, isLoading, isSaving, error, takePhoto, chooseFromGallery, removePhoto, clearError };
}