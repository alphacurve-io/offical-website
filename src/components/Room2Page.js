import React, { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Room2Page = () => {
  const { content } = useLanguage();
  const room2Config = content.room2;

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

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.margin = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        key={room2Url}
        title="3D Meeting Room"
        src={room2Url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default Room2Page;
