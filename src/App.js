import React from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Team from './components/Team';
import ParallaxWords from './components/ParallaxWords';
import ServiceModel from './components/ServiceModel';
import SwipeTransition from './components/SwipeTransition';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SEOHead from './components/SEOHead';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useScrollTracking } from './hooks/useScrollTracking';

const AppContent = () => {
  const { language } = useLanguage();
  
  // 啟用滾動深度和 Section 視圖追蹤
  useScrollTracking();
  
  return (
    <>
      <SEOHead language={language} />
      <div className="App">
        <CustomCursor />
        <Header />
        <HeroSection />
        <Services />
        <Team />
        <ParallaxWords />
        <ServiceModel />
        <SwipeTransition />
        <ContactForm />
        <Footer />
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