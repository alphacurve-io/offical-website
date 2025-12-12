import React from 'react';
import './HeroSection.css';
import videoSrc from '../assets/hero-section-background-video.mp4';
import heroContent from '../content/hero-content';

const HeroSection = () => {
  const { title, subtitle, description, button, footer } = heroContent;

  const handleButtonClick = () => {
    const targetSection = document.getElementById(button.targetSection);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" id="hero">
      {/* <div className="hero-section-floating-wave "></div> */}

      <div className="hero-container">
        <div className="hero-title-container">
          <h1 className="hero-title">{title}</h1>
        </div>
        <div className="hero-slogan-container">
          <div className="hero-subtitle-container">
            <p className="hero-subtitle">
              {subtitle.line1}<br/>
              {subtitle.line2}<span>{subtitle.line2Highlight}</span>
            </p>
          </div>
          <div className="hero-description-container">
            <p className="hero-description">
              {description.line1}<br/>
              {description.line2}
            </p>
          </div>
        </div>
        <div className="hero-button-container">
          <button className="hero-button" onClick={handleButtonClick}>
            {button.text}
          </button>
          <p className="hero-footer">{footer}</p>
        </div>
      </div>
      {/* video secion start */}
      <div className="hero-section-video-container">
        <video
          className="hero-section-video"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <script src="./HeroSectionVideo.js"></script>
      {/* video secion end */}
      <div className="hero-section-floating-background" />
    </section>
  );
};

export default HeroSection;
