import React from 'react';
import './Footer.css';
import { useLanguage } from '../contexts/LanguageContext';
import { trackExternalLinkClick } from '../utils/analytics';
// import { ReactComponent as FooterIcon } from '../assets/footer-icon.svg';
import { ReactComponent as FooterIconWithText } from '../assets/footer-icon-with-text.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { content } = useLanguage();
  const { contactInfo, columns, copyright } = content.footer;

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-logo">
            <FooterIconWithText className="footer-icon-with-text" />
          {/* <h3>ALPHACURVE</h3> */}
        </div>
        <div className="footer-columns">
          <div className="footer-column">
            <h4>{columns.product.title}</h4>
            <ul>
              {columns.product.links.map((link, index) => (
                <li key={index}>{link.label}</li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h4>{columns.resources.title}</h4>
            <ul>
              {columns.resources.links.map((link, index) => (
                <li key={index}>
                  <a 
                    href={contactInfo[link.key]} 
                    onClick={() => trackExternalLinkClick(contactInfo[link.key], link.label, 'footer')}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-column">
            <h4>{columns.contact.title}</h4>
            <ul>
              <li>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  onClick={() => trackExternalLinkClick(`mailto:${contactInfo.email}`, contactInfo.email, 'footer')}
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>{contactInfo.company_name}/{contactInfo.company_name_en} (統編/Tax: {contactInfo.company_tax_id})</li>
              {/* <li>電話/Phone: <a href={`tel:${contact_info.phone}`}>{contact_info.phone}</a></li> */}
              <li>
                地址/Address: <a 
                  href={contactInfo.address_link}
                  onClick={() => trackExternalLinkClick(contactInfo.address_link, contactInfo.address_en, 'footer')}
                >
                  {contactInfo.address_en}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        
        <p>©  2010-{currentYear} {copyright.text}
        </p>
      </div>
    </footer>
  );
};

export default Footer;