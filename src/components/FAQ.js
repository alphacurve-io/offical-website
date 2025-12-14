import React, { useState } from 'react';
import './ServiceModel.css';

const FAQ = ({ faq }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
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
  );
};

export default FAQ;
