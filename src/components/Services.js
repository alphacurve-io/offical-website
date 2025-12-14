import React, { useState } from 'react';
import './Services.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

const Services = () => {
  const { content } = useLanguage();
  const servicesContent = content.services;
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <h2 className="services-title">{servicesContent.title}</h2>
        <p className="services-description">{servicesContent.description}</p>
        <div className="services-grid">
          {servicesContent.cards.map((card) => (
            <div 
              key={card.id} 
              className="services-card"
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="services-card-content">
                <h3 className="services-card-main-title">{card.title}/{card.subtitle}</h3>
                <div className="services-card-stat-container">
                  <div className="services-card-stat">{card.stat}</div>
                  <div className="services-card-text">
                    <p className="services-card-title">{card.statTitle}</p>
                    <p className="services-card-subtitle">{card.statSubtitle}</p>
                  </div>
                </div>
              </div>
              <ul className={`services-list ${hoveredCard === card.id ? 'visible' : ''}`}>
                {card.items.map((item, index) => (
                  <li key={index}>
                    <CheckIcon className="check-icon" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;