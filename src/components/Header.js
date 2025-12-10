import React, { useState, useEffect } from 'react';
import './Header.css';
import { ReactComponent as HeaderIcon } from '../assets/header-icon.svg';
import { ReactComponent as HeaderIconWhite } from '../assets/header-icon-white.svg';
import { ReactComponent as MenuOpenIcon } from '../assets/menu-open-icon.svg';
import { ReactComponent as MenuCloseIcon } from '../assets/menu-close-icon.svg';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    
    const handleScroll = () => {
      const header = document.querySelector('.header');
      const headerIcon = document.querySelector('.header-icon');
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
              <h1>LPHACURVE</h1>
            </div>
            <div className="logo-text-subtitle">
              <p>software R&D | tech consulting</p>
            </div>
          </div>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <MenuCloseIcon /> : <MenuOpenIcon />}
        </button>
        <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li>
              <div onClick={() => handleNavLinkClick('hero')} className="nav-link-container">
                <div className="nav-title">首頁</div>
                <div className="nav-subtitle">home</div>
              </div>
            </li>
            <li>
              <div onClick={() => handleNavLinkClick('services')} className="nav-link-container">
                <div className="nav-title">服務</div>
                <div className="nav-subtitle">service</div>
              </div>
            </li>
            <li>
              <div onClick={() => handleNavLinkClick('team')} className="nav-link-container">
                <div className="nav-title">關於我們</div>
                <div className="nav-subtitle">about us</div>
              </div>
            </li>
            <li>
              <div onClick={() => handleNavLinkClick('contact')} className="nav-link-container">
                <div className="nav-title">聯絡我們</div>
                <div className="nav-subtitle">contact us</div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;