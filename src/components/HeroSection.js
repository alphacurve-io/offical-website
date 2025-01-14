import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const handleButtonClick = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-section-floating-background "></div>
      <div className="hero-container">
        <div className="hero-title-container">
          <h1 className="hero-title">alphacurve.io</h1>
        </div>
        <div className="hero-slogan-container">
            <div className="hero-subtitle-container">
            <p className="hero-subtitle">技術與商業策略的整合者<br/>打通技術斷點，釋放您的商業潛能</p>
            </div>
            <div className="hero-description-container">
            <p className="hero-description">We integrate tech and business strategy,<br/>break Through Tech Bottlenecks to Unleash Your Business Potential.</p>
            </div>
        </div>
        <div className="hero-button-container">
            <button className="hero-button" onClick={handleButtonClick}>了解更多</button>
            <p className="hero-footer">軟體系統研發 | 技術顧問諮詢</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
