const links = {
  linkedin: 'https://www.linkedin.com/in/kexin-wang-ai/',
  github: 'https://github.com/michellewkx',
  dumate: 'https://www.dumate.cn/',
  lasev: 'https://robitsg.github.io/LASEV/',
  lasevPaper: 'https://arxiv.org/abs/2602.11790',
};

const projectMedia = {
  dumate: {
    src: 'https://dumate-skill-bos.bj.bcebos.com/michellewkx.com/projects/dumate/7cd99789445d-dumate-workflow-artwork.webp',
    fallback: '/assets/dumate-workflow-artwork.webp',
    width: 944,
    height: 440,
    source: 'https://now.bdstatic.com/store/v2/d33e0f5/dumate-portal/7dd7541/static/image/feature_2.b433666f.png',
  },
  dumateFiles: {
    src: 'https://dumate-skill-bos.bj.bcebos.com/michellewkx.com/projects/dumate/b306ad82c33d-dumate-file-organization.webp',
    fallback: '/assets/dumate-file-organization.webp',
    width: 1240,
    height: 676,
    source: 'https://now.bdstatic.com/store/v2/d33e0f5/dumate-portal/7dd7541/static/image/scenarios_1_1200.18e8b976.png',
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
  portraitAlt: 'Portrait of Kathy Wang',
  description: 'Kathy Wang, AI Agent Architect and Algorithm Team Lead at Baidu. Master’s student in Software Engineering at Tsinghua University.',
  navigation: ['Overview', 'Projects', 'Timeline', 'CV', 'Contact'],
  theme: { label: 'Appearance', choices: ['System', 'Light', 'Dark'] },
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
        images: [
          {
            ...projectMedia.dumate,
            alt: 'DuMate logo surrounded by cards for scheduling, code generation, data analysis, and custom skills.',
            caption: 'Feature overview',
          },
          {
            ...projectMedia.dumateFiles,
            alt: 'DuMate organizes assorted documents into labeled folders and extracts information.',
            caption: 'File organization',
          },
        ],
        links: [['Product site', links.dumate]],
      },
      {
        id: 'lasev',
        name: 'LASEV',
        scope: 'Baidu · Sep–Dec 2024',
        description: 'I led algorithm architecture and engineering for Baidu’s educational problem-solving video system. It coordinates solution, executable visualization, and narration agents, with compilation and semantic checks to guide revisions.',
        images: [
          {
            ...projectMedia.lasev,
            alt: 'A frame from a LASEV math video, showing a geometric diagram and steps of a proof.',
            caption: 'Middle-school geometry · LASEV demo',
          },
        ],
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
  timeline: {
    heading: 'Work timeline',
    entries: [
      {
        id: 'current', jump: 'Now', date: 'Present', current: true, title: 'Baidu · DuMate',
        description: 'AI Agent Architect and Algorithm Team Lead for Baidu’s desktop agent.',
        link: ['DuMate project', '#dumate'],
      },
      {
        id: '2026', jump: '2026', date: 'Mar 2026', dateTime: '2026-03-27', title: 'Intelligent information acquisition',
        description: 'Granted a Chinese invention patent as the sole named inventor.',
        link: ['Patent record', '#patent-CN117312641B'],
      },
      {
        id: '2024', jump: '2024', date: 'Sep–Dec 2024', title: 'Baidu · Educational video agents',
        description: 'Led algorithm architecture and engineering for a multi-agent educational video system.',
        link: ['LASEV project', '#lasev'],
      },
      {
        id: '2021', jump: '2021', date: 'May 2021', dateTime: '2021-05-14', title: 'Baidu · Feedback processing',
        description: 'Filed a feedback-processing invention with Baidu as applicant and later received a grant.',
        link: ['Patent record', '#patent-CN113238792B'],
      },
    ],
  },
  patents: {
    heading: 'Patents',
    statuses: {
      granted: { heading: 'Granted patents', date: 'Granted' },
      published: { heading: 'Published applications', date: 'Published' },
    },
    otherApplications: 'Two additional filed applications are in examination and have no public document listed.',
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
  portraitAlt: '王珂欣的照片',
  description: '王珂欣，百度 AI Agent 架构师、DuMate 搭子算法团队负责人，清华大学软件工程硕士在读。',
  navigation: ['简介', '项目', '时间线', '履历', '联系'],
  theme: { label: '外观', choices: ['跟随系统', '浅色', '暗色'] },
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
        images: [
          {
            ...projectMedia.dumate,
            alt: 'DuMate 标志周围展示日程规划、代码生成、数据分析和自定义技能。',
            caption: '功能概览',
          },
          {
            ...projectMedia.dumateFiles,
            alt: 'DuMate 将杂乱文件分类归档，并提取文档中的信息。',
            caption: '文件整理场景',
          },
        ],
        links: [['产品官网', links.dumate]],
      },
      {
        id: 'lasev',
        name: 'LASEV',
        scope: '百度 · 2024.09–2024.12',
        description: '负责百度教育解题视频系统的算法架构与工程落地。系统协调解题、可执行图示和讲解智能体，并用编译检查与语义评审来修正生成结果。',
        images: [
          {
            ...projectMedia.lasev,
            alt: 'LASEV 数学解题视频画面，包含矩形几何图示和解题步骤。',
            caption: '初中几何解题 · LASEV 项目演示',
          },
        ],
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
  timeline: {
    heading: '工作时间线',
    entries: [
      {
        id: 'current', jump: '目前', date: '目前', current: true, title: '百度 · DuMate 搭子',
        description: '担任 AI Agent 架构师，负责百度桌面智能体的算法团队。',
        link: ['DuMate 项目', '#dumate'],
      },
      {
        id: '2026', jump: '2026', date: '2026.03', dateTime: '2026-03-27', title: '智能获取信息专利获授权',
        description: '作为唯一列名发明人获中国发明专利授权。',
        link: ['专利记录', '#patent-CN117312641B'],
      },
      {
        id: '2024', jump: '2024', date: '2024.09–12', title: '百度 · 教育解题视频智能体',
        description: '负责教育解题视频系统的多智能体算法架构和工程落地。',
        link: ['LASEV 项目', '#lasev'],
      },
      {
        id: '2021', jump: '2021', date: '2021.05', dateTime: '2021-05-14', title: '百度 · 反馈信息处理',
        description: '以百度为申请人提交反馈信息处理方法发明专利，后获授权。',
        link: ['专利记录', '#patent-CN113238792B'],
      },
    ],
  },
  patents: {
    heading: '专利',
    statuses: {
      granted: { heading: '已授权', date: '授权' },
      published: { heading: '已公开申请', date: '公开' },
    },
    otherApplications: '另有 2 件已提交申请正在审查，暂无可引用的公开文本。',
  },
  contact: {
    heading: '联系',
    links: [['LinkedIn', links.linkedin], ['GitHub', links.github]],
  },
  missing: { heading: '页面未找到', back: '返回首页' },
};
