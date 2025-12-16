# GA4 追踪实施指南

## 🚀 快速开始

### 1. 确认 GA4 已安装

检查 `public/index.html` 中是否已有 GA4 代码：

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

✅ 已确认：GA4 追踪码已安装（G-QK3V12N7GB）

---

## 📝 实施步骤

### 步骤 1：导入追踪工具

在需要追踪的组件中导入：

```javascript
import { trackEvent, trackFormSubmit, trackNavClick } from '../utils/analytics';
```

### 步骤 2：添加追踪代码

#### 示例 1：表单提交追踪

**文件**：`src/components/ContactForm.js`

```javascript
import { trackFormStart, trackFormSubmit, trackFormSubmitSuccess, trackFormSubmitError } from '../utils/analytics';

const ContactForm = () => {
  const [formData, setFormData] = useState({...});
  const [formStartTime, setFormStartTime] = useState(null);

  // 表单开始填写
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 首次输入时追踪
    if (!formStartTime && value) {
      setFormStartTime(Date.now());
      trackFormStart('contact_form', 'contact_section');
    }
    
    setFormData({ ...formData, [name]: value });
  };

  // 字段聚焦追踪
  const handleFocus = (fieldName, fieldType) => {
    trackFormFieldFocus('contact_form', fieldName, fieldType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const completionTime = formStartTime 
      ? Math.floor((Date.now() - formStartTime) / 1000) 
      : 0;
    
    // 追踪表单提交
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

#### 示例 2：导航菜单追踪

**文件**：`src/components/Header.js`

```javascript
import { trackNavClick, trackLanguageToggle } from '../utils/analytics';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { language, toggleLanguage } = useLanguage();

  const handleNavLinkClick = (targetId, index) => {
    trackNavClick(targetId, index, language);
    // ... 原有导航逻辑
  };

  const handleLanguageToggle = () => {
    const fromLang = language;
    const toLang = language === 'zh' ? 'en' : 'zh';
    trackLanguageToggle(fromLang, toLang, 'header');
    toggleLanguage();
  };
};
```

#### 示例 3：3D 会议室追踪

**文件**：`src/components/ContactForm.js`（长按进入）

```javascript
import { trackRoom2Enter } from '../utils/analytics';

const startLongPress = () => {
  const pressStartTime = Date.now();
  // ... 长按逻辑
  
  if (percent >= 100) {
    const pressDuration = Date.now() - pressStartTime;
    trackRoom2Enter('long_press_logo', pressDuration);
    setShowRoom(true);
  }
};
```

**文件**：`public/room2.html`（AI 聊天）

```javascript
// 在 <script> 标签开头添加
function loadAnalytics() {
  return new Promise((resolve) => {
    if (window.gtag) {
      resolve();
    } else {
      // 如果 gtag 未加载，等待加载
      const checkGtag = setInterval(() => {
        if (window.gtag) {
          clearInterval(checkGtag);
          resolve();
        }
      }, 100);
    }
  });
}

// 追踪函数
function trackEvent(eventName, parameters) {
  if (window.gtag) {
    window.gtag('event', eventName, parameters);
    console.log('📊 GA Event:', eventName, parameters);
  }
}

// 在 sendQuestion 函数中添加
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

// 在 loadKid1 成功后添加
async function loadKid1() {
  const loadStartTime = Date.now();
  try {
    kid1 = await createPersonFromGLB('/assets/3d-models/kid1.glb');
    // ... 加载逻辑
    
    await loadAnalytics();
    trackEvent('room2_load', {
      load_time: Date.now() - loadStartTime,
      models_loaded: 1, // 可以根据实际情况计算
      language: textContent ? 'zh' : 'en',
    });
  } catch (error) {
    console.warn('⚠️ kid1.glb 加載失敗:', error);
  }
}
```

#### 示例 4：CTA 按钮追踪

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

#### 示例 5：FAQ 展开追踪

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

#### 示例 6：滚动深度追踪

**文件**：`src/App.js` 或创建新的 Hook

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

      // 追踪滚动深度
      [25, 50, 75, 90].forEach((depth) => {
        if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
          scrollDepthTracked[depth] = true;
          const currentSection = getCurrentSection(scrollTop);
          trackScrollDepth(depth, currentSection);
        }
      });

      // 追踪 Section 进入视图
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

## ✅ 实施检查清单

### 高优先级（立即实施）

- [ ] 表单提交追踪（ContactForm.js）
  - [ ] form_start
  - [ ] form_submit
  - [ ] form_submit_success
  - [ ] form_submit_error

- [ ] 3D 会议室追踪（ContactForm.js, room2.html）
  - [ ] room2_enter
  - [ ] room2_load
  - [ ] room2_chat_question
  - [ ] room2_chat_answer
  - [ ] room2_chat_error

- [ ] CTA 按钮追踪
  - [ ] cta_click（Line 按钮）
  - [ ] external_link_click

- [ ] 导航菜单追踪（Header.js）
  - [ ] nav_click
  - [ ] language_toggle

### 中优先级（1-2 周内）

- [ ] Section 视图追踪
  - [ ] section_view
  - [ ] scroll_depth

- [ ] FAQ 展开追踪
  - [ ] faq_expand

### 低优先级（后续优化）

- [ ] 表单字段交互
  - [ ] form_field_focus

- [ ] 3D 会议室交互
  - [ ] room2_camera_interaction
  - [ ] room2_character_click
  - [ ] room2_bubble_view

---

## 🧪 测试和验证

### 1. 使用 GA4 DebugView

1. 在 GA4 中启用 DebugView
2. 在浏览器中打开网站
3. 触发事件
4. 在 GA4 DebugView 中查看实时事件

### 2. 浏览器控制台检查

在开发环境下，所有事件都会打印到控制台：
```
📊 GA Event: form_submit { form_name: 'contact_form', ... }
```

### 3. 验证清单

- [ ] 所有事件都能正确触发
- [ ] 事件参数完整且正确
- [ ] 事件名称符合 GA4 命名规范
- [ ] 没有重复追踪
- [ ] 性能影响可接受

---

## 📊 在 GA4 中查看数据

### 创建自定义报告

1. 进入 GA4 → 报告 → 探索
2. 创建新的探索报告
3. 添加以下维度：
   - 事件名称
   - 自定义参数
4. 添加以下指标：
   - 事件计数
   - 用户数
   - 转化率

### 设置关键指标警报

1. 进入 GA4 → 管理 → 自定义提醒
2. 创建提醒，例如：
   - 表单提交数下降 20%
   - 3D 会议室进入率低于 5%

---

## 🔍 常见问题

### Q: 事件没有出现在 GA4 中？
A: 
1. 检查 gtag 是否正确加载
2. 确认 GA4 ID 正确（G-QK3V12N7GB）
3. 使用 DebugView 实时查看
4. 检查浏览器控制台是否有错误

### Q: 如何避免重复追踪？
A: 
1. 使用状态标记（如 `formStartTime`）
2. 在事件触发后设置标记
3. 检查标记后再追踪

### Q: 性能影响？
A: 
1. GA4 追踪是异步的，不会阻塞页面
2. 如果担心性能，可以延迟加载 gtag
3. 使用 `requestIdleCallback` 延迟非关键事件

---

## 📚 下一步

1. **实施高优先级事件**（1-2 天）
2. **测试和验证**（1 天）
3. **收集一周数据**
4. **分析数据并优化**
5. **实施中优先级事件**
6. **持续监控和优化**

