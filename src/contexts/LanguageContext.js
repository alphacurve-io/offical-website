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
import { kid1FollowerContent } from '../content/kid1-follower-content';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

// Helper function: get language from URL (?lang=zh / ?lang=en)
const getLanguageFromURL = () => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const lang = params.get('lang');
  return (lang === 'en' || lang === 'zh') ? lang : null;
};

// Helper function: detect language from browser settings
const getLanguageFromBrowser = () => {
  if (typeof navigator === 'undefined') return null;

  const candidates = [];

  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    candidates.push(...navigator.languages);
  }

  if (navigator.language) {
    candidates.push(navigator.language);
  }

  // 部分瀏覽器可能提供 userLanguage 等額外屬性
  if (navigator.userLanguage) {
    candidates.push(navigator.userLanguage);
  }

  const lowered = candidates
    .filter(Boolean)
    .map((l) => l.toLowerCase());

  // 優先檢查中文
  if (lowered.some((l) => l.startsWith('zh'))) return 'zh';

  // 其餘則優先英文
  if (lowered.some((l) => l.startsWith('en'))) return 'en';

  return null;
};

// Initial language resolution:
// 1) URL ?lang=zh/en（最高優先）
// 2) Browser language（navigator.language / languages）
// 3) Default to zh（你要求的預設：中文）
const getInitialLanguage = () => {
  const urlLang = getLanguageFromURL();
  if (urlLang) return urlLang;

  const browserLang = getLanguageFromBrowser();
  if (browserLang) return browserLang;

  return 'zh';
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => getInitialLanguage());

  // Update language when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const handleLocationChange = () => {
      const newLang = getLanguageFromURL();
      if (newLang) {
        setLanguage(newLang);
      }
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
    kid1Follower: kid1FollowerContent[language],
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
