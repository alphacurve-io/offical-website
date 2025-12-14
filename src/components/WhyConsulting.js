import React from 'react';
import './ServiceModel.css';

const WhyConsulting = ({ whyConsulting }) => {
  return (
    <div className="why-consulting-section" id="why-consulting">
      <h3 className="section-title">{whyConsulting.title}</h3>
      <p className="section-title-en">{whyConsulting.subtitle}</p>
      <div className="why-consulting-grid">
        {whyConsulting.reasons.map((reason, index) => (
          <div key={index} className="why-consulting-card">
            <div className="reason-icon">{reason.icon}</div>
            <h4>{reason.title}</h4>
            <p className="reason-subtitle">{reason.subtitle}</p>
            {reason.problems && (
              <ul className="reason-list problems">
                {reason.problems.map((problem, idx) => (
                  <li key={idx}>{problem}</li>
                ))}
              </ul>
            )}
            {reason.benefits && (
              <ul className="reason-list benefits">
                {reason.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            )}
            {reason.filters && (
              <ul className="reason-list filters">
                {reason.filters.map((filter, idx) => (
                  <li key={idx}>{filter}</li>
                ))}
              </ul>
            )}
            <p className="reason-conclusion">{reason.conclusion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyConsulting;
