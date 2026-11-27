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
    type: 'video',
    src: '/assets/lasev-math-demo.webp',
    width: 1440,
    height: 810,
    source: 'https://dumate-skill-bos.bj.bcebos.com/michellewkx.com/projects/lasev/3dfa7b8a1e23-geometry-demo.mp4',
    sourceFallback: 'https://robitsg.github.io/LASEV/videos/math_ms_with_illustration.mp4',
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
  media: {
    close: 'Close preview',
    previous: 'Previous image',
    next: 'Next image',
    originalImage: 'View original image',
    originalVideo: 'Open video',
    loadError: 'Preview unavailable. Open the original below.',
  },
  description: 'Kathy Wang, AI Agent Architect and Algorithm Team Lead at Baidu. Master’s student in Software Engineering at Tsinghua University.',
  navigation: ['Overview', 'Timeline', 'Projects', 'CV', 'Contact'],
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
    rotate: 'Drag to rotate',
    employment: {
      company: 'Baidu',
      tenure: 'Jul 2017 – Present',
      role: 'Current role · Senior R&D Engineer / AI Agent Architect',
    },
    entries: [
      {
        id: 'current', jump: '2026', date: 'May 2026 – Present', current: true, title: 'DuMate',
        role: 'Team Lead · Agent Harness & Skills',
        description: 'Lead the team developing DuMate’s general-purpose Agent Harness and key Skills for task planning, tool use, and evaluation.',
        link: ['DuMate project', '#dumate'],
      },
      {
        id: '2025', jump: '2025', date: 'Q3 2025 – Feb 2026', title: 'Baidu Agent Platform · Interactive digital humans',
        role: 'Core Engineering Lead',
        description: 'Led engineering for reusable production workflows and real-time interaction for digital humans.',
      },
      {
        id: '2024', jump: '2024', date: 'Sep – Dec 2024', title: 'LASEV · Educational video agents',
        role: 'Algorithm Architecture Lead',
        description: 'Led algorithm architecture and engineering for a multi-agent system that generates educational problem-solving videos.',
        link: ['LASEV project', '#lasev'],
      },
      {
        id: '2023', jump: '2023', date: 'Jun 2023 – Dec 2025', title: 'ERNIE Agent Platform / Xinxiang',
        role: 'Workstream Lead / Core Engineer',
        description: 'Built agent discovery and distribution capabilities, then led core engineering for the Xinxiang consumer task-execution agent.',
      },
      {
        id: 'earlier', jump: 'Early', date: 'Earlier work', title: 'Platform engineering',
        role: 'Backend Lead / Core Engineer',
        description: 'Worked on Baidu’s search resource platform, Smart Mini Programs, and high-concurrency interactions for the Spring Festival Gala.',
      },
    ],
  },
  patents: {
    heading: 'Patents',
    statusHeadings: {
      granted: 'Granted patents',
      published: 'Published applications',
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
  media: {
    close: '关闭预览',
    previous: '上一张',
    next: '下一张',
    originalImage: '查看原图',
    originalVideo: '单独打开视频',
    loadError: '预览加载失败，可以打开下方的原始文件。',
  },
  description: '王珂欣，百度 AI Agent 架构师、DuMate 搭子算法团队负责人，清华大学软件工程硕士在读。',
  navigation: ['简介', '时间线', '项目', '履历', '联系'],
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
    rotate: '拖动旋转',
    employment: {
      company: '百度',
      tenure: '2017.07 至今',
      role: '现任资深研发工程师 / AI Agent 架构师',
    },
    entries: [
      {
        id: 'current', jump: '2026', date: '2026.05 至今', current: true, title: 'DuMate 搭子',
        role: '团队负责人 / Harness 与 Skills 算法负责人',
        description: '带领团队研发通用 Agent Harness 和重点 Skills，负责任务规划、工具调用与质量评测。',
        link: ['DuMate 项目', '#dumate'],
      },
      {
        id: '2025', jump: '2025', date: '2025 Q3–2026.02', title: '百度智能体平台 · 互动数字人',
        role: '核心研发负责人',
        description: '负责互动数字人的批量制作流程与实时交互研发，将制作步骤封装成可复用工作流。',
      },
      {
        id: '2024', jump: '2024', date: '2024.09–2024.12', title: 'LASEV · 教育解题视频生成',
        role: '算法架构负责人',
        description: '负责教育解题视频多智能体系统的算法架构与工程落地。',
        link: ['LASEV 项目', '#lasev'],
      },
      {
        id: '2023', jump: '2023', date: '2023.06–2025.12', title: '文心智能体 / 心响',
        role: '方向负责人 / 核心研发',
        description: '建设文心智能体的发现与分发能力，随后主导心响面向个人用户的任务执行基础设施研发。',
      },
      {
        id: 'earlier', jump: '早期', date: '早期项目', title: '平台建设',
        role: '后端负责人 / 核心研发',
        description: '参与搜索资源平台、百度智能小程序和百度春晚红包高并发互动研发。',
      },
    ],
  },
  patents: {
    heading: '专利',
    statusHeadings: {
      granted: '已授权',
      published: '已公开申请',
    },
    otherApplications: '另有 2 件已提交申请正在审查，暂无可引用的公开文本。',
  },
  contact: {
    heading: '联系',
    links: [['LinkedIn', links.linkedin], ['GitHub', links.github]],
  },
  missing: { heading: '页面未找到', back: '返回首页' },
};
