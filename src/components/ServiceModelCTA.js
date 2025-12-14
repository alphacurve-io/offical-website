import React from 'react';
import './ServiceModel.css';

const ServiceModelCTA = ({ cta }) => {
  return (
    <div className="service-model-cta">
      <h3>{cta.title}</h3>
      <p>{cta.subtitle}</p>
      <a 
        href="#services" 
        className="cta-button" 
        style={{ display: 'inline-block', textDecoration: 'none' }}
        onClick={(e) => {
          e.preventDefault();
          const element = document.getElementById('services');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        {cta.buttonText}
      </a>
    </div>
  );
};

export default ServiceModelCTA;
