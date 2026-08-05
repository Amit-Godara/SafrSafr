import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Circle as SvgCircle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const ACCENT = '#3A63F3';

function MoonStarsIcon({ size = 24, color = ACCENT }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 3.5a7.5 7.5 0 1 0 5 12.9A9 9 0 0 1 15.5 3.5z"
        fill={color}
      />
      <Path d="M19 3l.7 1.6L21.3 5.3 19.7 6 19 7.6 18.3 6l-1.6-.7L18.3 4.6 19 3z" fill={color} />
      <SvgCircle cx={20.5} cy={10} r={0.9} fill={color} />
    </Svg>
  );
}

function SunIcon({ size = 24, color = ACCENT }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx={12} cy={12} r={4.5} fill={color} />
      <Path
        d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.4 19.6L6 18M18 6l1.6-1.6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export interface ThemeToggleButtonProps {
  isDark: boolean;
  onToggle: () => void;
}

/**
 * ThemeToggleButton — premium floating square toggle for the Profile
 * header. UI/animation only: pressing it rotates + scales the icon and
 * swaps Moon⇄Sun based on `isDark`, but does not apply any real theme
 * change — that's left to the parent via `onToggle`.
 */
export function ThemeToggleButton({ isDark, onToggle }: ThemeToggleButtonProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  useEffect(() => {
    rotation.value = withTiming(rotation.value + 180, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [isDark]);

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.88, { duration: 120, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 180, easing: Easing.out(Easing.back(1.6)) }),
    );
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} style={styles.button} hitSlop={6}>
      <Animated.View style={iconStyle}>
        {isDark ? <SunIcon /> : <MoonStarsIcon />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
});

export default ThemeToggleButton;