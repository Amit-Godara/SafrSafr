import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  isAppLockEnabled,
  setAppLockEnabled,
  hasPin as hasPinInStore,
  savePin as savePinToStore,
  verifyPin as verifyPinInStore,
  isBiometricEnabled,
  setBiometricEnabled,
} from '@services/appLock';
import { isBiometricHardwareAvailable, authenticateWithBiometrics } from '@services/biometrics';

export interface AppLockContextValue {
  isLoading: boolean;
  appLockEnabled: boolean;
  biometricEnabled: boolean;
  biometricAvailable: boolean;
  hasPinSet: boolean;
  /** Whether the lock overlay should currently be shown. */
  isLocked: boolean;
  error: string | null;
  toggleAppLock: (enabled: boolean) => Promise<void>;
  toggleBiometric: (enabled: boolean) => Promise<void>;
  savePin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  attemptBiometricUnlock: () => Promise<boolean>;
  clearError: () => void;
}

const AppLockContext = createContext<AppLockContextValue | null>(null);

export function AppLockProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [appLockEnabled, setAppLockEnabledState] = useState(false);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [hasPinSet, setHasPinSet] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mirror latest values in refs so the AppState listener (set up once)
  // never reads stale state from its original closure.
  const appLockEnabledRef = useRef(appLockEnabled);
  const hasPinSetRef = useRef(hasPinSet);
  appLockEnabledRef.current = appLockEnabled;
  hasPinSetRef.current = hasPinSet;

  // Initial load + lock-on-launch.
  useEffect(() => {
    (async () => {
      try {
        const [enabled, biometricOn, pinSet, hwAvailable] = await Promise.all([
          isAppLockEnabled(),
          isBiometricEnabled(),
          hasPinInStore(),
          isBiometricHardwareAvailable(),
        ]);
        setAppLockEnabledState(enabled);
        setBiometricEnabledState(biometricOn);
        setHasPinSet(pinSet);
        setBiometricAvailable(hwAvailable);
        if (enabled && pinSet) setIsLocked(true);
      } catch {
        setError('Could not load App Lock settings.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Re-lock whenever the app returns to the foreground from background/inactive.
  useEffect(() => {
    const appStateRef = { current: AppState.currentState as AppStateStatus };
    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasBackground = /inactive|background/.test(appStateRef.current);
      if (wasBackground && nextState === 'active') {
        if (appLockEnabledRef.current && hasPinSetRef.current) {
          setIsLocked(true);
        }
      }
      appStateRef.current = nextState;
    });
    return () => subscription.remove();
  }, []);

  const toggleAppLock = useCallback(async (enabled: boolean) => {
    setError(null);
    try {
      await setAppLockEnabled(enabled);
      setAppLockEnabledState(enabled);
    } catch {
      setError('Failed to update App Lock.');
    }
  }, []);

  const toggleBiometric = useCallback(async (enabled: boolean) => {
    setError(null);
    if (enabled) {
      const available = await isBiometricHardwareAvailable();
      setBiometricAvailable(available);
      if (!available) {
        setError('Biometric authentication is not set up on this device.');
        return;
      }
    }
    try {
      await setBiometricEnabled(enabled);
      setBiometricEnabledState(enabled);
    } catch {
      setError('Failed to update Biometric Login.');
    }
  }, []);

  const savePin = useCallback(async (pin: string) => {
    setError(null);
    await savePinToStore(pin); // throws with a readable message on invalid PIN — let caller catch it
    setHasPinSet(true);
  }, []);

  const verifyPin = useCallback(async (pin: string) => {
    const ok = await verifyPinInStore(pin);
    if (ok) {
      setIsLocked(false);
      setError(null);
    } else {
      setError('Incorrect PIN. Please try again.');
    }
    return ok;
  }, []);

  const attemptBiometricUnlock = useCallback(async () => {
    if (!biometricEnabled || !biometricAvailable) return false;
    const success = await authenticateWithBiometrics();
    if (success) {
      setIsLocked(false);
      setError(null);
    }
    return success;
  }, [biometricEnabled, biometricAvailable]);

  const clearError = useCallback(() => setError(null), []);

  const value: AppLockContextValue = {
    isLoading,
    appLockEnabled,
    biometricEnabled,
    biometricAvailable,
    hasPinSet,
    isLocked,
    error,
    toggleAppLock,
    toggleBiometric,
    savePin,
    verifyPin,
    attemptBiometricUnlock,
    clearError,
  };

  return <AppLockContext.Provider value={value}>{children}</AppLockContext.Provider>;
}

export function useAppLock(): AppLockContextValue {
  const ctx = useContext(AppLockContext);
  if (!ctx) {
    throw new Error('useAppLock must be used within an AppLockProvider');
  }
  return ctx;
}