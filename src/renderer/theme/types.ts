export type ThemeId = 'light' | 'dark' | 'pastel';

export type FontId = 'system-sans' | 'serif' | 'mono';

export interface ThemeColors {
  appBackground: string;
  appBackgroundAccent: string;
  panelBackground: string;
  panelSurface: string;
  panelBorder: string;
  panelShadow: string;
  previewBackground: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
}

export interface FontDefinition {
  id: FontId;
  label: string;
  fontFamily: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  label: string;
  colors: ThemeColors;
}

export interface ThemeState {
  themeId: ThemeId;
  fontId: FontId;
}

export type ThemeCssVariables = Record<`--${string}`, string>;
