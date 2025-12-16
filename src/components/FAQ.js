import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './ServiceModel.css';

const FAQ = ({ faq }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // FAQPage Schema 結構化數據
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return (
    <div className="faq-section">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
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
  );
};

export default FAQ;
