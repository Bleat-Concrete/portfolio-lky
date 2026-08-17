export type Locale = "zh" | "en";

export function assetUrl(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export type LocalizedText = {
  zh: string;
  en: string;
};

export type PortfolioCategory =
  | "games"
  | "texts"
  | "audiovisual"
  | "images"
  | "uiux"
  | "sound";

export type PortfolioItem = {
  slug: string;
  category: PortfolioCategory;
  title: LocalizedText;
  summary: LocalizedText;
  year?: string;
  tools?: string[];
  role?: LocalizedText;
  tags?: string[];
  image?: string;
  coverGallery?: string[];
  gallery?: string[];
  imageGroups?: {
    slug: string;
    title: LocalizedText;
    layout: "grid" | "masonry";
    images: string[];
  }[];
  galleryLayout?: "grid" | "single";
  tallGalleryImages?: string[];
  playableUrl?: string;
  characterAnimation?: string;
  characterDesignImages?: string[];
  characterProfiles?: {
    name: LocalizedText;
    image: string;
    body: LocalizedText;
  }[];
  links?: {
    label: LocalizedText;
    url: string;
    year?: string;
    tools?: string[];
    pending?: boolean;
  }[];
  sections?: {
    title: LocalizedText;
    body: LocalizedText;
  }[];
  displayOrder?: number;
  featured?: boolean;
};

export const categoryTabs: {
  id: PortfolioCategory;
  label: LocalizedText;
  note: LocalizedText;
}[] = [
  {
    id: "games",
    label: { zh: "游戏", en: "Games" },
    note: {
      zh: "核心板块，按项目浏览。",
      en: "Core works, organized by project.",
    },
  },
  {
    id: "texts",
    label: { zh: "文本", en: "Writing" },
    note: {
      zh: "每篇以标题、tag、summary 呈现。",
      en: "Each piece appears with a title, tags, and summary.",
    },
  },
  {
    id: "audiovisual",
    label: { zh: "影视", en: "Film" },
    note: {
      zh: "动画、实拍、分镜与演出节奏。",
      en: "Animation, live action, storyboard, and staging rhythm.",
    },
  },
  {
    id: "uiux",
    label: { zh: "UI/UX", en: "UI/UX" },
    note: {
      zh: "界面、流程、交互演示与设计链接。",
      en: "Interfaces, flows, demos, and design links.",
    },
  },
];

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "vagus",
    category: "games",
    title: { zh: "Vagus - 迷走", en: "Vagus" },
    summary: {
      zh: "3D 动作 AVG 独立开发项目。核心是潜入思维、修改认知、化解冲突与转移注意的玩法叙事。",
      en: "A solo-developed 3D action AVG about entering minds, shifting cognition, resolving conflict, and redirecting attention.",
    },
    year: "2025",
    tools: ["Unreal Engine"],
    role: {
      zh: "独立开发、关卡设计、角色设计、文案设计",
      en: "Solo development, level design, character design, writing",
    },
    image: "/assets/works/slide-03/10-image14.png",
    displayOrder: 2,
    gallery: [
      "/assets/works/slide-03/10-image14.png",
      "/assets/works/slide-03/11-image15.png",
      "/assets/works/slide-03/12-image16.png",
      "/assets/works/slide-04/04-image17.png",
    ],
    featured: true,
    links: [
      {
        label: { zh: "查看游戏文本", en: "Read game writing" },
        url: "/texts/text-03",
      },
      {
        label: { zh: "游玩演示", en: "Gameplay demo" },
        url: "https://www.bilibili.com/video/BV1vWVazPEWX/",
      },
    ],
    sections: [
      {
        title: { zh: "设计理念", en: "Design Concept" },
        body: {
          zh: "潜入思维，修改认知，化解冲突，转移注意。深入他人的大脑，改变角色的现实。",
          en: "Enter another mind, alter cognition, resolve conflict, and redirect attention. The player changes a character's reality from within.",
        },
      },
      {
        title: { zh: "迁移备注", en: "Migration Notes" },
        body: {
          zh: "第二步需要补充实机截图源图、角色设计原文与完整项目说明。",
          en: "Next step: replace PDF previews with source screenshots, character notes, and the full project write-up.",
        },
      },
    ],
  },
  {
    slug: "mask-of-jade",
    category: "games",
    title: { zh: "Mask of Jade", en: "Mask of Jade" },
    summary: {
      zh: "Global Game Jam HK 2026 获奖项目。使用手机陀螺仪控制光照，破除黑暗的“遮罩”。",
      en: "An award-winning Global Game Jam HK 2026 project using phone gyroscope-controlled light to break through a mask of darkness.",
    },
    year: "2026",
    tools: ["Unity"],
    role: {
      zh: "游戏策划、关卡设计、音效设计",
      en: "Game design, level design, sound design",
    },
    image: "/assets/works/slide-07/09-image73.png",
    displayOrder: 1,
    gallery: [
      "/assets/works/slide-07/05-image69.png",
      "/assets/works/slide-07/06-image70.png",
      "/assets/works/slide-07/07-image71.png",
      "/assets/works/slide-07/08-image72.png",
      "/assets/works/slide-07/09-image73.png",
    ],
    featured: true,
    links: [
      {
        label: { zh: "游玩演示", en: "Gameplay demo" },
        url: "https://www.bilibili.com/video/BV1X7gN6aEpx/",
      },
    ],
    sections: [
      {
        title: { zh: "奖项与主题", en: "Awards And Theme" },
        body: {
          zh: "荣获 Global Game Jam HK 2026 “最佳设备友好设计奖”与“观众选择奖”。主题为 Mask，叙事取材于三星堆、青铜大面具与巴蜀文化。",
          en: "Won Best Device-Friendly Design and Audience Choice at Global Game Jam HK 2026. The theme was Mask, with narrative references to Sanxingdui, bronze masks, and Ba-Shu culture.",
        },
      },
    ],
  },
  {
    slug: "escape-error",
    category: "games",
    title: { zh: "Escape Error", en: "Escape Error" },
    summary: {
      zh: "3D 恐怖游戏独立开发项目，包含关卡设计与游玩测试。",
      en: "A solo-developed 3D horror game project focused on level design and playtesting.",
    },
    year: "2025",
    tools: ["Unreal Engine"],
    image: "/assets/works/slide-05/08-image25.png",
    displayOrder: 3,
    gallery: [
      "/assets/works/slide-05/04-image21.png",
      "/assets/works/slide-05/05-image22.png",
      "/assets/works/slide-05/06-image23.png",
      "/assets/works/slide-05/03-image20.png",
      "/assets/works/slide-05/08-image25.png",
      "/assets/works/slide-05/10-image27.png",
      "/assets/works/slide-05/11-image28.png",
    ],
    role: {
      zh: "独立开发、关卡设计、游玩测试",
      en: "Solo development, level design, playtesting",
    },
    links: [
      {
        label: { zh: "游玩演示", en: "Gameplay demo" },
        url: "https://www.bilibili.com/video/BV1rEbh6aETq/",
      },
    ],
  },
  {
    slug: "ballot-battleground",
    category: "games",
    title: {
      zh: "Ballot Battleground",
      en: "Ballot Battleground",
    },
    summary: {
      zh: "非对称性对抗竞技类游戏设计。一套完整英文游戏设计文档，包含核心玩法、流程、声望机制、关系网络协同与角色设计。",
      en: "Asymmetric competitive game design. A complete English game design document covering core gameplay, game flow, reputation systems, relationship network synergy, and character design.",
    },
    year: "2025",
    image: "/assets/works/ballot-battleground/04-image85.png",
    displayOrder: 8,
    gallery: [
      "/assets/works/ballot-battleground/04-image85.png",
      "/assets/works/ballot-battleground/05-image86.png",
      "/assets/works/ballot-battleground/12-image93.png",
      "/assets/works/ballot-battleground/13-image94.png",
      "/assets/works/ballot-battleground/16-image97.png",
      "/assets/works/ballot-battleground/14-image95.png",
      "/assets/works/ballot-battleground/15-image96.png",
      "/assets/works/ballot-battleground/17-image98.png",
      "/assets/works/ballot-battleground/18-image99.png",
      "/assets/works/ballot-battleground/21-image102.png",
      "/assets/works/ballot-battleground/22-image103.png",
      "/assets/works/ballot-battleground/20-image101.png",
      "/assets/works/ballot-battleground/08-image89.png",
      "/assets/works/ballot-battleground/11-image92.png",
      "/assets/works/ballot-battleground/23-image104.png",
      "/assets/works/ballot-battleground/19-image100.png",
      "/assets/works/ballot-battleground/06-image87.png",
      "/assets/works/ballot-battleground/10-image91.png",
      "/assets/works/ballot-battleground/07-image88.png",
      "/assets/works/ballot-battleground/09-image90.png",
    ],
    role: {
      zh: "系统设计、规则设计、角色与流程设计",
      en: "System design, rule design, character and flow design",
    },
  },
  {
    slug: "board-game",
    category: "games",
    title: { zh: "桌游设计", en: "Board Game Design" },
    summary: {
      zh: "团队合作完成的记忆类卡牌桌游，以翻卡牌凑对为基础，融合角色扮演、身份推测、社交合作与对抗，并在多轮测试中调整阵营与角色强度。",
      en: "A collaborative memory-card tabletop project based on flipping and matching cards, integrating role-play, identity deduction, social cooperation, conflict, and repeated balance testing.",
    },
    year: "2025",
    displayOrder: 7,
    image: "/assets/works/board-game/game-overview.png",
    gallery: [
      "/assets/works/slide-09/04-image79.png",
      "/assets/works/slide-09/05-image80.png",
      "/assets/works/slide-09/06-image81.png",
    ],
    links: [
      {
        label: { zh: "介绍视频", en: "Intro video" },
        url: "https://www.bilibili.com/video/BV16wgN6kEa8/",
      },
    ],
    sections: [
      {
        title: { zh: "项目说明", en: "Project Overview" },
        body: {
          zh: "团队合作，设计了一款基于翻卡牌凑对的记忆类卡牌桌游，同时融合了角色扮演、身份推测、社交、合作与对抗、西方古代神话叙事等诸多元素。在多次高强度的游戏测试下平衡各方强度，设计出新奇有趣、可多次重复游玩的桌游项目。",
          en: "A collaborative tabletop card game based on memory, flipping cards, and matching pairs. The project combines role-play, identity deduction, social interaction, cooperation and conflict, and Western ancient mythological narrative elements. Through repeated intensive playtests, the team balanced each side's strength and shaped the game into a replayable tabletop project with a fresh structure.",
        },
      },
    ],
  },
  {
    slug: "mega-man-maker-level",
    category: "games",
    title: { zh: "2D平台跳跃关卡设计", en: "2D Platformer Level Design" },
    summary: {
      zh: "使用 Mega Man Maker 制作的 2D 平台跳跃关卡设计。",
      en: "A 2D platformer level design made with Mega Man Maker.",
    },
    year: "2025",
    tools: ["Mega Man Maker"],
    role: { zh: "关卡设计", en: "Level design" },
    image: "/assets/works/slide-08/04-image74.png",
    displayOrder: 4,
    gallery: [
      "/assets/works/slide-08/04-image74.png",
      "/assets/works/slide-08/05-image75.png",
    ],
    galleryLayout: "single",
    links: [
      {
        label: { zh: "游玩演示", en: "Gameplay demo" },
        url: "https://www.bilibili.com/video/BV1rcgN65Ekq/",
      },
    ],
  },
  {
    slug: "pixel-text-avg",
    category: "games",
    title: { zh: "弹丸论破同人游戏", en: "Danganronpa Fan Game" },
    summary: {
      zh: "撰写了近10万字的叙事内容，复刻类似弹丸论破的日式二次元风格对话，制作了像素艺术肖像和角色动画，配以角色印象曲，并同时负责场景构建，使用UE5蓝图编程落地。最终创建出通过多样化的场景与分支对话设计，构建具有高度沉浸感的推理解谜体验。",
      en: "A Danganronpa-inspired fan game with nearly 100,000 Chinese characters of narrative writing, Japanese anime-style dialogue, pixel portraits, character animations, character theme music, scene construction, and UE5 Blueprint implementation. The project builds an immersive mystery-solving experience through varied scenes and branching conversations.",
    },
    year: "2025",
    tools: ["Unreal Engine"],
    displayOrder: 6,
    gallery: [
      "/assets/works/slide-06/04-image32.png",
      "/assets/works/slide-06/05-image33.png",
      "/assets/works/slide-06/08-image36.png",
      "/assets/works/slide-06/09-image37.png",
      "/assets/works/slide-06/06-image34.png",
      "/assets/works/slide-06/07-image35.png",
    ],
    tallGalleryImages: [
      "/assets/works/slide-06/06-image34.png",
      "/assets/works/slide-06/07-image35.png",
    ],
    role: {
      zh: "独立开发、角色设计、地图设计、道具设计",
      en: "Solo development, character design, map design, prop design",
    },
    links: [
      {
        label: { zh: "角色介绍剧情", en: "Character introduction writing" },
        url: "/texts/text-01",
      },
      {
        label: { zh: "班级审判环节", en: "Class trial writing" },
        url: "/texts/text-02",
      },
    ],
    characterAnimation: "/assets/works/slide-06/12-image40.gif",
    characterDesignImages: [
      "/assets/works/slide-06/13-image41.png",
      "/assets/works/slide-06/14-image42.png",
      "/assets/works/slide-06/15-image43.png",
      "/assets/works/slide-06/16-image44.png",
      "/assets/works/slide-06/17-image45.png",
      "/assets/works/slide-06/18-image46.png",
      "/assets/works/slide-06/19-image47.png",
      "/assets/works/slide-06/20-image48.png",
      "/assets/works/slide-06/21-image49.png",
      "/assets/works/slide-06/22-image50.png",
      "/assets/works/slide-06/23-image51.png",
      "/assets/works/slide-06/24-image52.png",
      "/assets/works/slide-06/25-image53.png",
      "/assets/works/slide-06/26-image54.png",
      "/assets/works/slide-06/27-image55.png",
      "/assets/works/slide-06/28-image56.png",
    ],
  },
  {
    slug: "twine-text-game",
    category: "games",
    displayOrder: 5,
    title: {
      zh: "世界锅——锅包肉拯救世界计划",
      en: "World Pot: Guo Bao Rou Saves The World",
    },
    summary: {
      zh: "Twine 文字模拟经营游戏。玩家扮演回归鹤岗老城区的大厂下岗中年男子崔志强，经营锅包肉品牌“世界锅”，在直播销售、街区探索与固定事件中积累收入、经营员工关系，并走向不同结局。",
      en: "A Twine-based text management game about a laid-off middle-aged tech worker returning to Hegang to build a guo bao rou brand through livestream sales, neighborhood exploration, staff relationships, and branching endings.",
    },
    year: "2026",
    tools: ["Twine"],
    role: {
      zh: "互动叙事、系统设计、角色设计、文案设计",
      en: "Interactive narrative, system design, character design, writing",
    },
    image: "/assets/works/world-pot/cover.jpg",
    playableUrl: "/games/world-pot/index.html",
    links: [
      {
        label: { zh: "查看文本节选", en: "Read writing excerpt" },
        url: "/texts/text-21",
      },
    ],
    sections: [
      {
        title: { zh: "项目机制", en: "Core Loop" },
        body: {
          zh: "游戏总流程为 6 个游戏日，每天分为直播销售、自由探索和固定事件三个阶段。直播销售阶段处理随机直播事件，在热度、收入、舆论风险和员工状态之间做选择；自由探索阶段通过街区探索、偷听八卦和邻居对话提前获得情报；固定事件阶段直面角色冲突与经营危机。",
          en: "The game spans 6 in-game days. Each day is divided into livestream sales, free exploration, and fixed story events. Choices affect income, public response, staff condition, relationship values, and later branches.",
        },
      },
      {
        title: { zh: "结局与变量", en: "Variables And Endings" },
        body: {
          zh: "每个事件会影响收入、李焱好感和安德烈好感三个关键变量。最终结局由经营成果与员工关系共同决定，包含 8 个常规结局、2 个特殊结局和 1 个彩蛋结局。",
          en: "Events affect three key variables: income, Li Yan affinity, and Andrei affinity. Endings are determined by business results and staff relationships, including 8 regular endings, 2 special endings, and 1 hidden ending.",
        },
      },
      {
        title: { zh: "角色设计", en: "Character Design" },
        body: {
          zh: "三位主要角色围绕世界锅的直播经营、失败者返乡、盲目崇拜与扭曲关系展开。",
          en: "Cui Zhiqiang is the village's first college student and a laid-off tech worker trying to prove his value through an old-school guo bao rou brand. Li Yan drives livestream chaos and emotional momentum, while Andrei adds cross-cultural comedy and staff relationship tension.",
        },
      },
    ],
    characterProfiles: [
      {
        name: { zh: "崔志强", en: "Cui Zhiqiang" },
        image: "/assets/works/world-pot/04-image21.png",
        body: {
          zh: "村里第一个大学生，也是互联网大厂下岗员工，兼任受尽现代社会折磨后愤而归乡的失败者。设计灵感来自“家是本”，他试图用弘扬老牌锅包肉的方式证明自己的价值，和没有被人发现的卓越商业头脑。",
          en: "The village's first college student and a laid-off tech worker trying to prove his value through an old-school guo bao rou brand.",
        },
      },
      {
        name: { zh: "李焱", en: "Li Yan" },
        image: "/assets/works/world-pot/05-image22.jpeg",
        body: {
          zh: "爱抽烟喝酒纹身染头和给女人当狗的本地混混，在世界锅里当厨师。为人呆傻，在崔志强的升学宴上，因其一句套话而无法压抑对崔志强的盲目崇拜，发誓你干啥我干啥。",
          en: "A streetwise troublemaker who drives livestream chaos and emotional momentum.",
        },
      },
      {
        name: { zh: "安德烈", en: "Andrei" },
        image: "/assets/works/world-pot/06-image23.png",
        body: {
          zh: "俄罗斯逃兵，因语言隔阂而阴郁寡言。虽然不被重视、生存堪忧，但只要能在直播间里当吉祥物，算不算被需要，是否就能从扭曲的关系里获得生存的可能性？",
          en: "A Russian character who supports the project's absurd humor, cross-cultural jokes, and staff relationship tension.",
        },
      },
    ],
  },
  {
    slug: "moving-image",
    category: "audiovisual",
    title: { zh: "影视作品合集", en: "Film Works" },
    summary: {
      zh: "梦核/怪核风格 3D 动画分镜、实拍创意媒体作业与动画团队项目。",
      en: "Dreamcore/weirdcore 3D animation storyboard, live-action creative media work, and team animation coursework.",
    },
    year: "2025-2026",
    gallery: [
      "/assets/works/slide-11/04-image105.png",
      "/assets/works/slide-11/05-image106.png",
      "/assets/works/slide-11/06-image107.png",
    ],
    links: [
      {
        label: { zh: "创意媒体工作室结课作业", en: "Creative media studio final project" },
        url: "https://www.bilibili.com/video/BV12XLEz9Eez/",
      },
      {
        label: { zh: "梦核/怪核风格3D动画", en: "Dreamcore/weirdcore 3D animation" },
        url: "https://www.bilibili.com/video/BV1X7gN6aEZf/",
        year: "2026",
        tools: ["Maya", "DaVinci Resolve"],
      },
      {
        label: { zh: "动画课小组作业", en: "Animation group project" },
        url: "https://www.bilibili.com/video/BV16wgN6kE6x/",
      },
    ],
  },
  {
    slug: "visual-sets",
    category: "images",
    title: { zh: "MEME", en: "MEME" },
    summary: {
      zh: "迷因与图像表达实验。",
      en: "Memes and image-expression experiments.",
    },
    imageGroups: [
      {
        slug: "meme",
        title: { zh: "MEME", en: "MEME" },
        layout: "masonry",
        images: [
          "/assets/works/slide-14/03-image123.jpeg",
          "/assets/works/slide-14/04-image124.jpeg",
          "/assets/works/slide-14/05-image125.jpeg",
          "/assets/works/slide-14/06-image126.png",
          "/assets/works/slide-14/07-image127.jpeg",
          "/assets/works/slide-14/08-image128.jpeg",
          "/assets/works/slide-14/09-image129.png",
          "/assets/works/slide-14/10-image130.jpeg",
          "/assets/works/slide-14/11-image131.jpeg",
          "/assets/works/slide-14/12-image132.jpeg",
          "/assets/works/slide-14/13-image133.jpeg",
          "/assets/works/slide-14/14-image134.png",
          "/assets/works/slide-14/15-image135.jpeg",
          "/assets/works/slide-14/16-image136.jpeg",
        ],
      },
    ],
  },
  {
    slug: "jouissance-uiux",
    category: "uiux",
    title: { zh: "Jouissance", en: "Jouissance" },
    summary: {
      zh: "面向亚文化群体的手机 app，集交流、活动场地推广、票务、购物于一身。",
      en: "A mobile app for subculture communities, combining social interaction, venue and event promotion, ticketing, and shopping.",
    },
    year: "2025",
    tools: ["Figma"],
    image: "/assets/works/slide-12/04-image108.png",
    links: [
      {
        label: { zh: "交互演示", en: "Interactive demo" },
        url: "https://youtu.be/vZ5aiWFaKKs",
      },
      {
        label: { zh: "Figma 原型", en: "Figma prototype" },
        url: "https://www.figma.com/proto/L3bl5zGYCirRl3CSUMsfUd/Jouissance?node-id=81-587&p=f&t=wTFv2dVtyHApU2qW-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=81%3A587&show-proto-sidebar=1",
      },
      {
        label: { zh: "Slides", en: "Slides" },
        url: "https://drive.google.com/file/d/1pKq0E2aZ-aYQrUt58VOIoRr7Mwg8jVRo/view?usp=sharing",
      },
    ],
    gallery: [
      "/assets/works/slide-12/04-image108.png",
      "/assets/works/slide-12/06-image110.png",
      "/assets/works/slide-12/07-image111.png",
      "/assets/works/slide-12/08-image112.png",
      "/assets/works/slide-12/05-image109.png",
    ],
  },
  {
    slug: "band-sound-sketches",
    category: "sound",
    title: { zh: "声音与音乐小创作", en: "Sound And Music Sketches" },
    summary: {
      zh: "乐队成员身份下的小创作与音乐外链。该板块保持轻量。",
      en: "Small music works and links from band-related practice. This section stays lightweight.",
    },
  },
];

export function t(text: LocalizedText, locale: Locale) {
  return text[locale];
}

export function findItem(slug: string) {
  return portfolioItems.find((item) => item.slug === slug);
}
