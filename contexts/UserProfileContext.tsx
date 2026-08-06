import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile, updateUserProfile, type UserProfile } from '@services/userProfile';
import { useProfileImage } from '@hooks/useProfileImage';

export interface UserProfileContextValue {
  name: string;
  email: string;
  profileImage: string | null;
  /** True only during the initial load on mount. */
  isLoading: boolean;
  /** True while a photo pick/save/remove is in progress. */
  isImageSaving: boolean;
  error: string | null;
  updateProfile: (patch: Partial<Pick<UserProfile, 'name' | 'email'>>) => Promise<void>;
  takePhoto: () => Promise<void>;
  chooseFromGallery: () => Promise<void>;
  removePhoto: () => Promise<void>;
  clearError: () => void;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

/**
 * UserProfileProvider — single source of truth for name, email, and
 * profile photo. Wraps useProfileImage() internally (rather than each
 * screen calling it separately) so there's exactly one active photo
 * state for the whole app, not several instances that could drift out
 * of sync with each other.
 */
export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const {
    imageUri: profileImage,
    isSaving: isImageSaving,
    error: imageError,
    takePhoto,
    chooseFromGallery,
    removePhoto,
    clearError: clearImageError,
  } = useProfileImage();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const profile = await getUserProfile();
        if (isMounted) {
          setName(profile.name);
          setEmail(profile.email);
        }
      } catch {
        if (isMounted) setProfileError('Could not load your profile.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Pick<UserProfile, 'name' | 'email'>>) => {
    // Optimistic update — reflects immediately in the UI.
    if (patch.name !== undefined) setName(patch.name);
    if (patch.email !== undefined) setEmail(patch.email);
    try {
      await updateUserProfile(patch);
    } catch {
      setProfileError('Failed to update your profile.');
    }
  }, []);

  const clearError = useCallback(() => {
    setProfileError(null);
    clearImageError();
  }, [clearImageError]);

  const value: UserProfileContextValue = {
    name,
    email,
    profileImage,
    isLoading,
    isImageSaving,
    error: profileError ?? imageError,
    updateProfile,
    takePhoto,
    chooseFromGallery,
    removePhoto,
    clearError,
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfile(): UserProfileContextValue {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return ctx;
}