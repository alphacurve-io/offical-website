# GA4 追蹤實施指南

## 🚀 快速開始

### 1. 確認 GA4 已安裝

檢查 `public/index.html` 中是否已有 GA4 代碼：

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QK3V12N7GB"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-QK3V12N7GB');
</script>
```

✅ 已確認：GA4 追蹤碼已安裝（G-QK3V12N7GB）

---

## 📝 實施步驟

### 步驟 1：導入追蹤工具

在需要追蹤的組件中導入：

```javascript
import { trackEvent, trackFormSubmit, trackNavClick } from '../utils/analytics';
```

### 步驟 2：添加追蹤代碼

#### 示例 1：表單提交追蹤

**文件**：`src/components/ContactForm.js`

```javascript
import { trackFormStart, trackFormSubmit, trackFormSubmitSuccess, trackFormSubmitError } from '../utils/analytics';

const ContactForm = () => {
  const [formData, setFormData] = useState({...});
  const [formStartTime, setFormStartTime] = useState(null);

  // 表單開始填寫
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 首次輸入時追蹤
    if (!formStartTime && value) {
      setFormStartTime(Date.now());
      trackFormStart('contact_form', 'contact_section');
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // 字段聚焦追蹤
  const handleFocus = (fieldName, fieldType) => {
    trackFormFieldFocus('contact_form', fieldName, fieldType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const completionTime = formStartTime 
      ? Math.floor((Date.now() - formStartTime) / 1000) 
      : 0;
    
    // 追蹤表單提交
    trackFormSubmit('contact_form', formData, completionTime);
    
    const startTime = Date.now();
    try {
      const response = await fetch(apiUrl, { method: 'POST', body: data });
      if (response.ok) {
        trackFormSubmitSuccess('contact_form', Date.now() - startTime);
        alert('Message sent!');
      } else {
        trackFormSubmitError('contact_form', 'server_error', response.statusText);
        alert('Failed to send message.');
      }
    } catch (error) {
      trackFormSubmitError('contact_form', 'network_error', error.message);
      alert('An error occurred.');
    }
  };
};
```

#### 示例 2：導航菜單追蹤

**文件**：`src/components/Header.js`

```javascript
import { trackNavClick, trackLanguageToggle } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language, toggleLanguage } = useLanguage();

  const handleNavLinkClick = (targetId, index) => {
    trackNavClick(targetId, index, language);
    // ... 原有導航邏輯
  };

  const handleLanguageToggle = () => {
    const fromLang = language;
    const toLang = language === 'zh' ? 'en' : 'zh';
    trackLanguageToggle(fromLang, toLang, 'header');
    toggleLanguage();
  };
};
```

#### 示例 3：3D 會議室追蹤

**文件**：`src/components/ContactForm.js`（長按進入）

```javascript
import { trackRoom2Enter } from '../utils/analytics';

const startLongPress = () => {
  const pressStartTime = Date.now();
  // ... 長按邏輯
  
  if (percent >= 100) {
    const pressDuration = Date.now() - pressStartTime;
    trackRoom2Enter('long_press_logo', pressDuration);
    setShowRoom(true);
  }
};
```

**文件**：`public/room2.html`（AI 聊天）

```javascript
// 在 <script> 標簽開頭添加
function loadAnalytics() {
  return new Promise((resolve) => {
    if (window.gtag) {
      resolve();
    } else {
      // 如果 gtag 未加載，等待加載
      const checkGtag = setInterval(() => {
        if (window.gtag) {
          clearInterval(checkGtag);
          resolve();
        }
      }, 100);
    }
  });
}

// 追蹤函數
function trackEvent(eventName, parameters) {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('📊 GA Event:', eventName, parameters);
  }
}

// 在 sendQuestion 函數中添加
async function sendQuestion(question) {
  await loadAnalytics();
  
  trackEvent('room2_chat_question', {
    question_length: question.length,
    question_language: question.match(/[\u4e00-\u9fa5]/) ? 'zh' : 'en',
    has_question_mark: question.includes('?'),
  });
  
  const startTime = Date.now();
  try {
    const response = await fetch(apiUrl, {...});
    const data = await response.json();
    
    trackEvent('room2_chat_answer', {
      answer_length: data.answer.length,
      response_time: Date.now() - startTime,
      answer_language: data.answer.match(/[\u4e00-\u9fa5]/) ? 'zh' : 'en',
    });
    
    showAnswerBubble(people[0], data.answer);
  } catch (error) {
    trackEvent('room2_chat_error', {
      error_type: 'network_error',
      error_message: error.message,
    });
  }
}

// 在 loadKid1 成功後添加
async function loadKid1() {
  const loadStartTime = Date.now();
  try {
    kid1 = await createPersonFromGLB('/assets/3d-models/kid1.glb');
    // ... 加載邏輯
    
    await loadAnalytics();
    trackEvent('room2_load', {
      load_time: Date.now() - loadStartTime,
      models_loaded: 1, // 可以根據實際情況計算
      language: textContent ? 'zh' : 'en',
    });
  } catch (error) {
    console.warn('⚠️ kid1.glb 加載失敗:', error);
  }
}
```

#### 示例 4：CTA 按鈕追蹤

**文件**：`src/components/ServiceModelCTA.js`（如果存在）

```javascript
import { trackCTAClick } from '../utils/analytics';

const ServiceModelCTA = ({ cta }) => {
  const handleCTAClick = () => {
    trackCTAClick('line', cta.buttonText, 'service_model_cta', cta.link);
    window.open(cta.link, '_blank');
  };

  return (
    <button onClick={handleCTAClick}>
      {cta.buttonText}
    </button>
  );
};
```

#### 示例 5：FAQ 展開追蹤

**文件**：`src/components/FAQ.js`（如果存在）

```javascript
import { trackFAQExpand } from '../utils/analytics';

const FAQ = ({ faq }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    if (expandedIndex !== index) {
      trackFAQExpand(index, faq.questions[index].question, 'service_model');
      setExpandedIndex(index);
    } else {
      setExpandedIndex(null);
    }
  };
};
```

#### 示例 6：滾動深度追蹤

**文件**：`src/App.js` 或創建新的 Hook

```javascript
// src/hooks/useScrollTracking.js
import { useEffect } from 'react';
import { trackScrollDepth, trackSectionView } from '../utils/analytics';

export const useScrollTracking = () => {
  useEffect(() => {
    let scrollDepthTracked = {
      25: false,
      50: false,
      75: false,
      90: false,
    };
    
    let sectionViewTracked = {
      hero: false,
      services: false,
      team: false,
      service_model: false,
      contact: false,
    };

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

      // 追蹤滾動深度
      [25, 50, 75, 90].forEach((depth) => {
        if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
          scrollDepthTracked[depth] = true;
          const currentSection = getCurrentSection(scrollTop);
          trackScrollDepth(depth, currentSection);
        }
      });

      // 追蹤 Section 進入視圖
      const sections = ['hero', 'services', 'team', 'service_model', 'contact'];
      sections.forEach((sectionName) => {
        const section = document.getElementById(sectionName);
        if (section && !sectionViewTracked[sectionName]) {
          const rect = section.getBoundingClientRect();
          if (rect.top < windowHeight * 0.5 && rect.bottom > 0) {
            sectionViewTracked[sectionName] = true;
            const sectionIndex = sections.indexOf(sectionName);
            const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);
            trackSectionView(sectionName, sectionIndex, timeOnPage);
          }
        }
      });
    };

    const pageLoadTime = Date.now();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};

function getCurrentSection(scrollTop) {
  const sections = [
    { id: 'hero', offset: 0 },
    { id: 'services', offset: 800 },
    { id: 'team', offset: 1600 },
    { id: 'service_model', offset: 2400 },
    { id: 'contact', offset: 3200 },
  ];
  
  for (let i = sections.length - 1; i >= 0; i--) {
    if (scrollTop >= sections[i].offset) {
      return sections[i].id;
    }
  }
  return 'hero';
}
```

---

## ✅ 實施檢查清單

### 高優先級（立即實施）

- [ ] 表單提交追蹤（ContactForm.js）
  - [ ] form_start
  - [ ] form_submit
  - [ ] form_submit_success
  - [ ] form_submit_error

- [ ] 3D 會議室追蹤（ContactForm.js, room2.html）
  - [ ] room2_enter
  - [ ] room2_load
  - [ ] room2_chat_question
  - [ ] room2_chat_answer
  - [ ] room2_chat_error

- [ ] CTA 按鈕追蹤
  - [ ] cta_click（Line 按鈕）
  - [ ] external_link_click

- [ ] 導航菜單追蹤（Header.js）
  - [ ] nav_click
  - [ ] language_toggle

### 中優先級（1-2 周內）

- [ ] Section 視圖追蹤
  - [ ] section_view
  - [ ] scroll_depth

- [ ] FAQ 展開追蹤
  - [ ] faq_expand

### 低優先級（後續優化）

- [ ] 表單字段交互
  - [ ] form_field_focus

- [ ] 3D 會議室交互
  - [ ] room2_camera_interaction
  - [ ] room2_character_click
  - [ ] room2_bubble_view

---

## 🧪 測試和驗證

### 1. 使用 GA4 DebugView

1. 在 GA4 中啟用 DebugView
2. 在瀏覽器中打開網站
3. 觸發事件
4. 在 GA4 DebugView 中查看實時事件

### 2. 瀏覽器控制台檢查

在開發環境下，所有事件都會打印到控制台：
```
📊 GA Event: form_submit { form_name: 'contact_form', ... }
```

### 3. 驗證清單

- [ ] 所有事件都能正確觸發
- [ ] 事件參數完整且正確
- [ ] 事件名稱符合 GA4 命名規範
- [ ] 沒有重覆追蹤
- [ ] 性能影響可接受

---

## 📊 在 GA4 中查看數據

### 創建自定義報告

1. 進入 GA4 → 報告 → 探索
2. 創建新的探索報告
3. 添加以下維度：
   - 事件名稱
   - 自定義參數
4. 添加以下指標：
   - 事件計數
   - 用戶數
   - 轉化率

### 設置關鍵指標警報

1. 進入 GA4 → 管理 → 自定義提醒
2. 創建提醒，例如：
   - 表單提交數下降 20%
   - 3D 會議室進入率低於 5%

---

## 🔍 常見問題

### Q: 事件沒有出現在 GA4 中？
A: 
1. 檢查 gtag 是否正確加載
2. 確認 GA4 ID 正確（G-QK3V12N7GB）
3. 使用 DebugView 實時查看
4. 檢查瀏覽器控制台是否有錯誤

### Q: 如何避免重覆追蹤？
A: 
1. 使用狀態標記（如 `formStartTime`）
2. 在事件觸發後設置標記
3. 檢查標記後再追蹤

### Q: 性能影響？
A: 
1. GA4 追蹤是異步的，不會阻塞頁面
2. 如果擔心性能，可以延遲加載 gtag
3. 使用 `requestIdleCallback` 延遲非關鍵事件

---

## 📚 下一步

1. **實施高優先級事件**（1-2 天）
2. **測試和驗證**（1 天）
3. **收集一周數據**
4. **分析數據並優化**
5. **實施中優先級事件**
6. **持續監控和優化**

