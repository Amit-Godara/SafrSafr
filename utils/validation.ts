/**
 * Lightweight, dependency-free form validators.
 * Each returns an error string, or undefined when valid.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Email is required';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value))
    return 'Use letters and numbers';
  return undefined;
}

export function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Name is required';
  if (v.length < 2) return 'Name is too short';
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirm: string
): string | undefined {
  if (!confirm) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return undefined;
}

export function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Phone number is required';
  if (!/^\+?[0-9\s-]{7,15}$/.test(v)) return 'Enter a valid phone number';
  return undefined;
}

/** Returns true when every value in the record is undefined. */
export function isFormValid(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).every((e) => !e);
}
