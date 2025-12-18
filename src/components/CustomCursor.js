import React, { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';
import headerIcon from '../assets/header-icon.svg';
import headerIconWhite from '../assets/header-icon-white.svg';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const cursorRef = useRef(null);

  useEffect(() => {
    // 檢測是否為移動設備
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return;
    }

    // 隱藏默認游標
    document.body.style.cursor = 'none';

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      // 一旦偵測到滑鼠移動，就確保自訂游標顯示出來
      setOpacity(1);
      
      // 檢查是否在可點擊元素上
      const target = e.target;
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isClickable);
    };

    const handleMouseEnter = () => {
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 每 5 秒檢查一次自訂游標是否「實際可見」，若偵測到異常則嘗試修復或還原系統游標
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      return;
    }

    let checkCount = 0;

    const checkCursorVisible = () => {
      const cursorEl = cursorRef.current;

      // 若組件已卸載或節點不存在，就終止輪詢
      if (!cursorEl) {
        window.clearInterval(intervalId);
        return;
      }

      const style = window.getComputedStyle(cursorEl);
      const opacityValue = parseFloat(style.opacity || '0');
      const isVisible =
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        opacityValue > 0.01;

      if (isVisible) {
        // 一旦確認自訂游標已經穩定顯示，就可以停止繼續檢查
        window.clearInterval(intervalId);
        return;
      }

      checkCount += 1;

      console.warn('⚠️ 自訂游標檢查：偵測到游標不可見，將嘗試強制顯示自訂游標', {
        checkCount,
        opacity: opacityValue,
      });

      // 優先嘗試強制顯示自訂游標本身
      setOpacity(1);

      // 如果多次檢查仍然不可見，退回系統預設游標避免完全沒有游標
      if (checkCount >= 3) {
        console.warn('⚠️ 自訂游標多次檢查仍不可見，將還原系統游標');
        document.body.style.cursor = '';
        window.clearInterval(intervalId);
      }
    };

    const intervalId = window.setInterval(checkCursorVisible, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  // 如果是移動設備，不渲染游標
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
      }}
    >
      <div className="cursor-icon-container">
        <img
          src={headerIcon}
          alt="cursor icon"
          className="cursor-icon cursor-icon-default"
        />
        <img
          src={headerIconWhite}
          alt="cursor icon white"
          className="cursor-icon cursor-icon-white"
        />
      </div>
      
      {isHovering && (
        <svg
          className="cursor-animation-circle"
          width="80"
          height="80"
          viewBox="0 0 80 80"
        >
          <circle
            className="cursor-circle-outer"
            cx="40"
            cy="40"
            r="30"
            strokeWidth="4"
            stroke="#00bcd4"
            strokeLinecap="round"
            fill="none"
          />
          <circle
            className="cursor-circle-inner"
            cx="40"
            cy="40"
            r="30"
            strokeWidth="2"
            stroke="#008ba3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
};

export default CustomCursor;