import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@safesafar/profile_image_uri';

/**
 * Persistence layer for the profile photo.
 *
 * IMPORTANT for future backend integration: this file is the ONLY place
 * that knows the photo is currently stored in AsyncStorage. To switch to
 * a real backend later (e.g. upload to a server and store the returned
 * URL), replace the three function bodies below with API calls — keep
 * the same function names and signatures, and nothing in
 * hooks/useProfileImage.ts or the Profile screen needs to change.
 */

export async function getProfileImage(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    throw new Error('Failed to load your saved profile photo.');
  }
}

export async function saveProfileImage(uri: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, uri);
  } catch {
    throw new Error('Failed to save your profile photo.');
  }
}

export async function removeProfileImage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    throw new Error('Failed to remove your profile photo.');
  }
}