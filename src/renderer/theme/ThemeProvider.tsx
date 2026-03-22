import {
  createContext,
  useContext,
  useMemo,
  useState,
  type CSSProperties,
  type PropsWithChildren
} from 'react';
import { fontRegistry, getThemeCssVariables, themeRegistry } from './registry';
import type { FontId, ThemeId, ThemeState } from './types';

interface ThemeContextValue extends ThemeState {
  setThemeId: (themeId: ThemeId) => void;
  setFontId: (fontId: FontId) => void;
  cssVariables: CSSProperties;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({
  children
}: PropsWithChildren): React.JSX.Element => {
  const [themeId, setThemeId] = useState<ThemeId>('light');
  const [fontId, setFontId] = useState<FontId>('system-sans');

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      fontId,
      setThemeId,
      setFontId,
      cssVariables: getThemeCssVariables(themeId, fontId) as CSSProperties
    }),
    [fontId, themeId]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="theme-root" style={value.cssVariables}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};

export { fontRegistry, themeRegistry };
