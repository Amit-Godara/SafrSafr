import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@constants/index';
import { ThemedText } from '../ui/Typography';

export interface CircularProgressProps {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
}

/**
 * CircularProgress — determinate ring indicator with optional % label.
 */
export function CircularProgress({
  progress,
  size = 72,
  strokeWidth = 7,
  showLabel = true,
  color = colors.primary,
}: CircularProgressProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {showLabel && (
        <View style={{ position: 'absolute' }}>
          <ThemedText variant="label" color={colors.textPrimary}>
            {Math.round(clamped * 100)}%
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export default CircularProgress;
