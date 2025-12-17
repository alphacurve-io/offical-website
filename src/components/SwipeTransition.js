import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './SwipeTransition.css';
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

const SwipeTransition = () => {
  const { content } = useLanguage();
  const swipeTransitionContent = content.swipeTransition;
  const items = swipeTransitionContent.items;
  const middleItemCount = items.length - 1; // 中间 items 的数量（不包括最后一个）

  const sectionRef = useRef(null);
  const mainRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !mainRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 计算滚动进度（0 到 1）- 只针对中间 items
      // 占位空间的高度（只包括中间 items）
      const spacerHeight = middleItemCount * windowHeight;
      const scrollableHeight = Math.max(spacerHeight - windowHeight, 1);
      let progress = 0;
      let visible = false;

      // 检测最后一个 item 的位置
      const lastItem = sectionRef.current.querySelector('.swipe-transition-last-item');
      let lastItemTop = Infinity;
      if (lastItem) {
        const lastItemRect = lastItem.getBoundingClientRect();
        lastItemTop = lastItemRect.top;
      }

      if (rect.top <= 0 && rect.bottom > 0) {
        // section 在视窗中
        progress = Math.min(1, Math.max(0, -rect.top / scrollableHeight));
        // 当 progress 达到 1（最后一个中间 item，即倒数第二个 item）时
        // 需要精确控制隐藏时机，让转场刚好完成，不会看起来奇怪
        if (progress >= 1) {
          // 倒数第二个 item 的转场应该刚好在最后一个 item 显示时完成
          // 当最后一个 item 的顶部刚好到达视窗顶部时（lastItemTop <= 0），隐藏固定定位内容
          // 这样转场动效会刚好完成，实现无缝衔接
          // 使用很小的阈值，确保转场刚好完成
          visible = lastItemTop > -10; // 允许 10px 的容差，确保转场完成
        } else {
          visible = true;
        }
      } else if (rect.top > 0 && rect.top < windowHeight) {
        // section 刚开始进入视窗
        progress = 0;
        visible = true;
      } else if (rect.top <= 0 && rect.bottom <= 0) {
        // section 完全滚过，隐藏固定定位的内容（最后一个 item 在正常文档流中）
        progress = 1;
        visible = false;
      } else if (rect.top >= windowHeight) {
        // section 还未进入视窗
        progress = 0;
        visible = false;
      }

      // 更新 CSS 变量
      mainRef.current.style.setProperty('--p', progress);

      // 计算当前选中的项目索引（只针对中间 items）
      const currentIndex = Math.round(progress * (middleItemCount - 1));
      mainRef.current.style.setProperty('--current-index', currentIndex);

      setIsVisible(visible);
    };

    // 使用 requestAnimationFrame 优化性能
    let rafId = null;
    const optimizedScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    window.addEventListener('resize', optimizedScroll, { passive: true });
    handleScroll(); // 初始计算

    return () => {
      window.removeEventListener('scroll', optimizedScroll);
      window.removeEventListener('resize', optimizedScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [middleItemCount]);

  // 分离中间 items 和最后一个 item
  const middleItems = items.slice(0, -1);
  const lastItem = items[items.length - 1];
  
  // Get the first image source for LCP preload
  const firstImageSrc = middleItems.length > 0 ? getImageSrc(middleItems[0].image) : null;

  return (
    <>
      {/* Preload LCP image (first SwipeTransition image) for optimal performance */}
      {firstImageSrc && firstImageSrc !== placeholderImage && (
        <Helmet>
          <link 
            rel="preload" 
            as="image" 
            href={firstImageSrc}
            fetchPriority="high"
          />
        </Helmet>
      )}
      <section 
        ref={sectionRef} 
        className="swipe-transition-section"
        style={{ '--n': middleItemCount }}
      >
      {/* 占位空间，只计算中间 items 的高度 */}
      <div className="swipe-transition-spacer" style={{ height: `${middleItemCount * 100}vh` }} />
      
      {/* 固定定位的 swipe transition 内容（只包含中间 items） */}
      <main 
        ref={mainRef}
        className={`swipe-transition-main ${isVisible ? 'visible' : ''}`}
        style={{ '--n': middleItemCount }}
      >
        {/* 导航 */}
        <nav aria-label="primary navigation">
          {middleItems.map((item, index) => (
            <a 
              key={item.id} 
              href={`#${item.id}`}
              style={{ '--i': index }}
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* 中间的文章内容 */}
        {middleItems.map((item, index) => (
          <article key={item.id} style={{ '--i': index }}>
            <header>
              <h2>{item.title}</h2>
              <em>{item.subtitle}</em>
            </header>
            <section>
              <figure>
                <img 
                  src={getImageSrc(item.image)} 
                  alt={item.title}
                  // Optimize LCP: First image should have high priority and eager loading
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    e.target.src = placeholderImage;
                  }}
                />
                <figcaption>
                  <p>{item.description}</p>
                </figcaption>
              </figure>
            </section>
          </article>
        ))}
      </main>

      {/* 最后一个 item - 使用相对定位，作为正常文档流的一部分 */}
      <article className="swipe-transition-last-item">
        <header>
          <h2>{lastItem.title}</h2>
          <em>{lastItem.subtitle}</em>
        </header>
        <section>
          <figure>
            <img 
              src={getImageSrc(lastItem.image)} 
              alt={lastItem.title}
              loading="lazy"
              onError={(e) => {
                e.target.src = placeholderImage;
              }}
            />
            <figcaption>
              <p>{lastItem.description}</p>
            </figcaption>
          </figure>
        </section>
      </article>
    </section>
    </>
  );
};

export default SwipeTransition;
