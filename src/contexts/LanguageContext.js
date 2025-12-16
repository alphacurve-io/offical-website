import React, { createContext, useState, useContext, useEffect } from 'react';
import { headerContent } from '../content/header-content';
import { heroContent } from '../content/hero-content';
import { servicesContent } from '../content/services-content';
import { teamContent } from '../content/team-content';
import { parallaxWordsContent } from '../content/parallax-words-content';
import { serviceModelContent } from '../content/service-model-content';
import { contactContent } from '../content/contact-content';
import { room2Content } from '../content/room2-content';
import { footerContent } from '../content/footer-content';
import { swipeTransitionContent } from '../content/swipe-transition-content';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Helper function to get language from URL
const getLanguageFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return (lang === 'en' || lang === 'zh') ? lang : 'zh';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => getLanguageFromURL());

  // Update language when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const newLang = getLanguageFromURL();
      setLanguage(newLang);
    };

    // Listen for browser back/forward navigation
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    
    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('lang', newLang);
    window.history.pushState({}, '', url);
  };

  const content = {
    header: headerContent[language],
    hero: heroContent[language],
    services: servicesContent[language],
    team: teamContent[language],
    parallaxWords: parallaxWordsContent[language],
    serviceModel: serviceModelContent[language],
    swipeTransition: swipeTransitionContent[language],
    contact: contactContent[language],
    footer: footerContent[language],
    room2: room2Content[language],
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
