import React from 'react';
import './Services.css';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';
import servicesContent from '../content/services-content';

const Services = () => {
  const { title, description, cards } = servicesContent;

  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <h2 className="services-title">{title}</h2>
        <p className="services-description">{description}</p>
        <div className="services-grid">
          {cards.map((card) => (
            <div key={card.id} className="services-card">
              <h3 className="services-card-main-title">{card.title}/{card.subtitle}</h3>
              <div className="services-card-stat-container">
                <div className="services-card-stat">{card.stat}</div>
                <div className="services-card-text">
                  <p className="services-card-title">{card.statTitle}</p>
                  <p className="services-card-subtitle">{card.statSubtitle}</p>
                </div>
              </div>
              <ul className="services-list">
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