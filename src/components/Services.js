import React from 'react';
import './Services.css';
import { ReactComponent as CheckIcon } from '../assets/check-icon.svg';

const Services = () => {
  return (
    <section className="services-section" id="services">
      <div className="services-container">
        <h2 className="services-title">What We Can Do</h2>
        <p className="services-description">我們透過軟體系統研發與專業的諮詢服務，為您打造高效且可擴充的解決方案。將創新技術轉化為具體商業價值。 </p>
        <div className="services-grid">
          <div className="services-card">
            <h3 className="services-card-main-title">諮詢經驗/Consulting Experience</h3>
            <div className="services-card-stat-container">
                <div className="services-card-stat">10+</div>
                <div className="services-card-text">
                    <p className="services-card-title">年 商業諮詢與合作經驗</p>
                    <p className="services-card-subtitle">Years Consulting Experience</p>
                </div>
            </div>
            <ul className="services-list">
              <li><CheckIcon className="check-icon" />企業AI化/AI Integration</li>
              <li><CheckIcon className="check-icon" />講座、培訓、諮詢/Training & Consulting</li>
              <li><CheckIcon className="check-icon" />架構設計、流程分析/Architecture Design</li>
              <li><CheckIcon className="check-icon" />整合策略/Integration Strategy</li>
              <li><CheckIcon className="check-icon" />產品規劃設計/Product Planning, Design</li>
            </ul>
          </div>
          <div className="services-card">
            <h3 className="services-card-main-title">研發量能/R&D Experience</h3>
            <div className="services-card-stat-container">
                <div className="services-card-stat">100+</div>
                <div className="services-card-text">
                    <p className="services-card-title">項目研發經驗</p>
                    <p className="services-card-subtitle">Project R&D Experience</p>
                </div>
            </div>
            <ul className="services-list">
              <li><CheckIcon className="check-icon" />技術產品研發與導入/Software R&D</li>
              <li><CheckIcon className="check-icon" />網頁設計/Web Design</li>
              <li><CheckIcon className="check-icon" />維運自動化/DevOps & CICD</li>
              <li><CheckIcon className="check-icon" />API設計/API Design</li>
              <li><CheckIcon className="check-icon" />雲端架構與部署/Cloud Solutions</li>
              <li><CheckIcon className="check-icon" />Web3/On-Chain Dapp</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;