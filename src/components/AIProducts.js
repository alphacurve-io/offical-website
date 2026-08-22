import React from 'react';
import './AIProducts.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

// 單張產品卡：內容常駐可見（不用 hover 展開），
// 確保審核人員與不執行 JS hover 的裝置都能完整看到產品資訊
const ProductCard = ({ product, linkText, isClone = false }) => (
  <article
    className={`ai-product-card${isClone ? ' ai-product-card--clone' : ''}`}
    aria-hidden={isClone ? 'true' : undefined}
  >
    <a
      className="ai-product-screenshot-link"
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={isClone ? -1 : undefined}
    >
      <img
        className="ai-product-screenshot"
        src={product.screenshot}
        alt={isClone ? '' : product.screenshotAlt}
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
      tabIndex={isClone ? -1 : undefined}
    >
      {linkText} →
    </a>
  </article>
);

// 旗下 AI 產品區塊：一列跑馬燈輪播。
// 軌道複製一份做無縫循環，複製品以 aria-hidden 隱藏、連結移出 tab 順序，
// 避免螢幕閱讀器與鍵盤操作讀到重複內容；hover / focus 時暫停，觸控與
// prefers-reduced-motion 則改成可手動左右滑動（見 AIProducts.css）。
const AIProducts = () => {
  const { content } = useLanguage();
  const aiProducts = content.aiProducts;
  const products = aiProducts.products;

  // 速度固定：每張卡約 10 秒，之後新增產品不需另外調整
  const marqueeStyle = { '--ai-marquee-duration': `${products.length * 10}s` };

  return (
    <section className="ai-products-section" id="products">
      <div className="ai-products-container">
        <h2 className="ai-products-title">{aiProducts.title}</h2>
        <p className="ai-products-description">{aiProducts.description}</p>
      </div>
      <div className="ai-products-marquee">
        <div className="ai-products-track" style={marqueeStyle}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              linkText={aiProducts.linkText}
            />
          ))}
          {products.map((product) => (
            <ProductCard
              key={`${product.id}-clone`}
              product={product}
              linkText={aiProducts.linkText}
              isClone
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIProducts;
