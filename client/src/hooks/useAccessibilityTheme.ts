import { useEffect, useState, useCallback } from 'react';

type ThemePreference = 'light' | 'dark' | 'system';

interface AccessibilityThemeState {
  currentTheme: 'light' | 'dark';
  highContrast: boolean;
  toggleContrast: () => void;
  setTheme: (theme: ThemePreference) => void;
}

const STORAGE_KEY = 'theme-preference';
const CONTRAST_KEY = 'high-contrast-mode';

const getSystemTheme = (): 'light' | 'dark' => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

/**
 * Custom hook to manage the application's theme (light/dark/system) 
 * and accessibility features (high contrast mode).
 * 
 * This hook is critical for final UX/UI polish and accessibility compliance.
 */
export function useAccessibilityTheme(): AccessibilityThemeState {
  const [theme, setInternalTheme] = useState<ThemePreference>(
    (localStorage.getItem(STORAGE_KEY) as ThemePreference) || 'system'
  );
  const [highContrast, setHighContrast] = useState<boolean>(
    localStorage.getItem(CONTRAST_KEY) === 'true'
  );
  
  const currentTheme = theme === 'system' ? getSystemTheme() : theme;

  // --- Theme Side Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(currentTheme);
    
    // Save non-system preference to local storage
    if (theme !== 'system') {
        localStorage.setItem(STORAGE_KEY, theme);
    } else {
        localStorage.removeItem(STORAGE_KEY);
    }
  }, [theme, currentTheme]);

  // --- Contrast Side Effect ---
  useEffect(() => {
    const body = window.document.body;
    if (highContrast) {
      // NOTE: You must define this CSS class globally for the effect to work.
      body.classList.add('high-contrast'); 
      localStorage.setItem(CONTRAST_KEY, 'true');
    } else {
      body.classList.remove('high-contrast');
      localStorage.removeItem(CONTRAST_KEY);
    }
  }, [highContrast]);

  const toggleContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);
  
  const setTheme = useCallback((newTheme: ThemePreference) => {
      setInternalTheme(newTheme);
  }, []);

  return {
    currentTheme,
    highContrast,
    toggleContrast,
    setTheme,
  };
}
