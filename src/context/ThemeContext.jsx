import { createContext, useContext } from "react";

// FIX: Light mode removed — single polished dark theme
const ThemeContext = createContext({ theme: "dark" });

export function ThemeProvider({ children }) {
  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);