import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DARK_THEME_COLOR = '#00020a';
const LIGHT_THEME_COLOR = '#f8fafc';
const THEME_STORAGE_KEY = 'theme';

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof document !== 'undefined') {
    const theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
    } catch {
      // Ignore storage access failures and fall back to the default theme.
    }
  }

  return 'dark';
}

function getThemeColor(theme) {
  return theme === 'light' ? LIGHT_THEME_COLOR : DARK_THEME_COLOR;
}

function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures. The theme still applies for the current session.
  }

  const themeColorMeta = document.querySelector("meta[name='theme-color']");
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', getThemeColor(theme));
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
      themeColor: getThemeColor(theme),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
