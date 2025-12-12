// Team Section 內容配置
import { ReactComponent as JamesIcon } from '../assets/team/james.svg';
import { ReactComponent as PeterIcon } from '../assets/team/peter.svg';
import { ReactComponent as AngelaIcon } from '../assets/team/angela.svg';
import { ReactComponent as AaronIcon } from '../assets/team/aaron.svg';

export const teamContent = {
  zh: {
    title: "Who We Are",
    description: "關於我們",
    members: [
      {
        id: 'james',
        name: 'James',
        role: 'CEO & Founder',
        education: '國立成功大學 製造資訊與系統所 碩士',
        degree: "Master's of Science, National Cheng Kung University",
        picture: JamesIcon,
        link: 'https://app.wavecnct.com/app/profile/james.shieh.8uqu',
      },
      {
        id: 'peter',
        name: 'Peter',
        role: 'Chief Designer',
        education: '波士頓大學 工業設計 學士',
        degree: "Bachelor's degree, Boston University",
        picture: PeterIcon,
        link: '#',
      },
      {
        id: 'angela',
        name: 'Angela',
        role: 'Business Development',
        education: '國立台灣大學 企業管理 碩士',
        degree: "Master's degree in National Taiwan University",
        picture: AngelaIcon,
        link: '#',
      },
      {
        id: 'aaron',
        name: 'Aaron',
        role: 'Business Development',
        education: '國立清大大學 工業工程 碩士',
        degree: "Master's degree in National Tsinghua University",
        picture: AaronIcon,
        link: '#',
      },
    ]
  },
  en: {
    title: "Who We Are",
    description: "About Us",
    members: [
      {
        id: 'james',
        name: 'James',
        role: 'CEO & Founder',
        education: 'M.S. in Manufacturing Information & Systems, NCKU',
        degree: "Master's of Science, National Cheng Kung University",
        picture: JamesIcon,
        link: 'https://app.wavecnct.com/app/profile/james.shieh.8uqu',
      },
      {
        id: 'peter',
        name: 'Peter',
        role: 'Chief Designer',
        education: 'B.S. in Industrial Design, Boston University',
        degree: "Bachelor's degree, Boston University",
        picture: PeterIcon,
        link: '#',
      },
      {
        id: 'angela',
        name: 'Angela',
        role: 'Business Development',
        education: 'MBA, National Taiwan University',
        degree: "Master's degree in National Taiwan University",
        picture: AngelaIcon,
        link: '#',
      },
      {
        id: 'aaron',
        name: 'Aaron',
        role: 'Business Development',
        education: 'M.S. in Industrial Engineering, NTHU',
        degree: "Master's degree in National Tsinghua University",
        picture: AaronIcon,
        link: '#',
      },
    ]
  }
};

export default teamContent;
