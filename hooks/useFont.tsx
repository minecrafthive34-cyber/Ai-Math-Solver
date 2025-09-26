import React, { createContext, useState, useContext, useEffect, FC, ReactNode } from 'react';
import { Font } from '../types';
import { FONT_OPTIONS } from '../constants';

const FONT_STORAGE_KEY = 'math-solver-font';

interface FontContextType {
  font: Font;
  setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

const FONT_CLASSES = FONT_OPTIONS.map(f => `font-${f.id}`);

export const FontProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [font, setFont] = useState<Font>('inter');

  useEffect(() => {
    try {
      const storedFont = localStorage.getItem(FONT_STORAGE_KEY) as Font;
      if (storedFont && FONT_OPTIONS.some(f => f.id === storedFont)) {
        setFont(storedFont);
      }
    } catch (error) {
      console.error("Failed to load font from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_STORAGE_KEY, font);
      document.body.classList.remove(...FONT_CLASSES);
      document.body.classList.add(`font-${font}`);
    } catch (error) {
      console.error("Failed to save font or apply class", error);
    }
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
