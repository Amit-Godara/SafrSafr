export type OtpMethod = 'email' | 'phone';

interface OtpRecord {
  code: string;
  expiresAt: number;
}

/** In-memory only — resets on app restart. Fine for a frontend-only demo. */
const otpStore = new Map<string, OtpRecord>();

const OTP_TTL_MS = 5 * 60 * 1000;

function generateSixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function keyFor(method: OtpMethod, destination: string): string {
  return `${method}:${destination.trim().toLowerCase()}`;
}

/**
 * requestOtp — stand-in for a future backend call that actually sends an
 * email/SMS. Replace ONLY this function's body later (call your API,
 * which sends the code server-side and returns nothing) — ForgotPinModal
 * and everything above this file stays the same.
 *
 * The `devOtp` field only exists because there's no real email/SMS
 * service yet — it lets the dummy UI display the code so the flow is
 * actually testable. A real implementation must return void; a real
 * backend should never send the OTP back to the client.
 */
export async function requestOtp(method: OtpMethod, destination: string): Promise<{ devOtp: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700)); // simulated network latency
  const code = generateSixDigitCode();
  otpStore.set(keyFor(method, destination), { code, expiresAt: Date.now() + OTP_TTL_MS });
  return { devOtp: code };
}

/**
 * verifyOtp — stand-in for a future backend verification call. Codes are
 * single-use (deleted on successful verification) and expire after 5
 * minutes.
 */
export async function verifyOtp(method: OtpMethod, destination: string, code: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const key = keyFor(method, destination);
  const record = otpStore.get(key);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    otpStore.delete(key);
    return false;
  }

  const isValid = record.code === code;
  if (isValid) otpStore.delete(key);
  return isValid;
}