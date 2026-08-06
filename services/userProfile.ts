export interface UserProfile {
  name: string;
  email: string;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Amit Godara',
  email: 'mituamitgodara@gmail.com',
};

/**
 * getUserProfile — stand-in for a future GET /me API call.
 * Replace only this function's body later (e.g. `return await
 * fetch(...).then(r => r.json())`) — UserProfileContext and every screen
 * that reads from it stay exactly the same.
 */
export async function getUserProfile(): Promise<UserProfile> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return DEFAULT_PROFILE;
}

/**
 * updateUserProfile — stand-in for a future PATCH /me API call.
 * The context applies updates optimistically to its own state; this
 * function only needs to simulate (later: perform) the round-trip.
 */
export async function updateUserProfile(patch: Partial<UserProfile>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // no-op for now — nothing to persist until a real backend exists
}