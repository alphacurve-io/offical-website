import React from 'react';
import './ServiceModel.css';

const ServiceModelHeader = ({ header }) => {
  return (
    <div className="service-model-header">
      <h2 className="service-model-title">{header.title}</h2>
      <p>{header.subtitle}</p>
    </div>
  );
};

export default ServiceModelHeader;
