import { MD3LightTheme, MD3Theme } from 'react-native-paper';

// Convert HSL to RGB for React Native
const colors = {
  // Primary colors
  primary: '#1A5FFF', // hsl(228 100% 52%)
  primaryLight: '#4D82FF', // hsl(228 100% 65%)
  primaryDark: '#0044D6', // hsl(228 100% 42%)
  primaryForeground: '#FFFFFF',
  
  // Accent colors
  accent: '#FF6B6B', // hsl(0 100% 71%)
  accentLight: '#FFB3B3', // hsl(0 100% 80%)
  accentForeground: '#FFFFFF',
  
  // Background colors
  background: '#FFFFFF', // hsl(0 0% 100%)
  foreground: '#1F2937', // hsl(228 15% 15%)
  
  // Card colors
  card: '#FFFFFF',
  cardForeground: '#1F2937',
  
  // Muted colors
  muted: '#F3F4F6', // hsl(228 15% 96%)
  mutedForeground: '#6B7280', // hsl(228 10% 45%)
  
  // Secondary colors
  secondary: '#FAFAFA', // hsl(0 0% 98%)
  secondaryForeground: '#1F2937',
  
  // Border and input
  border: '#E5E7EB', // hsl(228 15% 90%)
  input: '#E5E7EB',
  
  // Destructive
  destructive: '#EF4444', // hsl(0 84.2% 60.2%)
  destructiveForeground: '#FFFFFF',
  
  // Success
  success: '#10B981',
  successForeground: '#FFFFFF',
  
  // Warning
  warning: '#F59E0B',
  warningForeground: '#FFFFFF',
};

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.primaryForeground,
    primaryContainer: colors.primaryLight,
    onPrimaryContainer: colors.primaryDark,
    secondary: colors.secondary,
    onSecondary: colors.secondaryForeground,
    tertiary: colors.accent,
    onTertiary: colors.accentForeground,
    error: colors.destructive,
    onError: colors.destructiveForeground,
    background: colors.background,
    onBackground: colors.foreground,
    surface: colors.card,
    onSurface: colors.cardForeground,
    surfaceVariant: colors.muted,
    onSurfaceVariant: colors.mutedForeground,
    outline: colors.border,
    outlineVariant: colors.input,
  },
  roundness: 16,
};

export { colors };

export const shadows = {
  soft: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  medium: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 8,
  },
  strong: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 12,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

