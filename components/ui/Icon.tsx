import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline } from 'react-native-svg';
import { colors } from '@constants/index';

/**
 * Icon — lightweight, dependency-free SVG icon set for the design system.
 * Stroke-based, sized via `size`, colored via `color`.
 */
export type IconName =
  | 'home'
  | 'map-pin'
  | 'community'
  | 'profile'
  | 'settings'
  | 'chevron-left'
  | 'chevron-right'
  | 'phone'
  | 'shield'
  | 'search'
  | 'plus'
  | 'edit'
  | 'bell'
  | 'check'
  | 'close'
  | 'alert'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'google'
  | 'arrow-right'
  | 'user'
  | 'route'
  | 'star'
  | 'clock'
  | 'navigation'
  | 'sparkles'
  | 'file-text'
  | 'heart'
  | 'coffee';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 24,
  color = colors.textPrimary,
  strokeWidth = 2,
}: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'home' && (
        <>
          <Path d="M3 10.5 12 3l9 7.5" {...common} />
          <Path d="M5 9.5V21h14V9.5" {...common} />
        </>
      )}
      {name === 'map-pin' && (
        <>
          <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" {...common} />
          <Circle cx="12" cy="10" r="3" {...common} />
        </>
      )}
      {name === 'community' && (
        <>
          <Circle cx="9" cy="8" r="3.2" {...common} />
          <Path d="M2.5 20a6.5 6.5 0 0 1 13 0" {...common} />
          <Path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" {...common} />
          <Path d="M17.5 14.2A6.5 6.5 0 0 1 21.5 20" {...common} />
        </>
      )}
      {name === 'profile' && (
        <>
          <Circle cx="12" cy="8" r="4" {...common} />
          <Path d="M4 20a8 8 0 0 1 16 0" {...common} />
        </>
      )}
      {name === 'settings' && (
        <>
          <Circle cx="12" cy="12" r="3" {...common} />
          <Path
            d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 6.7 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 5 6.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H10a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V10a2 2 0 1 1 0 4h-.1Z"
            {...common}
          />
        </>
      )}
      {name === 'chevron-left' && <Polyline points="15 6 9 12 15 18" {...common} />}
      {name === 'chevron-right' && <Polyline points="9 6 15 12 9 18" {...common} />}
      {name === 'phone' && (
        <Path
          d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"
          {...common}
        />
      )}
      {name === 'shield' && (
        <>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" {...common} />
          <Path d="m9 12 2 2 4-4" {...common} />
        </>
      )}
      {name === 'search' && (
        <>
          <Circle cx="11" cy="11" r="7" {...common} />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" {...common} />
        </>
      )}
      {name === 'plus' && (
        <>
          <Line x1="12" y1="5" x2="12" y2="19" {...common} />
          <Line x1="5" y1="12" x2="19" y2="12" {...common} />
        </>
      )}
      {name === 'edit' && (
        <>
          <Path d="M12 20h9" {...common} />
          <Path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" {...common} />
        </>
      )}
      {name === 'bell' && (
        <>
          <Path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
          <Path d="M13.7 21a2 2 0 0 1-3.4 0" {...common} />
        </>
      )}
      {name === 'check' && <Polyline points="20 6 9 17 4 12" {...common} />}
      {name === 'close' && (
        <>
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
        </>
      )}
      {name === 'alert' && (
        <>
          <Path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" {...common} />
          <Line x1="12" y1="9" x2="12" y2="13" {...common} />
          <Line x1="12" y1="17" x2="12.01" y2="17" {...common} />
        </>
      )}
      {name === 'mail' && (
        <>
          <Rect x="3" y="5" width="18" height="14" rx="2" {...common} />
          <Path d="m3 7 9 6 9-6" {...common} />
        </>
      )}
      {name === 'lock' && (
        <>
          <Rect x="4" y="11" width="16" height="10" rx="2" {...common} />
          <Path d="M8 11V8a4 4 0 0 1 8 0v3" {...common} />
        </>
      )}
      {name === 'eye' && (
        <>
          <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" {...common} />
          <Circle cx="12" cy="12" r="3" {...common} />
        </>
      )}
      {name === 'eye-off' && (
        <>
          <Path d="M9.9 4.2A10.9 10.9 0 0 1 12 4c6.5 0 10 7 10 7a19 19 0 0 1-3 3.8" {...common} />
          <Path d="M6.1 6.1A19 19 0 0 0 2 11s3.5 7 10 7a10.7 10.7 0 0 0 5-1.2" {...common} />
          <Path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" {...common} />
          <Line x1="3" y1="3" x2="21" y2="21" {...common} />
        </>
      )}
      {name === 'user' && (
        <>
          <Circle cx="12" cy="8" r="4" {...common} />
          <Path d="M4 20a8 8 0 0 1 16 0" {...common} />
        </>
      )}
      {name === 'arrow-right' && (
        <>
          <Line x1="4" y1="12" x2="20" y2="12" {...common} />
          <Polyline points="14 6 20 12 14 18" {...common} />
        </>
      )}
      {name === 'google' && (
        <>
          <Path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" fill="#4285F4" stroke="none" />
          <Path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" fill="#34A853" stroke="none" />
          <Path d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3.1a10 10 0 0 0 0 9l3.3-2.6Z" fill="#FBBC05" stroke="none" />
          <Path d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6.1 12 6.1Z" fill="#EA4335" stroke="none" />
        </>
      )}
      {name === 'route' && (
        <>
          <Circle cx="6" cy="19" r="2.5" {...common} />
          <Circle cx="18" cy="5" r="2.5" {...common} />
          <Path d="M8.5 19H14a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-7h5.5" {...common} />
        </>
      )}
      {name === 'star' && (
        <Path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9L12 3.5Z" {...common} />
      )}
      {name === 'clock' && (
        <>
          <Circle cx="12" cy="12" r="9" {...common} />
          <Polyline points="12 7 12 12 16 14" {...common} />
        </>
      )}
      {name === 'navigation' && (
        <Path d="M3 11l18-8-8 18-2-8-8-2Z" {...common} />
      )}
      {name === 'sparkles' && (
        <>
          <Path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" {...common} />
          <Path d="M19 14l.9 2.1 2.1.9-2.1.9L19 20l-.9-2.1-2.1-.9 2.1-.9L19 14Z" {...common} />
        </>
      )}
      {name === 'file-text' && (
        <>
          <Path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" {...common} />
          <Polyline points="14 3 14 8 19 8" {...common} />
          <Line x1="9" y1="13" x2="15" y2="13" {...common} />
          <Line x1="9" y1="17" x2="13" y2="17" {...common} />
        </>
      )}
      {name === 'heart' && (
        <Path d="M12 20s-7-4.4-9.3-8.5C1.2 8.5 2.6 5.5 5.6 5.1c1.9-.2 3.4.8 4.4 2.2 1-1.4 2.5-2.4 4.4-2.2 3 .4 4.4 3.4 2.9 6.4C19 15.6 12 20 12 20Z" {...common} />
      )}
      {name === 'coffee' && (
        <>
          <Path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" {...common} />
          <Path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17" {...common} />
          <Line x1="7" y1="2.5" x2="7" y2="5" {...common} />
          <Line x1="11" y1="2.5" x2="11" y2="5" {...common} />
        </>
      )}
    </Svg>
  );
}

export default Icon;
