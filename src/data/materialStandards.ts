export const materialStandards = [
  {
    slug: "all-agent",
    title: "全民代理",
    category: "运营活动",
    description: "全民代理顶部横幅、分享海报规格及 PC / H5 实际页面预览。",
    keywords: "全民代理 全名代理 代理推广 邀请 PC H5 顶部横幅 分享海报 347x140 600x232 300x368 PNG WEBP 3X",
  },
  {
    slug: "brand-logo",
    title: "品牌 Logo",
    category: "品牌标识",
    description: "首页、登录注册、浏览器与 PWA 的品牌 Logo 规格及源图。",
    keywords: "88x28 97x40 176x56 194x80 64x64 256x256 logo-h5 logo-pc logo-browser logo-pwa 首页 登录 注册 浏览器 PWA",
  },
  {
    slug: "terms-logo",
    title: "服务条款 Logo",
    category: "品牌标识",
    description: "服务条款 Logo 源图及 PC / H5 使用页面。",
    keywords: "300x300 服务条款 image 1841546675",
  },
  {
    slug: "banner",
    title: "首页 Banner",
    category: "首页素材",
    description: "首页 PC / H5 Banner 尺寸、格式、命名与导出规格。",
    keywords: "347x110 1261x300 banner-h5 banner-pc 首页 头部",
  },
  {
    slug: "home-popup",
    title: "首页弹窗",
    category: "首页素材",
    description: "PC / H5 首页弹窗模板、源图与实际使用页面。",
    keywords: "首页弹窗 游戏弹窗 模板 PC H5",
  },
  {
    slug: "menu-icons",
    title: "菜单图标",
    category: "首页素材",
    description: "PC / H5 菜单图标尺寸、格式与使用位置。",
    keywords: "48x48 24x24 菜单图标 字体图标",
  },
  {
    slug: "login-visual",
    title: "登录注册图",
    category: "账号素材",
    description: "登录注册配图规格、源图与 PC / H5 使用页面。",
    keywords: "655x482 375x262 登录 注册 登录注册图",
  },
  {
    slug: "activity-list",
    title: "活动图",
    category: "运营活动",
    description: "活动封面与详情图规格，支持 PC / H5 切换。",
    keywords: "407x186 375 活动封面 活动详情 列表",
  },
  {
    slug: "red-packet",
    title: "红包",
    category: "运营活动",
    description: "红包入口、提示窗、标题栏、状态背景与关闭按钮。",
    keywords: "80x80 132x32 292x180 301x429 红包 提示窗 标题栏 关闭按钮",
  },
  {
    slug: "turntable",
    title: "转盘",
    category: "运营活动",
    description: "转盘主体、指针、奖励底图与奖励图标。",
    keywords: "750x1276 160x160 517x517 64x64 转盘 指针 奖励",
  },
  {
    slug: "tg-assets",
    title: "TG 宣传图",
    category: "运营活动",
    description: "TG 宣传图规格与单张完整素材预览。",
    keywords: "1448x1086 1920x1080 TG 宣传图 运营图",
  },
  {
    slug: "game-cover",
    title: "游戏封面图",
    category: "游戏素材",
    description: "游戏封面图规格与 PC / H5 实际页面预览。",
    keywords: "600x800 游戏封面 JPG",
  },
  {
    slug: "venue-logo",
    title: "场馆 Logo",
    category: "游戏素材",
    description: "场馆 Logo 分类浏览、单个文件与压缩包下载。",
    keywords: "70 32x32 84x84 96x96 99x96 场馆 Logo WEBP 体育 真人 电子 棋牌 彩票 小游戏",
  },
]

function normalizeMaterialQuery(value: string) {
  return value.toLowerCase().replace(/[×＊*]/g, "x").replace(/[\s_\-\/（）()]/g, "")
}

export function searchMaterialStandards(query: string) {
  const normalizedQuery = normalizeMaterialQuery(query)
  return materialStandards.filter((item) =>
    normalizeMaterialQuery(["代理素材规范", item.title, item.category, item.description, item.keywords].join(" ")).includes(normalizedQuery)
  )
}
