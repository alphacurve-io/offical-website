// AI 產品區塊內容配置
// 旗下自研 AI 產品：Rank Pilot / DualView / ScanPro / Aura / Contract / Inference
import rankPilotScreenshot from '../assets/products/rank-pilot.webp';
import dualviewScreenshot from '../assets/products/dualview.webp';
import scanproScreenshot from '../assets/products/scanpro.webp';
import auraScreenshot from '../assets/products/aura.webp';
import contractScreenshot from '../assets/products/contract.webp';
import inferenceScreenshot from '../assets/products/inference.webp';

const PRODUCT_SCREENSHOTS = {
  'rank-pilot': rankPilotScreenshot,
  dualview: dualviewScreenshot,
  scanpro: scanproScreenshot,
  aura: auraScreenshot,
  contract: contractScreenshot,
  inference: inferenceScreenshot,
};

export const aiProductsContent = {
  zh: {
    title: "旗下 AI 產品",
    description:
      "我們不只提供顧問服務，更持續投入自主 AI 研發。以下產品皆由 Alphacurve 團隊自行設計、開發與營運，涵蓋生成式 AI、電腦視覺與自然語言理解等核心技術。",
    linkText: "造訪產品",
    products: [
      {
        id: "rank-pilot",
        screenshot: PRODUCT_SCREENSHOTS['rank-pilot'],
        screenshotAlt: "Rank Pilot 產品截圖：AI 搜尋能見度平台首頁與 AI 能見度積分排行榜",
        name: "Rank Pilot",
        tagline: "AI SEO & GEO 分析平台",
        category: "生成式 AI・SaaS",
        status: "已上線",
        url: "https://web-ai.alphacurve.io",
        painPoint:
          "AI 搜尋（ChatGPT、Perplexity、Google AI Overviews）正在取代傳統搜尋，多數品牌卻不知道自己在 AI 回答中是否「被看見」。",
        solution:
          "Rank Pilot 在 60 秒內診斷網站對 AI 搜尋引擎（AIO / AEO / GEO）的可見度，產出 AI 能見度評分與 B2B 等級的完整報告，並給出可執行的優化建議。",
        features: [
          "AI 能見度評分與競品比較",
          "AIO / AEO / GEO 全面診斷",
          "60 秒產出 B2B 等級報告",
          "LLM 驅動的優化建議"
        ]
      },
      {
        id: "dualview",
        screenshot: PRODUCT_SCREENSHOTS['dualview'],
        screenshotAlt: "DualView 產品截圖：雙語字幕影集語言學習平台首頁",
        name: "DualView",
        tagline: "把每一部影集，變成一堂語言課",
        category: "AI 語言學習・Web App",
        status: "已上線",
        url: "https://dualview.app",
        painPoint:
          "傳統語言教材枯燥、難以持續；看影集學語言又常常「看得懂劇情、學不到語言」。",
        solution:
          "DualView 讓你用喜歡的影集學語言：畫面同時顯示目標語言與母語雙字幕，內建 AI 查字典、逐句重播與主動回想練習，把追劇時間變成有效的學習時間。",
        features: [
          "雙語字幕同步顯示",
          "內建 AI 字典即點即查",
          "逐句重播精聽訓練",
          "主動回想記憶練習"
        ]
      },
      {
        id: "scanpro",
        screenshot: PRODUCT_SCREENSHOTS['scanpro'],
        screenshotAlt: "ScanPro 產品截圖：AI 文件掃描 App 官網，支援 iOS 與 Android",
        name: "ScanPro",
        tagline: "手機就是你的掃描器",
        category: "電腦視覺・行動 App",
        status: "iOS / Android 上架中",
        url: "https://scanner.alphacurve.io",
        painPoint:
          "紙本文件數位化仍是許多工作者的日常痛點：專用掃描器昂貴、一般拍照歪斜模糊，雲端掃描服務又有隱私疑慮。",
        solution:
          "ScanPro 用 AI 影像技術把手機變成專業掃描器：拍一下，文件自動變 PDF。自動邊緣偵測、影像增強與 OCR 文字辨識全部在裝置端完成，文件只存在你的手機裡。",
        features: [
          "AI 自動邊緣偵測與校正",
          "影像增強、去陰影",
          "OCR 文字辨識",
          "純裝置端處理，隱私優先"
        ]
      },
      {
        id: "aura",
        screenshot: PRODUCT_SCREENSHOTS['aura'],
        screenshotAlt: "Aura 產品截圖：AI 智慧助理官網與行程規劃展示",
        name: "Aura",
        tagline: "說出你想要的，Aura 幫你找到真正需要的",
        category: "AI 智慧助理・行動 App",
        status: "iOS 搶先體驗",
        url: "https://aura.alphacurve.io",
        painPoint:
          "規劃出遊或採買時，「去哪裡、帶什麼、值不值得買」的瑣碎決策消耗大量時間與心力。",
        solution:
          "Aura 是以 LLM 打造的智慧助理：用一句話描述需求，AI 就會把細節想好——從行程、清單到購買建議，主動釐清你真正需要的東西。",
        features: [
          "自然語言一句話輸入",
          "LLM 需求理解與拆解",
          "行程、清單、購物建議",
          "個人化持續學習"
        ]
      },
      {
        id: "contract",
        screenshot: PRODUCT_SCREENSHOTS['contract'],
        screenshotAlt: "AlphaCurve Contract 產品截圖：AI 合約協作平台首頁與定稿數位指紋、可信時戳展示",
        name: "AlphaCurve Contract",
        tagline: "擬約、議約、定稿，然後留下站得住腳的證據",
        category: "法律科技・SaaS",
        status: "已上線",
        url: "https://contract.alphacurve.io",
        painPoint:
          "合約來回改版時，條號、金額變數與格式全靠人工維護；等到真的有爭議，卻拿不出「談定的是哪一版、誰核准、什麼時候定稿」的可信證據。",
        solution:
          "AlphaCurve Contract 以結構化條款與 AI 輔助擬約／改約加速談判，定稿後自動產生 SHA-256 數位指紋、對外簽署紀錄與 RFC 3161 第三方可信時戳，組成一條可驗證的完整證據鏈。",
        features: [
          "AI 擬約與改約建議，前後逐行對照",
          "自動條號、六種變數與範本庫",
          "定稿 SHA-256 數位指紋驗證",
          "RFC 3161 可信時戳與稽核軌跡報告"
        ]
      },
      {
        id: "inference",
        screenshot: PRODUCT_SCREENSHOTS['inference'],
        screenshotAlt: "Inference 產品截圖：LLM API 中轉閘道首頁與 OpenAI 相容 curl 呼叫範例",
        name: "Inference",
        tagline: "一個端點，打所有模型",
        category: "LLM 基礎設施・API 閘道",
        status: "已上線",
        url: "https://inference.alphacurve.io",
        painPoint:
          "團隊同時用 OpenAI、Anthropic、Google Gemini 等多家模型，SDK、金鑰與帳單各自為政；上游限流或故障只能手動切換，成本也難以拆分到專案與團隊。",
        solution:
          "Inference 是 OpenAI 相容的 LLM 中轉閘道：把 base_url 換成我們，就能用同一支 SDK、同一把金鑰呼叫 10+ 家上游，內建自動容錯路由、金鑰額度控管與即時成本觀測。",
        features: [
          "OpenAI 相容：串流、工具呼叫、視覺輸入",
          "多家上游路由與自動容錯切換",
          "金鑰層級模型白名單與月額度上限",
          "Token、成本與 P95 延遲即時儀表板"
        ]
      }
    ]
  },
  en: {
    title: "Our AI Products",
    description:
      "Beyond consulting, we invest heavily in in-house AI R&D. The products below are designed, built, and operated entirely by the Alphacurve team, covering generative AI, computer vision, and natural language understanding.",
    linkText: "Visit Product",
    products: [
      {
        id: "rank-pilot",
        screenshot: PRODUCT_SCREENSHOTS['rank-pilot'],
        screenshotAlt: "Rank Pilot screenshot: AI search visibility platform homepage with AI visibility leaderboard",
        name: "Rank Pilot",
        tagline: "AI SEO & GEO Analyzer",
        category: "Generative AI · SaaS",
        status: "Live",
        url: "https://web-ai.alphacurve.io",
        painPoint:
          "AI search (ChatGPT, Perplexity, Google AI Overviews) is replacing traditional search, yet most brands have no idea whether AI engines can even see them.",
        solution:
          "Rank Pilot diagnoses your website's visibility to AI search engines (AIO / AEO / GEO) in under 60 seconds, delivering an AI visibility score, a B2B-grade report, and actionable optimization guidance.",
        features: [
          "AI visibility score & competitor comparison",
          "Full AIO / AEO / GEO diagnosis",
          "B2B-grade report in 60 seconds",
          "LLM-powered optimization advice"
        ]
      },
      {
        id: "dualview",
        screenshot: PRODUCT_SCREENSHOTS['dualview'],
        screenshotAlt: "DualView screenshot: dual-subtitle language learning platform homepage",
        name: "DualView",
        tagline: "Turn every show into a language lesson",
        category: "AI Language Learning · Web App",
        status: "Live",
        url: "https://dualview.app",
        painPoint:
          "Traditional language materials are dull and hard to stick with; watching shows alone means following the plot without actually learning the language.",
        solution:
          "DualView lets you learn from the shows you love: dual subtitles show your target language and native language side by side, with a built-in AI dictionary, sentence-by-sentence replay, and active-recall practice.",
        features: [
          "Synchronized dual subtitles",
          "Built-in AI dictionary, tap to look up",
          "Sentence-by-sentence replay",
          "Active-recall memory practice"
        ]
      },
      {
        id: "scanpro",
        screenshot: PRODUCT_SCREENSHOTS['scanpro'],
        screenshotAlt: "ScanPro screenshot: AI document scanner app site for iOS and Android",
        name: "ScanPro",
        tagline: "Your phone is your scanner",
        category: "Computer Vision · Mobile App",
        status: "iOS / Android",
        url: "https://scanner.alphacurve.io",
        painPoint:
          "Digitizing paper documents is still a daily pain: dedicated scanners are expensive, plain photos come out skewed and blurry, and cloud scanning raises privacy concerns.",
        solution:
          "ScanPro turns your phone into a professional scanner with AI imaging: snap once and your document becomes a PDF. Edge detection, image enhancement, and OCR all run on-device — your documents never leave your phone.",
        features: [
          "AI edge detection & correction",
          "Image enhancement & de-shadowing",
          "OCR text recognition",
          "100% on-device, privacy first"
        ]
      },
      {
        id: "aura",
        screenshot: PRODUCT_SCREENSHOTS['aura'],
        screenshotAlt: "Aura screenshot: AI assistant site with itinerary planning demo",
        name: "Aura",
        tagline: "Say what you want — Aura finds what you actually need",
        category: "AI Assistant · Mobile App",
        status: "iOS Early Access",
        url: "https://aura.alphacurve.io",
        painPoint:
          "Planning a trip or a purchase means countless small decisions — where to go, what to pack, whether it's worth buying — that drain time and mental energy.",
        solution:
          "Aura is an LLM-powered assistant: describe what you need in one sentence and the AI works out the details — itineraries, packing lists, and purchase advice — proactively clarifying what you actually need.",
        features: [
          "One-sentence natural language input",
          "LLM intent understanding & breakdown",
          "Itineraries, lists & shopping advice",
          "Personalized continuous learning"
        ]
      },
      {
        id: "contract",
        screenshot: PRODUCT_SCREENSHOTS['contract'],
        screenshotAlt: "AlphaCurve Contract screenshot: AI contract workspace homepage with document fingerprint and trusted timestamp",
        name: "AlphaCurve Contract",
        tagline: "Draft, negotiate, finalize — and leave evidence that holds up",
        category: "Legal Tech · SaaS",
        status: "Live",
        url: "https://contract.alphacurve.io",
        painPoint:
          "Contracts go through endless rounds where clause numbers, amounts, and formatting are all maintained by hand — and when a dispute arrives, there is no credible proof of which version was agreed, who approved it, or when it was finalized.",
        solution:
          "AlphaCurve Contract speeds up negotiation with structured clauses and AI-assisted drafting and redlining. On finalization it generates a SHA-256 fingerprint, external signature records, and an RFC 3161 trusted timestamp — one verifiable evidence chain.",
        features: [
          "AI drafting & redlines with line-by-line diff",
          "Auto clause numbering, six variable types & templates",
          "SHA-256 fingerprint on every finalized document",
          "RFC 3161 trusted timestamps & audit trail report"
        ]
      },
      {
        id: "inference",
        screenshot: PRODUCT_SCREENSHOTS['inference'],
        screenshotAlt: "Inference screenshot: LLM API gateway homepage with an OpenAI-compatible curl example",
        name: "Inference",
        tagline: "One endpoint, every model",
        category: "LLM Infrastructure · API Gateway",
        status: "Live",
        url: "https://inference.alphacurve.io",
        painPoint:
          "Teams juggling OpenAI, Anthropic, and Google Gemini end up with a separate SDK, key, and bill for each — manual failover when an upstream rate-limits, and no clean way to split cost across teams and projects.",
        solution:
          "Inference is an OpenAI-compatible LLM gateway: point base_url at us and call 10+ upstream providers with one SDK and one key, with automatic failover routing, per-key spend caps, and real-time cost observability built in.",
        features: [
          "OpenAI-compatible: streaming, tool calling & vision",
          "Multi-provider routing with automatic failover",
          "Per-key model whitelists & monthly spend caps",
          "Live dashboard for tokens, cost & P95 latency"
        ]
      }
    ]
  }
};

export default aiProductsContent;
