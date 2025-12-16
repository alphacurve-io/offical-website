import { useEffect } from 'react';
import { trackScrollDepth, trackSectionView } from '../utils/analytics';

export const useScrollTracking = () => {
  useEffect(() => {
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
    
    // 初始檢查一次
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

