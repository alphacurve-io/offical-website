/**
 * SEO Head 組件
 * 使用 React Helmet 動態設置 SEO meta 標籤
 * 
 * 使用方式：
 * import SEOHead from './components/SEOHead';
 * <SEOHead language="zh" />
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ language = 'zh' }) => {
  const isZh = language === 'zh';
  
  // SEO 內容配置
  const seoContent = {
    zh: {
      title: 'Alphacurve.io | AI 技術顧問與軟體開發服務',
      description: 'Alphacurve 提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型與業務成長。專業團隊，客製化解決方案。',
      keywords: 'AI 整合, 軟體開發, 技術顧問, 數位轉型, 系統開發, 自動化, 雲端解決方案, 企業系統, AI 顧問',
      ogTitle: 'Alphacurve.io | AI 技術顧問與軟體開發服務',
      ogDescription: '提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型。',
      twitterTitle: 'Alphacurve.io | AI 技術顧問與軟體開發',
      twitterDescription: '提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型。',
    },
    en: {
      title: 'Alphacurve.io | AI Tech Consulting & Software Development',
      description: 'Alphacurve provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks and achieve digital transformation. Expert team, customized solutions.',
      keywords: 'AI integration, software development, tech consulting, digital transformation, system development, automation, cloud solutions, enterprise systems, AI consulting',
      ogTitle: 'Alphacurve.io | AI Tech Consulting & Software Development',
      ogDescription: 'Provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks and achieve digital transformation.',
      twitterTitle: 'Alphacurve.io | AI Tech Consulting & Software Development',
      twitterDescription: 'Provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks.',
    },
  };

  const content = seoContent[language] || seoContent.zh;
  const baseUrl = 'https://alphacurve.io';
  const ogImage = `${baseUrl}/facebook-image.jpg`;
  const twitterImage = `${baseUrl}/twitter-image.png`;

  // 結構化數據 - Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Alphacurve',
    url: baseUrl,
    logo: `${baseUrl}/header-icon.svg`,
    description: isZh 
      ? 'AI 技術顧問與軟體開發服務'
      : 'AI Tech Consulting & Software Development Services',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['zh', 'en'],
    },
    sameAs: [
      'https://page.line.me/alphacurve',
    ],
  };

  // 結構化數據 - WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alphacurve.io',
    url: baseUrl,
    inLanguage: [isZh ? 'zh-TW' : 'en-US'],
  };

  return (
    <Helmet>
      {/* HTML lang 屬性 */}
      <html lang={isZh ? 'zh-TW' : 'en-US'} />
      
      {/* 基本 Meta 標籤 */}
      <title>{content.title}</title>
      <meta name="description" content={content.description} />
      <meta name="keywords" content={content.keywords} />
      <meta name="author" content="Alphacurve.io" />
      
      {/* Google AI Training Control */}
      {/* 允許用於搜索索引，但不允許用於 AI 訓練 */}
      <meta name="robots" content="index, follow, noai, noimageai" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={baseUrl} />
      
      {/* Resource hints for performance optimization */}
      {/* Preconnect to own domain for faster resource loading */}
      <link rel="preconnect" href={baseUrl} crossOrigin="anonymous" />
      <link rel="dns-prefetch" href={baseUrl} />
      
      {/* Preconnect to external domains (limit to 4 as recommended) */}
      <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://static.cloudflareinsights.com" />
      
      {/* Note: CSS preload will be handled by webpack's HTML plugin */}
      {/* The main CSS file will be automatically injected with proper attributes */}
      
      {/* Preload LCP images for optimal performance */}
      {/* These preload links ensure LCP images are discoverable immediately in the HTML */}
      {/* The actual image paths will be injected by React Helmet at render time */}
      {/* For the first SwipeTransition image (likely LCP element), we'll add preload via component */}
      
      {/* hreflang 標籤 */}
      <link rel="alternate" hreflang="zh" href={`${baseUrl}/?lang=zh`} />
      <link rel="alternate" hreflang="en" href={`${baseUrl}/?lang=en`} />
      <link rel="alternate" hreflang="x-default" href={baseUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={content.ogTitle} />
      <meta property="og:description" content={content.ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={content.ogTitle} />
      <meta property="og:site_name" content="Alphacurve.io" />
      <meta property="og:locale" content={isZh ? 'zh_TW' : 'en_US'} />
      <meta property="og:locale:alternate" content={isZh ? 'en_US' : 'zh_TW'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={content.twitterTitle} />
      <meta name="twitter:description" content={content.twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={content.twitterTitle} />
      
      {/* 結構化數據 */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

export default SEOHead;

