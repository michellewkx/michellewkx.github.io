const links = {
  linkedin: 'https://www.linkedin.com/in/kexin-wang-ai/',
  github: 'https://github.com/michellewkx',
  dumate: 'https://www.dumate.cn/',
  lasev: 'https://robitsg.github.io/LASEV/',
  lasevPaper: 'https://arxiv.org/abs/2602.11790',
  patent: 'https://patents.google.com/patent/CN117312641B/zh',
};

const projectMedia = {
  dumate: {
    src: '/assets/dumate-desktop.webp',
    width: 1440,
    height: 810,
    source: 'https://bce.bdstatic.com/p3m/common-service/uploads/dumate0323_ec7af94.mp4',
  },
  lasev: {
    src: '/assets/lasev-math-demo.webp',
    width: 1440,
    height: 810,
    source: 'https://robitsg.github.io/LASEV/videos/math_ms_with_illustration.mp4',
  },
};

export const english = {
  lang: 'en',
  path: '/',
  alternate: '中文',
  skip: 'Skip to content',
  name: 'Kathy Wang',
  secondaryName: '王珂欣',
  description: 'Kathy Wang, AI Agent Architect and Algorithm Team Lead at Baidu. Master’s student in Software Engineering at Tsinghua University.',
  navigation: ['Overview', 'Projects', 'CV', 'Contact'],
  location: 'Beijing, China',
  role: 'AI Agent Architect & Algorithm Team Lead',
  affiliation: 'Baidu · DuMate',
  education: 'Tsinghua University · Software Engineering',
  flow: {
    title: 'DuMate workflow',
    replay: 'Replay',
    orchestrator: 'Task request',
    output: 'Result & files',
    agents: [
      ['Plan', 'Turn a natural-language request into actionable steps.'],
      ['Execute', 'Use relevant skills to work across applications and files.'],
      ['Deliver', 'Return the result and any files the task produces.'],
    ],
  },
  work: {
    heading: 'Selected projects',
    entries: [
      {
        id: 'dumate',
        name: 'DuMate',
        scope: 'Baidu · Current',
        description: 'I lead the agent architecture and algorithm team for DuMate, Baidu’s desktop AI agent. DuMate plans multi-step tasks, selects the relevant skills, and works across applications and files to deliver results.',
        image: {
          ...projectMedia.dumate,
          alt: 'DuMate desktop app with its task sidebar and a request to create a calendar event.',
          caption: 'DuMate desktop interface · Baidu product demo',
        },
        links: [['Product site', links.dumate]],
      },
      {
        id: 'lasev',
        name: 'LASEV',
        scope: 'Baidu · Sep–Dec 2024',
        description: 'I led algorithm architecture and engineering for Baidu’s educational problem-solving video system. It coordinates solution, executable visualization, and narration agents, with compilation and semantic checks to guide revisions.',
        image: {
          ...projectMedia.lasev,
          alt: 'A frame from a LASEV math video, showing a geometric diagram and steps of a proof.',
          caption: 'Middle-school geometry · LASEV demo',
        },
        links: [['Project site', links.lasev], ['Related paper', links.lasevPaper]],
      },
    ],
  },
  cv: {
    heading: 'Experience & education',
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
  secondaryName: 'Kathy Wang',
  description: '王珂欣，百度 AI Agent 架构师、DuMate 搭子算法团队负责人，清华大学软件工程硕士在读。',
  navigation: ['简介', '项目', '履历', '联系'],
  location: '中国 · 北京',
  role: 'AI Agent 架构师、算法团队负责人',
  affiliation: '百度 · DuMate 搭子',
  education: '清华大学 · 软件工程',
  flow: {
    title: 'DuMate 搭子工作流',
    replay: '重播',
    orchestrator: '任务请求',
    output: '结果与文件',
    agents: [
      ['规划', '把自然语言需求拆成可执行的步骤。'],
      ['执行', '调用相关技能，跨应用和文件执行任务。'],
      ['交付', '交付任务结果及生成的文件。'],
    ],
  },
  work: {
    heading: '代表项目',
    entries: [
      {
        id: 'dumate',
        name: 'DuMate 搭子',
        scope: '百度 · 目前',
        description: '负责百度桌面智能体 DuMate 搭子的 Agent 架构和算法团队。DuMate 会拆解多步骤任务、调度相关技能，并跨应用和文件执行、交付结果。',
        image: {
          ...projectMedia.dumate,
          alt: 'DuMate 桌面界面，左侧是任务栏，输入区已有一条创建日历事件的请求。',
          caption: 'DuMate 桌面界面 · 百度官方演示',
        },
        links: [['产品官网', links.dumate]],
      },
      {
        id: 'lasev',
        name: 'LASEV',
        scope: '百度 · 2024.09–2024.12',
        description: '负责百度教育解题视频系统的算法架构与工程落地。系统协调解题、可执行图示和讲解智能体，并用编译检查与语义评审来修正生成结果。',
        image: {
          ...projectMedia.lasev,
          alt: 'LASEV 数学解题视频画面，包含矩形几何图示和解题步骤。',
          caption: '初中几何解题 · LASEV 项目演示',
        },
        links: [['项目官网', links.lasev], ['相关论文', links.lasevPaper]],
      },
    ],
  },
  cv: {
    heading: '工作与教育',
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
