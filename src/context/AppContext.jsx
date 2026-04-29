import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('electraGuide_language') || 'en';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('electraGuide_theme');
    if (saved !== null) return JSON.parse(saved);
    return false;
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    const saved = localStorage.getItem('electraGuide_badges');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('electraGuide_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('electraGuide_theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('electraGuide_badges', JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  const unlockBadge = (badgeName) => {
    setUnlockedBadges(prev => {
      if (prev.includes(badgeName)) return prev;
      return [...prev, badgeName];
    });
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <AppContext.Provider value={{ 
      language, setLanguage, 
      unlockedBadges, unlockBadge,
      isDarkMode, toggleDarkMode 
    }}>
      {children}
    </AppContext.Provider>
  );
}
