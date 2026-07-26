/**
 * Mock "service" layer for the AI Safety Agent chat.
 *
 * IMPORTANT: No real AI, no ML model, no network calls. getAIResponse()
 * below simulates response latency and returns a hardcoded answer picked
 * by simple keyword matching. To connect a real AI/API later, replace ONLY
 * the body of getAIResponse() — the screen and components never need to
 * change since they only depend on this function's signature.
 */

export type ChatRole = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  time: string; // pre-formatted display time, e.g. "9:41 AM"
}

export const SUGGESTED_QUESTIONS: string[] = [
  'Is Jaipur safe?',
  'Recommend safe hotels.',
  'Nearest police station.',
  'Safe route.',
];

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['jaipur', 'safe?', 'is it safe', 'how safe'],
    response:
      'Jaipur has an overall Safety Score of 78/100 — generally safe for travelers. Tourist areas like Hawa Mahal and Johari Bazaar stay busy and well-lit until late evening. Avoid isolated backstreets after 11 PM, and keep valuables secure in crowded markets.',
  },
  {
    keywords: ['hotel', 'stay', 'accommodation', 'where to stay'],
    response:
      'Based on safety ratings, well-reviewed areas to stay include C-Scheme and Malviya Nagar — both have good lighting, active police patrolling, and 24/7 front-desk security. I\'d recommend properties with verified guest reviews and secure entry systems.',
  },
  {
    keywords: ['police', 'station', 'emergency', 'help nearby'],
    response:
      'The nearest police station is Vidhayak Nagar Police Station, approximately 1.2 km away — about a 5-minute drive. You can also use the "Nearby Help" quick action from Home to see live directions and other emergency services around you.',
  },
  {
    keywords: ['route', 'safe route', 'directions', 'path', 'way'],
    response:
      'For your route, I\'d suggest sticking to Tonk Road and MI Road — both are well-lit, have consistent foot traffic, and regular police presence in the evening. I\'ve found 2 alternate routes with higher safety scores than the fastest option.',
  },
];

const FALLBACK_RESPONSES = [
  "That's a great question. Based on recent community reports and safety data for this area, I'd recommend staying alert in crowded spaces and keeping a trusted contact updated on your location.",
  "I don't have specific data on that yet, but generally, sticking to well-lit main roads and avoiding isolated areas after dark is the safest approach.",
  "Good thing to check before you go! I'd suggest reviewing the Safety Score for your destination and reading recent community reports for the most up-to-date picture.",
];

function pickResponse(question: string): string {
  const q = question.toLowerCase();
  const match = KEYWORD_RESPONSES.find((entry) => entry.keywords.some((kw) => q.includes(kw)));
  if (match) return match.response;
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `msg_${Date.now()}_${idCounter}`;
}

export function createMessage(role: ChatRole, text: string): ChatMessage {
  return { id: nextId(), role, text, time: formatTime() };
}

/**
 * getAIResponse — stand-in for a future real AI/API call.
 *
 * To connect a real backend later, replace ONLY the body of this function,
 * e.g.:
 *   const res = await fetch(`${API_BASE_URL}/ai/chat`, { method: 'POST', body: JSON.stringify({ question }) });
 *   const data = await res.json();
 *   return data.answer;
 *
 * The return type (string) and every caller stay exactly the same.
 */
export async function getAIResponse(question: string): Promise<string> {
  // simulated "thinking" delay so the typing indicator is visible
  const delay = 900 + Math.random() * 700;
  await new Promise((resolve) => setTimeout(resolve, delay));
  return pickResponse(question);
}

export function getInitialGreeting(): ChatMessage {
  return createMessage(
    'ai',
    "Hi! I'm your AI Safety Assistant. Ask me about a place's safety, safe routes, nearby help, or anything else on your mind.",
  );
}