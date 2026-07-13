import { theme, Theme } from '@constants/index';

/**
 * useTheme — access design tokens from components.
 * Static for now; a provider can back it later without changing call sites.
 */
export function useTheme(): Theme {
  return theme;
}

export default useTheme;
