import {
  ArrowUp,
  ArrowUpRight,
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  FileText,
  Leaf,
  Mail,
  Map,
  Maximize2,
  Menu,
  MessageCircle,
  Play,
  Sparkles,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path}`;

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
    summaryLabel: '职责',
    text: '公众号、小红书与短视频统筹，参与品牌种草。',
  },
  {
    time: '2024.12 - 2025.03',
    type: '实习',
    role: '小红书运营',
    company: '网易网络有限公司',
    summaryLabel: '成果',
    text: '从 0 到 1 搭建教育类账号矩阵，承接咨询留资。',
  },
  {
    time: '2024.06 - 2024.09',
    type: '实习',
    role: '新媒体运营',
    company: '畅捷通信息技术股份有限公司',
    summaryLabel: '成果',
    text: 'B 端内容多平台分发，月均沉淀 30+ 线索。',
  },
  {
    time: '2023.02 - 2023.11',
    type: '线上兼职',
    role: '新媒体运营 / 小红书运营',
    company: '北京趣拿软件科技有限公司（去哪儿）',
    summaryLabel: '成果',
    text: '旅游攻略与引流优化，团队前三、获银牌。',
  },
  {
    time: '阶段性项目',
    type: '实习',
    role: '热点内容运营',
    company: '北京金堤科技有限公司（天眼查）',
    summaryLabel: '成果',
    text: '微博热点第 1，知乎单篇阅读 10W+。',
  },
  {
    time: '阶段性项目',
    type: '内容供给',
    role: '官方账号内容运营',
    company: '北京世纪好未来教育科技有限公司（学而思）',
    summaryLabel: '成果',
    text: '整理 37 城素材，官方账号曝光 100W+。',
  },
  {
    time: '阶段性项目',
    type: '实习',
    role: '游戏宣发写作',
    company: '小黑羊（天津）文化传媒有限公司',
    summaryLabel: '成果',
    text: '手游宣发稿全网阅读 80W+。',
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
      skill: '@hatch wheel skill',
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
      url: 'https://zhechun.space',
    },
    stats: [
      { value: '800', label: '道家常菜' },
      { value: '1', label: '个上线产品' },
      { value: '1', label: '套原创 Skill' },
    ],
    links: [
      { group: '不牛马厨房 · 在线体验', label: 'zhechun.space', url: 'https://zhechun.space' },
    ],
    summary:
      '面向“今晚吃什么”的高频选择难题，将 800 道家常菜、随机转盘、偏好筛选和宠物反馈整合为一套可直接访问的决策体验。',
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
  },
];

const projects = [...projectCatalog.slice(1), projectCatalog[0]];

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
    text: '关注内容排期、账号互动与数据复盘，让内容稳定进入真实传播链路。',
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

function usePageInteractions() {
  const [pageState, setPageState] = useState({
    activeSection: 'home',
    scrollProgress: 0,
    showBackToTop: false,
  });

  useEffect(() => {
    let frameId = 0;

    const updatePageState = () => {
      frameId = 0;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const readingLine = scrollTop + Math.min(window.innerHeight * 0.42, 360);
      let activeSection = 'home';

      navItems.forEach((item) => {
        const section = document.querySelector(item.href);
        if (section && section.offsetTop <= readingLine) {
          activeSection = item.href.slice(1);
        }
      });

      setPageState({
        activeSection,
        scrollProgress: Math.min(1, Math.max(0, scrollTop / maxScroll)),
        showBackToTop: scrollTop > window.innerHeight * 0.72,
      });
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
  }, []);

  return pageState;
}

function Header({ activeSection, scrollProgress }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const closeMenu = () => setOpen(false);

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
      <div className="header-actions">
        <a className="button button-primary" href="mailto:2436528353@qq.com">
          <Mail aria-hidden="true" />
          联系我
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? '关闭导航' : '打开导航'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="移动端导航">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                className={isActive ? 'is-active' : undefined}
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
      <span
        className="header-scroll-progress"
        style={{ '--scroll-ratio': scrollProgress }}
        aria-hidden="true"
      />
    </header>
  );
}

function VinylMusicButton() {
  const [active, setActive] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [showTrackLabel, setShowTrackLabel] = useState(false);
  const contextRef = useRef(null);
  const vinylSourceRef = useRef(null);
  const masterGainRef = useRef(null);
  const chordTimerRef = useRef(null);
  const noteTimerRef = useRef(null);
  const labelTimerRef = useRef(null);
  const chordIndexRef = useRef(0);

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

  const stopMusic = () => {
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
      masterGainRef.current.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
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
    }, 420);
    setActive(false);
  };

  const switchTrack = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      return;
    }

    const context = contextRef.current || new AudioContext();
    contextRef.current = context;
    await context.resume();
    const nextIndex = active ? (trackIndex + 1) % tracks.length : trackIndex;
    if (active) stopMusic();
    startVinylMusic(context, tracks[nextIndex]);
    setTrackIndex(nextIndex);
    setActive(true);
    setShowTrackLabel(true);
    window.clearTimeout(labelTimerRef.current);
    labelTimerRef.current = window.setTimeout(() => setShowTrackLabel(false), 1800);
  };

  useEffect(() => {
    return () => {
      window.clearInterval(chordTimerRef.current);
      window.clearInterval(noteTimerRef.current);
      window.clearTimeout(labelTimerRef.current);
      try {
        vinylSourceRef.current?.stop();
      } catch {
        // Source may already be stopped by the toggle handler.
      }
      contextRef.current?.close();
    };
  }, []);

  return (
    <div className="vinyl-switcher">
      <button
        className={`sound-toggle${active ? ' is-active' : ''}`}
        type="button"
        aria-label={active ? `正在播放${tracks[trackIndex].title}，点击切换下一首` : `播放${tracks[trackIndex].title}`}
        aria-pressed={active}
        onClick={switchTrack}
        title={active ? `${tracks[trackIndex].title} · 点击切歌` : '点击播放森林歌单'}
      >
        <span className="vinyl-player" aria-hidden="true">
          <span className="vinyl-record"><span className="vinyl-label" /></span>
          <span className="vinyl-arm" />
        </span>
        <span className="vinyl-copy">
          <strong>{tracks[trackIndex].title}</strong>
          <small>{active ? '点击切歌' : '点击播放'}</small>
        </span>
      </button>
      <span className={`vinyl-track-label${showTrackLabel ? ' is-visible' : ''}`} aria-live="polite">
        {tracks[trackIndex].title}
      </span>
    </div>
  );
}

function Hero() {
  const posterRef = useRef(null);

  const movePosterLight = (event) => {
    const poster = posterRef.current;
    if (!poster || event.pointerType === 'touch') return;
    const bounds = poster.getBoundingClientRect();
    poster.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 2}`);
    poster.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 2}`);
  };

  const resetPosterLight = () => {
    posterRef.current?.style.setProperty('--pointer-x', '0');
    posterRef.current?.style.setProperty('--pointer-y', '0');
  };

  return (
    <section className="hero-section" id="home" aria-label="首页">
      <div
        className="magazine-poster"
        aria-label="折椿新媒体运营作品集封面"
        onPointerMove={movePosterLight}
        onPointerLeave={resetPosterLight}
        ref={posterRef}
      >
        <span className="magazine-grain" aria-hidden="true" />
        <span className="soft-light soft-light-one" aria-hidden="true" />
        <span className="soft-light soft-light-two" aria-hidden="true" />
        <span className="film-flash" aria-hidden="true" />
        <div className="rain-scene" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span className={`rain-drop rain-drop-${index + 1}`} key={index}>
              <span className="rain-splash" />
            </span>
          ))}
        </div>

        <figure className="magazine-visual">
          <img
            className="magazine-main-image"
            src={assetUrl('assets/hero-forest-photo.webp')}
            alt="雾绿色森林树冠与白鸟飞过的自然光影"
            fetchPriority="high"
          />
          <span className="grass-flow grass-flow-back" aria-hidden="true" />
          <span className="grass-flow grass-flow-front" aria-hidden="true" />
          <span className="film-frame-note" aria-hidden="true">F400 · 1/250 · CONTENT LOG</span>
        </figure>

        <div className="magazine-copy">
          <p className="hero-kicker">内容策划 / 账号运营 / 品牌表达</p>
          <h1>
            <span>折椿</span>
            <small>Editorial Content Portfolio</small>
          </h1>
          <p className="hero-copy">
            用审美判断、内容组织和平台语感，完成从选题到传播反馈的运营表达。
          </p>
          <div className="hero-index">
            <a href="#projects">
              精选项目
              <ArrowUpRight aria-hidden="true" />
            </a>
            <a href="mailto:2436528353@qq.com">
              联系我
              <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="magazine-collage" aria-hidden="true">
          <span className="crop-tile crop-tile-one" />
          <span className="crop-tile crop-tile-two" />
          <span className="mist-panel" />
        </div>

        <a className="page-hint" href="#about" aria-label="向下浏览个人经历">
          向下浏览
          <ArrowUpRight aria-hidden="true" />
        </a>
        <VinylMusicButton />
      </div>
    </section>
  );
}

function InteractivePortrait() {
  const [activeDirection, setActiveDirection] = useState(0);
  const activeItem = profileDirections[activeDirection];

  const handlePointerMove = (event) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const offsetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const offsetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    target.style.setProperty('--portrait-x', `${offsetX * 7}px`);
    target.style.setProperty('--portrait-y', `${offsetY * 6}px`);
    target.style.setProperty('--portrait-tilt-x', `${offsetY * -1.6}deg`);
    target.style.setProperty('--portrait-tilt-y', `${offsetX * 1.8}deg`);
  };

  const resetPointer = (event) => {
    const target = event.currentTarget;
    target.style.setProperty('--portrait-x', '0px');
    target.style.setProperty('--portrait-y', '0px');
    target.style.setProperty('--portrait-tilt-x', '0deg');
    target.style.setProperty('--portrait-tilt-y', '0deg');
  };

  return (
    <figure className="portrait-panel reveal-on-scroll">
      <div
        className="portrait-visual"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <img src={assetUrl('media/pdf-images/full_p02_i01_Im73.jpg')} alt="折椿个人照片" />
        <span className="portrait-light" aria-hidden="true" />
        <span className="portrait-count" aria-hidden="true">0{activeDirection + 1}</span>
      </div>
      <figcaption>
        <div className="portrait-heading-row">
          <span className="portrait-label">求职方向</span>
          <a className="portrait-email" href="mailto:2436528353@qq.com" aria-label="发送邮件至 2436528353@qq.com">
            <Mail aria-hidden="true" />
            <span>2436528353@qq.com</span>
          </a>
        </div>
        <strong>运营、策划、产品类</strong>
        <div className="portrait-tabs" role="tablist" aria-label="求职方向能力切换">
          {profileDirections.map((item, index) => (
            <button
              type="button"
              role="tab"
              id={`profile-direction-tab-${index}`}
              aria-controls="profile-direction-panel"
              aria-selected={activeDirection === index}
              tabIndex={activeDirection === index ? 0 : -1}
              className={activeDirection === index ? 'is-active' : ''}
              onClick={() => setActiveDirection(index)}
              key={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="portrait-direction"
          id="profile-direction-panel"
          role="tabpanel"
          aria-labelledby={`profile-direction-tab-${activeDirection}`}
          aria-live="polite"
          key={activeItem.label}
        >
          <span>{activeItem.title}</span>
          <p>{activeItem.text}</p>
        </div>
      </figcaption>
    </figure>
  );
}

function About() {
  return (
    <section className="section about-section" id="about">
      <div className="section-heading reveal-on-scroll">
        <p className="eyebrow">关于与经历</p>
        <h2>偏内容创意型的新媒体运营。</h2>
        <p>
          我关注内容在不同平台里的角色分工：小红书负责种草触达与心智渗透，公众号承接深度表达与信任建立，评论区和私信用于沉淀互动反馈和转化线索。
        </p>
      </div>
      <div className="about-grid">
        <InteractivePortrait />
        <div className="about-body">
          <div className="timeline">
            {experience.map((item, index) => (
              <article className="timeline-item reveal-on-scroll" key={`${item.company}-${item.time}`}>
                <div className="timeline-meta">
                  <span className="experience-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <time>{item.time}</time>
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">
                    <h3>{item.role}</h3>
                    <span className="experience-type">{item.type}</span>
                  </div>
                  <p className="company">{item.company}</p>
                  <div className="career-summary">
                    <span className="career-summary-label">{item.summaryLabel}</span>
                    <span className="career-summary-text">{item.text}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
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
  const imageCount = images.length;

  const stopAutoplay = useCallback(() => setAutoplayStopped(true), []);
  const move = useCallback((step) => {
    setActiveIndex((index) => (index + step + imageCount) % imageCount);
  }, [imageCount]);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

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
      <div className="carousel-stage">
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
          onClick={() => {
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
              <span>打开 zhechun.space</span>
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
        className={`project-modal-window${project.aiProduct ? ' is-ai-product-modal' : ''}`}
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
        <div className="project-modal-scroll">
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
              <ProjectSourceLinks links={project.links} title={project.title} />
            </div>
          </div>
          <details className="project-modal-secondary">
            <summary>
              <span>完整介绍</span>
              <small>{project.aiProduct || project.aiDesign ? '含补充材料' : '展开阅读'}</small>
              <ChevronDown aria-hidden="true" />
            </summary>
            <div className="project-modal-secondary-content">
              <p className="project-modal-full-summary">{project.summary}</p>
              {project.aiProduct && <AiProductSpotlight content={project.aiProduct} />}
              {project.aiDesign && <AiDesignShowcase content={project.aiDesign} />}
            </div>
              </details>
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
  const projectButtonRefs = useRef([]);
  const selectedProject = selectedIndex === null ? null : projects[selectedIndex];

  const openProject = (index) => {
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
      <div className="section-heading projects-heading reveal-on-scroll">
        <h2>项目经历</h2>
      </div>
      <div className="experience-overview-panel">
        <div className="experience-overview-intro">
          <p>共 {projects.length} 个项目</p>
          <span>点击项目查看执行过程、数据与原始作品。</span>
        </div>
        <div className="experience-overview-grid">
          {projects.map((project, index) => (
            <button
              className={`experience-card${project.aiProduct ? ' is-supporting' : ''}`}
              type="button"
              onClick={() => openProject(index)}
              ref={(node) => { projectButtonRefs.current[index] = node; }}
              key={project.title}
            >
              <span className="experience-card-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="experience-card-visual">
                <img src={project.image} alt="" loading="lazy" />
              </span>
              <span className="experience-card-copy">
                <span className="experience-card-kicker">{project.aiProduct ? '独立产品实践 · AI 应用' : project.subtitle}</span>
                <strong>{project.title}</strong>
                <span>{project.stats[0].value} · {project.stats[0].label}</span>
              </span>
              <ArrowUpRight className="experience-card-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
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
      <div className="section-heading reveal-on-scroll">
        <p className="eyebrow">能力结构</p>
        <h2>内容运营能力结构</h2>
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
            <p>已独立制作并上线“不牛马厨房”转盘点餐小程序，同时完成 {projectCatalog[0].aiProduct.skill} 转盘宠物 Skill，能把 AI 从想法落到真实可用的产品体验。</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner reveal-on-scroll">
        <p className="eyebrow">Contact</p>
        <h2>期待在真实业务里继续把内容做得可见、可信，也可转化。</h2>
        <p>
          如果你想了解我的完整作品、平台链接或具体项目复盘，可以通过邮件联系我。
        </p>
        <div className="contact-actions">
          <a className="button button-primary" href="mailto:2436528353@qq.com">
            <Mail aria-hidden="true" />
            2436528353@qq.com
          </a>
        </div>
      </div>
      <div className="contact-orbit" aria-hidden="true">
        <BookOpenText />
        <Sparkles />
        <Leaf />
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
  const { activeSection, scrollProgress, showBackToTop } = usePageInteractions();

  return (
    <>
      <Header activeSection={activeSection} scrollProgress={scrollProgress} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
      <BackToTop visible={showBackToTop} />
      <ClickBloom />
    </>
  );
}
