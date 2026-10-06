"use client";

import React, { createContext, useContext } from 'react';

const TranslationContext = createContext<{
  locale: string;
  messages: Record<string, any>;
}>({
  locale: 'en',
  messages: {},
});

export function NextIntlClientProvider({
  children,
  locale,
  localizedText,
}: {
  children: React.ReactNode;
  locale: string;
  localizedText: Record<string, any>;
}) {
  return (
    <TranslationContext.Provider value={{ locale, messages: localizedText }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(TranslationContext);
  return context.locale;
}

export function useTranslations() {
  const { messages } = useContext(TranslationContext);

  return (key: string) => {
    const keys = key.split('.');
    let value: any = messages;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  };
}
