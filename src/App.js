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
import { LanguageProvider } from './contexts/LanguageContext';

const App = () => {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  );
};

export default App;