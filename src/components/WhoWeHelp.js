import React from 'react';
import './ServiceModel.css';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

const WhoWeHelp = ({ whoWeHelp }) => {
  return (
    <div className="who-we-help-section">
      <h3 className="section-title">{whoWeHelp.title}</h3>
      <p className="section-title-en">{whoWeHelp.subtitle}</p>
      <div className="target-grid">
        {whoWeHelp.targets.map((target, index) => (
          <div key={index} className="target-card">
            <CheckIcon className="check-icon" />
            <p>{target}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoWeHelp;
