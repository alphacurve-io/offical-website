import { useEffect, useState } from 'react';

/**
 * 延迟加载滚动追踪组件
 * 在用户开始交互后才加载追踪功能
 */
const LazyScrollTracking = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    let loaded = false;
    
    const loadTracking = () => {
      if (loaded) return;
      loaded = true;
      setShouldLoad(true);
    };

    // 在用户首次交互时加载
    const events = ['scroll', 'mousedown', 'touchstart', 'keydown'];
    const handlers = events.map(event => {
      const handler = () => {
        loadTracking();
        document.removeEventListener(event, handler);
      };
      document.addEventListener(event, handler, { once: true, passive: true });
      return { event, handler };
    });

    // 2秒后自动加载
    const timer = setTimeout(loadTracking, 2000);

    return () => {
      clearTimeout(timer);
      handlers.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    // 动态导入滚动追踪逻辑
    Promise.all([
      import('../utils/analytics'),
      import('../hooks/useScrollTracking')
    ]).then(([analyticsModule]) => {
      const { trackScrollDepth, trackSectionView } = analyticsModule;
      
      let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        90: false,
      };
      
      let sectionViewTracked = {
        hero: false,
        services: false,
        team: false,
        service_model: false,
        contact: false,
      };

      const pageLoadTime = Date.now();

      function getCurrentSection(scrollTop) {
        const sections = [
          { id: 'hero', offset: 0 },
          { id: 'services', offset: 800 },
          { id: 'team', offset: 1600 },
          { id: 'service_model', offset: 2400 },
          { id: 'contact', offset: 3200 },
        ];
        
        for (let i = sections.length - 1; i >= 0; i--) {
          if (scrollTop >= sections[i].offset) {
            return sections[i].id;
          }
        }
        return 'hero';
      }

      const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        // 追蹤滾動深度
        [25, 50, 75, 90].forEach((depth) => {
          if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
            scrollDepthTracked[depth] = true;
            const currentSection = getCurrentSection(scrollTop);
            trackScrollDepth(depth, currentSection);
          }
        });

        // 追蹤 Section 進入視圖
        const sections = ['hero', 'services', 'team', 'service_model', 'contact'];
        sections.forEach((sectionName) => {
          const section = document.getElementById(sectionName);
          if (section && !sectionViewTracked[sectionName]) {
            const rect = section.getBoundingClientRect();
            if (rect.top < windowHeight * 0.5 && rect.bottom > 0) {
              sectionViewTracked[sectionName] = true;
              const sectionIndex = sections.indexOf(sectionName);
              const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
              trackSectionView(sectionName, sectionIndex, timeOnPage);
            }
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // 初始检查
    });
  }, [shouldLoad]);

  return null;
};

export default LazyScrollTracking;

