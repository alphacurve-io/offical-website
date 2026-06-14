import React, { useState } from 'react';
import './ServiceModel.css';
import { trackFAQExpand } from '../utils/analytics';

const FAQ = ({ faq }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    if (openFaqIndex !== index) {
      // 只有展开时才追踪（避免重复追踪关闭操作）
      trackFAQExpand(index, faq.questions[index].question, 'service_model');
    }
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // 註：FAQPage 結構化資料已統一移至 public/index.html 的靜態 JSON-LD @graph
  // (#faq 節點)，以確保不執行 JS 的 AI 爬蟲也能讀取，避免重複定義。

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
