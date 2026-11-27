const links = {
  linkedin: 'https://www.linkedin.com/in/kexin-wang-ai/',
  github: 'https://github.com/michellewkx',
  dumate: 'https://www.dumate.cn/',
  lasev: 'https://robitsg.github.io/LASEV/',
  lasevPaper: 'https://arxiv.org/abs/2602.11790',
  patent: 'https://patents.google.com/patent/CN117312641B/zh',
};

export const english = {
  lang: 'en',
  path: '/',
  alternate: '中文',
  skip: 'Skip to content',
  name: 'Kexin Wang',
  secondaryName: '王珂欣',
  description: 'Kexin Wang, AI Agent Architect and Algorithm Team Lead at Baidu. Master’s student in Software Engineering at Tsinghua University.',
  navigation: ['Overview', 'CV', 'Projects', 'Contact'],
  location: 'Beijing, China',
  role: 'AI Agent Architect & Algorithm Team Lead',
  affiliation: 'Baidu · DuMate',
  education: 'Tsinghua University · Software Engineering',
  work: {
    heading: 'Selected projects',
    entries: [
      {
        name: 'DuMate',
        scope: 'Baidu · Current',
        description: 'I lead agent architecture and algorithm team for Baidu’s desktop agent, which can work across applications and files to complete multi-step tasks.',
        links: [['Product site', links.dumate]],
      },
      {
        name: 'LASEV',
        scope: 'Baidu · Sep–Dec 2024',
        description: 'I led algorithm architecture and engineering for Baidu’s educational problem-solving video system. It coordinates solution, executable visualization, and narration agents, with compilation and semantic checks to guide revisions.',
        links: [['Project site', links.lasev], ['Related paper', links.lasevPaper]],
      },
    ],
  },
  cv: {
    heading: 'Experience & education',
    print: 'Print CV',
    entries: [
      ['Current', 'Baidu', 'AI Agent Architect & Algorithm Team Lead, DuMate'],
      ['Jul 2024 – Present', 'Tsinghua University', 'Master’s student in Software Engineering · Top 10%'],
      ['Undergraduate', 'Xidian University', 'Software Engineering'],
    ],
  },
  patent: {
    section: 'Patent',
    heading: 'Intelligent information acquisition',
    description: 'Sole named inventor · Assigned to Baidu Online Network Technology (Beijing) Co., Ltd.',
    date: 'Granted 27 Mar 2026',
    number: 'CN117312641B',
    link: links.patent,
  },
  contact: {
    heading: 'Contact',
    links: [['LinkedIn', links.linkedin], ['GitHub', links.github]],
  },
  missing: { heading: 'Page not found', back: 'Return to the homepage' },
};

export const chinese = {
  lang: 'zh-CN',
  path: '/zh/',
  alternate: 'EN',
  skip: '跳到正文',
  name: '王珂欣',
  secondaryName: 'Kexin Wang',
  description: '王珂欣，百度 AI Agent 架构师、DuMate 搭子算法团队负责人，清华大学软件工程硕士在读。',
  navigation: ['简介', '履历', '项目', '联系'],
  location: '中国 · 北京',
  role: 'AI Agent 架构师、算法团队负责人',
  affiliation: '百度 · DuMate 搭子',
  education: '清华大学 · 软件工程',
  work: {
    heading: '代表项目',
    entries: [
      {
        name: 'DuMate 搭子',
        scope: '百度 · 目前',
        description: '负责百度桌面智能体 DuMate 的 Agent 架构和算法团队。DuMate 能在不同应用和文件间操作，完成多步骤任务。',
        links: [['产品官网', links.dumate]],
      },
      {
        name: 'LASEV',
        scope: '百度 · 2024.09–2024.12',
        description: '负责百度教育解题视频系统的算法架构与工程落地。系统协调解题、可执行图示和讲解智能体，并用编译检查与语义评审来修正生成结果。',
        links: [['项目官网', links.lasev], ['相关论文', links.lasevPaper]],
      },
    ],
  },
  cv: {
    heading: '工作与教育',
    print: '打印履历',
    entries: [
      ['现任', '百度', 'AI Agent 架构师、算法团队负责人 · DuMate'],
      ['2024.07 至今', '清华大学', '软件工程硕士在读 · 排名前 10%'],
      ['本科', '西安电子科技大学', '软件工程'],
    ],
  },
  patent: {
    section: '专利',
    heading: '智能获取信息的方法、装置、设备及存储介质',
    description: '唯一列名发明人 · 专利权人为百度在线网络技术（北京）有限公司',
    date: '2026.03.27 授权',
    number: 'CN117312641B',
    link: links.patent,
  },
  contact: {
    heading: '联系',
    links: [['LinkedIn', links.linkedin], ['GitHub', links.github]],
  },
  missing: { heading: '页面未找到', back: '返回首页' },
};
