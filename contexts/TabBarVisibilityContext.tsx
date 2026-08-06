import React, { createContext, useContext, useState, useCallback } from 'react';

interface TabBarVisibilityContextValue {
  isTabBarHidden: boolean;
  hideTabBar: () => void;
  showTabBar: () => void;
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue | null>(null);

/**
 * TabBarVisibilityProvider — lets any screen nested inside the tab
 * navigator (e.g. the Chat list while its search field is focused)
 * temporarily hide the bottom tab bar without leaving the tab/route it's
 * on. This is distinct from navigating to a root-level full-screen route
 * (like an individual conversation) — it's for transient UI states.
 */
export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  const hideTabBar = useCallback(() => setIsTabBarHidden(true), []);
  const showTabBar = useCallback(() => setIsTabBarHidden(false), []);

  return (
    <TabBarVisibilityContext.Provider value={{ isTabBarHidden, hideTabBar, showTabBar }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) {
    throw new Error('useTabBarVisibility must be used within a TabBarVisibilityProvider');
  }
  return ctx;
}