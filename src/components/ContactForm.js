import React, { useState } from 'react';

import './ContactForm.css';

import { ReactComponent as UploadIcon } from '../assets/upload-icon.svg';
// import { ReactComponent as PhoneIcon } from '../assets/phone-icon.svg';
import { ReactComponent as LineIcon } from '../assets/line-icon.svg';
import { ReactComponent as EmailIcon } from '../assets/email-icon.svg';
import { ReactComponent as MapPinIcon } from '../assets/map-pin.svg';
import videoSrc from '../assets/map-background-video.mp4';

const ContactForm = () => {
    const contact_info = {
        phone: '+886 921833117',
        email: 'service@alphacurve.io',
        address: '302059 新竹市竹北市莊敬三路207號10樓',
        address_en: '10F., No.207, Zhuangjing 3rd Rd., Zhubei City, Hsinchu County 302059, Taiwan (R.O.C.)',
        company_name: '艾菲肯有限公司',
        company_name_en: 'AlphaCurve Co., Ltd.',
        line_id: '@alphacurve',
        line_link: 'https://page.line.me/alphacurve',

    }
    const [formData, setFormData] = useState({
        name: '',
        street: '',
        city: '',
        postcode: '',
        phone: '',
        email: '',
        message: '',
        file: null,
        });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    /* print env */
    var REACT_APP_API_BASE_URL_PRODUCTION='https://alphacurve.io/website/api';
    var REACT_APP_API_BASE_URL_DEVELOPMENT='http://localhost:8080';
    console.log('Environment:', process.env.REACT_APP_ENV);
    const baseUrl = process.env.REACT_APP_ENV !== 'dev'
      ? REACT_APP_API_BASE_URL_PRODUCTION
      : REACT_APP_API_BASE_URL_DEVELOPMENT;
    const apiUrl = `${baseUrl}/submit`;
    console.log('API URL:', apiUrl);
    try {
      console.log('Form Data:', formData);
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        alert('Message sent!');
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
  };

  /* 如果在手機上，點擊 .map-pin-icon 時，顯示 .map-info */
  const handleMapPinClick = () => {
    const mapInfo = document.querySelector('.map-info');
    if (window.innerWidth < 768) {
      mapInfo.style.display = 'block';
    }

  }
  const handleMapPinHover = () => {
    const mapInfo = document.querySelector('.map-info');
    if (window.innerWidth < 768) {
      mapInfo.style.display = 'block';
      mapInfo.style.opacity = '1';
        /*過3秒後，隱藏 .map-info 漸變消失*/
        setTimeout(() => {
            mapInfo.style.opacity = '0';
            mapInfo.style.transition = 'opacity 0.3s ease-in-out';
            // mapInfo.style.display = 'none';
        }, 3000);
    }

  }

  return (
    <section className="contact-section" id="contact">
      <div className="contact-form-side"></div>
      <div className="contact-container">
        <div className="contact-form-container">
        
          <h2 className="contact-title">聯絡我們/Get in <span className="highlight">touch</span></h2>
          <p className="contact-subtitle">我們會盡快聯繫您！</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="姓名/Contact name" name="name" onChange={handleChange} />
            <input type="text" placeholder="地址/Street" name="street" onChange={handleChange} />
            <input type="text" placeholder="城市/City" name="city" onChange={handleChange} />
            <input type="text" placeholder="郵遞區號/Postcode" name="postcode" onChange={handleChange} />
            <input type="text" placeholder="聯絡電話/Contact Phone" name="phone" onChange={handleChange} />
            <input type="email" placeholder="E-mail" name="email" onChange={handleChange} />
            <textarea placeholder="說說你的想法/Let's talk about your idea" name="message" onChange={handleChange}></textarea>
            <div className="file-upload">
                <label htmlFor="file-upload" className="file-label">
                    <UploadIcon className="upload-icon" />
                    Upload Additional file
                </label>
                <input type="file" id="file-upload" name="file" onChange={handleChange} />
                <small>Attach file. File size of your documents should not exceed 10MB</small>
            </div>
            <button type="submit" className="submit-button">提交/SUBMIT</button>
            <div className="contact-info">
                <div className="contact-item">
                <LineIcon className="contact-icon" />
                <div className="contact-item-text">
                    <strong>Line</strong>
                    <p><a href={contact_info.line_link} target="_blank" rel="noopener noreferrer">{contact_info.line_id}</a></p>
                </div>
                </div>
                <div className="contact-item">
                <EmailIcon className="contact-icon" />
                <div className="contact-item-text">
                    <strong>E-MAIL</strong>
                    <p>{contact_info.email}</p>
                </div>
                </div>
            </div>
          </form>
        </div>
        
        <div className="contact-map-container">
          <div className="map"><MapPinIcon className="map-pin-icon" onClick={handleMapPinClick} onMouseOver={handleMapPinHover} /></div>
          <div className="map-info">
            <p>{contact_info.company_name_en}</p>
            <h3>{contact_info.company_name}</h3>
            <p>{contact_info.address}</p>
          </div>
        </div>
      </div>
      {/* video section start */}
      <div className="map-background-video-container">
        <video
          className="map-background-video"
          autoPlay
          loop
          muted
          playsInline
        >
        <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <script src="./MapSectionVideo.js"></script>
      {/* video section end */}
    </section>
  );
};

export default ContactForm;