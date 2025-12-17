import React, { useState, useRef, useEffect, useCallback } from 'react';

import './ContactForm.css';
import { useLanguage } from '../contexts/LanguageContext';
import {
  trackFormStart,
  trackFormFieldFocus,
  trackFormSubmit,
  trackFormSubmitSuccess,
  trackFormSubmitError,
  trackRoom2Enter,
  trackExternalLinkClick,
} from '../utils/analytics';

import { ReactComponent as UploadIcon } from '../assets/upload-icon.svg';
// import { ReactComponent as PhoneIcon } from '../assets/phone-icon.svg';
import { ReactComponent as LineIcon } from '../assets/line-icon.svg';
import { ReactComponent as EmailIcon } from '../assets/email-icon.svg';
import { ReactComponent as MapPinIcon } from '../assets/map-pin.svg';
import videoSrc from '../assets/map-background-video.mp4';

const ContactForm = () => {
  const { content } = useLanguage();
  const { contactInfo, form, landscapePrompt } = content.contact;
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
  const [formStartTime, setFormStartTime] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (!formStartTime && (value || (files && files.length))) {
      setFormStartTime(Date.now());
      trackFormStart('contact_form', 'contact_section');
    }

    if (name === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFieldFocus = (fieldName, fieldType) => {
    trackFormFieldFocus('contact_form', fieldName, fieldType);
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
      const completionTime = formStartTime ? Math.floor((Date.now() - formStartTime) / 1000) : 0;
      trackFormSubmit('contact_form', formData, completionTime);

      const submitStart = Date.now();
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        trackFormSubmitSuccess('contact_form', Date.now() - submitStart);
        alert('Message sent!');
      } else {
        trackFormSubmitError('contact_form', 'server_error', response.statusText);
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      trackFormSubmitError('contact_form', 'network_error', error.message);
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
  const [showLandscapePrompt, setShowLandscapePrompt] = useState(false);
  const pressTimerRef = useRef(null);
  
  // 檢測是否為移動設備
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                  (window.innerWidth <= 768);
  
  // 檢測是否為橫屏（針對 iPad 優化，使用多種方法綜合判斷）
  const checkIsLandscape = useCallback(() => {
    // 收集所有可用的檢測結果
    const results = [];
    
    // 方法1: 使用 visualViewport API（最準確，特別是在 iPad Safari 上）
    if (window.visualViewport) {
      const vw = window.visualViewport;
      if (vw.width && vw.height) {
        const ratio = vw.width / vw.height;
        if (ratio > 1.05) results.push(true);
        else if (ratio < 0.95) results.push(false);
      }
    }
    
    // 方法2: 使用 window.screen.orientation API
    if (window.screen && window.screen.orientation) {
      const angle = window.screen.orientation.angle;
      // 標準化角度到 0-360 範圍
      const normalizedAngle = ((angle % 360) + 360) % 360;
      if (normalizedAngle === 90 || normalizedAngle === 270) {
        results.push(true);
      } else if (normalizedAngle === 0 || normalizedAngle === 180) {
        results.push(false);
      }
    }
    
    // 方法3: 使用 matchMedia
    if (window.matchMedia) {
      const landscapeQuery = window.matchMedia('(orientation: landscape)');
      const portraitQuery = window.matchMedia('(orientation: portrait)');
      if (landscapeQuery.matches) {
        results.push(true);
      } else if (portraitQuery.matches) {
        results.push(false);
      }
    }
    
    // 方法4: 使用 window.innerWidth/Height（會隨方向變化）
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width && height && width !== height) {
      const ratio = width / height;
      // 使用更寬鬆的閾值，避免 iPad 上的邊界情況
      if (ratio > 1.05) {
        results.push(true);
      } else if (ratio < 0.95) {
        results.push(false);
      }
    }
    
    // 方法5: 使用 document.documentElement.clientWidth/Height
    const docWidth = document.documentElement.clientWidth;
    const docHeight = document.documentElement.clientHeight;
    if (docWidth && docHeight && docWidth !== docHeight) {
      const ratio = docWidth / docHeight;
      if (ratio > 1.05) {
        results.push(true);
      } else if (ratio < 0.95) {
        results.push(false);
      }
    }
    
    // 統計結果：如果大部分方法都認為是橫屏，則返回 true
    const trueCount = results.filter(r => r === true).length;
    const falseCount = results.filter(r => r === false).length;
    
    // 如果有明確的結果，使用多數決
    if (trueCount > falseCount) return true;
    if (falseCount > trueCount) return false;
    
    // 如果結果相等或沒有結果，使用最可靠的方法作為最終判斷
    // 優先使用 visualViewport，然後是 innerWidth/Height
    if (window.visualViewport) {
      const vw = window.visualViewport;
      if (vw.width && vw.height) {
        return vw.width > vw.height;
      }
    }
    
    if (width && height) {
      return width > height;
    }
    
    // 默认返回 false（保守策略）
    return false;
  }, []);

  // 关闭 header menu 的辅助函数
  const closeHeaderMenu = useCallback(() => {
    const headerNav = document.querySelector('.header-nav');
    
    // 移除 open class
    if (headerNav) {
      headerNav.classList.remove('open');
      // 强制隐藏 menu（使用 !important 级别的样式）
      headerNav.style.display = 'none';
    }
    
    // 注意：这里不能直接修改 Header 组件的状态，但可以通过移除 class 来关闭 menu
  }, []);

  const startLongPress = (e) => {
    // 阻止默认行为（防止触发右键菜单）
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // 僅在桌機上顯示 tooltip 的邏輯保留，長按另行處理
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
    }
    setIsPressing(true);
    setPressProgress(0);

    // 手機版使用更短的長按時間（0.8秒），避免觸發系統菜單（通常約1秒）
    // 桌面版保持較長的時間（1.5秒）以提供更好的用戶體驗
    const duration = isMobile ? 300 : 1000;
    const startTime = Date.now();

    pressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setPressProgress(percent);

      if (percent >= 100) {
        clearInterval(pressTimerRef.current);
        pressTimerRef.current = null;
        setIsPressing(false);
        trackRoom2Enter('long_press_logo', elapsed);
        
        // 先关闭 header menu（避免横屏时冲突）
        closeHeaderMenu();
        
        // 在移動設備上，檢查是否為橫屏
        if (isMobile && !checkIsLandscape()) {
          // 顯示橫屏提示，不打開 room2
          setShowLandscapePrompt(true);
        } else {
          // 橫屏或非移動設備，直接打開 room2
          // 手機版：立即顯示，不等待 iframe 加載完成
          setShowRoom(true);
        }
      }
    }, isMobile ? 20 : 30); // 手機版更頻繁更新進度條（每 20ms），讓進度更流暢
  };

  const cancelLongPress = (e) => {
    // 阻止默认行为
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (pressTimerRef.current) {
      clearInterval(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    setIsPressing(false);
    setPressProgress(0);
  };
  
  // 阻止右键菜单和图片相关的上下文菜单
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  
  // 阻止拖拽（拖拽图片也可能触发上下文菜单）
  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  useEffect(() => {
    // 清理函数：清除长按计时器
    return () => {
      if (pressTimerRef.current) {
        clearInterval(pressTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // 監聽屏幕方向變化（在父窗口中）
    // 使用 ref 来避免依赖 showLandscapePrompt，防止不必要的重新绑定
    const handleOrientationChange = () => {
      if (isMobile) {
        // 在 iPad 上，方向變化後需要更長時間才能正確檢測
        // 使用多次檢查確保準確性
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = 100; // 每 100ms 檢查一次
        
        const performCheck = () => {
          checkCount++;
          const isLandscape = checkIsLandscape();
          
          // 使用函数式更新来获取最新的状态
          setShowLandscapePrompt(prev => {
            // 如果提示正在顯示且已轉為橫屏，關閉提示並打開 room2
            if (prev && isLandscape) {
              // 先关闭 header menu（避免横屏时冲突）
              closeHeaderMenu();
              setShowRoom(true);
              return false;
            }
            return prev;
          });
          
          // 如果還沒達到最大檢查次數，繼續檢查
          if (checkCount < maxChecks) {
            setTimeout(performCheck, checkInterval);
          }
        };
        
        // 第一次檢查延遲更長，讓系統有時間更新
        setTimeout(performCheck, 300);
      }
    };
    
    // 監聽多種方向變化事件
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
    }
    window.addEventListener('orientationchange', handleOrientationChange);
    // 移除 resize 监听，避免频繁触发（orientationchange 已经足够）
    // window.addEventListener('resize', handleOrientationChange);
    
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(orientation: landscape)');
      mediaQuery.addEventListener('change', handleOrientationChange);
    }
    
    return () => {
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
      // window.removeEventListener('resize', handleOrientationChange);
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(orientation: landscape)');
        mediaQuery.removeEventListener('change', handleOrientationChange);
      }
    };
  }, [isMobile, checkIsLandscape, closeHeaderMenu]); // 添加 closeHeaderMenu 到依赖数组

  // 当 room2 打开时隐藏 header（包括展开的菜单）
  useEffect(() => {
    const header = document.querySelector('.header');
    const headerNav = document.querySelector('.header-nav');
    const body = document.body;
    
    if (showRoom) {
      // 先关闭 menu
      closeHeaderMenu();
      
      // 在 body 上添加 class，用于 CSS 强制隐藏
      body.classList.add('room2-open');
      
      // 隐藏 header
      if (header) {
        header.style.display = 'none';
        header.style.visibility = 'hidden';
      }
      // 强制隐藏移动端菜单
      if (headerNav) {
        headerNav.classList.remove('open');
        headerNav.style.display = 'none';
        headerNav.style.visibility = 'hidden';
      }
    } else {
      // 移除 body class
      body.classList.remove('room2-open');
      
      // 恢复 header
      if (header) {
        header.style.display = '';
        header.style.visibility = '';
      }
      // 恢复 menu（但不自动打开）
      if (headerNav) {
        headerNav.style.display = '';
        headerNav.style.visibility = '';
      }
    }

    // 清理函数：确保在组件卸载时恢复 header
    return () => {
      body.classList.remove('room2-open');
      if (header) {
        header.style.display = '';
        header.style.visibility = '';
      }
      if (headerNav) {
        headerNav.style.display = '';
        headerNav.style.visibility = '';
      }
    };
  }, [showRoom, closeHeaderMenu]); // 添加 closeHeaderMenu 到依赖数组

  const room2Url = React.useMemo(() => {
    try {
      const people = room2Config?.people || [];
      const encoded = encodeURIComponent(JSON.stringify(people));
      let base = `/room2.html?people=${encoded}`;
      
      const title = room2Config?.boardTitle;
      if (title) {
        const titleEncoded = encodeURIComponent(title);
        base = `${base}&title=${titleEncoded}`;
      }
      
      // 添加文本内容
      const textContent = {
        chatPrompt: room2Config?.chatPrompt || '你有什麼問題想問嗎？',
        inputPlaceholder: room2Config?.inputPlaceholder || '輸入你的問題...',
        sendButton: room2Config?.sendButton || '發送',
        loadingText: room2Config?.loadingText || '思考中...',
        errorText: room2Config?.errorText || '抱歉，發生錯誤，請稍後再試。',
      };
      const textContentEncoded = encodeURIComponent(JSON.stringify(textContent));
      base = `${base}&textContent=${textContentEncoded}`;
      
      // 添加音頻配置
      const audioConfig = room2Config?.audioConfig || {};
      if (audioConfig.mp3) {
        const audioConfigEncoded = encodeURIComponent(JSON.stringify(audioConfig));
        base = `${base}&audioConfig=${audioConfigEncoded}`;
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
            <input type="text" placeholder={form.placeholders.name} name="name" onChange={handleChange} onFocus={() => handleFieldFocus('name', 'text')} />
            <input type="text" placeholder={form.placeholders.street} name="street" onChange={handleChange} onFocus={() => handleFieldFocus('street', 'text')} />
            <input type="text" placeholder={form.placeholders.city} name="city" onChange={handleChange} onFocus={() => handleFieldFocus('city', 'text')} />
            <input type="text" placeholder={form.placeholders.postcode} name="postcode" onChange={handleChange} onFocus={() => handleFieldFocus('postcode', 'text')} />
            <input type="text" placeholder={form.placeholders.phone} name="phone" onChange={handleChange} onFocus={() => handleFieldFocus('phone', 'text')} />
            <input type="email" placeholder={form.placeholders.email} name="email" onChange={handleChange} onFocus={() => handleFieldFocus('email', 'email')} />
            <textarea placeholder={form.placeholders.message} name="message" onChange={handleChange} onFocus={() => handleFieldFocus('message', 'textarea')}></textarea>
            <div className="file-upload">
                <label htmlFor="file-upload" className="file-label">
                    <UploadIcon className="upload-icon" />
                    {form.upload.label}
                </label>
                <input type="file" id="file-upload" name="file" onChange={handleChange} onFocus={() => handleFieldFocus('file', 'file')} />
                <small>{form.upload.note}</small>
            </div>
            <button type="submit" className="submit-button">{form.submitButton}</button>
            <div className="contact-info">
                <div className="contact-item">
                <LineIcon className="contact-icon" />
                <div className="contact-item-text">
                    <strong>Line</strong>
                    <p><a href={contactInfo.line_link} target="_blank" rel="noopener noreferrer" onClick={() => trackExternalLinkClick(contactInfo.line_link, 'line_link', 'contact_line')}>{contactInfo.line_id}</a></p>
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
            <div 
              className="map-pin-wrapper" 
              id="map-pin"
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
            >
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
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                draggable="false"
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
          aria-label="Map section background video"
        >
        <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
      <script src="./MapSectionVideo.js"></script>
      {/* video section end */}
      {/* 橫屏提示（在打開 room2 之前顯示） */}
      {showLandscapePrompt && (
        <div className="landscape-prompt-overlay" onClick={() => setShowLandscapePrompt(false)}>
          <div className="landscape-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="landscape-prompt-close"
              onClick={() => setShowLandscapePrompt(false)}
            >
              ×
            </button>
            <div className="landscape-prompt-content">
              <div className="landscape-prompt-icon">📱</div>
              <h2>{landscapePrompt.title}</h2>
              <p>{landscapePrompt.description}</p>
              <button
                type="button"
                className="landscape-prompt-button"
                onClick={() => {
                  setShowLandscapePrompt(false);
                  // 先关闭 header menu（避免横屏时冲突）
                  closeHeaderMenu();
                  // 再次檢查，如果已經橫屏則打開 room2
                  if (checkIsLandscape()) {
                    setShowRoom(true);
                  }
                }}
              >
                {landscapePrompt.button}
              </button>
            </div>
          </div>
        </div>
      )}
      
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
              key={room2Url} // 使用 key 确保只有在 URL 改变时才重新加载 iframe
              title="3D Meeting Room"
              src={room2Url}
              className="room2-iframe"
              loading="eager"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactForm;