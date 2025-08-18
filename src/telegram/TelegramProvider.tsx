import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type TelegramContextValue = {
  isReady: boolean;
  colorScheme: 'light' | 'dark';
  themeParams: Record<string, string>;
  setMainButton: (opts: { text: string; onClick: () => void; visible?: boolean }) => void;
  hideMainButton: () => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  hapticSuccess: () => void;
  hapticWarning: () => void;
  hapticError: () => void;
};

const TelegramContext = createContext<TelegramContextValue | null>(null);

export function useTelegramUI() {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error('useTelegramUI must be used within TelegramProvider');
  return ctx;
}

function applyThemeToDocument(themeParams: Record<string, string>, colorScheme: 'light' | 'dark') {
  const root = document.documentElement;
  const fallback = (_key: string, light: string, dark: string) => (colorScheme === 'dark' ? dark : light);
  const bg = themeParams.bg_color || fallback('bg_color', '#ffffff', '#0f0f0f');
  const text = themeParams.text_color || fallback('text_color', '#0f0f0f', '#ffffff');
  const hint = themeParams.hint_color || fallback('hint_color', '#6b7280', '#9ca3af');
  const link = themeParams.link_color || fallback('link_color', '#3b82f6', '#60a5fa');
  const button = themeParams.button_color || '#3b82f6';
  const buttonText = themeParams.button_text_color || '#ffffff';
  const secondaryBg = themeParams.secondary_bg_color || fallback('secondary_bg_color', '#f5f7fb', '#121212');

  root.style.setProperty('--tg-bg', bg);
  root.style.setProperty('--tg-text', text);
  root.style.setProperty('--tg-hint', hint);
  root.style.setProperty('--tg-link', link);
  root.style.setProperty('--tg-button', button);
  root.style.setProperty('--tg-button-text', buttonText);
  root.style.setProperty('--tg-surface', secondaryBg);
  root.style.setProperty('color-scheme', colorScheme);
  document.body.style.backgroundColor = bg;
  document.body.style.color = text;
}

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [themeParams, setThemeParams] = useState<Record<string, string>>({});
  const mainBtnHandlerRef = useRef<(() => void) | null>(null);
  const backBtnHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;
    try {
      tg.ready();
      tg.expand();
      if (tg.isVersionAtLeast('7.7')) tg.disableVerticalSwipes();
    } catch (err) {
      console.warn('Telegram WebApp initialization failed', err);
    }

    const scheme = (tg.colorScheme as 'light' | 'dark') || 'light';
    setColorScheme(scheme);
    setThemeParams((tg.themeParams as unknown as Record<string, string>) || {});
    setIsReady(true);

    applyThemeToDocument((tg.themeParams as unknown as Record<string, string>) || {}, scheme);

    const onThemeChanged = () => {
      const newScheme = (tg.colorScheme as 'light' | 'dark') || 'light';
      const params = (tg.themeParams as unknown as Record<string, string>) || {};
      setColorScheme(newScheme);
      setThemeParams(params);
      applyThemeToDocument(params, newScheme);
    };

    tg.onEvent?.('themeChanged', onThemeChanged);
    return () => {
      tg.offEvent?.('themeChanged', onThemeChanged);
    };
  }, []);

  const value = useMemo<TelegramContextValue>(() => ({
    isReady,
    colorScheme,
    themeParams,
    setMainButton: ({ text, onClick, visible = true }) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.MainButton) return;
      try {
        tg.MainButton.setText(text);
        tg.MainButton.setParams?.({ color: getComputedStyle(document.documentElement).getPropertyValue('--tg-button')?.trim() });
        if (visible) tg.MainButton.show(); else tg.MainButton.hide();
        if (mainBtnHandlerRef.current) {
          tg.MainButton.offClick?.(mainBtnHandlerRef.current);
        }
        mainBtnHandlerRef.current = onClick;
        tg.MainButton.onClick(onClick);
      } catch (err) {
        console.warn('Telegram MainButton setup error', err);
      }
    },
    hideMainButton: () => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.MainButton) return;
      try {
        if (mainBtnHandlerRef.current) tg.MainButton.offClick?.(mainBtnHandlerRef.current);
        mainBtnHandlerRef.current = null;
        tg.MainButton.hide();
      } catch (err) {
        console.warn('Telegram MainButton hide error', err);
      }
    },
    showBackButton: (onClick: () => void) => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.BackButton) return;
      try {
        if (backBtnHandlerRef.current) tg.BackButton.offClick?.(backBtnHandlerRef.current);
        backBtnHandlerRef.current = onClick;
        tg.BackButton.onClick(onClick);
        tg.BackButton.show();
      } catch (err) {
        console.warn('Telegram BackButton setup error', err);
      }
    },
    hideBackButton: () => {
      const tg = window.Telegram?.WebApp;
      if (!tg?.BackButton) return;
      try {
        if (backBtnHandlerRef.current) tg.BackButton.offClick?.(backBtnHandlerRef.current);
        backBtnHandlerRef.current = null;
        tg.BackButton.hide();
      } catch (err) {
        console.warn('Telegram BackButton hide error', err);
      }
    },
    hapticSuccess: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'),
    hapticWarning: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning'),
    hapticError: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error'),
  }), [isReady, colorScheme, themeParams]);

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};


