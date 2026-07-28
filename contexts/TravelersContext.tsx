import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Traveler {
  id: string;
  name: string;
  initials: string;
  distance: string;
  online: boolean;
  connected: boolean;
  avatarColor: string;
}

export interface PersonMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

const INITIAL_TRAVELERS: Traveler[] = [
  { id: 't1', name: 'Ananya Rao', initials: 'AR', distance: '0.3 km away', online: true, connected: true, avatarColor: '#F59E0B' },
  { id: 't2', name: 'Karan Mehta', initials: 'KM', distance: '0.6 km away', online: true, connected: false, avatarColor: '#3A63F3' },
  { id: 't3', name: 'Sara Ali', initials: 'SA', distance: '0.9 km away', online: false, connected: false, avatarColor: '#E53935' },
  { id: 't4', name: 'Dev Patel', initials: 'DP', distance: '1.1 km away', online: true, connected: false, avatarColor: '#22C55E' },
  { id: 't5', name: 'Neha Kapoor', initials: 'NK', distance: '1.4 km away', online: false, connected: true, avatarColor: '#A855F7' },
  { id: 't6', name: 'Vikram Joshi', initials: 'VJ', distance: '2.0 km away', online: true, connected: false, avatarColor: '#0EA5E9' },
];

/** Canned auto-replies — purely for a lived-in feel. No AI, no backend. */
const CANNED_REPLIES = [
  "Hey! Thanks for reaching out 👋",
  "I'm nearby too — stay safe out there!",
  'Got it, noted.',
  'Sounds good!',
  "I'll keep you posted on my location.",
];

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `pm_${Date.now()}_${idCounter}`;
}

interface TravelersContextValue {
  travelers: Traveler[];
  toggleConnect: (id: string) => void;
  getTraveler: (id: string) => Traveler | undefined;
  messages: Record<string, PersonMessage[]>;
  sendMessage: (travelerId: string, text: string) => void;
}

const TravelersContext = createContext<TravelersContextValue | null>(null);

export function TravelersProvider({ children }: { children: React.ReactNode }) {
  const [travelers, setTravelers] = useState<Traveler[]>(INITIAL_TRAVELERS);
  const [messages, setMessages] = useState<Record<string, PersonMessage[]>>({});

  const toggleConnect = useCallback((id: string) => {
    setTravelers((prev) => prev.map((t) => (t.id === id ? { ...t, connected: !t.connected } : t)));
  }, []);

  const getTraveler = useCallback((id: string) => travelers.find((t) => t.id === id), [travelers]);

  const sendMessage = useCallback((travelerId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const mine: PersonMessage = { id: nextId(), fromMe: true, text: trimmed, time: formatTime() };
    setMessages((prev) => ({ ...prev, [travelerId]: [...(prev[travelerId] ?? []), mine] }));

    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      const theirs: PersonMessage = { id: nextId(), fromMe: false, text: reply, time: formatTime() };
      setMessages((prev) => ({ ...prev, [travelerId]: [...(prev[travelerId] ?? []), theirs] }));
    }, 1100 + Math.random() * 700);
  }, []);

  return (
    <TravelersContext.Provider value={{ travelers, toggleConnect, getTraveler, messages, sendMessage }}>
      {children}
    </TravelersContext.Provider>
  );
}

export function useTravelers() {
  const ctx = useContext(TravelersContext);
  if (!ctx) {
    throw new Error('useTravelers must be used within a TravelersProvider');
  }
  return ctx;
}