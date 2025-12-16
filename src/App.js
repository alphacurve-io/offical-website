import React, { Suspense, lazy } from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SEOHead from './components/SEOHead';
import LazyScrollTracking from './components/LazyScrollTracking';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// 懒加载非关键组件（首屏不需要的组件）
const CustomCursor = lazy(() => import('./components/CustomCursor'));
const Services = lazy(() => import('./components/Services'));
const Team = lazy(() => import('./components/Team'));
const ParallaxWords = lazy(() => import('./components/ParallaxWords'));
const ServiceModel = lazy(() => import('./components/ServiceModel'));
const SwipeTransition = lazy(() => import('./components/SwipeTransition'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));

// 加载占位符组件
const LoadingPlaceholder = () => null;

const AppContent = () => {
  const { language } = useLanguage();
  
  return (
    <>
      <SEOHead language={language} />
      <LazyScrollTracking />
      <div className="App">
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
        <Header />
        <HeroSection />
        <Suspense fallback={<LoadingPlaceholder />}>
          <Services />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Team />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <ParallaxWords />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <ServiceModel />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <SwipeTransition />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <ContactForm />
        </Suspense>
        <Suspense fallback={<LoadingPlaceholder />}>
          <Footer />
        </Suspense>
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