// 服務模式內容配置
export const serviceModelContent = {
  // 區塊標題
 header: {
    title: "服務模式",
    subtitle:
      "我們以顧問式合作為核心，協助企業釐清問題、降低開發風險，並提供完整的系統規劃、開發與維運服務，確保您的商業策略得以真正落地。"
  },
  // Section 1: 服務內容
  services: {
    title: "四階段合作流程",
    subtitle: "Four-Stage Collaboration Process",
    items: [
      {
        id: "consulting",
        number: "01",
        title: "顧問諮詢",
        subtitle: "Consulting",
        slogan: "讓方向先對再開發",
        description: "釐清需求、驗證可行性，並提供技術與商業角度的完整分析。",
        benefits: [
          "需求拆解與目標對齊",
          "系統功能可行性分析",
          "架構草案與技術選型建議",
          "開發預算與工期估算",
          "風險清單（可避免後期爆量追加）"
        ],
        note: "顧問費可折抵後續專案費用，因此您可用最小成本確認方向是否正確。"
      },
      {
        id: "planning",
        number: "02",
        title: "系統規劃",
        subtitle: "Architecture & Planning",
        slogan: "打造可長期維護的技術藍圖",
        description: "在方向明確後，我們會協助您制定完整的系統規劃。",
        benefits: [
 "系統與使用流程圖",
          "資料流與資料結構設計",
          "角色與權限模型設計",
          "API 與第三方整合規劃",
          "Roadmap（MVP → Phase 1 → Phase 2）"
        ],
        note: "規劃文件可作為後續開發的規格書，任何工程團隊都能依據此文件執行。"      },
      {
        id: "development",
        number: "03",
        title: "系統開發與整合",
        subtitle: "Development & Integration",
        slogan: "讓系統更完整、更安全、更穩定",
        description: "依據規格書進行系統開發，並確保品質、安全性與擴充性。",
        benefits: [
          "企業應用服務客製化開發",
          "後台管理 / CRM / 會員系統",
          "AI／Automation 系統導入",
          "跨平台資料整合",
          "API 串接（Line、金流、物流等平台）",
        ],
        note: "所有開發都遵循顧問階段確立的架構與風險控管，確保開發品質。"
      },
      {
        id: "maintenance",
        number: "04",
        title: "長期技術維運",
        subtitle: "Maintenance & Optimization",
        slogan: "無需再為技術煩惱，專注核心業務",
        description: "協助企業維持系統穩定運作，並持續根據業務需求進行優化。",
        benefits: [
          "優化建議與技術傾聽",
          "功能巡檢與資安檢查",
          "版本更新、除錯與系統優化",
          "效能調校與技術債管理",
          "緊跟企業需求迭代，降低改不了的風險",
        ],
        note: "讓企業不用擔心技術債、開發後無人維護的問題，確保系統長期穩定運作。"
      }
    ]
  },

  // Section 2: 為什麼採用顧問導向合作
  whyConsulting: {
    title: "為什麼企業需要顧問導向合作？",
    subtitle: "您可能遭遇過這些問題",
    reasons: [
      {
        icon: "❗",
        title: "做出來不能用？",
        subtitle: "要降低開發風險，避免做錯方向，多數專案失敗不是因為技術問題，而是方向問題。",
        problems: [
          "需求未被明確定義",
          "做一半才發現功能不可行",
          "預算與期望落差巨大",
          "沒有完整規格書就開始開發",
          "反覆返工"
        ],
        conclusion: "顧問階段能提前發現問題，大幅降低開發風險。"
      },
      {
        icon: "💬",
        title: "溝通不順利？",
        subtitle: "減少溝通成本與認知落差，透明流程與清晰輸出＝溝通效率全面提升。",
        problems: [
          "需求越做越多、版本不斷變更",
          "開發與企業理解不同步",
          "開發限制與技術瓶頸後期爆發",
          "專案拖延",
          "預算失控"
        ],
        conclusion: "顧問流程讓雙方認知一致，確保專案穩定推進。"
      },
      {
        icon: "💰",
        title: "預算超支？",
        subtitle: "讓預算與時程更可控，需要充足的資訊（需客製?第三方限制?需額外開發?）",
        benefits: [
          "有共識的預算區間",
          "客觀的成本估算",
          "合理的工期推估",
          "資源安排建議",
          "技術風險標註"
        ],
        conclusion: "讓決策者能在資訊充分的狀況下制定預算。"
      },
      {
        icon: "🎯",
        title: "怕我選錯團隊？",
        subtitle: "協助企業做出最適合的技術選擇，不是比較價格，而是比較風險、擴充性與可維護性。",
        filters: [
          "避免被低價方案誤導",
          "提升決策品質",
          "減少後續維護成本",
          "保留企業資源給最重要的項目",
          "確保技術選型的長期可維護性"  
        ],
        conclusion: "讓企業做出更務實且可長期維護的決策。"
      }
    ]
  },

  // Section 3: 合作流程
 process: {
  title: "清晰的輸入／輸出流程",
  subtitle: "每一步都有明確產出，讓專案可控、透明、無黑箱",
  steps: [
    {
      number: "01",
      title: "預約顧問會議",
      subtitle: "對齊目標，確認合作可能性",
      description: "了解您的商業目標、現況與挑戰，提供初步技術方向，並評估是否進入顧問階段。",
      note: "免費的1小時顧問會議。"
    },
    {
      number: "02",
      title: "前期顧問",
      subtitle: "先把方向做對，再開始開發",
      description: "產出明確可用的分析成果：需求拆解、可行性驗證、架構草案、預算與工期估算、風險清單等。",
      note: "顧問費可折抵後續開發費用。"
    },
    {
      number: "03",
      title: "系統規劃",
      subtitle: "打造正式可開發的技術藍圖",
      description: "交付完整技術規格書（流程圖、架構、資料流、角色模型、Roadmap），作為後續開發的唯一依據。"
    },
    {
      number: "04",
      title: "開發與整合",
      subtitle: "依規格高品質落地",
      description: "依據規格書分階段開發，提供透明進度，確保系統穩定、安全、可維護並能長期擴充。"
    },
    {
      number: "05",
      title: "驗收與長期維護",
      subtitle: "陪伴企業持續演進",
      description: "協助驗收、版本更新、效能調校、資安檢查與系統優化，讓企業無需擔心技術負擔。"
    }
  ]
},

  // Section 4: 適合哪些企業
  whoWeHelp: {
    title: "適合哪些企業？",
    subtitle: "Who We Help",
    targets: [
      "想導入 AI、自動化或新技術的組織",
      "需要技術顧問協助決策的企業",
      "需要客製系統但缺乏技術架構能力",
      "正在比較不同開發團隊、希望降低風險的決策者",
      "被第三方工具或 WordPress 限制住，需要重構或優化的企業",
      "需要建立長期技術合作關係的企業"
    ]
  },

  // Section 5: FAQ
  faq: {
    title: "常見問題",
    subtitle: "FAQ",
    questions: [
      {
        question: "為什麼需要先付顧問費？",
        answer: "顧問階段會產出需求分析、架構草案、可行性評估、預算與工期估算等具體成果，這些內容都有高度專業性，並非一般諮詢或聊天能完成。"
      },
      {
        question: "如果最後不合作怎麼辦？",
        answer: "您仍可保留我們產出的所有規劃文件，並交給任何工程團隊使用，這確保您不會因方向錯誤而損失更多時間與成本。"
      },
      {
        question: "顧問費會抵專案費用嗎？",
        answer: "會的，顧問費可全額折抵後續專案開發費用。"
      }
    ]
  },

  // CTA Section
  cta: {
  title: "先了解我們的專業實力",
  subtitle: "看看我們如何協助不同企業降低風險、成功落地商業策略。",
  buttonText: "查看過往經驗"
  }
};

export default serviceModelContent;
