import React from 'react';
import './ServiceModel.css';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

// Placeholder SVG
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';

// 獲取服務流程圖片
const getServiceImage = (imagePath) => {
  if (!imagePath) {
    return placeholderImage;
  }
  
  try {
    const image = require(`../assets/${imagePath}`);
    return image.default || image;
  } catch (e) {
    return placeholderImage;
  }
};

const ServiceModelServices = ({ services }) => {
  return (
    <div className="service-content-section">
      <div className="service-model-header">
        <h3>{services.title}</h3>
        <p>{services.subtitle}</p>
      </div>
      <div className="service-items">
        {services.items.map((item) => (
          <div key={item.id} className="service-item">
            {/* 半透明圖片背景 */}
            <div className="service-item-image-container">
              <img 
                src={getServiceImage(item.image)} 
                alt={item.title}
                className="service-item-image"
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
              <div className="service-item-image-overlay"></div>
            </div>
            
            <div className="service-item-content">
              <div className="service-item-header">
                <div className="service-number">{item.number}</div>
                <div className="service-title-group">
                  <h4>{item.title}</h4>
                  <p className="service-title-en">{item.subtitle}</p>
                  {item.slogan && <p className="service-subtitle">{item.slogan}</p>}
                </div>
              </div>
              <p className="service-description">{item.description}</p>
              <ul className="service-benefits">
                {item.benefits.map((benefit, index) => (
                  <li key={index}>
                    <CheckIcon className="check-icon" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="service-note">{item.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceModelServices;
