import React from 'react';
import './ServiceModel.css';

// 获取图片路径的工具函数
const getImageSrc = (imagePath) => {
  if (!imagePath) {
    return null;
  }
  
  try {
    // 尝试从 assets 目录加载图片
    const image = require(`../assets/${imagePath}`);
    return image.default || image;
  } catch (e) {
    // 如果加载失败，返回 null
    console.warn(`Failed to load image: ${imagePath}`, e);
    return null;
  }
};

const ServiceModelCTA = ({ cta }) => {
  const handleClick = (e, link) => {
    // 如果是 anchor (以 # 开头)，使用平滑滚动
    if (link && link.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(link.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // 如果是 URL，让浏览器正常处理
    // 如果 link 为空或未定义，阻止默认行为
    if (!link) {
      e.preventDefault();
    }
  };

  const link = cta.link || cta.url || '#services'; // 默认值保持向后兼容
  const iconSrc = cta.icon ? getImageSrc(cta.icon) : null;
  const iconPosition = cta.iconPosition || 'right'; // 默认在右边，可选 'left' 或 'right'

  return (
    <div className="service-model-cta">
      <h3>{cta.title}</h3>
      <p>{cta.subtitle}</p>
      <a 
        href={link}
        className={`cta-button ${iconPosition === 'left' ? 'icon-left' : 'icon-right'}`}
        style={{ textDecoration: 'none' }}
        onClick={(e) => handleClick(e, link)}
      >
        {iconSrc && iconPosition === 'left' && (
          <img src={iconSrc} alt="" className="cta-button-icon" />
        )}
        <span className="cta-button-text">{cta.buttonText}</span>
        {iconSrc && iconPosition === 'right' && (
          <img src={iconSrc} alt="" className="cta-button-icon" />
        )}
      </a>
    </div>
  );
};

export default ServiceModelCTA;
