import { TabItem } from '@components/navigation/BottomNavigation';

/**
 * Primary bottom-tab definitions.
 * Must stay in sync with BottomNavigation icons.
 */
export const TABS: TabItem[] = [
  {
    key: 'index',
    label: 'Home',
    icon: 'home',
  },
  {
    key: 'map',
    label: 'Map',
    icon: 'map',
  },
  {
    key: 'chat',
    label: 'Chat',
    icon: 'chat',
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: 'profile',
  },
];