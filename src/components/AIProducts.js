import React from 'react';
import './AIProducts.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

// 旗下 AI 產品區塊：內容保持常駐可見（不用 hover 展開），
// 確保審核人員與不執行 JS hover 的裝置都能完整看到產品資訊
const AIProducts = () => {
  const { content } = useLanguage();
  const aiProducts = content.aiProducts;

  return (
    <section className="ai-products-section" id="products">
      <div className="ai-products-container">
        <h2 className="ai-products-title">{aiProducts.title}</h2>
        <p className="ai-products-description">{aiProducts.description}</p>
        <div className="ai-products-grid">
          {aiProducts.products.map((product) => (
            <article key={product.id} className="ai-product-card">
              <a
                className="ai-product-screenshot-link"
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="ai-product-screenshot"
                  src={product.screenshot}
                  alt={product.screenshotAlt}
                  loading="lazy"
                  width="1024"
                  height="640"
                />
              </a>
              <div className="ai-product-card-header">
                <div className="ai-product-name-row">
                  <h3 className="ai-product-name">{product.name}</h3>
                  <span className="ai-product-status">{product.status}</span>
                </div>
                <p className="ai-product-tagline">{product.tagline}</p>
                <p className="ai-product-category">{product.category}</p>
              </div>
              <p className="ai-product-pain">{product.painPoint}</p>
              <p className="ai-product-solution">{product.solution}</p>
              <ul className="ai-product-features">
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <CheckIcon className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                className="ai-product-link"
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {aiProducts.linkText} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIProducts;
