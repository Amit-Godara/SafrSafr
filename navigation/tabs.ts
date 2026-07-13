import { TabItem } from '@components/navigation/BottomNavigation';

/**
 * Primary bottom-tab definitions. Kept here so both the router and any
 * custom tab bar stay in sync.
 */
export const TABS: TabItem[] = [
  { key: 'index', label: 'Home', icon: 'home' },
  { key: 'map', label: 'Map', icon: 'map-pin' },
  { key: 'community', label: 'Community', icon: 'community' },
  { key: 'profile', label: 'Profile', icon: 'profile' },
];
