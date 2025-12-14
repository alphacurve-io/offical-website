import React, { useState, useRef, useEffect } from 'react';
import './WhyConsulting.css';
import { useLanguage } from '../contexts/LanguageContext';

// Placeholder SVG
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QbGFjZWhvbGRlcjwvdGV4dD48L3N2Zz4=';

// 获取图片路径
const getImageSrc = (imagePath) => {
  if (!imagePath || imagePath === 'placeholder') {
    return placeholderImage;
  }
  
  try {
    // 尝试从 assets 目录加载图片
    const image = require(`../assets/${imagePath}`);
    return image.default || image;
  } catch (e) {
    // 如果加载失败，返回 placeholder
    console.warn(`Failed to load image: ${imagePath}`, e);
    return placeholderImage;
  }
};

// FlipCard 组件移到外部
const FlipCard = ({ reason, hue, language }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const timeoutRef = useRef(null);

  const handleButtonClick = (e) => {
    e.stopPropagation();
    // 清除之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    // 清除之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // 设置 2 秒延迟后翻回正面
    timeoutRef.current = setTimeout(() => {
      setIsFlipped(false);
      timeoutRef.current = null;
    }, 2000);
  };

  // 清理 timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 根据语言设置 filters 字体大小
  const filtersFontSize = language === 'zh' ? '0.95rem' : '0.8rem';

  return (
    <div 
      className={`flip-card-container ${isFlipped ? 'flipped' : ''}`}
      style={{ '--hue': hue, '--filters-font-size': filtersFontSize }}
      tabIndex="0"
      onMouseLeave={handleMouseLeave}
    >
      <div className="flip-card">
        {/* 正面 */}
        <div className="card-front">
          <figure>
            <div className="img-bg">
              {(reason.imageFront || reason.image) && (
                <img 
                  src={getImageSrc(reason.imageFront || reason.image)} 
                  alt={reason.title}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
              )}
            </div>
          </figure>
          <div className="card-front-content">
            <div className="reason-icon">{reason.icon}</div>
            <h4>{reason.title}</h4>
            <p className="reason-subtitle">{reason.subtitle}</p>
            {reason.buttonText && (
              <button 
                className="flip-button"
                onClick={handleButtonClick}
              >
                {reason.buttonText}
              </button>
            )}
          </div>
        </div>

        {/* 背面 */}
        <div className="card-back">
          <figure>
            <div className="img-bg">
              {(reason.imageBack || reason.image) && (
                <img 
                  src={getImageSrc(reason.imageBack || reason.image)} 
                  alt={reason.title}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
              )}
            </div>
            {reason.figcaption && (
              <figcaption>{reason.figcaption}</figcaption>
            )}
          </figure>
          <div className="card-back-content">
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
                {reason.filters.map((filter, idx) => {
                  const fontSize = language === 'zh' ? '0.95rem' : '0.8rem';
                  return (
                    <li 
                      key={`filter-${idx}`}
                      style={{ 
                        fontSize: fontSize,
                        color: 'inherit'
                      }}
                    >
                      {filter}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="reason-conclusion">{reason.conclusion}</p>
          </div>
          <div className="design-container">
            <span className="design design--1"></span>
            <span className="design design--2"></span>
            <span className="design design--3"></span>
            <span className="design design--4"></span>
            <span className="design design--5"></span>
            <span className="design design--6"></span>
            <span className="design design--7"></span>
            <span className="design design--8"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WhyConsulting = ({ whyConsulting }) => {
  const { language } = useLanguage();
  // 为每个卡片分配不同的 hue 值，创建不同的颜色主题
  // 使用蓝色系，接近主视觉 #34BFD1 (hsl(188, 60%, 50%)) 和 #00618a (hsl(198, 100%, 27%))
  const hueValues = [188, 195, 185, 200]; // 蓝色系的变化

  return (
    <div className={`why-consulting-section ${language === 'zh' ? 'lang-zh' : 'lang-en'}`} id="why-consulting">
      <h3 className="section-title">{whyConsulting.title}</h3>
      <p className="section-title-en">{whyConsulting.subtitle}</p>
      <div className="why-consulting-grid">
        {whyConsulting.reasons.map((reason, index) => (
          <FlipCard 
            key={`reason-${index}-${reason.title}`}
            reason={reason}
            hue={hueValues[index % hueValues.length]}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default WhyConsulting;
