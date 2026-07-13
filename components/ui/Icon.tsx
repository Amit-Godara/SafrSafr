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
  | 'alert';

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
    </Svg>
  );
}

export default Icon;
