// Kid1Follower 配置
export const kid1FollowerContent = {
  zh: {
    // 模型大小配置（单位：Three.js 单位，1.5 表示高度为 1.5 个单位）
    modelSize: 0.7,
    // 跟随鼠标的速度（0-1，值越大移动越快，0.1 表示每次移动 10% 的距离）
    moveSpeed: 0.05,
    // 初始移动速度（刚开始加载时的速度，通常比正常速度慢）
    initialMoveSpeed: 0.02,
    // 初始速度持续时间（毫秒），超过这个时间后使用正常速度
    initialSpeedDuration: 3000,
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        selector: '#hero',
        messages: ['歡迎來到 Alphacurve!','我是工程師Kyle！'],
        destination: null, // 没有 destination，直接跟随鼠标
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'services',
        name: 'Services Section',
        selector: '#services',
        messages: [ '卡片展開後可以看到更多細節喔！'],
        destination: null,
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'team',
        name: 'Team Section',
        selector: '#team',
        messages: ['認識一下團隊成員', '大家都很厲害'],
        destination: null,
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'service-model',
        name: 'Service Model Section',
        selector: '#service-model',
        messages: ['看看我們如何工作'],
        destination: null, // 可以设置为某个 element，例如 '#why-consulting'
        bubbleShowDuration: 4000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'contact',
        name: 'Contact Section',
        selector: '#contact',
        messages: ['長按地圖上的logo圖釘，可以參加我們的虛擬會議唷~快跟我一起進來!'],
        destination: '#map-pin',
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
    ],
    movingMessage: '讓我帶你去看看...',
  },
  en: {
    // Model size configuration (unit: Three.js units, 1.5 means height of 1.5 units)
    modelSize: 0.7,
    // Mouse following speed (0-1, higher value means faster movement, 0.1 means 10% distance per frame)
    moveSpeed: 0.05,
    // Initial movement speed (speed when first loaded, usually slower than normal speed)
    initialMoveSpeed: 0.02,
    // Initial speed duration (milliseconds), after this time, use normal speed
    initialSpeedDuration: 3000,
    sections: [
      {
        id: 'hero',
        name: 'Hero Section',
        selector: '#hero',
        messages: ['Welcome to Alphacurve!','I\'m Kyle, the engineer of Alphacurve'],
        destination: null,
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'services',
        name: 'Services Section',
        selector: '#services',
        messages: ['Check out our services!', 'Hover on the card to see more details'],
        destination: null,
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'team',
        name: 'Team Section',
        selector: '#team',
        messages: ['Meet our team members'],
        destination: null,
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'service-model',
        name: 'Service Model Section',
        selector: '#service-model',
        messages: ['See how we work'],
        destination: null, // Can be set to an element selector, e.g., '#why-consulting'
        bubbleShowDuration: 4000,
        bubbleHideDuration: 2000,
      },
      {
        id: 'contact',
        name: 'Contact Section',
        selector: '#contact',
        messages: ['Long press the logo pin on the map, you can join our virtual meeting', 'Come in with me!'],
        destination: '#map-pin',
        bubbleShowDuration: 3000,
        bubbleHideDuration: 2000,
      },
    ],
    movingMessage: 'Let me take you there...',
  },
};

export default kid1FollowerContent;

