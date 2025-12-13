import React, { useState } from 'react';
import './ServiceModel.css';
import { useLanguage } from '../contexts/LanguageContext';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

const ServiceModel = () => {
  const { content } = useLanguage();
  const serviceModelContent = content.serviceModel;
  const { header, services, whyConsulting, process, whoWeHelp, faq, cta } = serviceModelContent;
  
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };



  return (
    <section className="service-model-section" id="service-model">
      <div className="service-model-container">
        
        {/* Header */}
        <div className="service-model-header">
          <h2>{header.title}</h2>
          <p>{header.subtitle}</p>
        </div>

        {/* Services List */}
        <div className="service-content-section">
            <div className="service-model-header">
                <h3>{services.title}</h3>
                <p>{services.subtitle}</p>
            </div>
          <div className="service-items">
            {services.items.map((item) => (
              <div key={item.id} className="service-item">
                <div className="service-item-header">
                  <div className="service-number">{item.number}</div>
                  <div className="service-title-group">
                    <h4>{item.title}</h4>
                    <p className="service-title-en">{item.subtitle}</p>
                    {item.slogan && <p className="service-subtitle">{item.slogan}</p>}
                  </div>
                </div>
                <p className="service-description">{item.description}</p>
                <ul className="service-benefits">
                  {item.benefits.map((benefit, index) => (
                    <li key={index}>
                      <CheckIcon className="check-icon" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <p className="service-note">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Consulting */}
        <div className="why-consulting-section" id="why-consulting">
          <h3 className="section-title">{whyConsulting.title}</h3>
          <p className="section-title-en">{whyConsulting.subtitle}</p>
          <div className="why-consulting-grid">
            {whyConsulting.reasons.map((reason, index) => (
              <div key={index} className="why-consulting-card">
                <div className="reason-icon">{reason.icon}</div>
                <h4>{reason.title}</h4>
                <p className="reason-subtitle">{reason.subtitle}</p>
                {reason.problems && (
                  <ul className="reason-list problems">
                    {reason.problems.map((problem, idx) => (
                      <li key={idx}>{problem}</li>
                    ))}
                  </ul>
                )}
                {reason.benefits && (
                  <ul className="reason-list benefits">
                    {reason.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                )}
                {reason.filters && (
                  <ul className="reason-list filters">
                    {reason.filters.map((filter, idx) => (
                      <li key={idx}>{filter}</li>
                    ))}
                  </ul>
                )}
                <p className="reason-conclusion">{reason.conclusion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="process-section">
          <h3 className="section-title">{process.title}</h3>
          <p className="section-title-en">{process.subtitle}</p>
          <div className="process-timeline">
            {process.steps.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{step.number}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p className="step-title-en">{step.subtitle}</p>
                  <p className="step-description">{step.description}</p>
                  {step.note && <p className="step-note">{step.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Help */}
        <div className="who-we-help-section">
          <h3 className="section-title">{whoWeHelp.title}</h3>
          <p className="section-title-en">{whoWeHelp.subtitle}</p>
          <div className="target-grid">
            {whoWeHelp.targets.map((target, index) => (
              <div key={index} className="target-card">
                <CheckIcon className="check-icon" />
                <p>{target}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3 className="section-title">{faq.title}</h3>
          <p className="section-title-en">{faq.subtitle}</p>
          <div className="faq-list">
            {faq.questions.map((q, index) => (
              <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                <div className="faq-question">
                  <h4>{q.question}</h4>
                  <span className="faq-toggle">{openFaqIndex === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>{q.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="service-model-cta">
          <h3>{cta.title}</h3>
          <p>{cta.subtitle}</p>
          <a 
            href="#services" 
            className="cta-button" 
            style={{ display: 'inline-block', textDecoration: 'none' }}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById('services');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {cta.buttonText}
          </a>
        </div>

      </div>
    </section>
  );
};

export default ServiceModel;
