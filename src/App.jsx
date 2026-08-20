import {
  ArrowUp,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Leaf,
  Mail,
  Map,
  Maximize2,
  MessageCircle,
  Pause,
  Play,
  RotateCw,
  Search,
  SkipBack,
  SkipForward,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import DraggableProjectGrid from './DraggableProjectGrid';
import ExperienceUmbrella from './ExperienceUmbrella';

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;
const chapterNavigateEvent = 'portfolio:chapter-navigate';

const navItems = [
  { label: '首页', href: '#home' },
  { label: '关于', href: '#about' },
  { label: '经历', href: '#projects' },
  { label: '优势', href: '#strengths' },
  { label: '联系', href: '#contact' },
];

const pdfImage = (file, label) => ({
  src: assetUrl(`media/pdf-images/${file}`),
  label,
});

const projectImages = {
  brand: [
    pdfImage('full_p05_i01_Im474.jpg', '公众号推文与内容封面'),
    pdfImage('full_p05_i02_Im476.jpg', '小红书内容截图'),
    pdfImage('full_p05_i03_Im478.jpg', '百度百科词条页面'),
    pdfImage('full_p05_i04_Im480.jpg', '评论互动截图'),
    pdfImage('full_p06_i01_Im534.jpg', '活动与品牌页面'),
    pdfImage('full_p06_i02_Im536.jpg', '产品种草笔记'),
    pdfImage('full_p06_i03_Im538.jpg', '内容数据表'),
    pdfImage('full_p06_i04_Im540.jpg', '售罄活动反馈'),
  ],
  seeding: [
    pdfImage('full_p07_i01_Im598.jpg', '达人数据与内容表现'),
    pdfImage('full_p07_i02_Im600.jpg', '达人内容案例'),
    pdfImage('full_p07_i03_Im602.jpg', '种草项目核心数据'),
    pdfImage('full_p07_i04_Im604.jpg', '高赞稿件示例'),
  ],
  education: [
    pdfImage('full_p08_i01_Im659.jpg', '教育类账号内容与咨询截图'),
    pdfImage('full_p08_i02_Im665.jpg', '矩阵账号与内容账号截图'),
  ],
  software: [
    pdfImage('full_p09_i01_Im714.jpg', 'B 端软件小红书内容截图'),
    pdfImage('full_p09_i02_Im716.jpg', '财务场景图文内容'),
    pdfImage('full_p09_i03_Im718.jpg', '用友品牌与项目说明'),
    pdfImage('full_p09_i04_Im720.jpg', '畅捷通账号与内容截图'),
  ],
  travel: [
    pdfImage('full_p10_i01_Im782.jpg', '去哪儿内容账号截图'),
    pdfImage('full_p10_i02_Im784.jpg', '旅游攻略封面与互动'),
    pdfImage('full_p10_i03_Im786.jpg', '旅游内容数据表'),
    pdfImage('full_p10_i04_Im788.jpg', '旅游内容数据补充'),
    pdfImage('related_p01_i03_X41.png', '旅游项目排名截图'),
  ],
  official: [
    pdfImage('full_p11_i01_Im856.jpg', '热点内容与官方账号案例'),
    pdfImage('full_p11_i02_Im858.jpg', '学而思官方账号截图'),
    pdfImage('full_p11_i03_Im860.jpg', '天眼查账号截图'),
    pdfImage('full_p11_i04_Im862.jpg', '天眼查内容数据截图'),
  ],
  personal: [
    pdfImage('full_p12_i05_Im918.jpg', '松子穿搭账号资料'),
    pdfImage('full_p12_i06_Im920.jpg', '松子文案馆账号资料'),
    pdfImage('full_p12_i07_Im922.jpg', '个人账号爆款内容截图'),
    pdfImage('full_p12_i08_Im924.jpg', '个人账号内容数据截图'),
    pdfImage('related_p07_i01_X89.png', '个人账号主页截图'),
    pdfImage('related_p07_i02_X90.png', '个人账号内容数据截图'),
  ],
  writing: [
    pdfImage('related_p03_i01_X59.png', '小说作品二维码页'),
    pdfImage('related_p03_i02_X60.png', '小说作品分享页'),
    pdfImage('related_p04_i01_X67.png', '公众号文章页面'),
    pdfImage('related_p04_i02_X68.png', '小红书旅游稿件截图'),
    pdfImage('related_p05_i01_X75.png', '公众号文章截图'),
    pdfImage('related_p05_i02_X76.png', '个人公众号主页'),
    pdfImage('related_p06_i01_X79.png', '公众号文章列表'),
    pdfImage('related_p06_i02_X80.png', '图文作品合集'),
  ],
};

const aiDesignExamples = [
  {
    src: assetUrl('media/ai-design/ai-mountain-story.jpeg'),
    label: '品牌角色山野叙事画面',
  },
  {
    src: assetUrl('media/ai-design/ai-pixel-bot.jpeg'),
    label: '小鹿家护肤 bot 视觉',
  },
  {
    src: assetUrl('media/ai-design/ai-christmas-display.jpeg'),
    label: '圣诞主题产品陈列',
  },
  {
    src: assetUrl('media/ai-design/ai-winter-campaign.jpeg'),
    label: '冬日品牌活动场景',
  },
];

const experience = [
  {
    time: '2025.09 - 2026.02',
    type: '正式工作',
    role: '自媒体运营',
    company: '深圳华大基因细胞科技有限公司',
    responsibility: '统筹公众号、小红书、短视频与 SEO 内容，参与品牌种草、节点传播和互动承接。',
    achievement: '完成 50+ 篇原创推文，短视频阅读 10W+，持续沉淀品牌内容资产。',
  },
  {
    time: '2024.12 - 2025.03',
    type: '实习',
    role: '小红书运营',
    company: '网易网络有限公司',
    responsibility: '从 0 到 1 搭建教育类小红书账号矩阵，持续测试标题、封面和正文结构，通过评论区与私信承接咨询。',
    achievement: '稳定产出每周 2–3 个爆款，累计承接 200+ 后台咨询，月留资 100+。',
  },
  {
    time: '2024.06 - 2024.09',
    type: '实习',
    role: '新媒体运营',
    company: '畅捷通信息技术股份有限公司',
    responsibility: '围绕中小企业财务场景策划 B 端内容，同步分发至小红书、抖音和快手，并跟进互动承接。',
    achievement: '累计完成 100+ 个选题内容，单篇曝光 1W+，月均沉淀 30+ 条线索。',
  },
  {
    time: '2023.02 - 2023.11',
    type: '线上兼职',
    role: '新媒体运营 / 小红书运营',
    company: '北京趣拿软件科技有限公司（去哪儿）',
    responsibility: '围绕酒店、机票和景点等出行场景撰写旅游攻略，优化标题、封面与 APP 引流路径。',
    achievement: '完成 63 篇攻略文章，累计获赞 1.2W，团队排名 TOP 3 并获银牌。',
  },
  {
    time: '阶段性项目',
    type: '实习',
    role: '热点内容运营',
    company: '北京金堤科技有限公司（天眼查）',
    responsibility: '负责微博热点策划与传播，并完成知乎选题、资料梳理和长文撰写。',
    achievement: '微博热点排名 TOP 1，知乎单篇阅读 10W+。',
  },
  {
    time: '阶段性项目',
    type: '内容供给',
    role: '官方账号内容运营',
    company: '北京世纪好未来教育科技有限公司（学而思）',
    responsibility: '收集并整理全国分校的本地化信息，形成可复用内容素材，支持官方账号持续发布。',
    achievement: '完成 37 个城市素材整理，相关官方账号内容曝光 100W+。',
  },
  {
    time: '阶段性项目',
    type: '实习',
    role: '游戏宣发写作',
    company: '小黑羊（天津）文化传媒有限公司',
    responsibility: '围绕手游卖点和玩家兴趣完成宣发选题、资料整合与稿件撰写。',
    achievement: '手游宣发稿全网阅读 80W+。',
  },
];

const projectCatalog = [
  {
    title: '不牛马厨房',
    subtitle: '餐食决策工具',
    tag: 'AI 辅助制作 / 交互设计 / Skill 创作 / 上线部署',
    image: assetUrl('media/ai-design/buniuma-kitchen-promo.webp'),
    gallery: [],
    aiProduct: {
      skill: 'Hatch Wheel Pet',
      title: '把“今晚吃什么”，做成轻松好用的餐食决策工具。',
      text: '我借助 AI 完成产品构思、页面视觉、转盘交互与上线部署，并制作转盘宠物 Skill。用户端不提供 AI 功能：用户无需浏览冗长菜单，可以先用转盘快速缩小选择，再结合口味与饮食偏好获得更贴近当下需求的菜品建议。',
      features: [
        '选择困难救星',
        '海量菜品',
        '多标签客制化推荐',
        '一键随机决策',
        '转盘宠物反馈',
        '在线即开即用',
      ],
      url: 'https://freebite.zhechun.space',
    },
    stats: [
      { value: '800', label: '道家常菜' },
      { value: '1', label: '个上线产品' },
      { value: '1', label: '套原创 Skill' },
    ],
    links: [
      { group: '不牛马厨房 · 在线体验', label: 'freebite.zhechun.space', url: 'https://freebite.zhechun.space' },
    ],
    summary:
      '面向“今晚吃什么”的高频选择难题，将 800 道家常菜、随机转盘、偏好筛选和宠物反馈整合为一套可直接访问的决策体验。',
    rationale: {
      motivation:
        '我做“不牛马厨房”，是想把过去用内容解释问题的能力再向前推进一步：直接做出一个帮助用户完成决策的工具。“今晚吃什么”看似是小问题，背后却是高频选择疲劳——菜单越多，人反而越难决定；完全随机虽然快，又可能忽略人数、口味和最近吃过什么。我的思路不是继续增加推荐内容，而是设计一条从缩小选择到确认行动的路径，让用户少想一步，但仍保留对结果的控制。',
      evidence:
        '产品先用转盘打断反复比较，再允许用户按用餐人数和地域口味筛选；抽中后继续提供热量、时长、辣度、食材和步骤，并用“加入清单”“今天做它”把结果推进到行动，同时尽量避开最近做过的 3 道菜。800 道菜不是为了展示数量，而是作为筛选与随机机制的内容底座；宠物反馈则让一次功能操作有即时的情绪回应。',
      capabilities: ['生活问题提炼', '信息架构组织', '决策路径设计', 'AI 协同实现', '可用体验落地'],
    },
  },
  {
    title: '品牌自媒体运营',
    subtitle: '小鹿系列护肤品',
    tag: '公众号 / 小红书 / 短视频 / SEO',
    image: projectImages.brand[0].src,
    gallery: projectImages.brand,
    aiDesign: {
      title: 'AI 辅助视觉设计',
      summary: '在华大基因项目中使用 AI 辅助视觉构思、场景生成与素材延展，再由我完成选图、品牌元素整合、版式调整和发布适配。',
      examples: aiDesignExamples,
    },
    stats: [
      { value: '50+', label: '原创推文' },
      { value: '10W+', label: '短视频阅读' },
      { value: '7000W+', label: '销售额突破' },
    ],
    links: [
      { group: '品牌小红书', label: '华大小鹿账号主页', url: 'https://xhslink.com/m/l38Tqj6Ryg' },
      { group: '品牌小红书', label: '精华护肤“三不要”', url: 'http://xhslink.com/o/9z92a13xVxV' },
      { group: '品牌小红书', label: '小鹿面膜在线听劝', url: 'http://xhslink.com/o/3dv6dK6O1W8' },
      { group: '品牌公众号', label: '科技赋能美妆产业', url: 'https://mp.weixin.qq.com/s/_U9ODkiQ2Dvp1zmeB7phFA' },
      { group: '品牌公众号', label: '泰国美妆品牌到访华大', url: 'https://mp.weixin.qq.com/s/RQj4rKMXcw1u5cz_7uPRrg' },
      { group: '品牌公众号', label: '一份特别的礼物', url: 'https://mp.weixin.qq.com/s/6axKJBPIT-kHNKZOH3-8RQ' },
      { group: '品牌公众号', label: '孔维老师推荐小鹿精华', url: 'https://mp.weixin.qq.com/s/0YF-7YE8VDJNblPazm3OjA' },
      { group: '品牌公众号', label: '限时秒杀活动', url: 'https://mp.weixin.qq.com/s/AEd5rUEHh9uoYTd0d2bUfw' },
      { group: '品牌公众号', label: '动态版式设计', url: 'https://d.xiumius.cn/stage/v5/6m17W/666480758?share_depth=1#/' },
      { group: '品牌视频号', label: '视频号主页', url: 'https://weixin.qq.com/sph/AB2RNeG0EL' },
      { group: '品牌抖音', label: '抖音主页', url: 'https://v.douyin.com/AZPLvB3ETxw/' },
      { group: '品牌抖音', label: '化妆品产业蓝图', url: 'https://v.douyin.com/GDQyvVG3Vmw/' },
      { group: '品牌抖音', label: '鹿茸护肤', url: 'https://v.douyin.com/uTgmPvJ4SBo/' },
    ],
    summary:
      '通过公众号、小红书和短视频共同放大品牌声量，结合电商节点、粉丝互动和百科词条搭建，完成从内容触达到信任承接的运营闭环。',
    rationale: {
      motivation:
        '我做品牌自媒体，不只是为了增加发布频次，而是想解决科技品牌最难的两个距离：专业技术与普通用户之间的认知距离，以及品牌机构与真实用户之间的情感距离。华大小鹿背后有鹿茸活性成分、人体功效测试等科研依据，但数据本身不会自动转化成信任；只讲成分，用户觉得难懂，只追热点，品牌又会失去专业性。因此，我希望让不同平台各自承担角色：公众号解释“为什么可信”，小红书回答“和我的生活有什么关系”，短视频与 IP 内容让品牌变得可感知、可记忆。',
      evidence:
        '在《“制妆强国”黄金时代已至》中，我把化妆品监管改革、新原料与银发需求，连接到品牌的鹿茸科研、胶原表达和 28 天人体功效数据，让宏观信息落到用户能理解的“信任理由”。小红书“苏暮雨三不接”则把专业卖点翻译成“三不要”；“8 岁小朋友 3D 打印小鹿”的故事又让我看到，IP 不只是装饰，也能为品牌留下人与人之间的情感记忆。',
      capabilities: ['专业信息翻译', '平台角色分工', '品牌语气控制', '内容信任构建', '专业与亲近感平衡'],
    },
  },
  {
    title: '小红书种草协同',
    subtitle: '达人内容铺量与复盘',
    tag: '博主筛选 / 稿件审核 / 第三方对接',
    image: projectImages.seeding[0].src,
    gallery: projectImages.seeding,
    stats: [
      { value: '84', label: '篇稿件' },
      { value: '200W+', label: '项目曝光' },
      { value: '3W+', label: '内容互动' },
    ],
    links: [
      { group: '小红书种草笔记', label: '西藏好物分享', url: 'http://xhslink.com/o/47lG6VB1cPN' },
      { group: '小红书种草笔记', label: 'i 人生活 Vlog', url: 'http://xhslink.com/o/66BUDQwQ3Ai' },
      { group: '小红书种草笔记', label: '垮脸修复', url: 'http://xhslink.com/o/1aY38N2uqf3' },
    ],
    summary:
      '对接第三方与达人资源，跟进发布节奏、内容方向和数据表现，复盘高赞内容共性，提升品牌在小红书场景里的可信度。',
    rationale: {
      motivation:
        '我参与种草协同，是因为品牌自述只能说明“我是谁”，却很难独立回答“为什么用户要相信”。第三方内容真正的价值也不只是借达人流量，而是把产品放进不同人的真实生活语境，替用户完成一次使用想象：它在什么情况下有用、适合什么样的人、为什么值得尝试。因此，我想验证的不是“发多少篇”，而是同一个产品进入哪些人群、场景和表达方式后，才能形成可信而不重复的传播。',
      evidence:
        '同一款精华，我跟进的内容没有套用同一个模板：“西藏好物分享”借高原干燥、日晒和出行便携建立使用必要性；“i 人 Vlog”把产品放进低压力的日常生活；“垮脸修复”则从明确困扰和期待状态切入。在复核 84 篇稿件时，我还发现“小鹿精华”与“华大小鹿精华”标签混用会分散搜索资产，因此推动后续合作统一标签。',
      capabilities: ['达人与场景匹配', '卖点多语境转译', '内容审核与节奏管理', '搜索资产统一', '数据复盘'],
    },
  },
  {
    title: '教育类小红书获客',
    subtitle: '内容带来咨询与留资',
    tag: '账号矩阵 / 爆款测试 / 线索沉淀',
    image: projectImages.education[0].src,
    gallery: projectImages.education,
    stats: [
      { value: '2-3', label: '个周爆款' },
      { value: '200+', label: '后台咨询' },
      { value: '100+', label: '月留资' },
    ],
    links: [
      { group: '硕硕妈和北大娃', label: '账号主页', url: 'https://xhslink.com/m/8V70KNogKFe' },
      { group: '硕硕妈和北大娃', label: '高一学习忠告', url: 'http://xhslink.com/o/3a0yYTtELCG' },
      { group: '硕硕妈和北大娃', label: '高考 600 分强度', url: 'http://xhslink.com/o/1JszppEczY7' },
      { group: '北京晨晨妈妈聊学习', label: '账号主页', url: 'https://xhslink.com/m/5WNPXRGaeis' },
      { group: '北京晨晨妈妈聊学习', label: '高三一月', url: 'http://xhslink.com/o/7tWXla157vh' },
      { group: '北京晨晨妈妈聊学习', label: '中考倒计时布局', url: 'http://xhslink.com/o/2vR7zihzioL' },
    ],
    summary:
      '快速搭建矩阵账号，持续测试笔记标题、封面和正文结构，通过评论区与私信承接咨询，推动自然流量转化为有效线索。',
    rationale: {
      motivation:
        '我做教育类小红书获客，是因为家长真正缺少的往往不是更多课程介绍，而是一个能够判断“孩子现在处于什么位置、接下来该做什么”的坐标。教育决策周期长、信任门槛高，泛泛制造焦虑只会带来短暂流量；真正能触发咨询的内容，要把模糊焦虑拆成具体问题：孩子在哪个年级、离关键节点还有多久、哪门学科在掉队、下一阶段该怎样安排。内容先帮助家长把问题说清楚，课程咨询才会成为自然的下一步。',
      evidence:
        '在项目既有的“陪读妈妈”账号人设下，我把内容做得高度阶段化：“不要让孩子毁了自己的高一”从第一次月考波动切入，再分别给出数学、英语、物理的动作；“高三那年的一月”把 507 分到 687 分的变化落到各学科安排；“中考倒计时 154 天”则直接用剩余时间组织学习布局。内容由人设入口、阶段痛点、可执行方案，再走向资料或私信承接。',
      capabilities: ['用户阶段分层', '账号矩阵测试', '内容漏斗设计', '评论私信承接', '线索交接与增长探索'],
    },
  },
  {
    title: 'B 端软件内容运营',
    subtitle: '从热点选题到有效线索',
    tag: '财务软件 / 场景化内容 / 多平台分发',
    image: projectImages.software[0].src,
    gallery: projectImages.software,
    stats: [
      { value: '100+', label: '选题内容' },
      { value: '1W+', label: '单篇曝光' },
      { value: '30+', label: '月均线索' },
    ],
    links: [
      { group: '畅捷通 · 小红书', label: '账号主页', url: 'https://xhslink.com/m/5Ye1Q1i5iOK' },
      { group: '畅捷通 · 小红书', label: '用友与金蝶对比', url: 'http://xhslink.com/o/5GNwYnYVj9G' },
      { group: '财务软件内容案例', label: '用友软件真实测评', url: 'http://xhslink.com/o/ASPr1PxjduP' },
    ],
    summary:
      '围绕中小企业财务场景策划小红书内容，并同步分发至抖音、快手等平台，通过高频互动沉淀潜在线索。',
    rationale: {
      motivation:
        '我做 B 端软件内容，是因为这类产品的传播障碍往往不是功能不够，而是产品参数离用户的工作问题太远。中小企业和财务人员不会为了理解软件而研究一整套产品语言，他们更关心：我的企业规模适不适合、能不能减少重复工作、成本是否可控、和其他软件相比该怎么选。B 端内容的意义，就是把复杂产品改写成决策依据，降低用户理解、比较和试错的风险。',
      evidence:
        '在导师已搭建好的“财务软件销售／财务人”账号方向下，我主要负责搜集、改写、发布和互动，并逐渐理解到：有效改写不是换一种说法，而是重新组织用户的判断顺序。“498 元的用友和 798 元的金蝶怎么选”用价格、功能、品牌与适用场景帮助比较；“用友软件 1.36 元一天”则把 498 元年费换算成日成本，让抽象价格变成可感知的经营支出。',
      capabilities: ['复杂产品通俗化', '比较型内容组织', '高频内容变体生产', '需求识别', '曝光与销售线索连接'],
    },
  },
  {
    title: '旅游攻略内容引流',
    subtitle: '从用户场景到 APP 转化',
    tag: '旅游攻略 / 标题封面优化 / 外部引流',
    image: projectImages.travel[1].src,
    gallery: projectImages.travel,
    stats: [
      { value: '63', label: '篇攻略文章' },
      { value: '1.2W', label: '内容点赞' },
      { value: 'TOP 3', label: '团队排名' },
    ],
    links: [],
    summary:
      '围绕酒店、机票、景点等出行决策场景撰写攻略，优化封面与标题，把优质内容导向去哪儿 APP 的服务链路。',
    rationale: {
      motivation:
        '我做旅游攻略引流，是因为旅行交易并不是从下单页开始，而是从“我适合去哪、几天怎么排、住哪里更合适”开始。用户搜索攻略时，实际上正在逐步降低一次旅行的不确定性。只有先帮他完成目的地、路线、预算和住宿判断，机票、酒店与景点服务才有机会自然进入后面的预订链路。因此，我想做的不是把用户生硬地推向 APP，而是让攻略本身先完成一部分决策服务，再把需求顺势连接到去哪儿的产品能力。',
      evidence:
        '成都住宿攻略没有笼统罗列酒店，而是拆成“学生党”和“情侣党”：前者突出 102 元、3 人入住和拍照空间，后者突出 148 元、2 人入住及度假配套，让用户先按同行关系和预算判断。其他内容也会围绕“四天三夜”“春日出游”“明星同款打卡”等不同意图，组织酒店、航班、景点与餐饮信息。',
      capabilities: ['搜索意图识别', '旅行人群与场景拆分', '信息筛选与路线组织', '标题封面优化', '内容与业务链路连接'],
    },
  },
  {
    title: '热点传播与官方账号',
    subtitle: '天眼查 / 学而思内容供给',
    tag: '微博热点 / 知乎长文 / 官方账号运营',
    image: projectImages.official[0].src,
    gallery: projectImages.official,
    stats: [
      { value: 'TOP 1', label: '微博热点' },
      { value: '10W+', label: '知乎阅读' },
      { value: '37', label: '城信息收集' },
    ],
    links: [
      { group: '学而思内容案例', label: '学而思账号主页', url: 'https://xhslink.com/m/9auCsdpWtJR' },
      { group: '学而思内容案例', label: '寒假暖冬旅行选题', url: 'http://xhslink.com/o/3w6oCwnDECH' },
      { group: '学而思内容案例', label: '亲子日历选购', url: 'http://xhslink.com/o/9wNmte9HbLI' },
      { group: '天眼查 · 微博', label: '账号主页', url: 'https://weibo.com/u/5690608944' },
      { group: '天眼查 · 微博', label: '58 岁高三教师热点', url: 'https://weibo.com/5690608944/5105270957278227' },
      { group: '天眼查 · 知乎', label: '六块钱也能开公司吗', url: 'https://www.zhihu.com/pin/1845885763750862849' },
      { group: '天眼查 · 知乎', label: '高三教师工伤认定', url: 'https://www.zhihu.com/question/5197691592/answer/42288031842' },
    ],
    summary:
      '在天眼查负责微博热点策划与传播、知乎选题和长文撰写；同时为学而思收集 37 个城市分校信息，整理可复用的本地化内容，支持官方账号与全国分部持续发布。',
    rationale: {
      motivation:
        '我做热点传播与官方账号，是因为官方账号如果只围绕品牌自说自话，就很难持续进入用户的注意力。真正有价值的官方内容，不是机械追热点，而是在公众正在讨论的问题中找到品牌有资格提供的信息：教育品牌可以帮助家长做生活与学习选择，商业信息平台则应补充企业背景、经营关系和事实依据。我的动机，是让品牌进入公共讨论时既有速度，也有自己的信息增量，而不是只借热搜标题获得短暂曝光。',
      evidence:
        '学而思“寒假暖冬旅行”把临近寒假的出行焦虑整理成 12 个目的地选择，“亲子日历选购”则围绕年龄、兴趣和使用方式提供判断；我还收集 37 个城市分校信息，整理成可复用的本地化素材。天眼查的高三教师热点中，微博先补充涉事学校的成立时间、业务范围和对外投资，知乎再展开学校背景与事件脉络，形成短平台追时效、长平台补信息的分工。',
      capabilities: ['热点价值判断', '事实核验', '品牌专业视角提取', '长短内容协同', '官方表达边界'],
    },
  },
  {
    title: '个人账号运营',
    subtitle: '持续验证内容网感',
    tag: '穿搭账号 / 文案账号 / 数据复盘',
    image: projectImages.personal[0].src,
    gallery: projectImages.personal,
    stats: [
      { value: '100W+', label: '穿搭 / 店铺分享累计曝光' },
      { value: '11.8W+', label: '文案账号累计赞藏' },
      { value: '20+', label: '穿搭 / 店铺分享千赞爆款' },
    ],
    links: [
      { group: '松子随意分享 · 穿搭', label: '账号主页', url: 'https://www.xiaohongshu.com/user/profile/649ba55a000000002b00b0e3?xhsshare=CopyLink&appuid=649ba55a000000002b00b0e3&apptime=1721651273' },
      { group: '松子随意分享 · 穿搭', label: '学生党平价店铺', url: 'https://www.xiaohongshu.com/discovery/item/65dd3445000000000b00e274?source=webshare&xhsshare=pc_web&xsec_token=ABpYgASdhgDiTztadTpUawu43DiYii9BXralmWwb5Gl-U=&xsec_source=pc_share' },
      { group: '松子随意分享 · 穿搭', label: '清仓店铺合集', url: 'https://www.xiaohongshu.com/discovery/item/67c9b3e200000000070376b3?source=webshare&xhsshare=pc_web&xsec_token=ABE8HYCgV0v8F9q7fIT4bvhiFMGuqpI-CmhWfF7QDjBus=&xsec_source=pc_share' },
      { group: '松子文案馆 · 文案', label: '严浩翔主题', url: 'https://www.xiaohongshu.com/discovery/item/664c6cda000000001401910a?source=webshare&xhsshare=pc_web&xsec_token=AB-bCr1EY8Px0cqKLu_dVPM9EwoO5TAiwRBCTcnuGT1Zw=&xsec_source=pc_share' },
      { group: '松子文案馆 · 文案', label: '黄子弘凡主题', url: 'https://www.xiaohongshu.com/discovery/item/65cf5320000000002d003ca2?source=webshare&xhsshare=pc_web&xsec_token=ABuAniIv42ZyCmANtShlyXFOw28FEP2te4O3sbzcEHQJA=&xsec_source=pc_share' },
    ],
    summary:
      '独立运营垂类内容账号，围绕选题、封面、文案和反馈不断测试，积累对平台情绪、视觉表达和内容转化的实感判断。',
    rationale: {
      motivation:
        '我做个人账号，是想拥有一个没有公司品牌、预算和成熟策略托底的实验场，验证自己的内容判断是否真的成立。资源有限反而迫使我回答更本质的问题：当我不露脸、没有专业拍摄条件时，用户为什么还要看我？我逐渐意识到，内容竞争力不一定来自精致制作，也可以来自更高的信息密度、更真实的筛选和更准确的情绪连接。因此，我用两个账号验证了两种内容价值：穿搭／店铺号帮助用户减少消费决策成本，文案号帮助用户表达身份和情绪。',
      evidence:
        '“学生党回购过的平价店铺”把起球、瑕疵和“需要看运气”等缺点也写出来，用不完美信息建立可信度；当普通合集表现回落后，我又测试“近期清仓、建议看见就去”的限时信息。文案号中，“黄子弘凡真爱粉挑战”把歌词整理成可参与、可验证身份的互动内容，“严浩翔主题”则围绕粉丝熟悉的表达形成收藏需求。',
      capabilities: ['资源约束下的形式选择', '信息型与情绪型选题', '标题封面测试', '用户反馈复盘', '跨平台与商业化验证'],
    },
  },
  {
    title: '内容写作与补充作品',
    subtitle: '公众号 / 小说 / 图文稿件',
    tag: '长文写作 / 校园公众号 / 旅游稿件 / 小说作品',
    image: projectImages.writing[0].src,
    gallery: projectImages.writing,
    stats: [
      { value: '3000+', label: '公众号阅读' },
      { value: '签约', label: '小说持续更新' },
      { value: '多类型', label: '图文稿件' },
    ],
    links: [
      { group: '校园公众号', label: '那就一起去看初雪吧', url: 'https://mp.weixin.qq.com/s/g_JFjtTwyirjRwP6e6tnvg' },
      { group: '校园公众号', label: '云边有个小卖部', url: 'https://mp.weixin.qq.com/s/RQhCHVCD2clUsfe_MJiEjA' },
      { group: '个人公众号', label: '希望我能成为快乐的大人', url: 'https://mp.weixin.qq.com/s/4910W0J9BgegjgP73d3bYQ' },
    ],
    summary:
      '补充展示公众号文章、校园媒体内容、旅游图文稿件和网络小说作品，体现更长线的文字表达与内容生产能力。',
    rationale: {
      motivation:
        '我持续写公众号、小说和诗歌，不是为了补充作品数量，而是因为运营的底层不只是抓注意力，还包括理解一个人为什么会被一句话击中，以及怎样把复杂感受组织成他人能够进入的叙事。短内容训练即时判断，长写作则迫使我处理结构、节奏、视角和情绪因果。它让我不只会把信息写得“能看”，也能把那些不容易说清楚的感受写得“被理解”。',
      evidence:
        '在个人公众号《细数失眠》中，《希望我能成为快乐的大人》用春、夏、秋、冬组织成长中的期待、自卑、焦虑和自我和解，让一句愿望变成一条有来处的情绪路径；校园公众号内容训练我在公共主题中寻找可共鸣的叙事入口。持续写小说与诗歌，又让我练习更长周期的人物、语言和情节控制。',
      capabilities: ['情绪洞察', '长文结构', '叙事节奏', '多文体切换', '私人感受的公共表达'],
    },
  },
];

const aiSkillProjects = [
  {
    title: 'Hatch Wheel Pet',
    subtitle: '转盘动态宠物制作 Skill',
    tag: '角色设计 / 四状态动画 / 资产校验 / 页面接入',
    image: assetUrl('assets/skill-wheel-pet-idle.webp'),
    gallery: [
      { src: assetUrl('assets/skill-wheel-pet-idle.webp'), label: '包仔小厨待机状态' },
      { src: assetUrl('assets/skill-wheel-pet-run-right.webp'), label: '包仔小厨向右奔跑状态' },
      { src: assetUrl('assets/skill-wheel-pet-run-left.webp'), label: '包仔小厨向左奔跑状态' },
      { src: assetUrl('assets/skill-wheel-pet-done.webp'), label: '包仔小厨完成反馈状态' },
    ],
    stats: [
      { value: '5', label: '套已接入宠物' },
      { value: '4', label: '种交互状态' },
      { value: '1', label: '套资产工作流' },
    ],
    links: [
      { group: '不牛马厨房 · 在线体验', label: '查看转盘宠物实际交互', url: 'https://freebite.zhechun.space' },
    ],
    summary:
      '把用户的角色设想转化为可直接接入网页的四状态动态宠物，让点菜工具不仅替用户完成选择，也通过角色反馈建立轻量的陪伴感。',
    rationale: {
      motivation:
        '在制作“不牛马厨房”时，我发现转盘解决的是“今天吃什么”的决策效率，但如果交互在菜品抽中后立刻结束，产品仍然只是一个用完即走的功能。真正能让用户愿意反复打开的，不只有功能结果，还包括过程中得到的情绪反馈和角色记忆。因此，我把宠物角色引入点菜流程：它在等待时保持待机，跟随转盘方向左右奔跑，并在抽中菜品后给出完成反馈。角色不再只是装饰，而成为用户操作状态的可视化回应。动态角色落地的难点也不是生成一张可爱的图，而是让同一角色在不同动作里保持一致，同时满足透明背景、画布尺寸、动作方向和网页小尺寸展示等要求。为了避免每增加一只宠物都重复沟通、裁切、校验和返工，我把角色确认、四状态制作、规格校验、打包安装和真实页面检查沉淀成一套 Skill。',
      evidence:
        '“不牛马厨房”目前已经接入草莓甜心小厨、奶茶小狗、慵懒小猫、Astr 和包仔小厨 5 套宠物。每套角色包含待机、向右奔跑、向左奔跑和完成反馈 4 种状态；拖动转盘时，宠物会根据交互方向切换动作，抽中菜品后进入完成状态。网站同时保留四状态图片的自定义上传入口，让角色系统既能提供预设，也能承接用户自己的宠物形象。这次实践验证了 Skill 不只负责出图，还能把情绪价值转化成可安装、可检查的产品资产。',
      capabilities: ['情绪价值产品化', '角色状态设计', '动态资产标准化', '质量校验', '前端交互接入'],
    },
    aiSkill: true,
  },
  {
    title: 'Prepare and Review Interviews',
    subtitle: '面试前后证据链 Skill',
    tag: '公司研究 / JD 拆解 / 证据匹配 / 面后复盘',
    image: assetUrl('assets/skill-interview-evidence-map.png'),
    gallery: [],
    stats: [
      { value: '面前+面后', label: '双阶段工作流' },
      { value: '4', label: '环证据链' },
      { value: '持续', label: '个人档案更新' },
    ],
    links: [],
    summary:
      '围绕“岗位要求、个人证据、面试表达、面后复盘”建立持续积累的证据链，让面试准备从通用题库变成基于真实经历的针对性判断与训练。',
    rationale: {
      motivation:
        '我在自己的求职过程中发现，很多面试准备看似搜集了大量资料，最后却没有真正回答三个问题：公司为什么需要这个岗位、我的哪些经历能够证明匹配、哪些能力缺口需要如实说明并提前补齐。公司资料、JD、简历和作品集往往被分开处理，最终得到的只是通用自我介绍和高频题库。面试后的信息也常常没有继续发挥价值，复盘停留在“这里没答好”或“当时有点紧张”，没有进一步判断面试官在验证什么、回答缺少哪段证据，以及问题暴露了怎样的能力缺口。因此，我把面试前后的工作放进同一个 Skill：先沉淀用户已经确认的履历与作品证据，再研究公司和岗位，把 JD 意图映射到可验证的个人案例；面试后继续结合录音、转写或笔记逐题分析，把失误改写成可练习的回答和下一步行动。',
      evidence:
        '在一次国内营销岗位的匿名化初面复盘中，Skill 没有把问题简单归因于“表达不够自信”，而是识别出更关键的能力分界：回答只罗列了公众号、小红书、抖音和达人等渠道，却没有说明活动目标、核心人群、产品卖点、阶段节奏、转化承接和衡量指标。这意味着候选人证明了内容执行经验，却还没有充分证明整合营销方案能力。基于这一判断，复盘把原回答重构为完整的大促方案框架，并同步生成 90 秒岗位化自我介绍、可复用的 STAR 案例、能力缺口和下一轮反问清单，让一次面试转化成下一次可以直接调用的证据和训练任务。',
      capabilities: ['用户信息建模', '资料检索与信源判断', 'JD 意图拆解', '个人证据匹配', '反馈闭环设计'],
    },
    aiSkill: true,
  },
  {
    title: 'Make Transparent Sticker',
    subtitle: '透明贴纸标准化 Skill',
    tag: '透明抠图 / 视觉规范 / 资产复用 / 输出质检',
    image: assetUrl('assets/person-guitar-sticker-v2.png'),
    gallery: [
      { src: assetUrl('assets/person-guitar-sticker-v2.png'), label: '人物弹唱透明贴纸' },
      { src: assetUrl('assets/cat-sticker-v2.png'), label: '橘白猫咪透明贴纸' },
      { src: assetUrl('assets/green-grape-soda-sticker.png'), label: '青提气泡饮透明贴纸' },
      { src: assetUrl('assets/mint-guitar-sticker.png'), label: '薄荷吉他透明贴纸' },
      { src: assetUrl('assets/guitar-sticker.png'), label: '吉他透明贴纸' },
    ],
    stats: [
      { value: '5', label: '类页面贴纸' },
      { value: '透明', label: 'PNG 资产' },
      { value: '1', label: '套制作规范' },
    ],
    links: [],
    summary:
      '把作品集里反复出现的抠图与贴纸制作需求转化为可复用的透明贴纸生产标准，在提高效率的同时保持页面资产的一致性。',
    rationale: {
      motivation:
        '在制作个人作品集时，我需要把猫咪、饮品、乐器和人物等不同来源的素材转化成尺寸接近、风格统一的贴纸。最初看起来只是重复抠图，但真正影响页面质感的远不止背景是否透明：主体在画布中的大小、四周留白、白色描边、阴影强度和边缘质量只要不一致，同一页面上的素材就会像来自不同系统；逐张手工调整又会占用大量时间，也很难保证每次都使用相同标准。我因此把自己对贴纸效果的判断从“凭感觉修图”转化为可复用的制作规则：保留原始对象的身份、材质和关键细节，统一透明背景、主体占比、留白、白色轮廓和轻阴影，并在输出后检查透明通道、边缘残留和实际页面效果。',
      evidence:
        '目前作品集中已经使用人物弹唱、猫咪、青提汽水和吉他等多类透明贴纸。它们的原始形态和比例差异较大，但经过同一套处理逻辑后，可以作为统一的视觉语言进入页面，在不遮挡核心信息的前提下补充个人感和场景感。后续新增素材时，也不再需要从零决定抠图、描边和阴影标准。这个案例验证了 Skill 的价值不只是少做几次抠图，而是把一次性的视觉劳动转化为稳定、可复用的资产生产流程。',
      capabilities: ['重复需求抽象', '视觉规范制定', '透明资产处理', '输出质量检查', '工作流封装'],
    },
    aiSkill: true,
  },
];

const projects = [...projectCatalog.slice(1), projectCatalog[0], ...aiSkillProjects];

const strengths = [
  {
    icon: <FileText aria-hidden="true" />,
    title: '内容策略梳理',
    text: '能把产品卖点拆成用户愿意点开、收藏和互动的选题，并根据平台语境调整表达方式。',
  },
  {
    icon: <MessageCircle aria-hidden="true" />,
    title: '互动与转化承接',
    text: '熟悉评论区、私信、活动榜单和抽奖机制，用轻量互动沉淀反馈、信任和线索。',
  },
  {
    icon: <Map aria-hidden="true" />,
    title: '多平台运营节奏',
    text: '覆盖公众号、小红书、视频号、抖音、微博、今日头条等内容场景，能保持稳定产出。',
  },
  {
    icon: <CheckCircle2 aria-hidden="true" />,
    title: '项目协同推进',
    text: '参与过达人筛选、稿件审核、第三方沟通、结案报告和复盘优化，能把执行链路推进到底。',
  },
  {
    icon: <Play aria-hidden="true" />,
    title: '基础视觉与剪辑',
    text: '熟悉 Canva、稿定设计、PS、醒图、剪映等工具，可完成基础海报、封面和短视频剪辑。',
  },
];

const profileDirections = [
  {
    label: '运营',
    title: '平台运营',
    text: '搭建内容排期、账号互动与数据复盘节奏，让日常运营稳定执行。',
  },
  {
    label: '策划',
    title: '内容策划',
    text: '从产品卖点和用户情绪出发，完成选题、标题、封面与内容结构设计。',
  },
  {
    label: '产品',
    title: '产品协同',
    text: '把用户需求、内容反馈和业务目标连接起来，协助形成可执行的产品表达。',
  },
];

const workflowSteps = [
  { number: '01', title: '内容判断', detail: '目标 · 用户 · 场景' },
  { number: '02', title: '选题策划', detail: '卖点 · 平台 · 切口' },
  { number: '03', title: '内容制作', detail: '文案 · 视觉 · 视频' },
  { number: '04', title: '发布运营', detail: '节奏 · 分发 · 协同' },
  { number: '05', title: '互动承接', detail: '评论 · 私信 · 线索' },
  { number: '06', title: '数据复盘', detail: '表现 · 问题 · 迭代' },
];

function getSectionFromHash() {
  const section = window.location.hash.slice(1);
  return navItems.some((item) => item.href === `#${section}`) ? section : 'home';
}

function usePageInteractions() {
  const [pageState, setPageState] = useState({
    activeSection: getSectionFromHash(),
    scrollProgress: 0,
    showBackToTop: false,
    transitionPhase: 'idle',
  });
  const transitionLockRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const updatePageState = () => {
      frameId = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setPageState((current) => ({
        ...current,
        scrollProgress: Math.min(1, Math.max(0, scrollTop / maxScroll)),
        showBackToTop: scrollTop > window.innerHeight * 0.72,
      }));
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updatePageState);
      }
    };

    updatePageState();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    root.style.scrollBehavior = previousBehavior;
  }, [pageState.activeSection]);

  useEffect(() => {
    const resetScrollInstantly = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousBehavior;
      });
    };

    const showSection = (activeSection) => {
      setPageState((current) => ({
        ...current,
        activeSection,
        scrollProgress: 0,
        showBackToTop: false,
        transitionPhase: 'direct',
      }));
      resetScrollInstantly();
    };

    const handleHashChange = () => {
      showSection(getSectionFromHash());
    };

    const handleChapterNavigate = (event) => {
      const href = event.detail?.href;
      const targetSection = href?.replace(/^#/, '');
      const projectIndex = Number.isInteger(event.detail?.projectIndex)
        ? event.detail.projectIndex
        : null;
      const isKnownSection = navItems.some((item) => item.href === href);
      if (!isKnownSection || transitionLockRef.current) return;

      if (targetSection === getSectionFromHash()) {
        if (projectIndex === null) return;
        window.history.pushState(
          { ...window.history.state, portfolioProject: projectIndex },
          '',
          href,
        );
        window.dispatchEvent(new PopStateEvent('popstate', { state: window.history.state }));
        return;
      }

      transitionLockRef.current = true;
      resetScrollInstantly();
      window.history.pushState(
        { ...window.history.state, portfolioProject: projectIndex ?? undefined },
        '',
        href,
      );
      flushSync(() => {
        setPageState((current) => ({
          ...current,
          activeSection: targetSection,
          scrollProgress: 0,
          showBackToTop: false,
          transitionPhase: 'chapter',
        }));
      });
      resetScrollInstantly();
      transitionLockRef.current = false;
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener(chapterNavigateEvent, handleChapterNavigate);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener(chapterNavigateEvent, handleChapterNavigate);
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (shouldReduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [pageState.activeSection]);

  return pageState;
}

function Header({ activeSection, scrollProgress }) {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setSearchOpen(false);
  }, [activeSection]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeSearch = () => setSearchOpen(false);

  return (
    <header className="site-header">
      <a className="brand-mark" href="#home" aria-label="回到首页">
        <Leaf aria-hidden="true" />
        <span>折椿</span>
      </a>
      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              className={isActive ? 'is-active' : undefined}
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <nav className="mobile-nav" aria-label="移动端导航">
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              className={isActive ? 'is-active' : undefined}
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
      <div className="header-actions">
        {activeSection === 'home' && (
          <PortfolioSearch className="header-search-form" inputId="header-project-search" />
        )}
        <a className="button button-primary" href="mailto:2436528353@qq.com">
          <Mail aria-hidden="true" />
          联系我
        </a>
        <button
          className="mobile-search-toggle"
          type="button"
          aria-label="搜索作品集项目"
          aria-expanded={searchOpen}
          onClick={() => setSearchOpen((value) => !value)}
        >
          <Search aria-hidden="true" />
        </button>
      </div>
      {searchOpen && (
        <div className="mobile-search-panel">
          <PortfolioSearch autoFocus onResultSelected={closeSearch} />
        </div>
      )}
      <span
        className="header-scroll-progress"
        style={{ '--scroll-ratio': scrollProgress }}
        aria-hidden="true"
      />
    </header>
  );
}

function PortfolioSearch({
  autoFocus = false,
  onResultSelected,
  className = '',
  inputId = 'mobile-project-search',
}) {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');
  const resultsId = `${inputId}-results`;
  const searchResults = normalizedQuery
    ? projects
      .map((project, index) => ({ project, index }))
      .filter(({ project }) => [
        project.title,
        project.subtitle,
        project.tag,
        project.summary,
        ...project.stats.flatMap((stat) => [stat.label, stat.value]),
      ].some((value) => value?.toLocaleLowerCase('zh-CN').includes(normalizedQuery)))
      .slice(0, 4)
    : [];

  const openSearchResult = (index) => {
    onResultSelected?.();
    window.dispatchEvent(new CustomEvent(chapterNavigateEvent, {
      detail: { href: '#projects', projectIndex: index },
    }));
  };

  return (
    <form
      className={`portfolio-search-form mobile-search-form ${normalizedQuery ? 'is-populated' : ''} ${className}`.trim()}
      role="search"
      aria-label="搜索作品集项目"
      onSubmit={(event) => {
        event.preventDefault();
        if (searchResults[0]) openSearchResult(searchResults[0].index);
      }}
    >
      <label className="portfolio-search-label mobile-search-label" htmlFor={inputId}>
        <Search aria-hidden="true" />
        <span className="sr-only">搜索作品集项目</span>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder="搜索项目关键词"
          autoFocus={autoFocus}
          autoComplete="off"
          aria-controls={resultsId}
          aria-expanded={Boolean(normalizedQuery)}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            setQuery('');
            event.currentTarget.blur();
          }}
        />
      </label>
      {normalizedQuery && (
        <div
          className="portfolio-search-results mobile-search-results"
          id={resultsId}
          aria-live="polite"
        >
          {searchResults.length > 0 ? searchResults.map(({ project, index }) => (
            <button type="button" onClick={() => openSearchResult(index)} key={project.title}>
              <span>{project.title}</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          )) : <p>暂未找到相关项目，试试“品牌”“小红书”或“AI”。</p>}
        </div>
      )}
    </form>
  );
}

function VinylMusicButton() {
  const [active, setActive] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playerOffset, setPlayerOffset] = useState({ x: 0, y: 0 });
  const [isPlayerDragging, setIsPlayerDragging] = useState(false);
  const contextRef = useRef(null);
  const vinylSourceRef = useRef(null);
  const masterGainRef = useRef(null);
  const chordTimerRef = useRef(null);
  const noteTimerRef = useRef(null);
  const chordIndexRef = useRef(0);
  const playerRef = useRef(null);
  const playerDragRef = useRef(null);

  const tracks = [
    {
      title: '森林雨幕',
      chords: [[220, 261.63, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [196, 233.08, 293.66]],
      notes: [523.25, 587.33, 659.25, 739.99, 659.25, 587.33],
      chordInterval: 4800,
      noteInterval: 2100,
      noiseGain: 0.008,
      lowpass: 1850,
      waveform: 'sine',
    },
    {
      title: '雾中回声',
      chords: [[174.61, 220, 293.66], [164.81, 207.65, 261.63], [146.83, 196, 246.94], [164.81, 220, 277.18]],
      notes: [392, 440, 493.88, 587.33, 493.88, 440],
      chordInterval: 5600,
      noteInterval: 2700,
      noiseGain: 0.0045,
      lowpass: 1420,
      waveform: 'triangle',
    },
    {
      title: '青苔月光',
      chords: [[146.83, 185, 220], [130.81, 174.61, 220], [164.81, 207.65, 246.94], [146.83, 196, 233.08]],
      notes: [659.25, 783.99, 880, 783.99, 698.46, 659.25],
      chordInterval: 5200,
      noteInterval: 2450,
      noiseGain: 0.0028,
      lowpass: 2200,
      waveform: 'sine',
    },
    {
      title: '溪谷来信',
      chords: [[196, 246.94, 329.63], [220, 277.18, 349.23], [174.61, 233.08, 293.66], [196, 261.63, 329.63]],
      notes: [587.33, 659.25, 783.99, 880, 783.99, 659.25],
      chordInterval: 4400,
      noteInterval: 1850,
      noiseGain: 0.0055,
      lowpass: 2600,
      waveform: 'triangle',
    },
  ];

  const playChord = (context, destination, track) => {
    const frequencies = track.chords[chordIndexRef.current % track.chords.length];
    const now = context.currentTime;
    chordIndexRef.current += 1;

    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = index === 1 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      oscillator.detune.setValueAtTime(index === 2 ? 4 : -3, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.026 / (index + 1), now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.6);
      oscillator.connect(gain);
      gain.connect(destination);
      oscillator.start(now);
      oscillator.stop(now + 5.8);
    });
  };

  const playVinylNote = (context, destination, track) => {
    const frequency = track.notes[Math.floor(Math.random() * track.notes.length)];
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    oscillator.type = track.waveform;
    oscillator.frequency.setValueAtTime(frequency, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    oscillator.start(now);
    oscillator.stop(now + 1.8);
  };

  const startVinylMusic = (context, track) => {
    const masterGain = context.createGain();
    const vinylGain = context.createGain();
    const lowpass = context.createBiquadFilter();
    const highpass = context.createBiquadFilter();
    const bufferLength = context.sampleRate * 4;
    const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
    const data = buffer.getChannelData(0);
    const source = context.createBufferSource();

    for (let index = 0; index < bufferLength; index += 1) {
      const slowPulse = 0.72 + Math.sin((index / context.sampleRate) * Math.PI * 0.34) * 0.12;
      data[index] = (Math.random() * 2 - 1) * slowPulse;
    }

    source.buffer = buffer;
    source.loop = true;
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(120, context.currentTime);
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(track.lowpass, context.currentTime);
    vinylGain.gain.setValueAtTime(track.noiseGain, context.currentTime);
    masterGain.gain.setValueAtTime(0.0001, context.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.9, context.currentTime + 0.8);

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(vinylGain);
    vinylGain.connect(masterGain);
    masterGain.connect(context.destination);
    source.start();

    vinylSourceRef.current = source;
    masterGainRef.current = masterGain;
    chordIndexRef.current = 0;
    playChord(context, masterGain, track);
    playVinylNote(context, masterGain, track);
    chordTimerRef.current = window.setInterval(() => playChord(context, masterGain, track), track.chordInterval);
    noteTimerRef.current = window.setInterval(() => playVinylNote(context, masterGain, track), track.noteInterval);
  };

  const stopMusic = (fadeDuration = 0.38) => {
    if (chordTimerRef.current) {
      window.clearInterval(chordTimerRef.current);
      chordTimerRef.current = null;
    }
    if (noteTimerRef.current) {
      window.clearInterval(noteTimerRef.current);
      noteTimerRef.current = null;
    }
    if (masterGainRef.current && contextRef.current) {
      const now = contextRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.setValueAtTime(masterGainRef.current.gain.value || 0.0001, now);
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + fadeDuration);
    }
    const source = vinylSourceRef.current;
    const masterGain = masterGainRef.current;
    vinylSourceRef.current = null;
    masterGainRef.current = null;
    window.setTimeout(() => {
      try {
        source?.stop();
      } catch {
        // Source may already be stopped if the component unmounts immediately.
      }
      source?.disconnect();
      masterGain?.disconnect();
    }, Math.ceil((fadeDuration + 0.04) * 1000));
  };

  const startTrack = async (index) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const context = contextRef.current || new AudioContext();
    contextRef.current = context;
    await context.resume();
    if (masterGainRef.current) stopMusic(0.14);
    startVinylMusic(context, tracks[index]);
    setTrackIndex(index);
    setActive(true);
  };

  const togglePlayback = async () => {
    if (active) {
      stopMusic();
      setActive(false);
      return;
    }
    await startTrack(trackIndex);
  };

  const changeTrack = async (direction) => {
    const nextIndex = (trackIndex + direction + tracks.length) % tracks.length;
    if (active) {
      await startTrack(nextIndex);
      return;
    }
    setTrackIndex(nextIndex);
  };

  const movePlayerWithinPoster = (deltaX, deltaY) => {
    const player = playerRef.current;
    const poster = player?.offsetParent;
    if (!player || !poster) return;

    const playerRect = player.getBoundingClientRect();
    const posterRect = poster.getBoundingClientRect();
    const boundedX = Math.min(Math.max(deltaX, posterRect.left - playerRect.left), posterRect.right - playerRect.right);
    const boundedY = Math.min(Math.max(deltaY, posterRect.top - playerRect.top), posterRect.bottom - playerRect.bottom);
    setPlayerOffset((current) => ({ x: current.x + boundedX, y: current.y + boundedY }));
  };

  const handlePlayerPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest('.turntable-controls')) return;
    const player = event.currentTarget;
    const poster = player.offsetParent;
    if (!poster) return;

    const playerRect = player.getBoundingClientRect();
    const posterRect = poster.getBoundingClientRect();
    playerDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: playerOffset,
      minX: posterRect.left - playerRect.left,
      maxX: posterRect.right - playerRect.right,
      minY: posterRect.top - playerRect.top,
      maxY: posterRect.bottom - playerRect.bottom,
    };
    player.setPointerCapture(event.pointerId);
    setIsPlayerDragging(true);
  };

  const handlePlayerPointerMove = (event) => {
    const drag = playerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = Math.min(Math.max(event.clientX - drag.startX, drag.minX), drag.maxX);
    const deltaY = Math.min(Math.max(event.clientY - drag.startY, drag.minY), drag.maxY);
    setPlayerOffset({ x: drag.startOffset.x + deltaX, y: drag.startOffset.y + deltaY });
  };

  const finishPlayerDrag = (event) => {
    if (playerDragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    playerDragRef.current = null;
    setIsPlayerDragging(false);
  };

  const handlePlayerKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    const directions = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault();
      setPlayerOffset({ x: 0, y: 0 });
      return;
    }
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 24 : 8;
    movePlayerWithinPoster(direction[0] * step, direction[1] * step);
  };

  useEffect(() => {
    return () => {
      window.clearInterval(chordTimerRef.current);
      window.clearInterval(noteTimerRef.current);
      try {
        vinylSourceRef.current?.stop();
      } catch {
        // Source may already be stopped by the toggle handler.
      }
      contextRef.current?.close();
    };
  }, []);

  return (
    <div
      ref={playerRef}
      className={`vinyl-switcher turntable-switcher${isPlayerDragging ? ' is-dragging' : ''}`}
      role="group"
      aria-label={`可移动唱片机，当前曲目${tracks[trackIndex].title}`}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
      tabIndex={0}
      title="拖动唱片机移动，双击或按 Home 复位"
      style={{ '--turntable-x': `${playerOffset.x}px`, '--turntable-y': `${playerOffset.y}px` }}
      onPointerDown={handlePlayerPointerDown}
      onPointerMove={handlePlayerPointerMove}
      onPointerUp={finishPlayerDrag}
      onPointerCancel={finishPlayerDrag}
      onDoubleClick={(event) => {
        if (event.target.closest('.turntable-controls')) return;
        setPlayerOffset({ x: 0, y: 0 });
      }}
      onKeyDown={handlePlayerKeyDown}
    >
      <div className={`turntable-player${active ? ' is-playing' : ''}`}>
        <div className="turntable-deck">
          <img
            className="turntable-shell"
            src={assetUrl('assets/turntable-player-sage-reference.png')}
            alt=""
            aria-hidden="true"
            decoding="async"
            draggable="false"
          />
          <span className="turntable-platter">
            <span className="turntable-record"><span className="turntable-record-label" /></span>
          </span>
          <span className="turntable-tonearm">
            <span className="turntable-tonearm-base" />
            <span className="turntable-tonearm-bar" />
            <span className="turntable-tonearm-head" />
          </span>
          <span className="turntable-power-light" />
          <div className="turntable-footer">
            <span className="turntable-track" aria-live="polite">
              <strong>{tracks[trackIndex].title}</strong>
              <small>{active ? '正在播放' : '准备播放'}</small>
            </span>
            <div className="turntable-controls" role="group" aria-label="音乐播放控制">
              <button type="button" aria-label="播放上一首" onClick={() => changeTrack(-1)}>
                <SkipBack aria-hidden="true" />
              </button>
              <button
                className="turntable-play-toggle"
                type="button"
                aria-label={active ? `暂停${tracks[trackIndex].title}` : `播放${tracks[trackIndex].title}`}
                aria-pressed={active}
                onClick={togglePlayback}
              >
                {active ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
              </button>
              <button type="button" aria-label="播放下一首" onClick={() => changeTrack(1)}>
                <SkipForward aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DraggableHeroElement({ as: Element = 'button', label, className = '', children }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const stickerRef = useRef(null);
  const dragRef = useRef(null);

  const moveWithinPoster = (deltaX, deltaY) => {
    const sticker = stickerRef.current;
    const poster = sticker?.offsetParent;
    if (!sticker || !poster) return;

    const stickerRect = sticker.getBoundingClientRect();
    const posterRect = poster.getBoundingClientRect();
    const boundedX = Math.min(Math.max(deltaX, posterRect.left - stickerRect.left), posterRect.right - stickerRect.right);
    const boundedY = Math.min(Math.max(deltaY, posterRect.top - stickerRect.top), posterRect.bottom - stickerRect.bottom);
    setOffset((current) => ({ x: current.x + boundedX, y: current.y + boundedY }));
  };

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    const sticker = event.currentTarget;
    const poster = sticker.offsetParent;
    if (!poster) return;

    const stickerRect = sticker.getBoundingClientRect();
    const posterRect = poster.getBoundingClientRect();
    const isRotateGesture = Boolean(event.target.closest('.sticker-rotate-handle')) || event.altKey;
    const pointerAngle = Math.atan2(
      event.clientY - (stickerRect.top + stickerRect.height / 2),
      event.clientX - (stickerRect.left + stickerRect.width / 2),
    ) * (180 / Math.PI);
    dragRef.current = {
      mode: isRotateGesture ? 'rotate' : 'move',
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offset,
      minX: posterRect.left - stickerRect.left,
      maxX: posterRect.right - stickerRect.right,
      minY: posterRect.top - stickerRect.top,
      maxY: posterRect.bottom - stickerRect.bottom,
      centerX: stickerRect.left + stickerRect.width / 2,
      centerY: stickerRect.top + stickerRect.height / 2,
      lastAngle: pointerAngle,
      rotation,
    };
    sticker.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setIsRotating(isRotateGesture);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.mode === 'rotate') {
      const pointerAngle = Math.atan2(event.clientY - drag.centerY, event.clientX - drag.centerX) * (180 / Math.PI);
      let angleDelta = pointerAngle - drag.lastAngle;
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;
      drag.rotation += angleDelta;
      drag.lastAngle = pointerAngle;
      setRotation(drag.rotation);
      return;
    }

    const deltaX = Math.min(Math.max(event.clientX - drag.startX, drag.minX), drag.maxX);
    const deltaY = Math.min(Math.max(event.clientY - drag.startY, drag.minY), drag.maxY);
    setOffset({ x: drag.startOffset.x + deltaX, y: drag.startOffset.y + deltaY });
  };

  const finishDrag = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsDragging(false);
    setIsRotating(false);
  };

  const handleKeyDown = (event) => {
    const directions = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (event.key === 'Home' || event.key === 'Escape') {
      event.preventDefault();
      setOffset({ x: 0, y: 0 });
      setRotation(0);
      return;
    }
    const rotationDirection = event.key === '[' || (event.altKey && event.key === 'ArrowLeft')
      ? -1
      : event.key === ']' || (event.altKey && event.key === 'ArrowRight')
        ? 1
        : 0;
    if (rotationDirection) {
      event.preventDefault();
      setRotation((current) => current + rotationDirection * (event.shiftKey ? 15 : 5));
      return;
    }
    const direction = directions[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 24 : 8;
    moveWithinPoster(direction[0] * step, direction[1] * step);
  };

  const isButton = Element === 'button';

  return (
    <Element
      ref={stickerRef}
      className={`hero-draggable ${className}${isDragging ? ' is-dragging' : ''}${isRotating ? ' is-rotating' : ''}`.trim()}
      type={isButton ? 'button' : undefined}
      tabIndex={isButton ? undefined : 0}
      aria-label={label}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Alt+ArrowLeft Alt+ArrowRight BracketLeft BracketRight Home"
      title="拖动主体移动，拖动旋转把手转动，双击或按 Home 复位"
      style={{
        '--sticker-x': `${offset.x}px`,
        '--sticker-y': `${offset.y}px`,
        '--sticker-user-rotation': `${rotation}deg`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onDoubleClick={() => {
        setOffset({ x: 0, y: 0 });
        setRotation(0);
      }}
      onKeyDown={handleKeyDown}
    >
      {children}
      <span className="sticker-rotate-handle" aria-hidden="true">
        <RotateCw />
      </span>
    </Element>
  );
}

function DraggableHeroSticker({ src, label, className = '' }) {
  return (
    <DraggableHeroElement className={`hero-sticker ${className}`} label={label}>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable="false"
      />
    </DraggableHeroElement>
  );
}

function DraggableGrapeSodaSticker() {
  const orbitLetters = 'ZHECHUNZHECHUN'.split('');

  return (
    <DraggableHeroElement
      as="div"
      className="hero-sticker hero-grape-soda-sticker"
      label="移动青提气泡饮与环绕字标"
    >
      <span className="grape-word-orbit is-back" aria-hidden="true">
        {orbitLetters.map((letter, index) => (
          <span
            className="grape-orbit-letter"
            key={`back-${letter}-${index}`}
            style={{
              '--orbit-letter-index': orbitLetters.length - 1 - index,
              '--orbit-static-distance': `${1 + index * 7.1}%`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
      <img
        src={assetUrl('assets/green-grape-soda-sticker.png')}
        alt=""
        aria-hidden="true"
        decoding="async"
        draggable="false"
      />
      <span className="grape-word-orbit is-front" aria-hidden="true">
        {orbitLetters.map((letter, index) => (
          <span
            className="grape-orbit-letter"
            key={`front-${letter}-${index}`}
            style={{
              '--orbit-letter-index': orbitLetters.length - 1 - index,
              '--orbit-static-distance': `${1 + index * 7.1}%`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
    </DraggableHeroElement>
  );
}

const phoneMessage = '用审美判断、内容组织和平台语感，完成从选题到传播反馈的运营表达。';

function HeroPhone() {
  const [phoneState, setPhoneState] = useState('idle');
  const [visibleMessage, setVisibleMessage] = useState('');
  const audioRef = useRef(null);
  const ringRequestRef = useRef(0);
  const typingTimerRef = useRef(null);

  const stopRinging = useCallback(() => {
    ringRequestRef.current += 1;
    const audio = audioRef.current;
    if (!audio) return;
    window.clearInterval(audio.intervalId);
    const now = audio.context.currentTime;
    audio.gain.gain.cancelScheduledValues(now);
    audio.gain.gain.setTargetAtTime(0, now, 0.018);
    window.setTimeout(() => {
      audio.oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already be stopped during view cleanup.
        }
      });
      audio.context.close();
    }, 90);
    audioRef.current = null;
  }, []);

  const startRinging = useCallback(async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const requestId = ringRequestRef.current + 1;
    ringRequestRef.current = requestId;
    const context = new AudioContext();
    await context.resume();
    if (requestId !== ringRequestRef.current) {
      context.close();
      return;
    }
    const masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);

    const oscillators = [440, 480].map((frequency) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(masterGain);
      oscillator.start();
      return oscillator;
    });

    const ring = () => {
      const start = context.currentTime;
      masterGain.gain.cancelScheduledValues(start);
      masterGain.gain.setValueAtTime(0, start);
      masterGain.gain.linearRampToValueAtTime(0.055, start + 0.025);
      masterGain.gain.setValueAtTime(0.055, start + 0.34);
      masterGain.gain.linearRampToValueAtTime(0, start + 0.39);
      masterGain.gain.setValueAtTime(0, start + 0.57);
      masterGain.gain.linearRampToValueAtTime(0.055, start + 0.595);
      masterGain.gain.setValueAtTime(0.055, start + 0.91);
      masterGain.gain.linearRampToValueAtTime(0, start + 0.96);
    };

    ring();
    const intervalId = window.setInterval(ring, 1780);
    audioRef.current = { context, gain: masterGain, intervalId, oscillators };
  }, []);

  useEffect(() => () => {
    window.clearInterval(typingTimerRef.current);
    stopRinging();
  }, [stopRinging]);

  const handlePhoneClick = () => {
    if (phoneState === 'idle') {
      setPhoneState('ringing');
      startRinging();
      return;
    }

    if (phoneState === 'ringing') {
      stopRinging();
      setPhoneState('answered');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        setVisibleMessage(phoneMessage);
        return;
      }

      let characterIndex = 0;
      typingTimerRef.current = window.setInterval(() => {
        characterIndex += 1;
        setVisibleMessage(phoneMessage.slice(0, characterIndex));
        if (characterIndex >= phoneMessage.length) {
          window.clearInterval(typingTimerRef.current);
        }
      }, 68);
    }
  };

  const actionLabel = phoneState === 'idle'
    ? '点击电话，让它响起来'
    : phoneState === 'ringing'
      ? '电话响铃中，再点击接听'
      : '电话已接听';

  return (
    <div className={`hero-phone-experience is-${phoneState}`}>
      <p className="hero-phone-message" aria-live="polite">
        {visibleMessage}
        {phoneState === 'answered' && visibleMessage.length < phoneMessage.length ? (
          <span className="hero-phone-caret" aria-hidden="true" />
        ) : null}
      </p>
      <button
        className="hero-phone-button"
        type="button"
        aria-label={actionLabel}
        aria-pressed={phoneState === 'answered'}
        onClick={handlePhoneClick}
      >
        <img
          src={assetUrl('assets/rotary-phone.png')}
          alt="薄荷蓝复古转盘电话"
          draggable="false"
        />
      </button>
      <p className="hero-phone-status" aria-live="polite">{actionLabel}</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="home" aria-label="首页">
      <div
        className="magazine-poster"
        aria-label="折椿新媒体运营作品集封面"
      >
        <div className="magazine-copy">
          <HeroPhone />
        </div>

        <div className="hero-intro" aria-label="作品集方向">
          <p className="hero-kicker">内容策划 / 账号运营 / 品牌表达</p>
          <p className="hero-subtitle">Editorial Content Portfolio</p>
        </div>

        <h1 className="sr-only">zhechun</h1>
        <DraggableHeroSticker
          className="hero-cat-sticker"
          src={assetUrl('assets/cat-sticker-v2.png')}
          label="移动猫咪贴纸"
        />
        <div className="hero-index hero-sticker-actions" aria-label="首页快捷操作">
          <a href="#projects">
            精选项目
            <ArrowUpRight aria-hidden="true" />
          </a>
          <a href="mailto:2436528353@qq.com">
            联系我
            <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <DraggableHeroSticker
          className="hero-guitar-sticker"
          src={assetUrl('assets/person-guitar-sticker-v2.png')}
          label="移动人物吉他贴纸"
        />
        <DraggableGrapeSodaSticker />
        <DraggableHeroSticker
          className="hero-mint-guitar-sticker"
          src={assetUrl('assets/mint-guitar-sticker.png')}
          label="移动薄荷绿电吉他贴纸"
        />
        <PageContinuation className="page-hint" href="#about" label="关于" />
        <VinylMusicButton />
      </div>
    </section>
  );
}

function PageContinuation({ className = '', href, label, isReturn = false }) {
  const Icon = isReturn ? ArrowUp : ChevronDown;
  const [isReady, setIsReady] = useState(false);
  const runwayRef = useRef(null);
  const readyRef = useRef(false);
  const wheelArmedRef = useRef(false);
  const wheelArmTimerRef = useRef(null);
  const wheelDistanceRef = useRef(0);
  const touchStartRef = useRef(null);
  const navigationLockRef = useRef(false);
  const settleTimerRef = useRef(null);
  const settleFrameRef = useRef(null);
  const settleAnimationRef = useRef(null);
  const isSettlingRef = useRef(false);
  const thresholdCrossedRef = useRef(false);
  const lastInputDirectionRef = useRef(0);
  const touchLastYRef = useRef(null);
  const inputVelocityRef = useRef(0);
  const lastInputTimestampRef = useRef(null);

  const navigate = useCallback(() => {
    if (navigationLockRef.current) return;
    navigationLockRef.current = true;
    window.dispatchEvent(new CustomEvent(chapterNavigateEvent, { detail: { href } }));
  }, [href]);

  useEffect(() => {
    const revealDistance = 34;
    const revealedRestDistance = 52;
    const navigationDistance = 44;

    const getRunwayMetrics = () => {
      const runwayHeight = runwayRef.current?.offsetHeight ?? 0;
      const maximumScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return {
        baseBottom: Math.max(0, maximumScroll - runwayHeight),
        maximumScroll,
        runwayHeight,
      };
    };

    const resetArming = () => {
      wheelArmedRef.current = false;
      wheelDistanceRef.current = 0;
      window.clearTimeout(wheelArmTimerRef.current);
    };

    const resetInputVelocity = () => {
      inputVelocityRef.current = 0;
      lastInputTimestampRef.current = null;
    };

    const recordDownwardVelocity = (distance) => {
      const now = performance.now();
      const elapsed = lastInputTimestampRef.current === null
        ? 16
        : Math.max(16, now - lastInputTimestampRef.current);
      const instantaneousVelocity = Math.min(2.2, Math.max(0, distance) / elapsed);
      inputVelocityRef.current = inputVelocityRef.current * 0.55 + instantaneousVelocity * 0.45;
      lastInputTimestampRef.current = now;
    };

    const reveal = () => {
      if (readyRef.current) return;
      readyRef.current = true;
      resetArming();
      setIsReady(true);
    };

    const conceal = () => {
      thresholdCrossedRef.current = false;
      resetInputVelocity();
      if (!readyRef.current) return;
      readyRef.current = false;
      resetArming();
      touchStartRef.current = null;
      setIsReady(false);
    };

    const finishSpring = () => {
      settleAnimationRef.current = null;
      isSettlingRef.current = false;
      lastInputDirectionRef.current = 0;
      resetInputVelocity();
      if (!readyRef.current) {
        thresholdCrossedRef.current = false;
        return;
      }
      wheelDistanceRef.current = 0;
      window.clearTimeout(wheelArmTimerRef.current);
      wheelArmTimerRef.current = window.setTimeout(() => {
        wheelArmedRef.current = true;
      }, 180);
    };

    const springBack = () => {
      window.clearTimeout(settleTimerRef.current);
      window.cancelAnimationFrame(settleFrameRef.current);
      settleAnimationRef.current?.cancel();
      settleAnimationRef.current = null;
      wheelArmedRef.current = false;
      window.clearTimeout(wheelArmTimerRef.current);

      if (!readyRef.current && thresholdCrossedRef.current) reveal();

      const { baseBottom, maximumScroll, runwayHeight } = getRunwayMetrics();
      const readyOffset = Math.min(revealedRestDistance, runwayHeight * 0.62);
      const target = Math.min(maximumScroll, baseBottom + (readyRef.current ? readyOffset : 0));
      const start = window.scrollY;
      const inputVelocity = Math.min(2.2, inputVelocityRef.current);
      const inertiaDistance = inputVelocity > 0.04
        ? Math.min(30, 5 + inputVelocity * 11)
        : 0;
      const minimumPeak = readyRef.current ? target + 6 : start;
      const peak = Math.min(maximumScroll, Math.max(start + inertiaDistance, minimumPeak));
      const inertiaDuration = peak - start > 0.5
        ? Math.min(300, 150 + inputVelocity * 62)
        : 0;
      const returnDistance = Math.max(0, peak - target);
      const returnDuration = Math.min(720, 460 + returnDistance * 8 + inputVelocity * 42);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion || (Math.abs(target - start) < 1 && peak - start < 1)) {
        window.scrollTo({ top: target, left: 0, behavior: 'auto' });
        finishSpring();
        return;
      }

      isSettlingRef.current = true;
      let startedAt = null;
      const startCompositedReturn = () => {
        const pageView = document.querySelector('.portfolio-page-view');
        const visualOffset = Math.max(0, window.scrollY - target);
        window.scrollTo({ top: target, left: 0, behavior: 'auto' });

        if (!pageView || visualOffset < 0.5) {
          finishSpring();
          return;
        }

        const returnAnimation = pageView.animate(
          [
            { transform: `translate3d(0, ${-visualOffset}px, 0)` },
            { transform: 'translate3d(0, 0, 0)' },
          ],
          {
            duration: returnDuration,
            easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
          },
        );
        settleAnimationRef.current = returnAnimation;
        returnAnimation.onfinish = finishSpring;
      };

      const step = (timestamp) => {
        if (startedAt === null) startedAt = timestamp;
        const elapsed = timestamp - startedAt;
        let nextPosition;

        if (elapsed < inertiaDuration) {
          const progress = Math.min(1, elapsed / inertiaDuration);
          const easedProgress = 1 - (1 - progress) ** 3;
          nextPosition = start + (peak - start) * easedProgress;
        } else {
          startCompositedReturn();
          return;
        }

        nextPosition = Math.min(maximumScroll, Math.max(0, nextPosition));
        window.scrollTo({ top: nextPosition, left: 0, behavior: 'auto' });

        if (elapsed < inertiaDuration) {
          settleFrameRef.current = window.requestAnimationFrame(step);
          return;
        }
      };
      if (inertiaDuration > 0) {
        settleFrameRef.current = window.requestAnimationFrame(step);
      } else {
        startCompositedReturn();
      }
    };

    const scheduleSpringBack = () => {
      window.clearTimeout(settleTimerRef.current);
      const releaseDelay = 240 + Math.min(60, inputVelocityRef.current * 28);
      settleTimerRef.current = window.setTimeout(springBack, releaseDelay);
    };

    const isProjectModalOpen = () => Boolean(document.querySelector('.project-modal-backdrop'));

    const suspendForProjectModal = () => {
      wheelDistanceRef.current = 0;
      touchStartRef.current = null;
      touchLastYRef.current = null;
      lastInputDirectionRef.current = 0;
      resetInputVelocity();
      window.clearTimeout(settleTimerRef.current);
      window.cancelAnimationFrame(settleFrameRef.current);
      settleAnimationRef.current?.cancel();
      settleAnimationRef.current = null;
      isSettlingRef.current = false;
    };

    const updateRunwayState = () => {
      if (isProjectModalOpen()) {
        suspendForProjectModal();
        return;
      }
      if (isSettlingRef.current || navigationLockRef.current) return;
      const { baseBottom } = getRunwayMetrics();
      const pullDistance = window.scrollY - baseBottom;

      if (window.scrollY < baseBottom - 10) {
        conceal();
        return;
      }

      if (!readyRef.current && pullDistance >= revealDistance) {
        thresholdCrossedRef.current = true;
        springBack();
        return;
      }
      if (pullDistance > 0 && lastInputDirectionRef.current > 0) scheduleSpringBack();
    };

    const isProjectModalEvent = (event) => (
      isProjectModalOpen()
      || (
        event.target instanceof Element
        && Boolean(event.target.closest('.project-modal-backdrop'))
      )
    );

    const getProjectModalScroll = (event) => (
      event.target instanceof Element
        ? event.target.closest('.project-modal-scroll')
        : null
    );

    const onWheel = (event) => {
      if (isProjectModalEvent(event)) {
        suspendForProjectModal();
        const modalScroll = getProjectModalScroll(event);
        const isAtScrollBoundary = !modalScroll
          || (event.deltaY < 0 && modalScroll.scrollTop <= 0)
          || (
            event.deltaY > 0
            && modalScroll.scrollTop + modalScroll.clientHeight >= modalScroll.scrollHeight - 1
          );
        if (isAtScrollBoundary) event.preventDefault();
        return;
      }

      if (isSettlingRef.current && event.deltaY > 0) {
        event.preventDefault();
        return;
      }

      if (event.deltaY <= 0) {
        lastInputDirectionRef.current = -1;
        wheelDistanceRef.current = 0;
        resetInputVelocity();
        window.clearTimeout(settleTimerRef.current);
        if (isSettlingRef.current) {
          window.cancelAnimationFrame(settleFrameRef.current);
          settleAnimationRef.current?.cancel();
          settleAnimationRef.current = null;
          isSettlingRef.current = false;
        }
        return;
      }
      lastInputDirectionRef.current = 1;
      const { baseBottom } = getRunwayMetrics();
      if (window.scrollY < baseBottom - 3) return;
      recordDownwardVelocity(event.deltaY);
      scheduleSpringBack();
      if (!readyRef.current || !wheelArmedRef.current) return;

      wheelDistanceRef.current += event.deltaY;
      if (wheelDistanceRef.current >= navigationDistance) {
        event.preventDefault();
        navigate();
      }
    };

    const onTouchStart = (event) => {
      if (isProjectModalEvent(event)) {
        suspendForProjectModal();
        touchLastYRef.current = event.touches[0]?.clientY ?? null;
        return;
      }

      touchLastYRef.current = event.touches[0]?.clientY ?? null;
      const { baseBottom } = getRunwayMetrics();
      touchStartRef.current = readyRef.current
        && wheelArmedRef.current
        && window.scrollY >= baseBottom - 3
        ? event.touches[0]?.clientY ?? null
        : null;
    };

    const onTouchMove = (event) => {
      if (isProjectModalEvent(event)) {
        const currentY = event.touches[0]?.clientY;
        const touchDistance = typeof currentY === 'number' && touchLastYRef.current !== null
          ? touchLastYRef.current - currentY
          : 0;
        const modalScroll = getProjectModalScroll(event);
        const isAtScrollBoundary = !modalScroll
          || (touchDistance < 0 && modalScroll.scrollTop <= 0)
          || (
            touchDistance > 0
            && modalScroll.scrollTop + modalScroll.clientHeight >= modalScroll.scrollHeight - 1
          );
        suspendForProjectModal();
        touchLastYRef.current = typeof currentY === 'number' ? currentY : null;
        if (isAtScrollBoundary) event.preventDefault();
        return;
      }

      const currentY = event.touches[0]?.clientY;
      if (
        isSettlingRef.current
        && typeof currentY === 'number'
        && touchLastYRef.current !== null
        && currentY < touchLastYRef.current
      ) {
        touchLastYRef.current = currentY;
        event.preventDefault();
        return;
      }
      if (typeof currentY === 'number' && touchLastYRef.current !== null) {
        const touchDistance = touchLastYRef.current - currentY;
        lastInputDirectionRef.current = touchDistance > 0 ? 1 : -1;
        touchLastYRef.current = currentY;
        if (lastInputDirectionRef.current < 0) {
          resetInputVelocity();
          window.clearTimeout(settleTimerRef.current);
          if (isSettlingRef.current) {
            window.cancelAnimationFrame(settleFrameRef.current);
            settleAnimationRef.current?.cancel();
            settleAnimationRef.current = null;
            isSettlingRef.current = false;
          }
        } else {
          recordDownwardVelocity(touchDistance);
          scheduleSpringBack();
        }
      }
      if (touchStartRef.current === null || !readyRef.current || !wheelArmedRef.current) return;
      if (typeof currentY === 'number' && touchStartRef.current - currentY >= 25) {
        event.preventDefault();
        navigate();
      }
    };

    const onTouchEnd = () => {
      if (isProjectModalOpen()) {
        suspendForProjectModal();
        return;
      }
      touchLastYRef.current = null;
      if (lastInputDirectionRef.current > 0) scheduleSpringBack();
    };

    updateRunwayState();
    window.addEventListener('scroll', updateRunwayState, { passive: true });
    window.addEventListener('resize', updateRunwayState);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateRunwayState);
      window.removeEventListener('resize', updateRunwayState);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.clearTimeout(wheelArmTimerRef.current);
      window.clearTimeout(settleTimerRef.current);
      window.cancelAnimationFrame(settleFrameRef.current);
      settleAnimationRef.current?.cancel();
    };
  }, [navigate]);

  const continuationControl = (
    <a
        className={`page-continuation${className ? ` ${className}` : ''}${isReturn ? ' is-return' : ''}${isReady ? ' is-ready' : ''}`}
        href={href}
        aria-label={isReturn ? `返回${label}` : `前往下一页：${label}`}
        aria-hidden={!isReady}
        tabIndex={isReady ? 0 : -1}
        onClick={(event) => {
          event.preventDefault();
          navigate();
        }}
      >
        <span className="page-continuation-copy">
          <small>{isReturn ? '循环阅读' : '下一部分'} · {label}</small>
          <strong>{isReturn ? '继续向下滑动，返回首页' : '继续向下滑动，进入下一部分'}</strong>
        </span>
        <span className="page-continuation-icon" aria-hidden="true">
          <Icon />
        </span>
      </a>
  );

  return (
    <>
      <span className="page-continuation-runway" ref={runwayRef} aria-hidden="true" />
      {createPortal(continuationControl, document.body)}
    </>
  );
}

function PortraitProfile() {
  const [stage, setStage] = useState('idle');
  const [isFlipped, setIsFlipped] = useState(false);
  const audioContextRef = useRef(null);
  const startTimerRef = useRef(0);
  const finishTimerRef = useRef(0);
  const jobDirection = '内容策划 · 账号运营 · 品牌表达';

  useEffect(() => () => {
    window.clearTimeout(startTimerRef.current);
    window.clearTimeout(finishTimerRef.current);
    audioContextRef.current?.close().catch(() => {});
  }, []);

  const playInstantCameraSound = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextClass();
    }

    const context = audioContextRef.current;
    context.resume();
    const now = context.currentTime;
    const createShutterCurtain = (offset, duration, frequency, level, q) => {
      const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
      const buffer = context.createBuffer(1, frameCount, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < frameCount; index += 1) {
        const envelope = 1 - index / frameCount;
        data[index] = (Math.random() * 2 - 1) * envelope * envelope;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = buffer;
      filter.type = 'bandpass';
      filter.frequency.value = frequency;
      filter.Q.value = q;
      gain.gain.setValueAtTime(level, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + duration);
      source.connect(filter).connect(gain).connect(context.destination);
      source.start(now + offset);
    };

    // A camera shutter is a short high curtain snap followed by a lower body click.
    createShutterCurtain(0, 0.018, 3100, 0.11, 2.8);
    createShutterCurtain(0.034, 0.05, 960, 0.13, 0.72);

    const bodyClick = context.createOscillator();
    const bodyGain = context.createGain();
    bodyClick.type = 'triangle';
    bodyClick.frequency.setValueAtTime(188, now + 0.03);
    bodyClick.frequency.exponentialRampToValueAtTime(78, now + 0.08);
    bodyGain.gain.setValueAtTime(0.035, now + 0.03);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    bodyClick.connect(bodyGain).connect(context.destination);
    bodyClick.start(now + 0.03);
    bodyClick.stop(now + 0.09);
  };

  const ejectPhoto = () => {
    if (stage !== 'idle') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    playInstantCameraSound();
    setIsFlipped(false);
    setStage('shutter');
    startTimerRef.current = window.setTimeout(() => {
      setStage('printing');
    }, reducedMotion ? 40 : 160);
    finishTimerRef.current = window.setTimeout(() => {
      setStage('ejected');
    }, reducedMotion ? 120 : 3750);
  };

  const togglePhoto = () => {
    if (stage !== 'ejected') return;
    setIsFlipped((current) => !current);
  };

  const statusText = stage === 'idle'
    ? '点击奶油黄色拍立得，拍出我的照片'
    : stage === 'shutter'
      ? '咔嚓——照片即将从下方出片'
      : '';

  return (
    <figure
      className={`portrait-panel instant-portrait${isFlipped ? ' is-flipped' : ''}`}
      data-stage={stage}
    >
      <div className="instant-portrait-stage">
        <button
          className="instant-photo"
          type="button"
          onClick={togglePhoto}
          aria-label={isFlipped ? '翻回照片正面' : '翻到照片背面查看求职方向'}
          aria-pressed={isFlipped}
          disabled={stage !== 'ejected'}
        >
          <span className="instant-photo-inner">
            <span className="instant-photo-face instant-photo-front">
              <span className="instant-photo-image">
                <img src={assetUrl('media/pdf-images/full_p02_i01_Im73.jpg')} alt="折椿个人照片" />
              </span>
            </span>
            <span className="instant-photo-face instant-photo-back">
              <span className="instant-photo-back-title">求职方向</span>
              <strong className="instant-photo-back-copy">{jobDirection}</strong>
              <small>Content · Social · Brand</small>
            </span>
          </span>
        </button>

        <button
          className="instant-camera"
          type="button"
          onClick={ejectPhoto}
          aria-label="点击奶油黄色 Mini 8 拍立得拍出个人照片"
          disabled={stage !== 'idle'}
        >
          <img
            src={assetUrl('assets/instax-mini8-butter-yellow-v4.png')}
            alt="奶油黄色 Mini 8 拍立得"
          />
          <span className="instant-camera-flash" aria-hidden="true" />
        </button>
      </div>
      <figcaption className="instant-portrait-status" aria-live="polite">
        {statusText}
      </figcaption>
    </figure>
  );
}

function About() {
  const [isExperienceArchiveOpen, setIsExperienceArchiveOpen] = useState(false);

  return (
    <section className="section about-section" id="about">
      <div className="about-grid">
        <AboutPostcard />
        <PortraitProfile />
        <ExperienceUmbrella experiences={experience} />
        <section className={`about-experience-archive${isExperienceArchiveOpen ? ' is-open' : ''}`} aria-labelledby="about-experience-archive-title">
          <button
            className="about-projects-index"
            type="button"
            onClick={() => setIsExperienceArchiveOpen((current) => !current)}
            aria-expanded={isExperienceArchiveOpen}
            aria-controls="about-experience-archive-list"
          >
            <strong id="about-experience-archive-title">
              查看全部 7 段经历
            </strong>
            <span className="about-projects-index-icon" aria-hidden="true">
              <ChevronDown />
            </span>
          </button>
          <div
            className="about-experience-archive-list"
            id="about-experience-archive-list"
            hidden={!isExperienceArchiveOpen}
          >
            {experience.map((item, index) => (
              <article className="about-experience-archive-item" key={`${item.company}-${item.time}`}>
                <span className="about-experience-archive-number">{String(index + 1).padStart(2, '0')}</span>
                <div className="about-experience-archive-role">
                  <time>{item.time}</time>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                </div>
                <div className="about-experience-archive-result">
                  <p><span>职责</span>{item.responsibility}</p>
                  <p><span>成果</span>{item.achievement}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      {!isExperienceArchiveOpen && <PageContinuation href="#projects" label="经历" />}
    </section>
  );
}

function AboutPostcard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef(null);
  const closingRef = useRef(false);
  const competency = '我擅长从产品卖点与用户情绪中提炼内容切口，并按平台角色组织小红书种草、公众号深度表达与评论区、私信互动承接，让选题、内容生产、反馈沉淀和转化线索形成一条可执行、可复盘的传播链路。';
  const competencyLines = [
    '我擅长从产品卖点与用户情绪中提炼内容切',
    '口，并按平台角色组织小红书种草、公众号',
    '深度表达与评论区、私信互动承接，让选题',
    '内容生产、反馈沉淀和转化线索形成一条可',
    '执行、可复盘的传播链路。',
  ];

  const closeExpandedPostcard = useCallback(() => {
    if (!isExpanded || closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setIsExpanded(false);
      setIsClosing(false);
      setIsFlipped(false);
      closingRef.current = false;
    }, 420);
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('postcard-reading');
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeExpandedPostcard();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(closeTimerRef.current);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('postcard-reading');
    };
  }, [closeExpandedPostcard, isExpanded]);

  const openPostcard = () => {
    if (isExpanded) {
      closeExpandedPostcard();
      return;
    }
    setIsFlipped(true);
    setIsExpanded(true);
  };

  const renderPostcardFaces = () => (
    <span className="about-postcard-inner">
      <span className="about-postcard-face about-postcard-front" aria-hidden={isFlipped}>
        <img
          src={assetUrl('assets/about-postcard-front.png')}
          alt="浅蓝色章鱼与大象异形明信片正面"
        />
      </span>
      <span className="about-postcard-face about-postcard-back" aria-hidden={!isFlipped}>
        <img
          src={assetUrl('assets/about-postcard-back.png')}
          alt="带邮票框、地址线和书写横线的明信片背面"
        />
        <span className="about-postcard-stamp" aria-hidden="true">
          <svg viewBox="0 0 100 76" role="presentation">
            <path d="M32 49c-8 1-15-4-15-11 0-5 4-9 10-10-1-9 6-16 15-16 6 0 11 3 14 8 3-3 7-5 12-5 8 0 15 6 15 14 0 9-8 16-17 15-3 9-11 16-21 16-8 0-15-4-18-10l-7 5c-4 3-10-2-6-6l8-10Z" />
            <circle cx="43" cy="31" r="2.5" />
            <circle cx="63" cy="31" r="2.5" />
            <path className="stamp-smile" d="M45 40c5 4 10 4 15 0" />
          </svg>
          <span>POSTCARD<br />ZHECHUN</span>
        </span>
        <span className="about-postcard-postmark" aria-hidden="true"><i /><i /><i /></span>
        <span className="about-postcard-handwriting" aria-label={competency}>
          {competencyLines.map((line, index) => (
            <span className={`about-postcard-line-${index + 1}`} key={line}>{line}</span>
          ))}
        </span>
        <span className="about-postcard-address" aria-label="明信片收寄信息：寄给内容团队，主题为作品与经历，内页包含七段履历，寄件人折椿">
          <span>TO · CONTENT TEAM</span>
          <span>主题 · 作品与经历</span>
          <span>内页 · 七段履历</span>
          <span>FROM · ZHECHUN</span>
        </span>
      </span>
    </span>
  );

  return (
    <div className={`about-postcard-scene${isExpanded ? ' is-expanded' : ''}${isClosing ? ' is-closing' : ''}`}>
      <button
        className={`about-postcard${isFlipped ? ' is-flipped' : ''}`}
        type="button"
        onClick={openPostcard}
        onMouseDown={(event) => event.preventDefault()}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPostcard();
          }
        }}
        aria-label={isExpanded ? '收起放大的明信片' : '翻到明信片背面并放大阅读'}
        aria-pressed={isFlipped}
        aria-expanded={isExpanded}
        aria-hidden={isExpanded}
        tabIndex={isExpanded ? -1 : 0}
      >
        {renderPostcardFaces()}
      </button>
      <p className="about-postcard-hint" aria-live="polite">
        {isExpanded ? '点击卡片或背景，回到页面' : '点击明信片，放大阅读背面的留言'}
      </p>
      {isExpanded && createPortal(
        <div className={`about-postcard-reader about-section${isClosing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-label="明信片背面留言">
          <button
            className="about-postcard-backdrop"
            type="button"
            onClick={closeExpandedPostcard}
            aria-label="收起放大的明信片"
          />
          <button
            className="about-postcard about-postcard-reader-card is-flipped"
            type="button"
            onClick={closeExpandedPostcard}
            onMouseDown={(event) => event.preventDefault()}
            aria-label="收起放大的明信片"
          >
            {renderPostcardFaces()}
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}

function ImageLightbox({ activeIndex, images, onClose, onMove, title }) {
  const closeButtonRef = useRef(null);
  const currentImage = images[activeIndex];
  const imageCount = images.length;

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && imageCount > 1) {
        onMove(-1);
      } else if (event.key === 'ArrowRight' && imageCount > 1) {
        onMove(1);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [imageCount, onClose, onMove]);

  const handleOutsideImageClick = (event) => {
    const target = event.target;

    if (target instanceof Element && target.closest('.image-lightbox-image, button')) {
      return;
    }

    onClose();
  };

  return createPortal(
    <div
      className="image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title}作品大图`}
      onClick={handleOutsideImageClick}
    >
      <div className="image-lightbox-dialog">
        <button
          className="image-lightbox-close"
          type="button"
          aria-label="关闭大图"
          onClick={onClose}
          ref={closeButtonRef}
        >
          <X aria-hidden="true" />
        </button>
        {imageCount > 1 && (
          <>
            <button
              className="image-lightbox-nav image-lightbox-prev"
              type="button"
              aria-label={`查看${title}上一张大图`}
              onClick={() => onMove(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              className="image-lightbox-nav image-lightbox-next"
              type="button"
              aria-label={`查看${title}下一张大图`}
              onClick={() => onMove(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
        <img
          className="image-lightbox-image"
          src={currentImage.src}
          alt={`${title}大图：${currentImage.label}`}
          key={`${title}-lightbox-${activeIndex}-${currentImage.src}`}
        />
        <p className="image-lightbox-caption" aria-live="polite">
          <span>{currentImage.label}</span>
          <span>{activeIndex + 1} / {imageCount}</span>
        </p>
      </div>
    </div>,
    document.body,
  );
}

function ProjectCarousel({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const carouselRef = useRef(null);
  const thumbsRef = useRef(null);
  const thumbRefs = useRef([]);
  const swipeRef = useRef(null);
  const suppressImageClickRef = useRef(false);
  const imageCount = images.length;

  const stopAutoplay = useCallback(() => setAutoplayStopped(true), []);
  const move = useCallback((step) => {
    setActiveIndex((index) => (index + step + imageCount) % imageCount);
  }, [imageCount]);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const resetSwipeVisual = useCallback((stage) => {
    stage.classList.remove('is-swiping');
    stage.style.setProperty('--carousel-swipe-x', '0px');
  }, []);

  const handleSwipePointerDown = (event) => {
    if (event.pointerType === 'mouse' || event.button !== 0 || event.target.closest('.carousel-button')) return;
    swipeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSwipePointerMove = (event) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    swipe.deltaX = event.clientX - swipe.startX;
    swipe.deltaY = event.clientY - swipe.startY;

    if (Math.abs(swipe.deltaX) <= Math.abs(swipe.deltaY) || Math.abs(swipe.deltaX) < 6) return;
    const stage = event.currentTarget;
    const boundedOffset = Math.max(-stage.clientWidth * 0.32, Math.min(stage.clientWidth * 0.32, swipe.deltaX));
    stage.classList.add('is-swiping');
    stage.style.setProperty('--carousel-swipe-x', `${boundedOffset}px`);
    stopAutoplay();
  };

  const finishSwipe = (event) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const stage = event.currentTarget;
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);

    const isHorizontal = Math.abs(swipe.deltaX) > Math.abs(swipe.deltaY) * 1.15;
    const threshold = Math.min(58, stage.clientWidth * 0.16);
    const didSwipe = isHorizontal && Math.abs(swipe.deltaX) >= threshold;
    suppressImageClickRef.current = didSwipe;
    swipeRef.current = null;
    resetSwipeVisual(stage);

    if (didSwipe) move(swipe.deltaX < 0 ? 1 : -1);
  };

  const cancelSwipe = (event) => {
    if (swipeRef.current?.pointerId !== event.pointerId) return;
    swipeRef.current = null;
    suppressImageClickRef.current = false;
    resetSwipeVisual(event.currentTarget);
  };

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.22 },
    );
    observer.observe(carousel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || autoplayStopped || imageCount < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % imageCount);
    }, 2800);

    return () => window.clearInterval(timerId);
  }, [autoplayStopped, imageCount, isInView]);

  useEffect(() => {
    const thumbs = thumbsRef.current;
    const activeThumb = thumbRefs.current[activeIndex];

    if (!thumbs || !activeThumb) {
      return undefined;
    }

    const centerActiveThumb = () => {
      const thumbCenter = activeThumb.offsetLeft + activeThumb.offsetWidth / 2;
      const targetLeft = thumbCenter - thumbs.clientWidth / 2;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      thumbs.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const frameId = window.requestAnimationFrame(centerActiveThumb);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeIndex, imageCount]);

  if (!imageCount) {
    return null;
  }

  if (imageCount === 1) {
    return (
      <figure className="project-visual project-static-visual" aria-label={`${title}宣传图`}>
        <img
          className="project-static-image"
          src={images[0].src}
          alt={`${title}宣传图：${images[0].label}`}
          loading="lazy"
          width="941"
          height="1672"
        />
      </figure>
    );
  }

  const currentImage = images[activeIndex];
  const previousImage = images[(activeIndex - 1 + imageCount) % imageCount];
  const nextImage = images[(activeIndex + 1) % imageCount];
  return (
    <figure
      className={`project-visual project-carousel${autoplayStopped ? ' is-manual' : ' is-autoplaying'}`}
      aria-label={`${title}作品截图浏览`}
      ref={carouselRef}
    >
      <div
        className="carousel-stage"
        onPointerDown={handleSwipePointerDown}
        onPointerMove={handleSwipePointerMove}
        onPointerUp={finishSwipe}
        onPointerCancel={cancelSwipe}
      >
        {imageCount > 1 && (
          <>
            <img
              className="carousel-image carousel-image-side carousel-image-prev"
              src={previousImage.src}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
            <img
              className="carousel-image carousel-image-side carousel-image-next"
              src={nextImage.src}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
          </>
        )}
        <button
          className="carousel-image-trigger"
          type="button"
          aria-label={`放大查看${title}当前截图：${currentImage.label}`}
          onClick={(event) => {
            if (suppressImageClickRef.current) {
              suppressImageClickRef.current = false;
              event.preventDefault();
              return;
            }
            stopAutoplay();
            setLightboxOpen(true);
          }}
        >
          <img
            className="carousel-image carousel-image-current"
            src={currentImage.src}
            alt={`${title}当前截图：${currentImage.label}`}
            loading="lazy"
            key={`${title}-${activeIndex}-${currentImage.src}`}
          />
          <span className="carousel-zoom-icon" aria-hidden="true">
            <Maximize2 />
          </span>
        </button>
        {imageCount > 1 && (
          <>
            <button
              className="carousel-button carousel-button-prev"
              type="button"
              aria-label={`查看${title}上一张截图`}
              onClick={() => {
                stopAutoplay();
                move(-1);
              }}
            >
              <svg className="carousel-arrow" viewBox="0 0 36 112" aria-hidden="true" focusable="false">
                <path className="carousel-arrow-path" d="M27 10 C19 25 11 42 7 56 C11 70 19 87 27 102" />
              </svg>
            </button>
            <button
              className="carousel-button carousel-button-next"
              type="button"
              aria-label={`查看${title}下一张截图`}
              onClick={() => {
                stopAutoplay();
                move(1);
              }}
            >
              <svg className="carousel-arrow" viewBox="0 0 36 112" aria-hidden="true" focusable="false">
                <path className="carousel-arrow-path" d="M9 10 C17 25 25 42 29 56 C25 70 17 87 9 102" />
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="project-gallery-strip carousel-thumbs" aria-label={`${title}作品缩略图`} ref={thumbsRef}>
        {images.map((image, index) => (
          <button
            className={`project-thumb-button${index === activeIndex ? ' is-active' : ''}`}
            type="button"
            aria-label={`切换到${title}第 ${index + 1} 张截图：${image.label}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => {
              stopAutoplay();
              setActiveIndex(index);
            }}
            ref={(node) => {
              thumbRefs.current[index] = node;
            }}
            key={`${image.src}-${index}`}
          >
            <img className="project-thumb" src={image.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {lightboxOpen && (
        <ImageLightbox
          activeIndex={activeIndex}
          images={images}
          onClose={closeLightbox}
          onMove={move}
          title={title}
        />
      )}
    </figure>
  );
}

function ProjectSourceLinks({ links, title }) {
  if (!links?.length) {
    return null;
  }

  if (links.length === 1) {
    const [link] = links;

    return (
      <nav className="project-source-links project-source-links-single" aria-label={`${title}在线产品入口`}>
        <div className="project-source-single-copy">
          <span>在线产品</span>
          <strong>{title}</strong>
          <small>{link.label}</small>
        </div>
        <a className="project-source-single-action" href={link.url} target="_blank" rel="noreferrer noopener">
          <span>打开在线体验</span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </nav>
    );
  }

  const linkGroups = links.reduce((groups, link) => {
    const groupName = link.group || '更多作品';
    const existingGroup = groups.find((group) => group.name === groupName);

    if (existingGroup) {
      existingGroup.links.push(link);
    } else {
      groups.push({ name: groupName, links: [link] });
    }

    return groups;
  }, []);

  return (
    <nav className="project-source-links" aria-label={`${title}原始作品链接`}>
      <header className="project-source-header">
        <div>
          <span className="project-source-kicker">作品索引</span>
          <h4 className="project-source-heading">原始作品链接</h4>
        </div>
        <p>{links.length} 件作品 · {linkGroups.length} 个平台</p>
      </header>
      <div className="project-source-groups">
        {linkGroups.map((group, groupIndex) => (
          <section className="project-source-group" key={group.name}>
            <header className="project-source-group-header">
              <span>{String(groupIndex + 1).padStart(2, '0')}</span>
              <h5>{group.name}</h5>
              <small>{group.links.length} 件</small>
            </header>
            <div className="project-source-list">
              {group.links.map((link, linkIndex) => (
                <a href={link.url} target="_blank" rel="noreferrer noopener" key={`${link.label}-${link.url}`}>
                  <small>{String(linkIndex + 1).padStart(2, '0')}</small>
                  <span>{link.label}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </nav>
  );
}

function AiDesignShowcase({ content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openExample = (index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  const moveExample = useCallback((direction) => {
    setActiveIndex((current) => (current + direction + content.examples.length) % content.examples.length);
  }, [content.examples.length]);

  return (
    <section className="ai-design-showcase" aria-labelledby="ai-design-title">
      <div className="ai-design-copy">
        <div className="ai-design-kicker">
          <Sparkles aria-hidden="true" />
          <span>AI Assisted</span>
        </div>
        <h4 id="ai-design-title">{content.title}</h4>
        <p>{content.summary}</p>
      </div>
      <div className="ai-design-grid">
        {content.examples.map((example, index) => (
          <figure className="ai-design-example" key={example.src}>
            <button
              type="button"
              className="ai-design-image-button"
              aria-label={`放大查看${example.label}`}
              onClick={() => openExample(index)}
            >
              <img src={example.src} alt={example.label} loading="lazy" />
              <Maximize2 aria-hidden="true" />
            </button>
            <figcaption>{example.label}</figcaption>
          </figure>
        ))}
      </div>
      {lightboxOpen && (
        <ImageLightbox
          activeIndex={activeIndex}
          images={content.examples}
          onClose={() => setLightboxOpen(false)}
          onMove={moveExample}
          title={content.title}
        />
      )}
    </section>
  );
}

function ProjectRationale({ project }) {
  const content = project.rationale;

  if (!content) {
    return null;
  }

  return (
    <section className="project-rationale" aria-labelledby={`project-rationale-${project.title}`}>
      <header className="project-rationale-header">
        <span>PROJECT THINKING</span>
        <h4 id={`project-rationale-${project.title}`}>我为什么做这件事</h4>
      </header>
      <div className="project-rationale-columns">
        <article className="project-rationale-section">
          <div className="project-rationale-label">
            <span>01</span>
            <h5>为什么做</h5>
          </div>
          <p>{content.motivation}</p>
        </article>
        <article className="project-rationale-section">
          <div className="project-rationale-label">
            <span>02</span>
            <h5>案例与思考</h5>
          </div>
          <p>{content.evidence}</p>
        </article>
      </div>
      <div className="project-rationale-capabilities" aria-label="沉淀能力">
        <div className="project-rationale-label">
          <span>03</span>
          <h5>沉淀能力</h5>
        </div>
        <ul>
          {content.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
        </ul>
      </div>
    </section>
  );
}

function AiProductCase({ images, project }) {
  const content = project.aiProduct;

  return (
    <div className="ai-product-case">
      <header className="ai-product-case-masthead">
        <div className="ai-product-case-title">
          <p className="project-tag">{project.tag}</p>
          <h3 id="project-modal-title">{project.title}</h3>
        </div>
        <div className="ai-product-case-status">
          <span>项目状态</span>
          <strong>独立完成 · 已上线</strong>
          <small>{project.subtitle}</small>
        </div>
      </header>

      <section className="ai-product-case-hero" aria-labelledby="ai-product-case-heading">
        <ProjectCarousel images={images} title={project.title} key={project.title} />
        <div className="ai-product-case-narrative">
          <div className="ai-design-kicker">
            <Sparkles aria-hidden="true" />
            <span>AI-Assisted Build</span>
          </div>
          <h4 id="ai-product-case-heading">{content.title}</h4>
          <p>{project.summary}</p>
          <dl className="project-stats" aria-label={`${project.title}核心数据`}>
            {project.stats.map((stat) => (
              <div className="project-stat" key={`${stat.value}-${stat.label}`}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="ai-product-actions">
            <a href={content.url} target="_blank" rel="noreferrer noopener" className="ai-product-link">
              <span>打开 freebite.zhechun.space</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
            <span className="ai-skill-badge" aria-label={`原创转盘宠物 Skill ${content.skill}`}>
              <span>ORIGINAL SKILL</span>
              <strong>{content.skill}</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="ai-product-case-details" aria-label="产品实现与适用场景">
        <div className="ai-product-case-story">
          <span>产品实现</span>
          <p>{content.text}</p>
        </div>
        <div className="ai-product-feature-block">
          <span>产品亮点</span>
          <ul className="ai-product-feature-tags" aria-label="不牛马厨房产品亮点">
            {content.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </div>
      </section>
      <ProjectRationale project={project} />
    </div>
  );
}

function ProjectDetailModal({ index, onClose, project, returnFocusElement }) {
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const carouselImages = [
    { src: project.image, label: `${project.title}主图` },
    ...project.gallery.filter((image) => image.src !== project.image),
  ];
  const hasSourceLinks = Boolean(project.links?.length);
  const hasSupplementalMaterial = Boolean(project.aiDesign);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;

    const handleKeyDown = (event) => {
      if (document.querySelector('.image-lightbox')) {
        return;
      }

      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !dialog) {
        return;
      }

      const focusable = [...dialog.querySelectorAll(
        'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
      )].filter((element) => !element.hasAttribute('hidden') && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      (returnFocusElement || previouslyFocused)?.focus?.({ preventScroll: true });
    };
  }, [onClose, returnFocusElement]);

  return createPortal(
    <div
      className="project-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <article
        className={`project-modal-window${project.aiProduct ? ' is-ai-product-modal' : ''}${project.aiSkill ? ' is-ai-skill-modal' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={dialogRef}
      >
        <header className="project-modal-bar">
          <div className="project-modal-position">
            <span>项目 {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>
          </div>
          <button
            type="button"
            className="project-modal-close"
            aria-label={`关闭${project.title}案例窗口`}
            onClick={onClose}
            ref={closeButtonRef}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className={`project-modal-scroll${hasSourceLinks ? ' has-project-source-links' : ''}`}>
          {project.aiProduct ? (
            <AiProductCase images={carouselImages} project={project} />
          ) : (
            <>
              <div className="experience-detail-heading">
            <div className="experience-detail-title">
              <p className="project-tag">{project.tag}</p>
              <h3 id="project-modal-title">{project.title}</h3>
            </div>
            <div className="experience-detail-context">
              <span>项目主题</span>
              <p className="project-subtitle">{project.subtitle}</p>
            </div>
          </div>
          <div className="experience-detail-content">
            <ProjectCarousel images={carouselImages} title={project.title} key={project.title} />
            <div className="experience-detail-copy">
              <div className="project-summary-block">
                <span>项目概述</span>
                <p>{project.summary}</p>
              </div>
              <dl className="project-stats" aria-label={`${project.title}核心数据`}>
                {project.stats.map((stat) => (
                  <div className="project-stat" key={`${stat.value}-${stat.label}`}>
                    <dt>{stat.label}</dt>
                    <dd>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
           </div>
          <ProjectRationale project={project} />
          <ProjectSourceLinks links={project.links} title={project.title} />
          {hasSupplementalMaterial && (
            <details className="project-modal-secondary">
              <summary>
                <span>补充材料</span>
                <small>展开查看</small>
                <ChevronDown aria-hidden="true" />
              </summary>
              <div className="project-modal-secondary-content">
                <AiDesignShowcase content={project.aiDesign} />
              </div>
            </details>
          )}
            </>
          )}
        </div>
      </article>
    </div>,
    document.body,
  );
}

function Projects() {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const historyIndex = window.history.state?.portfolioProject;
    return Number.isInteger(historyIndex) ? historyIndex : null;
  });
  const [isCcdAwake, setIsCcdAwake] = useState(false);
  const [isProjectSummaryOpen, setIsProjectSummaryOpen] = useState(false);
  const ccdAudioRef = useRef(null);
  const projectButtonRefs = useRef([]);
  const selectedProject = selectedIndex === null ? null : projects[selectedIndex];

  useEffect(() => () => {
    ccdAudioRef.current?.close().catch(() => {});
  }, []);

  const playCcdShutterSound = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!ccdAudioRef.current || ccdAudioRef.current.state === 'closed') {
      ccdAudioRef.current = new AudioContextClass();
    }

    const context = ccdAudioRef.current;
    context.resume();
    const now = context.currentTime;
    const noise = context.createBuffer(1, Math.floor(context.sampleRate * 0.09), context.sampleRate);
    const noiseData = noise.getChannelData(0);
    for (let index = 0; index < noiseData.length; index += 1) {
      const envelope = 1 - index / noiseData.length;
      noiseData[index] = (Math.random() * 2 - 1) * envelope * envelope;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = noise;
    filter.type = 'bandpass';
    filter.frequency.value = 2500;
    filter.Q.value = 1.6;
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(now);

    const click = context.createOscillator();
    const clickGain = context.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(180, now + 0.035);
    click.frequency.exponentialRampToValueAtTime(72, now + 0.12);
    clickGain.gain.setValueAtTime(0.05, now + 0.035);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    click.connect(clickGain).connect(context.destination);
    click.start(now + 0.035);
    click.stop(now + 0.13);
  };

  const openProject = (index, triggerElement = null) => {
    if (triggerElement) projectButtonRefs.current[index] = triggerElement;
    window.history.pushState(
      { ...window.history.state, portfolioProject: index },
      '',
      '#projects',
    );
    setSelectedIndex(index);
  };

  const returnToOverview = useCallback(() => {
    window.history.back();
  }, []);

  useEffect(() => {
    const handlePopState = (event) => {
      const historyIndex = event.state?.portfolioProject;
      setSelectedIndex(Number.isInteger(historyIndex) ? historyIndex : null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <section className="section projects-section" id="projects">
      <div className="section-heading projects-heading projects-ccd-heading reveal-on-scroll">
        <img
          className="projects-ccd-frame"
          src={assetUrl('assets/projects-ccd-frame-silver.png')}
          alt="Selected Work，项目经历：从内容策划、平台运营到转化承接，以代表项目呈现执行过程与结果。"
        />
        <span
          className={`projects-ccd-screen-cover${isCcdAwake ? ' is-awake' : ''}`}
          aria-hidden="true"
        />
        <button
          className={`projects-ccd-power-button${isCcdAwake ? ' is-awake' : ''}`}
          type="button"
          aria-label={isCcdAwake ? 'CCD 屏幕已打开' : '点击模式转盘打开 CCD 屏幕'}
          aria-pressed={isCcdAwake}
          onClick={() => {
            if (isCcdAwake) return;
            playCcdShutterSound();
            setIsCcdAwake(true);
          }}
        />
        <p className={`projects-ccd-hint${isCcdAwake ? ' is-awake' : ''}`} aria-live="polite">
          {isCcdAwake ? 'CCD 已打开' : '点击模式转盘，打开 CCD 屏幕'}
        </p>
      </div>
      <div className="experience-overview-panel">
        <section className="project-field" aria-label="项目胶卷总览">
          <DraggableProjectGrid
            projects={projects}
            onProjectOpen={openProject}
          />
        </section>

        <section className={`project-summary${isProjectSummaryOpen ? ' is-open' : ''}`} aria-labelledby="project-summary-title">
          <button
            className="project-summary-toggle"
            type="button"
            onClick={() => setIsProjectSummaryOpen((current) => !current)}
            aria-expanded={isProjectSummaryOpen}
            aria-controls="project-summary-list"
          >
            <strong id="project-summary-title">查看全部项目汇总</strong>
            <span>{projects.length} 个项目 · 内容策划、平台运营、转化承接与产品实践</span>
            <span className="project-summary-toggle-icon" aria-hidden="true"><ChevronDown /></span>
          </button>
          <div className="project-summary-list" id="project-summary-list" hidden={!isProjectSummaryOpen}>
            {projects.map((project, index) => (
            <button
              className="project-summary-row"
              type="button"
              onClick={(event) => openProject(index, event.currentTarget)}
              key={project.title}
            >
              <span className="project-summary-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="project-summary-copy">
                <strong>{project.title}</strong>
                <span>{project.subtitle}</span>
              </span>
              <span className="project-summary-result">
                {project.stats[0].value} · {project.stats[0].label}
              </span>
              <ArrowUpRight aria-hidden="true" />
            </button>
            ))}
          </div>
        </section>
      </div>
      <PageContinuation href="#strengths" label="优势" />
      {selectedProject && (
        <ProjectDetailModal
          index={selectedIndex}
          onClose={returnToOverview}
          project={selectedProject}
          returnFocusElement={projectButtonRefs.current[selectedIndex]}
        />
      )}
    </section>
  );
}

function Strengths() {
  return (
    <section className="section strengths-section" id="strengths">
      <div className="section-heading editorial-page-heading reveal-on-scroll" data-watermark="STRENGTHS">
        <p className="eyebrow">能力结构</p>
        <h2>内容运营能力结构</h2>
        <p>从内容判断到数据复盘，把每一次创作放进可执行、可协同、可迭代的工作链路。</p>
      </div>
      <div className="strengths-editorial-layout">
        <div className="strengths-editorial-column strengths-process-column">
          <div className="strength-block-heading reveal-on-scroll">
            <span>01</span>
            <div>
              <p>工作方法</p>
              <h3>一条完整的内容运营链路</h3>
            </div>
          </div>
          <div className="strength-workflow reveal-on-scroll" aria-label="内容运营完整流程">
            <ol className="workflow-flow">
              {workflowSteps.map((step) => (
                <li className="workflow-step" key={step.number}>
                  <span className="workflow-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="strengths-editorial-column strengths-capability-column">
          <div className="strength-block-heading reveal-on-scroll">
            <span>02</span>
            <div>
              <p>核心能力</p>
              <h3>能独立推进，也能进入协作</h3>
            </div>
          </div>
          <div className="strength-capabilities">
            {strengths.map((item) => (
              <article className="strength-card reveal-on-scroll" key={item.title}>
                <div className="strength-icon">{item.icon}</div>
                <div className="strength-copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
            <article className="strength-card strength-ai-capability reveal-on-scroll">
              <div className="strength-icon"><Sparkles aria-hidden="true" /></div>
              <div className="strength-copy">
                <h3>AI 产品与 Skill 创作</h3>
                <p>已独立制作并上线“不牛马厨房”，并围绕动态宠物、面试准备复盘和透明贴纸生产完成 3 套 Skill，把个人判断转化为可复用、可校验的工作流。</p>
              </div>
            </article>
          </div>
        </div>
      </div>
      <PageContinuation href="#contact" label="联系" />
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <img
        className="contact-background"
        src={assetUrl('assets/contact-green-light.png')}
        alt=""
        aria-hidden="true"
      />
      <div className="contact-inner editorial-page-heading reveal-on-scroll" data-watermark="CONTACT">
        <div className="contact-masthead">
          <p className="eyebrow">Contact</p>
          <span>05 / 05</span>
        </div>
        <h2 className="contact-statement">
          <span>期待在真实业务里</span>
          <span>继续把内容做得</span>
          <span>可见、可信，也可转化。</span>
        </h2>
        <div className="contact-information-grid">
          <div className="contact-actions">
            <span>求职联系</span>
            <a className="button button-primary" href="mailto:2436528353@qq.com">
              <Mail aria-hidden="true" />
              2436528353@qq.com
            </a>
          </div>
        </div>
        <PageContinuation href="#home" label="首页" isReturn />
      </div>
    </section>
  );
}

function BackToTop({ visible }) {
  const scrollToTop = () => {
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <button
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      type="button"
      aria-label="返回顶部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      title="返回顶部"
      onClick={scrollToTop}
    >
      <ArrowUp aria-hidden="true" />
    </button>
  );
}

function ClickBloom() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const activeBursts = new Set();
    const cleanupTimers = new Set();

    const createBurst = (event) => {
      if (event.button !== 0 || reducedMotion.matches) return;

      const burst = document.createElement('span');
      burst.className = 'click-bloom';
      burst.setAttribute('aria-hidden', 'true');
      burst.style.setProperty('--bloom-x', `${event.clientX}px`);
      burst.style.setProperty('--bloom-y', `${event.clientY}px`);

      Array.from({ length: 8 }, (_, index) => {
        const particle = document.createElement('span');
        particle.className = `click-particle click-particle-starfield star-depth-${(index % 3) + 1}`;
        particle.style.setProperty('--particle-x', `${Math.round(Math.random() * 110 - 55)}px`);
        particle.style.setProperty('--particle-y', `${Math.round(22 + Math.random() * 58)}px`);
        particle.style.setProperty('--particle-delay', `${Math.random() * 95}ms`);
        particle.style.setProperty('--particle-scale', `${0.62 + Math.random() * 0.52}`);
        particle.style.setProperty('--particle-rotate', `${Math.round(Math.random() * 70 - 35)}deg`);
        burst.appendChild(particle);
        return particle;
      });

      document.body.appendChild(burst);
      activeBursts.add(burst);
      const timer = window.setTimeout(() => {
        burst.remove();
        activeBursts.delete(burst);
        cleanupTimers.delete(timer);
      }, 1180);
      cleanupTimers.add(timer);
    };

    window.addEventListener('pointerdown', createBurst, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', createBurst);
      cleanupTimers.forEach((timer) => window.clearTimeout(timer));
      activeBursts.forEach((burst) => burst.remove());
    };
  }, []);

  return null;
}

const entryExperiencePages = [
  { company: '华大基因', role: '自媒体运营', time: '2025.09—2026.02' },
  { company: '网易', role: '小红书运营', time: '2024.12—2025.03' },
  { company: '畅捷通 / 用友', role: '新媒体运营', time: '2024.06—2024.09' },
  { company: '去哪儿', role: '旅游内容运营', time: '2023.02—2023.11' },
  { company: '天眼查', role: '热点内容运营', time: '实习经历' },
  { company: '学而思', role: '官方账号内容运营', time: '内容项目' },
  { company: '小黑羊', role: '游戏宣发写作', time: '实习经历' },
];

const entryScenePages = [
  { ...projectImages.brand[0], label: '品牌自媒体运营' },
  { ...projectImages.education[0], label: '教育账号运营' },
  { ...projectImages.official[0], label: '热点与官方内容' },
];

function PortfolioEntryLegacy({ onEnter }) {
  const [isSequencing, setIsSequencing] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);
  const exitTimerRef = useRef(null);
  const leavingRef = useRef(false);

  const enterChapter = useCallback((href = '#home') => {
    if (leavingRef.current) return;

    leavingRef.current = true;
    setIsLeaving(true);
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    exitTimerRef.current = window.setTimeout(() => onEnter(href), shouldReduceMotion ? 20 : 620);
  }, [onEnter]);

  useEffect(() => {
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (shouldReduceMotion) {
      setIsSequencing(false);
      return undefined;
    }

    const sequenceTimer = window.setTimeout(() => setIsSequencing(false), 6900);
    return () => window.clearTimeout(sequenceTimer);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') enterChapter('#home');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, [enterChapter]);

  return (
    <section
      className={`portfolio-entry${isLeaving ? ' is-leaving' : ''}`}
      aria-label="内容运营作品集入口"
      aria-busy={isSequencing}
    >
      <div className="entry-forest-light entry-forest-light-one" aria-hidden="true" />
      <div className="entry-forest-light entry-forest-light-two" aria-hidden="true" />

      <div className="entry-scene">
        <header className="entry-intro">
          <p>Editorial Portfolio · 2026</p>
          <h1>一本关于内容、审美与成长的作品集</h1>
        </header>

        <div className="entry-story-stage">
          <div className="entry-mailbox-scene" aria-hidden="true">
            <div className="entry-mailbox">
              <span className="entry-mailbox-top" />
              <span className="entry-mailbox-slot" />
              <span className="entry-mailbox-door">POST</span>
              <span className="entry-mailbox-post" />
            </div>
            {entryExperiencePages.map((item, index) => (
              <article className={`entry-mail-letter entry-mail-letter-${index + 1}`} key={item.company}>
                <span>{item.time}</span>
                <h2>{item.company}</h2>
                <p>{item.role}</p>
              </article>
            ))}
          </div>

          <div className="entry-gather-stack" aria-hidden="true">
            <span className="entry-gather-page entry-gather-page-one" />
            <span className="entry-gather-page entry-gather-page-two" />
            <span className="entry-gather-page entry-gather-page-three" />
            <span className="entry-gather-page entry-gather-page-four" />
          </div>

          {entryScenePages.map((scene, index) => (
            <figure className={`entry-story-scene-page entry-story-scene-page-${index + 1}`} key={scene.src} aria-hidden="true">
              <img src={scene.src} alt="" />
              <figcaption>{scene.label}</figcaption>
            </figure>
          ))}

          <div className="entry-story-book-layer">
            <button
              className="entry-story-book"
              type="button"
              disabled={isSequencing}
              aria-label="进入完整作品集"
              onClick={() => enterChapter('#home')}
            >
              <span className="entry-story-book-spine" aria-hidden="true" />
              <div className="entry-cover-copy" aria-hidden="true">
                <span>Editorial Portfolio · 2026</span>
                <h2>内容 · 审美<br />与成长</h2>
                <p>Selected Works</p>
              </div>
            </button>
          </div>
        </div>

        <footer className="entry-actions">
          <p aria-live="polite">
            {isSequencing ? '经历正在汇聚成册…' : '点击封面，进入完整作品集'}
          </p>
        </footer>
      </div>
    </section>
  );
}

function PortfolioEntry({ onEnter }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const exitTimerRef = useRef(null);
  const leavingRef = useRef(false);

  const enterPortfolio = useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setIsLeaving(true);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    exitTimerRef.current = window.setTimeout(() => onEnter('#home'), reduceMotion ? 20 : 480);
  }, [onEnter]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') enterPortfolio();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, [enterPortfolio]);

  return (
    <section
      className={`portfolio-entry portfolio-entry-editorial${isLeaving ? ' is-leaving' : ''}`}
      aria-label={'\u5185\u5bb9\u8fd0\u8425\u4f5c\u54c1\u96c6\u5165\u53e3'}
    >
      <div className="entry-book-reveal" aria-hidden="true">
        <div className="entry-book-object">
          <div className="entry-book-page entry-book-page-back">
            <div className="entry-open-page-content">
              <div className="entry-open-page-head">
                <span>内容纪事 · 卷一</span>
                <span>2023—2026</span>
              </div>
              <h3>把经历写进<br />每一页里</h3>
              <p>从品牌内容、平台增长到 AI 产品实践，记录每一次真实发生的判断、创作与抵达。</p>
              <div className="entry-open-page-index">
                <span>品牌</span>
                <span>增长</span>
                <span>产品</span>
              </div>
              <small>001</small>
            </div>
          </div>
          <div className="entry-book-page entry-book-flip entry-book-flip-one">
            <span>内容</span>
          </div>
          <div className="entry-book-page entry-book-flip entry-book-flip-two">
            <span>品牌</span>
          </div>
          <div className="entry-book-page entry-book-flip entry-book-flip-three">
            <span>增长</span>
          </div>
          <div className="entry-book-page entry-book-flip entry-book-flip-four">
            <span>产品</span>
          </div>
          <div className="entry-book-page entry-book-flip entry-book-flip-five">
            <span>记录</span>
          </div>
          <div className="entry-book-cover">
            <div className="entry-book-cover-copy">
              <div className="entry-book-cover-head">
                <small>CONTENT ARCHIVE</small>
                <small>2023—2026</small>
              </div>
              <div className="entry-book-cover-title">
                <strong>内容</strong>
                <strong>纪事</strong>
                <span>折椿作品集</span>
              </div>
              <div className="entry-book-cover-foot">
                <span>品牌 · 增长 · 产品</span>
                <span>第一卷</span>
              </div>
            </div>
            <div className="entry-book-cover-inside">
              <span>序</span>
              <p>一本关于内容、审美与成长的工作档案。</p>
              <small>SUN XIAOTING</small>
            </div>
            <span className="entry-book-spine-line" />
          </div>
        </div>
      </div>
      <div className="entry-cinematic" aria-hidden="true">
        <div className="entry-cinematic-image" />
        <div className="entry-cinematic-shade" />
      </div>
      <div className="entry-rule entry-rule-top" aria-hidden="true" />
      <div className="entry-rule entry-rule-bottom" aria-hidden="true" />

      <div className="entry-editorial">
        <header className="entry-masthead">
          <span>SUN XIAOTING</span>
          <span>PORTFOLIO / 2026</span>
        </header>

        <div className="entry-title-block">
          <p>{'\u5185\u5bb9\u8fd0\u8425 \u00b7 \u7f16\u8f91\u7b56\u5212'}</p>
          <h1>
            <span>{'\u8ba9\u5185\u5bb9\u88ab\u770b\u89c1\uff0c'}</span>
            <span>{'\u4e5f\u8ba9\u54c1\u724c\u88ab\u8bb0\u4f4f\u3002'}</span>
          </h1>
          <div className="entry-title-meta">
            <span>{'\u54c1\u724c\u81ea\u5a92\u4f53'}</span>
            <span>{'\u793e\u5a92\u4f53\u8fd0\u8425'}</span>
            <span>{'\u5185\u5bb9\u7b56\u5212'}</span>
          </div>
        </div>

        <footer className="entry-enter-row">
          <p>Selected work / 2023—2026</p>
          <button type="button" onClick={enterPortfolio}>
            <span>{'\u8fdb\u5165\u4f5c\u54c1\u96c6'}</span>
            <ArrowUpRight aria-hidden="true" />
          </button>
        </footer>
      </div>
    </section>
  );
}

export default function App() {
  const {
    activeSection,
    scrollProgress,
    showBackToTop,
    transitionPhase,
  } = usePageInteractions();
  const pages = {
    home: <Hero />,
    about: <About />,
    projects: <Projects />,
    strengths: <Strengths />,
    contact: <Contact />,
  };

  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <Header activeSection={activeSection} scrollProgress={scrollProgress} />
      <main className="portfolio-page-shell" id="main-content" tabIndex="-1">
        <div
          className={`portfolio-page-view is-${transitionPhase}`}
          key={activeSection}
        >
          {pages[activeSection]}
        </div>
      </main>
      <BackToTop visible={showBackToTop} />
      <ClickBloom />
    </>
  );
}
