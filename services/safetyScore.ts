/**
 * Mock "service" layer for the AI Safety Score module.
 *
 * IMPORTANT: This file contains NO AI, NO ML model, and NO real network
 * calls. It only returns hardcoded dummy data behind an async function so
 * the UI layer never needs to change when a real backend/API is wired up —
 * only the body of getSafetyScore() below gets swapped out.
 */

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface SafetyFactor {
  id: string;
  label: string;
  icon: string; // matches an icon name in components/ui/Icon.tsx
  value: number; // 0-100
  highIs: 'good' | 'bad';
  caption: string;
}

export interface CommunityReport {
  id: string;
  text: string;
  time: string;
  positive: boolean;
}

export interface DailyIncident {
  label: string;
  value: number; // 0-100
  highlight?: boolean;
}

export interface SafetyScoreData {
  place: string;
  score: number; // 0-100
  riskLevel: RiskLevel;
  factors: SafetyFactor[];
  weekIncidents: DailyIncident[];
  reports: CommunityReport[];
  reasons: string[];
  recommendation: string;
}

const DEFAULT_DATA: SafetyScoreData = {
  place: 'Connaught Place, New Delhi',
  score: 82,
  riskLevel: 'Low',
  factors: [
    { id: 'crime', label: 'Crime Rate', icon: 'alert', value: 28, highIs: 'bad', caption: 'Low' },
    { id: 'crowd', label: 'Crowd Density', icon: 'community', value: 74, highIs: 'good', caption: 'Busy' },
    { id: 'lighting', label: 'Lighting', icon: 'sparkles', value: 86, highIs: 'good', caption: 'Well lit' },
    { id: 'police', label: 'Police Presence', icon: 'shield', value: 70, highIs: 'good', caption: 'Nearby' },
  ],
  weekIncidents: [
    { label: 'Mon', value: 30 },
    { label: 'Tue', value: 22 },
    { label: 'Wed', value: 48 },
    { label: 'Thu', value: 35 },
    { label: 'Fri', value: 66, highlight: true },
    { label: 'Sat', value: 58 },
    { label: 'Sun', value: 40 },
  ],
  reports: [
    { id: '1', text: 'Well-lit and crowded till late evening.', time: '2 hrs ago', positive: true },
    { id: '2', text: 'Avoid inner lanes after 11 pm, quite dark.', time: '5 hrs ago', positive: false },
    { id: '3', text: 'Police patrol seen near the metro gate.', time: 'Yesterday', positive: true },
  ],
  reasons: [
    'Well-lit and usually crowded till late evening',
    'Active police patrolling reported this week',
    'Few incidents reported in inner lanes after 11 pm',
  ],
  recommendation:
    'This area is generally safe at night. Stay in well-lit main blocks, avoid lonely inner lanes, and share your live location with a trusted contact.',
};

const CURRENT_LOCATION_DATA: SafetyScoreData = {
  ...DEFAULT_DATA,
  place: 'Your Current Location',
  score: 68,
  riskLevel: 'Medium',
  reasons: [
    'Moderate foot traffic reported in this area',
    'Mixed lighting conditions after sunset',
    'No major incidents reported in the last 24 hours',
  ],
  recommendation:
    'Exercise normal caution here. Stick to main roads after dark and keep a trusted contact updated on your location.',
};

/**
 * getSafetyScore — stand-in for a future real API call.
 *
 * To connect a real backend later, replace ONLY the body of this function,
 * e.g.:
 *   const res = await fetch(`${API_BASE_URL}/safety-score?place=${encodeURIComponent(query)}`);
 *   if (!res.ok) throw new Error('Failed to fetch safety score');
 *   return (await res.json()) as SafetyScoreData;
 *
 * The return type (SafetyScoreData) and every screen/component consuming
 * it stay exactly the same either way.
 */
export async function getSafetyScore(query: string): Promise<SafetyScoreData> {
  // simulated network latency so the loading state is visible in the UI
  await new Promise((resolve) => setTimeout(resolve, 550));

  const normalized = query.trim().toLowerCase();
  if (!normalized) return DEFAULT_DATA;
  if (normalized.includes('current location')) return CURRENT_LOCATION_DATA;

  return { ...DEFAULT_DATA, place: query.trim() };
}