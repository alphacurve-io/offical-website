import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Header.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as HeaderIcon } from '../assets/header-icon.svg';
import { ReactComponent as HeaderIconWhite } from '../assets/header-icon-white.svg';
import { ReactComponent as MenuOpenIcon } from '../assets/menu-open-icon.svg';
import { ReactComponent as MenuCloseIcon } from '../assets/menu-close-icon.svg';

const Header = () => {
  const { content, language, toggleLanguage } = useLanguage();
  const { logo, nav } = content.header;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const analyticsLoaded = useRef(false);
  const analyticsModule = useRef(null);

  // Lazy load analytics only when needed
  const loadAnalytics = useCallback(async () => {
    if (analyticsLoaded.current && analyticsModule.current) {
      return analyticsModule.current;
    }
    try {
      const module = await import('../utils/analytics');
      analyticsModule.current = module;
      analyticsLoaded.current = true;
      return module;
    } catch (error) {
      console.warn('Failed to load analytics:', error);
      return null;
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
        setIsScrolled(true);
      } else {
        header.classList.remove('scrolled');
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogoClick = () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavLinkClick = useCallback(async (targetId, index) => {
    // Load analytics only when user interacts
    const analytics = await loadAnalytics();
    if (analytics?.trackNavClick) {
      analytics.trackNavClick(targetId, index, language);
    }
    
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [language, loadAnalytics]);

  const handleLanguageToggle = useCallback(async () => {
    const fromLang = language;
    const toLang = language === 'zh' ? 'en' : 'zh';
    
    // Load analytics only when user interacts
    const analytics = await loadAnalytics();
    if (analytics?.trackLanguageToggle) {
      analytics.trackLanguageToggle(fromLang, toLang, 'header');
    }
    
    toggleLanguage();
  }, [language, toggleLanguage, loadAnalytics]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo" onClick={handleLogoClick}>
        {isScrolled ? <HeaderIconWhite className="logo-icon" /> : <HeaderIcon className="logo-icon" />}
        <div className="logo-text">
            <div className="logo-text-title">
              <h1>{logo.title}</h1>
            </div>
            <div className="logo-text-subtitle">
              <p>{logo.subtitle}</p>
            </div>
          </div>
        </div>
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {nav.map((item, index) => (
              <li key={index}>
                <div onClick={() => handleNavLinkClick(item.id, index)} className="nav-link-container" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleNavLinkClick(item.id, index)}>
                  <div className="nav-title" data-text={item.subtitle}>{item.title}</div>
                  <div className="nav-subtitle">{item.subtitle}</div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
            <button 
              className="lang-toggle" 
              onClick={handleLanguageToggle}
              aria-label={language === 'zh' ? 'Switch to English' : '切換到中文'}
            >
                {language === 'zh' ? 'EN' : 'ZH'}
            </button>
            <button 
              className="menu-toggle" 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
            {isMenuOpen ? <MenuCloseIcon aria-hidden="true" /> : <MenuOpenIcon aria-hidden="true" />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);