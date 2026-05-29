import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { colors } from './theme';

export function useTheme() {
  const { theme } = useContext(ThemeContext);
  return { theme, colors, isDarkMode: true };
}
