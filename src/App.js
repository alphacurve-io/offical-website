import React from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Team from './components/Team';
import ServiceModel from './components/ServiceModel';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';

const App = () => {
  return (
    <LanguageProvider>
      <div className="App">
        <Header />
        <HeroSection />
        <Services />
        <Team />
        <ServiceModel />
        <ContactForm />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;