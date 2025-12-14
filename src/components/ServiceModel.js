import React from 'react';
import './ServiceModel.css';
import { useLanguage } from '../contexts/LanguageContext';
import ServiceModelHeader from './ServiceModelHeader';
import ServiceModelServices from './ServiceModelServices';
import WhyConsulting from './WhyConsulting';
import Process from './Process';
import WhoWeHelp from './WhoWeHelp';
import FAQ from './FAQ';
import ServiceModelCTA from './ServiceModelCTA';

const ServiceModel = () => {
  const { content } = useLanguage();
  const serviceModelContent = content.serviceModel;
  const { header, services, whyConsulting, process, whoWeHelp, faq, cta } = serviceModelContent;



  return (
    <section className="service-model-section" id="service-model">
      <div className="service-model-container">
        <ServiceModelHeader header={header} />
        <ServiceModelServices services={services} />
        <WhyConsulting whyConsulting={whyConsulting} />
        <Process process={process} />
        <WhoWeHelp whoWeHelp={whoWeHelp} />
        <FAQ faq={faq} />
        <ServiceModelCTA cta={cta} />
      </div>
    </section>
  );
};

export default ServiceModel;
