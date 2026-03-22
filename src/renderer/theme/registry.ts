import type {
  FontDefinition,
  FontId,
  ThemeCssVariables,
  ThemeDefinition,
  ThemeId
} from './types';

export const themeRegistry: Record<ThemeId, ThemeDefinition> = {
  light: {
    id: 'light',
    label: 'Light',
    colors: {
      appBackground: 'linear-gradient(180deg, #f7f2e8 0%, #efe6d8 100%)',
      appBackgroundAccent:
        'radial-gradient(circle at top, rgba(190, 168, 127, 0.28), transparent 42%)',
      panelBackground: 'rgba(255, 252, 247, 0.82)',
      panelSurface: 'rgba(246, 239, 226, 0.9)',
      panelBorder: 'rgba(58, 47, 31, 0.1)',
      panelShadow: 'rgba(77, 57, 27, 0.12)',
      previewBackground: 'linear-gradient(180deg, #f4ecde 0%, #ecdfcb 100%)',
      textPrimary: '#1d1d1b',
      textMuted: '#665c4d',
      accent: '#836b42',
      accentSoft: 'rgba(233, 222, 201, 0.95)'
    }
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    colors: {
      appBackground: 'linear-gradient(180deg, #171a20 0%, #0f1116 100%)',
      appBackgroundAccent:
        'radial-gradient(circle at top, rgba(94, 127, 160, 0.22), transparent 40%)',
      panelBackground: 'rgba(20, 24, 31, 0.88)',
      panelSurface: 'rgba(30, 36, 46, 0.9)',
      panelBorder: 'rgba(143, 166, 194, 0.14)',
      panelShadow: 'rgba(0, 0, 0, 0.38)',
      previewBackground: 'linear-gradient(180deg, #1d2330 0%, #151922 100%)',
      textPrimary: '#edf2f7',
      textMuted: '#a7b2c2',
      accent: '#7db4ff',
      accentSoft: 'rgba(51, 77, 113, 0.92)'
    }
  },
  pastel: {
    id: 'pastel',
    label: 'Pastel',
    colors: {
      appBackground: 'linear-gradient(180deg, #fff7fb 0%, #f6f4ff 100%)',
      appBackgroundAccent:
        'radial-gradient(circle at top, rgba(255, 182, 193, 0.26), transparent 42%)',
      panelBackground: 'rgba(255, 255, 255, 0.8)',
      panelSurface: 'rgba(248, 241, 255, 0.95)',
      panelBorder: 'rgba(138, 110, 148, 0.12)',
      panelShadow: 'rgba(162, 120, 171, 0.14)',
      previewBackground: 'linear-gradient(180deg, #fff2f8 0%, #eef1ff 100%)',
      textPrimary: '#352a38',
      textMuted: '#75657a',
      accent: '#c06c9d',
      accentSoft: 'rgba(245, 217, 233, 0.96)'
    }
  }
};

export const fontRegistry: Record<FontId, FontDefinition> = {
  'system-sans': {
    id: 'system-sans',
    label: 'System Sans',
    fontFamily: '"Segoe UI", "Helvetica Neue", Arial, sans-serif'
  },
  serif: {
    id: 'serif',
    label: 'Editorial Serif',
    fontFamily: 'Georgia, "Times New Roman", serif'
  },
  mono: {
    id: 'mono',
    label: 'Studio Mono',
    fontFamily: '"Cascadia Code", "SFMono-Regular", Consolas, monospace'
  }
};

export const getThemeCssVariables = (
  themeId: ThemeId,
  fontId: FontId
): ThemeCssVariables => {
  const theme = themeRegistry[themeId];
  const font = fontRegistry[fontId];

  return {
    '--app-bg': theme.colors.appBackground,
    '--app-bg-accent': theme.colors.appBackgroundAccent,
    '--panel-bg': theme.colors.panelBackground,
    '--panel-surface': theme.colors.panelSurface,
    '--panel-border': theme.colors.panelBorder,
    '--panel-shadow': theme.colors.panelShadow,
    '--preview-bg': theme.colors.previewBackground,
    '--text-primary': theme.colors.textPrimary,
    '--text-muted': theme.colors.textMuted,
    '--accent': theme.colors.accent,
    '--accent-soft': theme.colors.accentSoft,
    '--font-family-base': font.fontFamily
  };
};
