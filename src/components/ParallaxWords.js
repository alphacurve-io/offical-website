import React, { useEffect, useRef, useState, useMemo } from 'react';
import './ParallaxWords.css';
import { useLanguage } from '../contexts/LanguageContext';

const ParallaxWords = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafId = useRef(null);
  const { content } = useLanguage();
  const parallaxWordsContent = content.parallaxWords;
  const words = parallaxWordsContent?.words || [];

  // 預定義的隨機位置數組（32個位置，8行4列）
  // 使用確定性的偽隨機算法，確保每次渲染結果一致
  const randomPositions = useMemo(() => {
    const totalPositions = 32;
    const positions = Array.from({ length: totalPositions }, (_, i) => i);
    
    // 使用確定性的偽隨機洗牌（基於固定種子）
    let seed = 12345; // 固定種子
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    // Fisher-Yates 洗牌算法（使用確定性隨機數）
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    return positions;
  }, []); // 只在組件掛載時生成一次

  // 計算背景色（基於滾動進度）- 使用 useMemo 緩存
  const backgroundColor = useMemo(() => {
    const progress = scrollProgress;
    
    // 從 Team 的結束色開始: rgba(247,248,250,1) - 淺灰
    // 過渡到藍色: rgba(70, 197, 213, 1)
    // 然後深色: rgba(21, 93, 103, 1)
    // 最後到 ServiceModel: #f2f7f9 = rgb(242, 247, 249)
    // 在 80% 時完成過渡，之後保持 ServiceModel 背景色
    
    let r, g, b;
    
    if (progress < 0.05) {
      // 0-25%: 從淺灰到藍色
      const t = progress / 0.1;
      r = Math.round(247 + (70 - 247) * t);
      g = Math.round(248 + (197 - 248) * t);
      b = Math.round(250 + (213 - 250) * t);
    } else if (progress < 0.8) {
      // 25-50%: 從藍色到深色
      const t = (progress - 0.1) / 0.7;
      r = Math.round(70 + (21 - 70) * t);
      g = Math.round(197 + (93 - 197) * t);
      b = Math.round(213 + (103 - 213) * t);
    } else if (progress < 0.8) {
      // 50-80%: 從深色到 ServiceModel 淺色
      const t = (progress - 0.5) / 0.3;
      r = Math.round(21 + (242 - 21) * t);
      g = Math.round(93 + (247 - 93) * t);
      b = Math.round(103 + (249 - 103) * t);
    } else {
      // 80-100%: 保持 ServiceModel 背景色
      r = 242;
      g = 247;
      b = 249;
    }
    
    return `rgb(${r}, ${g}, ${b})`;
  }, [scrollProgress]);

  useEffect(() => {
    let lastProgress = -1;
    
    const handleScroll = () => {
      if (sectionRef.current && rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          if (!sectionRef.current) {
            rafId.current = null;
            return;
          }
          
          const rect = sectionRef.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionHeight = rect.height || sectionRef.current.scrollHeight;
          
          // 計算滾動進度 (0 到 1)
          const scrollTop = window.scrollY || window.pageYOffset;
          const sectionTop = sectionRef.current.offsetTop;
          const sectionBottom = sectionTop + sectionHeight;
          
          let progress = 0;
          if (scrollTop >= sectionTop && scrollTop <= sectionBottom) {
            const scrollableHeight = Math.max(sectionHeight - windowHeight, 1);
            progress = (scrollTop - sectionTop) / scrollableHeight;
            progress = Math.max(0, Math.min(1, progress));
          } else if (scrollTop > sectionBottom) {
            progress = 1;
          }
          
          // 只在進度變化超過閾值時更新，減少不必要的重渲染
          if (Math.abs(progress - lastProgress) > 0.001) {
            setScrollProgress(progress);
            lastProgress = progress;
          }
          
          rafId.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始計算

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, []);

  return (
    <section 
      className="parallax-words-section" 
      ref={sectionRef} 
      id="parallax-words"
      style={{
        background: backgroundColor,
      }}
    >
      <div className="parallax-words-container" ref={containerRef}>
        {words.map((word, index) => {
          // 計算 3D 效果
          // 每個單字在不同的滾動進度時達到中心
          const offset = index / words.length;
          const wordProgress = (scrollProgress + offset) % 1;
          
          // translateZ: -1000px (遠) 到 1000px (近)
          // 當 wordProgress = 0.5 時，單字在中心 (translateZ = 0)
          const translateZ = (wordProgress - 0.5) * 2000; // -1000 到 1000
          
          // 計算透明度和模糊（當接近中心時最清晰）
          const distanceFromCenter = Math.abs(wordProgress - 0.5);
          const opacity = Math.max(0.2, 1 - distanceFromCenter * 2);
          const blur = distanceFromCenter * 8;
          const scale = 0.6 + (1 - distanceFromCenter * 2) * 0.4;

          // 計算隨機網格位置 (8x4 網格，32個位置)
          const cols = 4;
          const position = randomPositions[index] || index;
          const gridCol = (position % cols) + 1;
          const gridRow = Math.floor(position / cols) + 1;

          return (
            <div
              key={index}
              className="parallax-word"
              data-index={index}
              style={{
                gridColumn: gridCol,
                gridRow: gridRow,
                transform: `translateZ(${translateZ}px) scale(${scale})`,
                opacity: opacity,
                filter: `blur(${blur}px)`,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ParallaxWords;