// 多網域設定：同一份 build 同時服務 alphacurve.io 與 efacani.com，
// 依瀏覽器 hostname 動態切換網域相關資訊（email、canonical、og:url、版權宣告等）。
// 公司主體相同（艾菲肯有限公司 / AlphaCurve Co., Ltd.），只有網域與聯繫信箱不同。

const SITE_CONFIGS = {
  'alphacurve.io': {
    domain: 'alphacurve.io',
    baseUrl: 'https://alphacurve.io',
    siteLabel: 'Alphacurve.io',
    email: 'service@alphacurve.io',
  },
  'efacani.com': {
    domain: 'efacani.com',
    baseUrl: 'https://efacani.com',
    siteLabel: 'Efacani.com',
    email: 'service@efacani.com',
  },
};

const DEFAULT_SITE = SITE_CONFIGS['alphacurve.io'];

export const getSiteConfig = () => {
  if (typeof window === 'undefined') return DEFAULT_SITE;

  const hostname = (window.location.hostname || '').replace(/^www\./, '');
  return SITE_CONFIGS[hostname] || DEFAULT_SITE;
};

export default getSiteConfig;
