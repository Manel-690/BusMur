import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("busmur-theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    if (theme === "dark") root.classList.add("dark");
    localStorage.setItem("busmur-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
