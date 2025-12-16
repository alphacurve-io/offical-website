/**
 * Google Analytics 4 事件追踪工具
 * 
 * 使用方式：
 * import { trackEvent } from '../utils/analytics';
 * trackEvent('event_name', { param1: 'value1' });
 */

/**
 * 追踪自定义事件
 * @param {string} eventName - 事件名称
 * @param {object} parameters - 事件参数
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window === 'undefined') return;
  
  // 添加通用参数
  const eventData = {
    ...parameters,
    timestamp: Date.now(),
    page_path: window.location.pathname,
    page_title: document.title,
  };
  
  // 如果 gtag 已加载，立即发送事件
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  } else {
    // 如果 gtag 未加载，将事件推入 dataLayer 队列
    // GA4 加载后会自动处理队列中的事件
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventData
      });
    }
  }
  
  // 开发环境下打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 GA Event:', eventName, eventData);
  }
};

/**
 * 追踪页面浏览（如果需要自定义）
 * @param {string} pagePath - 页面路径
 * @param {string} pageTitle - 页面标题
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (typeof window === 'undefined') return;
  
  // 如果 gtag 已加载，立即发送
  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('config', 'G-QK3V12N7GB', {
      page_path: pagePath,
      page_title: pageTitle,
    });
  }
  // 注意：如果 gtag 未加载，GA4 会在加载时自动追踪初始页面浏览
};

/**
 * 追踪表单开始填写
 * @param {string} formName - 表单名称
 * @param {string} formLocation - 表单位置
 */
export const trackFormStart = (formName, formLocation) => {
  trackEvent('form_start', {
    form_name: formName,
    form_location: formLocation,
  });
};

/**
 * 追踪表单字段聚焦
 * @param {string} formName - 表单名称
 * @param {string} fieldName - 字段名称
 * @param {string} fieldType - 字段类型
 */
export const trackFormFieldFocus = (formName, fieldName, fieldType) => {
  trackEvent('form_field_focus', {
    form_name: formName,
    field_name: fieldName,
    field_type: fieldType,
  });
};

/**
 * 追踪表单提交
 * @param {string} formName - 表单名称
 * @param {object} formData - 表单数据
 * @param {number} completionTime - 填写耗时（秒）
 */
export const trackFormSubmit = (formName, formData, completionTime) => {
  const fieldsFilled = Object.values(formData).filter(v => v !== null && v !== '' && v !== undefined).length;
  const hasFile = !!formData.file;
  
  trackEvent('form_submit', {
    form_name: formName,
    form_completion_time: completionTime,
    fields_filled: fieldsFilled,
    has_file: hasFile,
  });
};

/**
 * 追踪表单提交成功
 * @param {string} formName - 表单名称
 * @param {number} responseTime - API 响应时间（毫秒）
 */
export const trackFormSubmitSuccess = (formName, responseTime) => {
  trackEvent('form_submit_success', {
    form_name: formName,
    response_time: responseTime,
  });
};

/**
 * 追踪表单提交错误
 * @param {string} formName - 表单名称
 * @param {string} errorType - 错误类型
 * @param {string} errorMessage - 错误信息
 */
export const trackFormSubmitError = (formName, errorType, errorMessage) => {
  trackEvent('form_submit_error', {
    form_name: formName,
    error_type: errorType,
    error_message: errorMessage,
  });
};

/**
 * 追踪导航菜单点击
 * @param {string} navItem - 导航项 ID
 * @param {number} navPosition - 导航项位置
 * @param {string} language - 当前语言
 */
export const trackNavClick = (navItem, navPosition, language) => {
  trackEvent('nav_click', {
    nav_item: navItem,
    nav_position: navPosition,
    language: language,
  });
};

/**
 * 追踪语言切换
 * @param {string} fromLanguage - 原语言
 * @param {string} toLanguage - 目标语言
 * @param {string} toggleLocation - 切换位置
 */
export const trackLanguageToggle = (fromLanguage, toLanguage, toggleLocation = 'header') => {
  trackEvent('language_toggle', {
    from_language: fromLanguage,
    to_language: toLanguage,
    toggle_location: toggleLocation,
  });
};

/**
 * 追踪 CTA 按钮点击
 * @param {string} ctaType - CTA 类型（line, contact, service）
 * @param {string} ctaText - 按钮文本
 * @param {string} ctaLocation - 按钮位置
 * @param {string} destination - 目标 URL
 */
export const trackCTAClick = (ctaType, ctaText, ctaLocation, destination) => {
  trackEvent('cta_click', {
    cta_type: ctaType,
    cta_text: ctaText,
    cta_location: ctaLocation,
    destination: destination,
  });
};

/**
 * 追踪外部链接点击
 * @param {string} linkUrl - 链接 URL
 * @param {string} linkText - 链接文本
 * @param {string} linkLocation - 链接位置
 */
export const trackExternalLinkClick = (linkUrl, linkText, linkLocation) => {
  trackEvent('external_link_click', {
    link_url: linkUrl,
    link_text: linkText,
    link_location: linkLocation,
  });
};

/**
 * 追踪 3D 会议室进入
 * @param {string} entryMethod - 进入方式
 * @param {number} pressDuration - 长按时长（毫秒）
 */
export const trackRoom2Enter = (entryMethod, pressDuration) => {
  trackEvent('room2_enter', {
    entry_method: entryMethod,
    press_duration: pressDuration,
  });
};

/**
 * 追踪 3D 会议室加载
 * @param {number} loadTime - 加载时间（毫秒）
 * @param {number} modelsLoaded - 加载的模型数量
 * @param {string} language - 当前语言
 */
export const trackRoom2Load = (loadTime, modelsLoaded, language) => {
  trackEvent('room2_load', {
    load_time: loadTime,
    models_loaded: modelsLoaded,
    language: language,
  });
};

/**
 * 追踪 AI 聊天问题提交
 * @param {string} question - 问题文本
 */
export const trackRoom2ChatQuestion = (question) => {
  const questionLanguage = detectLanguage(question);
  
  trackEvent('room2_chat_question', {
    question_length: question.length,
    question_language: questionLanguage,
    has_question_mark: question.includes('?'),
  });
};

/**
 * 追踪 AI 聊天回答显示
 * @param {string} answer - 回答文本
 * @param {number} responseTime - API 响应时间（毫秒）
 */
export const trackRoom2ChatAnswer = (answer, responseTime) => {
  const answerLanguage = detectLanguage(answer);
  
  trackEvent('room2_chat_answer', {
    answer_length: answer.length,
    response_time: responseTime,
    answer_language: answerLanguage,
  });
};

/**
 * 追踪 AI 聊天错误
 * @param {string} errorType - 错误类型
 * @param {string} errorMessage - 错误信息
 */
export const trackRoom2ChatError = (errorType, errorMessage) => {
  trackEvent('room2_chat_error', {
    error_type: errorType,
    error_message: errorMessage,
  });
};

/**
 * 追踪 FAQ 展开
 * @param {number} faqIndex - FAQ 索引
 * @param {string} faqQuestion - 问题文本
 * @param {string} section - 所在区块
 */
export const trackFAQExpand = (faqIndex, faqQuestion, section = 'service_model') => {
  trackEvent('faq_expand', {
    faq_index: faqIndex,
    faq_question: faqQuestion.substring(0, 50), // 限制长度
    section: section,
  });
};

/**
 * 追踪 Section 进入视图
 * @param {string} sectionName - Section 名称
 * @param {number} sectionIndex - Section 索引
 * @param {number} timeOnPage - 到达该 section 的时间（秒）
 */
export const trackSectionView = (sectionName, sectionIndex, timeOnPage) => {
  trackEvent('section_view', {
    section_name: sectionName,
    section_index: sectionIndex,
    time_on_page: timeOnPage,
  });
};

/**
 * 追踪滚动深度
 * @param {number} scrollDepth - 滚动百分比（25, 50, 75, 90）
 * @param {string} section - 当前可见的主要区块
 */
export const trackScrollDepth = (scrollDepth, section) => {
  trackEvent('scroll_depth', {
    scroll_depth: scrollDepth,
    section: section,
  });
};

/**
 * 简单的语言检测函数
 * @param {string} text - 文本
 * @returns {string} 语言代码（zh/en）
 */
function detectLanguage(text) {
  // 简单的检测：如果包含中文字符，返回 'zh'，否则返回 'en'
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text) ? 'zh' : 'en';
}

