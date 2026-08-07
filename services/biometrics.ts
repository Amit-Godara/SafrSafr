import * as LocalAuthentication from 'expo-local-authentication';

/**
 * isBiometricHardwareAvailable — true only if the device has biometric
 * hardware AND the user has actually enrolled a fingerprint/face. Both
 * checks matter: hardware can exist with nothing enrolled.
 */
export async function isBiometricHardwareAvailable(): Promise<boolean> {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) return false;
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return isEnrolled;
}

/**
 * authenticateWithBiometrics — prompts Face ID / fingerprint. Returns
 * true only on genuine success; false for cancel, failure, or error —
 * callers should fall back to the PIN screen in every false case.
 */
export async function authenticateWithBiometrics(promptMessage = 'Unlock SafeSafar'): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Use PIN instead',
      disableDeviceFallback: true, // fall back to our own PIN screen, not the device passcode
    });
    return result.success;
  } catch {
    return false;
  }
}