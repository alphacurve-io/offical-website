import React, { createContext, useState, useContext } from 'react';
import { headerContent } from '../content/header-content';
import { heroContent } from '../content/hero-content';
import { servicesContent } from '../content/services-content';
import { teamContent } from '../content/team-content';
import { parallaxWordsContent } from '../content/parallax-words-content';
import { serviceModelContent } from '../content/service-model-content';
import { contactContent } from '../content/contact-content';
import { footerContent } from '../content/footer-content';
import { swipeTransitionContent } from '../content/swipe-transition-content';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh'); // Default to Chinese

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'zh' ? 'en' : 'zh'));
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
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
