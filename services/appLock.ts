import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ENABLED: 'safesafar_app_lock_enabled',
  PIN: 'safesafar_app_lock_pin',
  BIOMETRIC_ENABLED: 'safesafar_app_lock_biometric_enabled',
} as const;

const PIN_PATTERN = /^\d{4}$/;

export async function isAppLockEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEYS.ENABLED)) === 'true';
}

export async function setAppLockEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ENABLED, enabled ? 'true' : 'false');
}

export async function hasPin(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEYS.PIN)) !== null;
}

export async function savePin(pin: string): Promise<void> {
  if (!PIN_PATTERN.test(pin)) {
    throw new Error('PIN must be exactly 4 digits.');
  }
  await SecureStore.setItemAsync(KEYS.PIN, pin);
}

export async function verifyPin(pin: string): Promise<boolean> {
  const saved = await SecureStore.getItemAsync(KEYS.PIN);
  return saved !== null && saved === pin;
}

export async function clearPin(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.PIN);
}

export async function isBiometricEnabled(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEYS.BIOMETRIC_ENABLED)) === 'true';
}

export async function setBiometricEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(KEYS.BIOMETRIC_ENABLED, enabled ? 'true' : 'false');
}