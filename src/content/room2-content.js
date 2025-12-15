// 3D 會議室（room2）人物外觀設定
// 可在這裡調整每個角色的身體顏色、頭髮顏色與表情
// expression: 'neutral' | 'smile' | 'sad' | 'surprised'

export const room2Content = {
  zh: {
    boardTitle: '客戶會議',
    people: [
      { 
        bodyColor: '#2c5f2d',
        hairColor: '#654321',
        expression: 'smile',
        messages: ['這題可以交給 AI 試試看。', '先釐清需求，再談技術細節。'],
      },
      { 
        bodyColor: '#1e3a5f',
        hairColor: '#ffd700',
        expression: 'surprised',
        messages: ['這個數據結果滿有趣的。', '如果自動化起來，可以省下不少時間。'],
      },
      { 
        bodyColor: '#1a1a4e',
        hairColor: '#8b4513',
        expression: 'neutral',
        messages: ['我們先把風險列出來。', '要不要先做一個小 PoC？'],
      },
      { 
        bodyColor: '#1a1a4e',
        hairColor: '#8b4513',
        expression: 'sad',
        messages: ['這個痛點，很多客戶都有提到。', '也許可以調整一下流程設計。'],
      },
      { 
        bodyColor: '#2c5f2d',
        hairColor: '#ffa500',
        expression: 'smile',
        messages: ['感覺可以變成一個很酷的產品。', '如果落地成功，影響會很大。'],
      },
      { 
        bodyColor: '#1e3a5f',
        hairColor: '#654321',
        expression: 'neutral',
        messages: ['我們幫你看技術可行性。', '先做一週的技術 Spike 如何？'],
      },
    ],
  },
  en: {
    // English can共用同一組顏色與表情，或之後再獨立調整
    boardTitle: 'Client Meeting',
    people: [
      { 
        bodyColor: '#2c5f2d',
        hairColor: '#654321',
        expression: 'smile',
        messages: ['Let’s see what AI can do here.', 'Clarify the problem first, then pick the tech.'],
      },
      { 
        bodyColor: '#1e3a5f',
        hairColor: '#ffd700',
        expression: 'surprised',
        messages: ['These numbers are interesting.', 'If we automate this, it saves a lot of time.'],
      },
      { 
        bodyColor: '#1a1a4e',
        hairColor: '#8b4513',
        expression: 'neutral',
        messages: ['Let’s list out the main risks.', 'Maybe start with a small PoC.'],
      },
      { 
        bodyColor: '#1a1a4e',
        hairColor: '#8b4513',
        expression: 'sad',
        messages: ['Many clients mention this pain point.', 'We could rethink the process design.'],
      },
      { 
        bodyColor: '#2c5f2d',
        hairColor: '#ffa500',
        expression: 'smile',
        messages: ['This could become a very cool product.', 'If this lands, the impact will be huge.'],
      },
      { 
        bodyColor: '#1e3a5f',
        hairColor: '#654321',
        expression: 'neutral',
        messages: ['We can help validate technical feasibility.', 'How about a one-week technical spike?'],
      },
    ],
  },
};

export default room2Content;


