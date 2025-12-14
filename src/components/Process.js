import React from 'react';
import './ServiceModel.css';

const Process = ({ process }) => {
  return (
    <div className="process-section">
      <h3 className="section-title">{process.title}</h3>
      <p className="section-title-en">{process.subtitle}</p>
      <div className="process-timeline">
        {process.steps.map((step, index) => (
          <div key={index} className="process-step">
            <div className="step-number">{step.number}</div>
            <div className="step-content">
              <h4>{step.title}</h4>
              <p className="step-title-en">{step.subtitle}</p>
              <p className="step-description">{step.description}</p>
              {step.note && <p className="step-note">{step.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Process;
