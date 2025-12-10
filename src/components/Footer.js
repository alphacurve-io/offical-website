import React from 'react';
import './Footer.css';
// import { ReactComponent as FooterIcon } from '../assets/footer-icon.svg';
import { ReactComponent as FooterIconWithText } from '../assets/footer-icon-with-text.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const contact_info = {
    phone: '+886 921833117',
    email: 'service@alphacurve.io',
    address: '302059 新竹市竹北市莊敬三路207號10樓',
    address_en: '10F., No.207, Zhuangjing 3rd Rd., Zhubei City, Hsinchu County 302059, Taiwan (R.O.C.)',
    company_name: '艾菲肯有限公司',
    company_name_en: 'AlphaCurve Co., Ltd.',
    company_tax_id: '96835042',
    address_link: 'https://www.google.com.tw/maps/place//@24.8273903,121.0243721,17z/data=!4m5!1m2!2m1!1s10F.,+No.207,+Zhuangjing+3rd+Rd.,+Zhubei+City,+Hsinchu+County+302059,+Taiwan+(R.O.C.)!3m1!15sClUxMEYuLCBOby4yMDcsIFpodWFuZ2ppbmcgM3JkIFJkLiwgWmh1YmVpIENpdHksIEhzaW5jaHUgQ291bnR5IDMwMjA1OSwgVGFpd2FuIChSLk8uQy4pkgEQY29tcG91bmRfc2VjdGlvbuABAA?hl=zh-TW&entry=ttu&g_ep=EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D',
    line_id: '@alphacurve',
    line_link: 'https://page.line.me/alphacurve',
    linkedin_link: 'https://www.linkedin.com/company/efacani',
    medium_link: 'https://medium.com/mr-efacani-teatime',
    studio_link: 'https://www.efacani.com/',
    wiki_link: 'https://wiki.alphacurve.io',
}
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
            <li><a href={contact_info.wiki_link}>Wiki</a></li>
            <li><a href={contact_info.medium_link}>Medium</a></li>
            <li><a href={contact_info.studio_link}>Studio</a></li>
              <li><a href={contact_info.linkedin_link}>LinkedIn</a></li>
              <li><a href={contact_info.line_link}>Line</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li><a href={`mailto:${contact_info.email}`}>{contact_info.email}</a></li>
              <li>{contact_info.company_name}/{contact_info.company_name_en} (統編/Tax: {contact_info.company_tax_id})</li>
              {/* <li>電話/Phone: <a href={`tel:${contact_info.phone}`}>{contact_info.phone}</a></li> */}
              <li>地址/Address: <a href={contact_info.address_link}>{contact_info.address_en}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        
        <p>©  2010-{currentYear} Alphacurve Co., Ltd. All Rights Reserved. alphacurve.io® is a registered domain owned and operated by Alphacurve Co., Ltd. Any unauthorized use or reproduction of this material or the domain is strictly prohibited and may result in legal action. Alphacurve Co., Ltd. 版權所有 (All Rights Reserved). alphacurve.io® 為 Alphacurve Co., Ltd. 正式註冊並營運之網域。任何未經授權之使用或複製行為，均屬違法，違者將依法追究法律責任。
        </p>
      </div>
    </footer>
  );
};

export default Footer;