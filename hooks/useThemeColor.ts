/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export function useThemeColor() {
  const colorScheme = useColorScheme()
  {/* Return the color scheme */}
  if (colorScheme === 'dark') {
    return Colors.dark
  } else {
    return Colors.light
  }
}
