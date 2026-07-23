import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { light } from '@constants/lightTheme';

function AvatarMark() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l1.9 4.2L18 8l-4.1 1.8L12 14l-1.9-4.2L6 8l4.1-1.8L12 2z" fill="#FFFFFF" />
      <Path d="M18.5 14l.95 2.1L21.5 17l-2.05.9L18.5 20l-.95-2.1L15.5 17l2.05-.9L18.5 14z" fill="#FFFFFF" />
    </Svg>
  );
}

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 320, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 320, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      ),
    );
  }, [delay]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

/**
 * TypingIndicator — AI avatar + a small bubble with three bouncing dots,
 * shown while the mock AI "response" is being generated.
 */
export function TypingIndicator() {
  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <AvatarMark />
      </View>
      <View style={styles.bubble}>
        <Dot delay={0} />
        <Dot delay={120} />
        <Dot delay={240} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEF0F5',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: light.primary,
  },
});

export default TypingIndicator;