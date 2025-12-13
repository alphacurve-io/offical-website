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