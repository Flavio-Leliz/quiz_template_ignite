import { Pressable, PressableProps, Text } from 'react-native';

import { THEME } from '../../styles/theme';
import { styles } from './styles';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor, color } from 'react-native-reanimated';
import { useEffect } from 'react';

const PressableAnimated = Animated.createAnimatedComponent(Pressable)

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string;
  isChecked?: boolean;
  type?: keyof typeof TYPE_COLORS;
}

export function Level({ title, type = 'EASY', isChecked = false, ...rest }: Props) {
  const scale = useSharedValue(1);
  const cheked = useSharedValue(1);

  const COLOR = TYPE_COLORS[type];

  const animatedContainerStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        cheked.value,
        [0, 1],
        ['transparent', COLOR]
      )
    }
  })
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        cheked.value,
        [0, 1],
        [COLOR, THEME.COLORS.GREY_100]
      )
    }
  })

  function onPressIn() {
    scale.value = withTiming(1.1);
  }
  function onPressOut() {
    scale.value = withTiming(1);
  }

  useEffect(() => {
    cheked.value = withTiming(isChecked ? 1 : 0);
  }, [isChecked])

  return (
    <PressableAnimated
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[
        styles.container,
        animatedContainerStyles,
        { borderColor: COLOR }
      ]}
      {...rest}>
      <Animated.Text style={
        [
          styles.title,
          animatedTextStyles
        ]
      }>
        {title}
      </Animated.Text>
    </PressableAnimated >

  );
}