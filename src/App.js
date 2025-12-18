import React, { Suspense, lazy } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SEOHead from './components/SEOHead';
import LazyScrollTracking from './components/LazyScrollTracking';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// 懒加载非关键组件（首屏不需要的组件）
// 使用更激进的代码分割策略，减少初始包大小
const CustomCursor = lazy(() => import(/* webpackChunkName: "cursor" */ './components/CustomCursor'));
const Kid1Follower = lazy(() => import(/* webpackChunkName: "kid1" */ './components/Kid1Follower'));
const Services = lazy(() => import(/* webpackChunkName: "services" */ './components/Services'));
const Team = lazy(() => import(/* webpackChunkName: "team" */ './components/Team'));
const ParallaxWords = lazy(() => import(/* webpackChunkName: "parallax" */ './components/ParallaxWords'));
const ServiceModel = lazy(() => import(/* webpackChunkName: "service-model" */ './components/ServiceModel'));
const SwipeTransition = lazy(() => import(/* webpackChunkName: "swipe" */ './components/SwipeTransition'));
const ContactForm = lazy(() => import(/* webpackChunkName: "contact" */ './components/ContactForm'));
const Footer = lazy(() => import(/* webpackChunkName: "footer" */ './components/Footer'));

// 加载占位符组件
const LoadingPlaceholder = () => null;

// Intersection Observer wrapper for lazy loading components when they enter viewport
const LazyComponent = ({ children, fallback = null, rootMargin = '200px' }) => {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold: 0.01 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad, rootMargin]);

  return (
    <div ref={ref}>
      {shouldLoad ? children : fallback}
    </div>
  );
};

const AppContent = () => {
  const { language, content } = useLanguage();
  const [enableKid1, setEnableKid1] = React.useState(false);
  const [canToggleKid1, setCanToggleKid1] = React.useState(false);
  const [kid1StartDelayMs, setKid1StartDelayMs] = React.useState(1000);
  const enableKid1Ref = React.useRef(enableKid1);

  const kid1ToggleText = content.kid1Follower?.toggle || {};

  // 桌面版預設啟動 Kid1；行動裝置預設關閉，但右側都有浮動選單可開關
  React.useEffect(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isMobile =
      /iPhone|iPad|iPod|Android/i.test(ua) ||
      window.innerWidth <= 768;

    const prefersReducedMotion = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

    // 所有裝置啟動延遲統一為 1 秒
    setKid1StartDelayMs(1000);

    // 桌面版：預設啟動 Kid1（若未要求減少動效）
    if (!isMobile && !prefersReducedMotion) {
      setEnableKid1(true);
    }

    // 只要未要求減少動效，就顯示右側浮動選單（桌機 + 手機都可以手動開關）
    if (!prefersReducedMotion) {
      setCanToggleKid1(true);
    }
  }, []);

  // 讓 callback 和延遲定時器可以讀到最新的 enableKid1 狀態
  React.useEffect(() => {
    enableKid1Ref.current = enableKid1;
  }, [enableKid1]);

  // 給 Kid1Follower 用的「重新載入」函式：效果等同使用者手動按一次 kid1-toggle（關->開）
  // 規則：
  // - 每次偵測到異常時立刻用 toggle 重新載入一次
  // - Kid1Follower 自己會每 5 秒做一次檢查並在需要時再次呼叫這個函式
  const handleKid1Reload = React.useCallback(() => {
    console.warn('🔁 Kid1Follower 要求重新載入，將透過 kid1-toggle 進行自動重載');

    // 如果使用者已經手動關掉 Kid1，就不要再自動重載，尊重使用者選擇
    if (!enableKid1Ref.current) {
      console.warn('⚠️ 收到自動重載請求，但 Kid1 目前已關閉，將略過自動重載');
      return;
    }
    
    // 先關閉 Kid1（會卸載 Kid1Follower 組件）
    setEnableKid1(false);
    // 稍微延遲之後再重新開啟，效果等同按一次切換按鈕（關->開）
    setTimeout(() => {
      setEnableKid1(true);
    }, 200);
  }, []);
  
  return (
    <>
      <SEOHead language={language} />
      <LazyScrollTracking />
      <div className="App">
        <main>
        {/* CustomCursor and Kid1Follower: Load after initial render to reduce main thread work */}
        <LazyComponent fallback={null} rootMargin="300px">
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
        </LazyComponent>
        {enableKid1 && (
          <Suspense fallback={null}>
            <Kid1Follower
              startDelayMs={kid1StartDelayMs}
              onKid1Reload={handleKid1Reload}
            />
          </Suspense>
        )}
        <Header />
        <HeroSection />
        {/* Below-the-fold components: Load when approaching viewport */}
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <Services />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <Team />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <ParallaxWords />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <ServiceModel />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <SwipeTransition />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <ContactForm />
          </Suspense>
        </LazyComponent>
        <LazyComponent fallback={<LoadingPlaceholder />} rootMargin="300px">
          <Suspense fallback={<LoadingPlaceholder />}>
            <Footer />
          </Suspense>
        </LazyComponent>
        </main>

        {/* 右側浮動選單：讓使用者決定是否啟動 Kid1
            桌機預設啟動，手機預設關閉，但兩者都可以在這裡切換 */}
        {canToggleKid1 && (
          <div className="kid1-toggle-container">
            <button
              type="button"
              className={
                `kid1-toggle-button ` +
                (enableKid1 ? 'kid1-toggle-button--active ' : '') +
                'kid1-toggle-button--en'
              }
              onClick={() => setEnableKid1((prev) => !prev)}
            >
              <span
                className={
                  `kid1-toggle-title ` +
                  (language === 'zh' ? 'kid1-toggle-title--zh' : 'kid1-toggle-title--en')
                }
              >
                {enableKid1 ? kid1ToggleText.disable : kid1ToggleText.enable}
              </span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
