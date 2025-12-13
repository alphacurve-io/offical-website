import React, { useState, useEffect } from 'react';
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
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    
    const handleScroll = () => {
      const header = document.querySelector('.header');
      // const headerIcon = document.querySelector('.header-icon');
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
        // headerIcon.classList.add('header-icon-active');
        setIsScrolled(true);
      } else {
        header.classList.remove('scrolled');
        // headerIcon.classList.remove('header-icon-active');
        setIsScrolled(false);

      }
    };

    window.addEventListener('scroll', handleScroll);
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

  const handleNavLinkClick = (targetId) => {
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                <div onClick={() => handleNavLinkClick(item.id)} className="nav-link-container">
                  <div className="nav-title" data-text={item.subtitle}>{item.title}</div>
                  <div className="nav-subtitle">{item.subtitle}</div>
                </div>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
            <button className="lang-toggle" onClick={toggleLanguage}>
                {language === 'zh' ? 'EN' : 'ZH'}
            </button>
            <button className="menu-toggle" onClick={toggleMenu}>
            {isMenuOpen ? <MenuCloseIcon /> : <MenuOpenIcon />}
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;