import React, { useState } from 'react';
import './ServiceModel.css';
import serviceModelContent from '../content/service-model-content';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

const ServiceModel = () => {
  const { header, services, whyConsulting, process, whoWeHelp, faq, cta } = serviceModelContent;
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMoreClick = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="service-model-section" id="service-model">
      <div className="service-model-container">
        
        {/* Header */}
        <div className="service-model-header">
          <h2 className="service-model-title">{header.title}</h2>
          <p className="service-model-subtitle">{header.subtitle}</p>
        </div>

        {/* Section 1: 為什麼採用顧問式合作 */}
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
                      <li key={idx}>❌ {problem}</li>
                    ))}
                  </ul>
                )}
                
                {reason.benefits && (
                  <ul className="reason-list benefits">
                    {reason.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <CheckIcon className="check-icon" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
                
                {reason.filters && (
                  <ul className="reason-list filters">
                    {reason.filters.map((filter, idx) => (
                      <li key={idx}>⛔ {filter}</li>
                    ))}
                  </ul>
                )}
                
                <p className="reason-conclusion">{reason.conclusion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 服務內容 */}
        <div className="service-content-section">
          <h3 className="section-title">{services.title}</h3>
          <p className="section-title-en">{services.subtitle}</p>
          
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
                
                {item.note && (
                  <div className="service-note">
                    <p>{item.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: 合作流程 */}
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
                  {step.note && (
                    <div className="step-note">💡 {step.note}</div>
                  )}
                </div>
                {index < process.steps.length - 1 && (
                  <div className="step-connector"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: 適合哪些企業 */}
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

        {/* Section 5: FAQ */}
        <div className="faq-section">
          <h3 className="section-title">{faq.title}</h3>
          <p className="section-title-en">{faq.subtitle}</p>
          
          <div className="faq-list">
            {faq.questions.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h4>{item.question}</h4>
                  <span className="faq-toggle">{openFaqIndex === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="service-model-cta">
          <h3>{cta.title}</h3>
          <p>{cta.subtitle}</p>
          <button className="cta-button" onClick={handleLearnMoreClick}>
            {cta.buttonText}
          </button>
        </div>

      </div>
    </section>
  );
};

export default ServiceModel;
