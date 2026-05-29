import React, { createContext } from 'react';

export const ThemeContext = createContext({ theme: 'dark' });

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}
