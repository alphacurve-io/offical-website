import React from 'react';
import './Footer.css';
// import { ReactComponent as FooterIcon } from '../assets/footer-icon.svg';
import { ReactComponent as FooterIconWithText } from '../assets/footer-icon-with-text.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-logo">
            <FooterIconWithText className="footer-icon-with-text" />
          {/* <h3>ALPHACURVE</h3> */}
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li>Features</li>
              <li>Story</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li>Support</li>
              <li>Privacy policy</li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li>service@alphacurve.io</li>
              <li>艾菲肯有限公司 (統編/Tax: 96835042)</li>
              <li>電話/Phone: +886 921 833 117</li>
              <li>地址: 新竹縣竹北市莊敬三路207號</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        
        <p>©  2010-{currentYear}  Alphacurve Co., Ltd. All Rights Reserved. alphacurve.io® is a registered product by alphacurve.io. </p>
      </div>
    </footer>
  );
};

export default Footer;