import React, { useEffect, useRef } from 'react';
import './HeroSection.css';
import { useLanguage } from '../contexts/LanguageContext';
import videoSrc from '../assets/hero-section-background-video.mp4';

const HeroSection = () => {
  const { content, language } = useLanguage();
  const heroContent = content.hero;
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  const handleScrollToWhyConsulting = () => {
    const element = document.getElementById('why-consulting');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={`hero-section ${language === 'en' ? 'lang-en' : ''}`} id="hero">
      <div className="hero-container">
        <div className="hero-title-container">
          <h1 className="hero-title">{heroContent.title}</h1>
        </div>
        <div className="hero-slogan-container">
          <div className="hero-subtitle-container">
            <h3 className="hero-subtitle">
              {heroContent.subtitle.line1}<br />
              {heroContent.subtitle.line2} <span className="highlight">{heroContent.subtitle.line2Highlight}</span>
            </h3>
          </div>
          <div className="hero-description-container">
            <p className="hero-description">
              {heroContent.description.line1}<br />
              {heroContent.description.line2}
            </p>
          </div>
        </div>
        <div className="hero-button-container">
          <button className="hero-button-svg" onClick={handleScrollToWhyConsulting}>
            <svg  
              className="hero-button-svg-element"
              width="180" 
              height="50" 
              viewBox="0 0 180 50"
            >
              <rect 
                className="hero-button-line hero-button-line--outer"
                strokeWidth="6"
                stroke="#00bcd4" 
                strokeLinecap="round"
                fill="none" 
                x="3" 
                y="3" 
                width="174" 
                height="44" 
                rx="8"
              />
              <rect 
                className="hero-button-line hero-button-line--inner"
                strokeWidth="3"
                stroke="#008ba3" 
                strokeLinecap="round"
                fill="none" 
                x="3" 
                y="3" 
                width="174" 
                height="44" 
                rx="8"
              />
            </svg>
            <div className="hero-button-content">
              {heroContent.button.text}
            </div>
          </button>
          <p className="hero-footer">{heroContent.footer}</p>
        </div>
      </div>
      <div className="hero-section-video-container">
        <video
          ref={videoRef}
          className="hero-section-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      {/* The script tag was likely intended to be removed or handled differently in a React context. */}
      {/* <script src="./HeroSectionVideo.js"></script> */}
      <div className="hero-section-floating-background" />
    </section>
  );
};

export default HeroSection;
