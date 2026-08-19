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
import { getSiteConfig } from '../utils/site-config';

const SEOHead = ({ language = 'zh' }) => {
  const isZh = language === 'zh';
  const site = getSiteConfig();

  // 多網域支援：public/index.html 內的靜態 canonical / hreflang 是為 alphacurve.io
  // 寫死的；當從 efacani.com 進站時，改寫這些靜態標籤指向 efacani.com，
  // 避免瀏覽器與審核工具看到指向另一個網域的 canonical。
  React.useEffect(() => {
    if (site.domain === 'alphacurve.io') return;

    const links = document.head.querySelectorAll(
      'link[rel="canonical"], link[rel="alternate"][hreflang]'
    );
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('https://alphacurve.io')) {
        link.setAttribute('href', href.replace('https://alphacurve.io', site.baseUrl));
      }
    });
  }, [site.domain, site.baseUrl]);

  // SEO 內容配置
  const seoContent = {
    zh: {
      title: `${site.siteLabel} | AI 研發、技術顧問與軟體開發服務`,
      description: 'Alphacurve 專注 AI 自主研發與技術顧問服務，旗下 AI 產品包含 Rank Pilot（AI SEO/GEO 分析）、DualView（AI 語言學習）、ScanPro（AI 文件掃描）與 Aura（AI 智慧助理）。協助企業導入 AI、突破技術瓶頸，實現數位轉型與業務成長。',
      keywords: 'AI 研發, AI 產品, AI 整合, 軟體開發, 技術顧問, 數位轉型, 系統開發, 自動化, 雲端解決方案, 企業系統, AI 顧問, Rank Pilot, DualView, ScanPro, Aura',
      ogTitle: `${site.siteLabel} | AI 研發、技術顧問與軟體開發服務`,
      ogDescription: '提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型。',
      twitterTitle: `${site.siteLabel} | AI 研發與技術顧問`,
      twitterDescription: '提供 AI 整合、軟體開發與技術顧問服務。協助企業突破技術瓶頸，實現數位轉型。',
    },
    en: {
      title: `${site.siteLabel} | AI R&D, Tech Consulting & Software Development`,
      description: 'Alphacurve builds in-house AI products — Rank Pilot (AI SEO/GEO analyzer), DualView (AI language learning), ScanPro (AI document scanner), and Aura (AI assistant) — and provides AI integration, software development, and tech consulting services for digital transformation.',
      keywords: 'AI R&D, AI products, AI integration, software development, tech consulting, digital transformation, system development, automation, cloud solutions, enterprise systems, AI consulting, Rank Pilot, DualView, ScanPro, Aura',
      ogTitle: `${site.siteLabel} | AI R&D, Tech Consulting & Software Development`,
      ogDescription: 'Provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks and achieve digital transformation.',
      twitterTitle: `${site.siteLabel} | AI R&D & Tech Consulting`,
      twitterDescription: 'Provides AI integration, software development, and tech consulting services. Help businesses break through tech bottlenecks.',
    },
  };

  const content = seoContent[language] || seoContent.zh;
  const baseUrl = site.baseUrl;
  const ogImage = `${baseUrl}/facebook-image.jpg`;
  const twitterImage = `${baseUrl}/twitter-image.png`;

  // 註：Organization / WebSite / WebPage 等結構化資料已統一改為靜態
  // JSON-LD @graph，直接寫在 public/index.html 的 <head>，以確保不執行 JS 的
  // AI 爬蟲 (GPTBot / ClaudeBot / PerplexityBot 等) 也能讀取，避免重複定義。

  return (
    <Helmet>
      {/* HTML lang 屬性 */}
      <html lang={isZh ? 'zh-TW' : 'en-US'} />
      
      {/* 基本 Meta 標籤 */}
      <title>{content.title}</title>
      <meta name="description" content={content.description} />
      <meta name="keywords" content={content.keywords} />
      <meta name="author" content={site.siteLabel} />
      
      {/* Google AI Training Control */}
      {/* 允許用於搜索索引，但不允許用於 AI 訓練 */}
      <meta name="robots" content="index, follow, noai, noimageai" />
      
      {/* 註：canonical 與 hreflang 已統一改為靜態標籤，寫在 public/index.html 的 <head>，
          以確保不執行 JS 的爬蟲也能讀取，避免與 Helmet 注入版本重複/衝突。 */}

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
      
      {/* hreflang 標籤已移至 public/index.html 靜態 <head> */}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={baseUrl} />
      <meta property="og:title" content={content.ogTitle} />
      <meta property="og:description" content={content.ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={content.ogTitle} />
      <meta property="og:site_name" content={site.siteLabel} />
      <meta property="og:locale" content={isZh ? 'zh_TW' : 'en_US'} />
      <meta property="og:locale:alternate" content={isZh ? 'en_US' : 'zh_TW'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={content.twitterTitle} />
      <meta name="twitter:description" content={content.twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:image:alt" content={content.twitterTitle} />

      {/* 結構化資料 (Organization / WebSite / WebPage / ProfessionalService)
          已移至 public/index.html 的靜態 JSON-LD @graph，此處不再重複注入。
          FAQPage 結構化資料仍由 FAQ 組件提供，並以 @id 串接回 @graph。 */}
    </Helmet>
  );
};

export default SEOHead;

