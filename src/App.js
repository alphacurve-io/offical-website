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
  const { language } = useLanguage();
  
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
        <LazyComponent fallback={null} rootMargin="300px">
          <Suspense fallback={null}>
            <Kid1Follower />
          </Suspense>
        </LazyComponent>
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