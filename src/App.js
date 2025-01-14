import React from 'react';
import './App.css';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Team from './components/Team';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import Timeline from './components/Timeline';
const App = () => {
  return (
    <div className="App">
      <Header />
      <HeroSection />
      <Services />
      <Team />
      <ContactForm />
      <Footer />
      {/* <Timeline /> */}
    </div>
  );
};

export default App;