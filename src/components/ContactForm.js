import React, { useState, useRef, useEffect } from 'react';

import './ContactForm.css';
import { useLanguage } from '../contexts/LanguageContext';

import { ReactComponent as UploadIcon } from '../assets/upload-icon.svg';
// import { ReactComponent as PhoneIcon } from '../assets/phone-icon.svg';
import { ReactComponent as LineIcon } from '../assets/line-icon.svg';
import { ReactComponent as EmailIcon } from '../assets/email-icon.svg';
import { ReactComponent as MapPinIcon } from '../assets/map-pin.svg';
import videoSrc from '../assets/map-background-video.mp4';

const ContactForm = () => {
  const { content } = useLanguage();
  const { contactInfo, form } = content.contact;
  const room2Config = content.room2;

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

  // 長按彩蛋：進度條 + 3D 會議室
  const [isPressing, setIsPressing] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [showRoom, setShowRoom] = useState(false);
  const pressTimerRef = useRef(null);

  const startLongPress = () => {
    // 僅在桌機上顯示 tooltip 的邏輯保留，長按另行處理
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
    }
    setIsPressing(true);
    setPressProgress(0);

    const duration = 1500; // 長按 1.5 秒到 100%
    const startTime = Date.now();

    pressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setPressProgress(percent);

      if (percent >= 100) {
        clearInterval(pressTimerRef.current);
        pressTimerRef.current = null;
        setIsPressing(false);
        setShowRoom(true);
      }
    }, 30);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
    setPressProgress(0);
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) {
        clearInterval(pressTimerRef.current);
      }
    };
  }, []);

  const room2Url = React.useMemo(() => {
    try {
      const people = room2Config?.people || [];
      const encoded = encodeURIComponent(JSON.stringify(people));
      const base = `/room2.html?people=${encoded}`;
      const title = room2Config?.boardTitle;
      if (title) {
        const titleEncoded = encodeURIComponent(title);
        return `${base}&title=${titleEncoded}`;
      }
      return base;
    } catch (e) {
      console.warn('Failed to encode room2 config', e);
      return '/room2.html';
    }
  }, [room2Config]);
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
        
          <h2 className="contact-title">{form.title} <span className="highlight">{form.titleHighlight}</span></h2>
          <p className="contact-subtitle">{form.subtitle}</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder={form.placeholders.name} name="name" onChange={handleChange} />
            <input type="text" placeholder={form.placeholders.street} name="street" onChange={handleChange} />
            <input type="text" placeholder={form.placeholders.city} name="city" onChange={handleChange} />
            <input type="text" placeholder={form.placeholders.postcode} name="postcode" onChange={handleChange} />
            <input type="text" placeholder={form.placeholders.phone} name="phone" onChange={handleChange} />
            <input type="email" placeholder={form.placeholders.email} name="email" onChange={handleChange} />
            <textarea placeholder={form.placeholders.message} name="message" onChange={handleChange}></textarea>
            <div className="file-upload">
                <label htmlFor="file-upload" className="file-label">
                    <UploadIcon className="upload-icon" />
                    {form.upload.label}
                </label>
                <input type="file" id="file-upload" name="file" onChange={handleChange} />
                <small>{form.upload.note}</small>
            </div>
            <button type="submit" className="submit-button">{form.submitButton}</button>
            <div className="contact-info">
                <div className="contact-item">
                <LineIcon className="contact-icon" />
                <div className="contact-item-text">
                    <strong>Line</strong>
                    <p><a href={contactInfo.line_link} target="_blank" rel="noopener noreferrer">{contactInfo.line_id}</a></p>
                </div>
                </div>
                <div className="contact-item">
                <EmailIcon className="contact-icon" />
                <div className="contact-item-text">
                    <strong>E-MAIL</strong>
                    <p>{contactInfo.email}</p>
                </div>
                </div>
            </div>
          </form>
        </div>
        
        <div className="contact-map-container">
          <div className="map">
            <div className="map-pin-wrapper">
              <MapPinIcon
                className="map-pin-icon"
                onClick={handleMapPinClick}
                onMouseOver={handleMapPinHover}
                onMouseDown={startLongPress}
                onMouseUp={cancelLongPress}
                onMouseLeave={cancelLongPress}
                onTouchStart={startLongPress}
                onTouchEnd={cancelLongPress}
                onTouchCancel={cancelLongPress}
              />
              {isPressing && (
                <div className="map-press-progress">
                  <div
                    className="map-press-progress-bar"
                    style={{ width: `${pressProgress}%` }}
                  />
                  <span className="map-press-progress-text">
                    {Math.round(pressProgress)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="map-info">
            <p>{contactInfo.company_name_en}</p>
            <h3>{contactInfo.company_name}</h3>
            <p>{contactInfo.address}</p>
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
      {showRoom && (
        <div className="room2-modal-overlay" onClick={() => setShowRoom(false)}>
          <div className="room2-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="room2-modal-close"
              onClick={() => setShowRoom(false)}
            >
              ×
            </button>
            <iframe
              title="3D Meeting Room"
              src={room2Url}
              className="room2-iframe"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;