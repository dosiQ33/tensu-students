// src/hooks/useTelegram.ts
import { useEffect, useState, useCallback } from 'react';

export type TelegramUser = {
  photo_url(photo_url: unknown): unknown;
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  phone_number?: string;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: { user: TelegramUser };
        colorScheme?: 'light' | 'dark';
        themeParams?: Record<string, string>;
        isVersionAtLeast: (v: string) => boolean;
        ready: () => void;
        expand: () => void;
        disableVerticalSwipes: () => void;
        sendData: (data: string) => void;
        onEvent?: (event: string, cb: (...args: unknown[]) => void) => void;
        offEvent?: (event: string, cb: (...args: unknown[]) => void) => void;
        MainButton?: {
          setText: (text: string) => void;
          setParams?: (params: Record<string, unknown>) => void;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick?: (cb: () => void) => void;
        };
        BackButton?: {
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick?: (cb: () => void) => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn('⚠️ Telegram WebApp is not available');
      return;
    }

    tg.ready();
    setUser(tg.initDataUnsafe.user);
  }, []);

  const sendData = useCallback((payload: Record<string, unknown>) => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.error('❌ Cannot send data – Telegram WebApp not available');
      return;
    }
    tg.sendData(JSON.stringify(payload));
  }, []);

  return { user, sendData };
}