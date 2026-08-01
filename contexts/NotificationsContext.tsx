import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number; // Date.now()-style epoch ms
  read: boolean;
  important: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const now = Date.now();

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Safety Alert',
    message: 'Heavy crowd reported near Market St. Consider an alternate route.',
    timestamp: now - 10 * 60 * 1000,
    read: false,
    important: false,
  },
  {
    id: 'n2',
    title: 'SOS Check-in',
    message: 'You marked yourself safe after your last SOS alert. Glad you\'re okay!',
    timestamp: now - 2 * 60 * 60 * 1000,
    read: false,
    important: false,
  },
  {
    id: 'n3',
    title: 'New Connection',
    message: 'Karan Mehta accepted your connection request.',
    timestamp: now - 5 * 60 * 60 * 1000,
    read: false,
    important: false,
  },
  {
    id: 'n4',
    title: 'Route Suggestion',
    message: 'A safer route is now available for your Home → College trip.',
    timestamp: now - 1 * DAY_MS,
    read: true,
    important: false,
  },
  {
    id: 'n5',
    title: 'Weekly Safety Summary',
    message: 'Your area\'s average safety score improved to 82/100 this week.',
    timestamp: now - 2 * DAY_MS,
    read: true,
    important: false,
  },
  {
    id: 'n6',
    title: 'Emergency Contact Added',
    message: 'Priya Verma was added to your emergency contacts.',
    timestamp: now - 9 * DAY_MS, // older than 7 days — should not appear in "Old"
    read: true,
    important: false,
  },
];

interface NotificationsContextValue {
  notifications: AppNotification[];
  unread: AppNotification[];
  important: AppNotification[];
  old: AppNotification[];
  hasUnread: boolean;
  markAsRead: (id: string) => void;
  toggleImportant: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const toggleImportant = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, important: !n.important } : n)));
  }, []);

  const unread = useMemo(() => notifications.filter((n) => !n.read).sort((a, b) => b.timestamp - a.timestamp), [notifications]);
  const important = useMemo(() => notifications.filter((n) => n.important).sort((a, b) => b.timestamp - a.timestamp), [notifications]);
  const old = useMemo(
    () =>
      notifications
        .filter((n) => n.read && Date.now() - n.timestamp <= 7 * DAY_MS)
        .sort((a, b) => b.timestamp - a.timestamp),
    [notifications],
  );

  const value: NotificationsContextValue = {
    notifications,
    unread,
    important,
    old,
    hasUnread: unread.length > 0,
    markAsRead,
    toggleImportant,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return ctx;
}