const pages = typeof AURORA_PAGES !== "undefined" ? AURORA_PAGES : window.AURORA_PAGES || [];
const baseBackendUrl = "https://admin.aurora.test/#";
const defaultPageKey = "dataCenter-overview";
const stateKey = "auroraAdminPrototypeState";

const savedState = readSavedState();

let version = savedState.version || "current";
let activeTab = "";
let selectedPage = pages.find((page) => page.key === savedState.pageKey) || pages.find((page) => page.key === defaultPageKey) || pages[0];

const shell = document.querySelector(".prototype-shell");
const topMenu = document.querySelector(".side-nav");
const pageSelect = document.querySelector("#pageSelect");
const backendFrame = document.querySelector("#backendFrame");
const liveOpenLink = document.querySelector("#liveOpenLink");
const breadcrumbs = document.querySelector("#breadcrumbs");
const pageTitle = document.querySelector("#pageTitle");
const pageDesc = document.querySelector("#pageDesc");
const insightStrip = document.querySelector("#insightStrip");
const filterPanel = document.querySelector(".filter-panel");
const optimizedFilters = document.querySelector("#optimizedFilters");
const statusTabs = document.querySelector("#statusTabs");
const dashboardView = document.querySelector("#dashboardView");
const tableTitle = document.querySelector("#tableTitle");
const toolbarHint = document.querySelector("#toolbarHint");
const tableHead = document.querySelector("#tableHead");
const tableBody = document.querySelector("#tableBody");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const drawer = document.querySelector("#detailDrawer");
const drawerMask = document.querySelector("#drawerMask");
const drawerTitle = document.querySelector("#drawerTitle");
const drawerBody = document.querySelector("#drawerBody");
const toast = document.querySelector("#toast");
const explainBtn = document.querySelector("#explainBtn");
const explainMask = document.querySelector("#explainMask");
const explainModal = document.querySelector("#explainModal");
const closeExplain = document.querySelector("#closeExplain");
const compareTable = document.querySelector("#compareTable");

const kindCopy = {
  dashboard: {
    desc: "基于老版默认首页读取结果，重组余额、输赢、充提、优惠、代理、在线分布和排行。",
    insights: [["会员总余额", "84024973021.46", "老版顶部余额卡"], ["公司游戏输赢", "1490.773", "当天数据约 30 分钟延迟"], ["优惠统计", "14573.94", "活动优惠占主要成本"], ["在线人数", "2", "www.aurora.test 域名"]],
    tabs: ["总览", "游戏输赢", "资金充提", "优惠代理"],
    action: "查看数据"
  },
  audit: {
    desc: "围绕待审数量、风险原因、审核链路和下一步动作组织处理队列。",
    insights: [["待审核", "18", "优先展示临近超时项"], ["高风险", "4", "需复核异常原因"], ["今日处理", "126", "含自动审核通过"], ["平均耗时", "7m", "比昨日缩短 12%"]],
    tabs: ["待审核", "审核中", "已通过", "已拒绝"],
    action: "审核处理"
  },
  finance: {
    desc: "围绕金额、状态、渠道回执、异常备注和处理责任人组织资金队列。",
    insights: [["待处理", "12", "需领取或补齐凭证"], ["处理中", "9", "待渠道回调确认"], ["待处理金额", "479 USDT", "含多币种折算"], ["异常备注", "5", "缺凭证 / 超时"]],
    tabs: ["未处理", "处理中", "已完成", "异常"],
    action: "资金处理"
  },
  record: {
    desc: "围绕记录追踪、异常定位、导出复核和关联对象快速排查。",
    insights: [["今日记录", "238", "默认按时间倒序"], ["异常记录", "6", "需人工跟进"], ["已完成", "192", "可直接导出"], ["待跟进", "11", "关联业务对象"]],
    tabs: ["全部", "异常", "已完成", "待跟进"],
    action: "查看记录"
  },
  report: {
    desc: "围绕核心指标、趋势变化、异常波动和导出任务组织报表视图。",
    insights: [["核心指标", "8", "置顶展示"], ["环比变化", "+12%", "自动标记波动"], ["异常项", "3", "点击定位明细"], ["导出队列", "2", "后台生成中"]],
    tabs: ["总览", "异常波动", "已导出", "待确认"],
    action: "查看报表"
  },
  config: {
    desc: "围绕配置影响范围、启用状态、最近变更和保存校验降低误操作风险。",
    insights: [["配置项", "32", "按业务域分组"], ["已启用", "25", "关键开关前置"], ["待确认", "4", "保存前展示摘要"], ["最近变更", "6", "可追溯操作人"]],
    tabs: ["全部配置", "已启用", "待确认", "最近变更"],
    action: "配置详情"
  },
  list: {
    desc: "围绕业务对象、关键状态、风险标记和高频操作组织管理列表。",
    insights: [["总数", "1,284", "按活跃度排序"], ["活跃", "876", "关键对象前置"], ["异常", "17", "需处理原因"], ["待处理", "42", "下一步动作明确"]],
    tabs: ["全部", "活跃", "异常", "待处理"],
    action: "查看详情"
  }
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function readSavedState() {
  const fallback = { version: "current", pageKey: defaultPageKey };
  try {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hashVersion = hashParams.get("version");
    const hashPage = hashParams.get("page");
    if (hashVersion || hashPage) {
      return {
        version: ["current", "optimized"].includes(hashVersion) ? hashVersion : fallback.version,
        pageKey: hashPage || fallback.pageKey
      };
    }
    return { ...fallback, ...JSON.parse(localStorage.getItem(stateKey) || "{}") };
  } catch {
    return fallback;
  }
}

function applyRouteState(nextState) {
  const nextVersion = ["current", "optimized"].includes(nextState.version) ? nextState.version : version;
  const nextPage = pages.find((page) => page.key === nextState.pageKey) || selectedPage;
  const changed = nextVersion !== version || nextPage?.key !== selectedPage?.key;

  version = nextVersion;
  selectedPage = nextPage;
  shell.dataset.version = version;
  document.body.classList.toggle("optimized", version === "optimized");
  document.querySelectorAll(".version-btn").forEach((item) => item.classList.toggle("active", item.dataset.version === version));

  if (changed) {
    activeTab = "";
    closeDrawer();
    renderPage();
  }
}

function saveState() {
  const nextState = { version, pageKey: selectedPage?.key || defaultPageKey };
  try {
    localStorage.setItem(stateKey, JSON.stringify(nextState));
    const params = new URLSearchParams({ version: nextState.version, page: nextState.pageKey });
    history.replaceState(null, "", `#${params.toString()}`);
  } catch {
    // 本地 file:// 或隐私模式下可能禁用存储，页面仍保持当前内存状态。
  }
}

function currentKind() {
  return kindCopy[selectedPage?.kind] || kindCopy.list;
}

function isDashboardPage() {
  return selectedPage?.kind === "dashboard";
}

function isImageManagementPage(page = selectedPage) {
  return hasImageColumns(page) && /图片|图标|角标|LOGO|Logo|logo/.test(`${page.title} ${page.fullTitle}`);
}

function pageProfile() {
  const title = selectedPage.title || "";
  const fullTitle = selectedPage.fullTitle || "";
  const module = selectedPage.module || "";
  const text = `${title} ${fullTitle}`;
  if (isDashboardPage()) {
    return { desc: currentKind().desc, insights: currentKind().insights, actions: [], tabs: currentKind().tabs, primaryAction: currentKind().action, detailAction: "查看", hint: "角色看板只服务数据中台，首屏聚焦经营指标和趋势" };
  }
  if (isImageManagementPage()) {
    return {
      desc: "管理游戏在不同端的展示素材，重点检查 PC 图、H5 图、角标状态并支持查看、修改和批量上传。",
      insights: [["图片总量", "2949", "老版列表总数"], ["PC / H5 图", "双端素材", "保持端内展示一致"], ["角标异常", "加载失败", "需要优先补图"], ["当前站点", "包网", "简体中文"]],
      actions: ["批量上传"],
      tabs: null,
      primaryAction: "修改",
      detailAction: "查看",
      hint: "PC图、H5图和角标并排展示，缺图状态直接暴露"
    };
  }
  if (/记录|日志|明细|History|Record/i.test(text)) {
    return {
      desc: "查询历史业务记录，重点支持按对象、时间和状态定位问题，并保留导出与详情追踪。",
      insights: [["今日记录", "238", "默认按时间倒序"], ["异常记录", "6", "优先排查"], ["可导出", "当前筛选", "用于复核"], ["关联对象", "会员 / 代理 / 订单", "支持追踪"]],
      actions: ["导出记录"],
      tabs: null,
      primaryAction: "查看记录",
      detailAction: "详情",
      hint: "按对象、时间和状态追踪记录，减少跨页查找"
    };
  }
  if (/审核|稽核|审批|风控/.test(text) || selectedPage.kind === "audit") {
    return {
      desc: "围绕待审对象、风险原因、审核链路和下一步动作组织审核队列。",
      insights: [["待审核", "18", "优先临近超时项"], ["高风险", "4", "需复核原因"], ["今日处理", "126", "含自动审核"], ["平均耗时", "7m", "比昨日缩短"]],
      actions: ["批量审核"],
      tabs: ["全部", "待审核", "审核中", "已通过", "已拒绝"],
      primaryAction: "审核处理",
      detailAction: "详情",
      hint: "风险原因、审核状态和处理动作前置"
    };
  }
  if (/提款|提现|充值|资金|账变|余额|财务|派发|代存|汇率/.test(text)) {
    return {
      desc: "处理资金相关业务，优先展示金额、状态、对象和异常原因，避免在长表格中查找关键字段。",
      insights: [["待处理", "12", "需要跟进"], ["金额汇总", "按币种", "默认 USDT 口径"], ["异常记录", "5", "需核对"], ["今日完成", "126", "可导出复核"]],
      actions: ["导出当前筛选"],
      tabs: ["全部", "待处理", "处理中", "已完成", "异常"],
      primaryAction: "查看资金",
      detailAction: "详情",
      hint: "金额、币种、状态和异常原因优先展示"
    };
  }
  if (module === "运营" && /统计|渠道|推广/.test(text)) {
    return {
      desc: "查看推广渠道和运营投放效果，重点关注注册、首充、充值提现和渠道贡献。",
      insights: [["注册人数", "按渠道", "定位拉新效果"], ["首充人数", "转化核心", "观察注册到付费"], ["充值金额", "按币种口径", "评估渠道质量"], ["渠道贡献", "可导出", "支持复盘"]],
      actions: ["导出数据"],
      tabs: null,
      primaryAction: "查看数据",
      detailAction: "详情",
      hint: "注册、首充、充值和提现按渠道集中对比"
    };
  }
  if (/报表|统计|分析/.test(text) || selectedPage.kind === "report") {
    return {
      desc: "查看业务指标和趋势变化，优先支持筛选、对比、异常定位和导出复核。",
      insights: [["核心指标", "8", "置顶展示"], ["环比变化", "+12%", "标记波动"], ["异常项", "3", "点击定位"], ["导出队列", "2", "后台生成"]],
      actions: ["导出报表"],
      tabs: null,
      primaryAction: "查看报表",
      detailAction: "详情",
      hint: "保留老版指标口径，增强对比和导出复核"
    };
  }
  if (module === "会员") {
    return {
      desc: "管理会员资料、标签、等级和状态，重点支持快速检索、查看详情和运营/风控标签维护。",
      insights: [["会员总数", "1,284", "按活跃排序"], ["活跃会员", "876", "可快速筛选"], ["异常会员", "17", "需跟进"], ["标签覆盖", "运营 / 风控", "便于分群"]],
      actions: ["导出会员"],
      tabs: ["全部", "活跃", "异常", "待跟进"],
      primaryAction: "查看会员",
      detailAction: "详情",
      hint: "会员身份、等级、标签和状态集中处理"
    };
  }
  if (module === "代理") {
    return {
      desc: "管理代理账号、资金、返佣和占成结算，重点看代理贡献、资金状态和结算进度。",
      insights: [["代理总数", "253", "含新增 1"], ["代理充值", "36724.5", "44 人 / 80 笔"], ["代理提现", "372", "1 人 / 4 笔"], ["返佣金额", "0", "待结算"]],
      actions: ["导出代理"],
      tabs: ["全部", "活跃", "待结算", "异常"],
      primaryAction: "查看代理",
      detailAction: "详情",
      hint: "代理贡献、资金状态和结算进度前置"
    };
  }
  if (module === "优惠") {
    return {
      desc: "管理活动、优惠券、抽奖和返水，重点看活动状态、成本、领取记录和派发效果。",
      insights: [["活动优惠", "14314.16", "主要成本"], ["返现优惠", "259.779", "需复盘"], ["待处理", "4", "配置/记录"], ["效果追踪", "排行", "看转化"]],
      actions: selectedPage.kind === "record" ? ["导出记录"] : ["新增活动"],
      tabs: selectedPage.kind === "record" ? null : ["全部", "进行中", "未开始", "已结束"],
      primaryAction: selectedPage.kind === "record" ? "查看记录" : "编辑活动",
      detailAction: "详情",
      hint: selectedPage.kind === "record" ? "优惠记录按对象和时间追踪" : "活动状态、成本和效果追踪前置"
    };
  }
  if (module === "运营") {
    return {
      desc: "处理运营配置、消息通知、推广渠道和推广数据，重点看发布状态、渠道效果和最近操作。",
      insights: [["待发布", "4", "需确认"], ["渠道统计", "今日", "看拉新"], ["最近操作", "6", "可追溯"], ["异常项", "2", "需处理"]],
      actions: selectedPage.kind === "record" || /统计/.test(text) ? ["导出数据"] : ["新增配置"],
      tabs: /统计|记录/.test(text) ? null : ["全部", "已启用", "待发布", "已停用"],
      primaryAction: /统计|记录/.test(text) ? "查看数据" : "编辑",
      detailAction: "详情",
      hint: /统计/.test(text) ? "推广指标和渠道转化集中查看" : "配置状态、影响范围和最近操作前置"
    };
  }
  if (module === "游戏") {
    return {
      desc: "管理游戏、场馆、赛事和玩法配置，重点看上架状态、维护状态、数据源和最近更新。",
      insights: [["游戏/赛事", "当前列表", "按场馆或数据源"], ["维护项", "待确认", "需处理"], ["最近更新", "6", "可追溯"], ["异常项", "2", "影响展示"]],
      actions: ["新增"],
      tabs: ["全部", "已上架", "维护中", "已下架"],
      primaryAction: "编辑",
      detailAction: "查看",
      hint: "场馆、游戏状态和最近更新前置"
    };
  }
  if (selectedPage.kind === "config") return { desc: currentKind().desc, insights: currentKind().insights, actions: ["新增配置"], tabs: currentKind().tabs, primaryAction: "配置详情", detailAction: "详情", hint: "配置影响范围、启用状态和保存校验前置" };
  return { desc: currentKind().desc, insights: currentKind().insights, actions: ["导出当前筛选"], tabs: currentKind().tabs, primaryAction: currentKind().action, detailAction: "详情", hint: "关键字段、状态和高频动作前置" };
}

function statusClass(status) {
  if (/拒|失败|异常|禁|停|未/.test(status)) return "reject";
  if (/通过|完成|成功|正常|启用|活跃|已/.test(status)) return "pass";
  if (/中|待|审核|确认|处理/.test(status)) return "pending";
  return "review";
}

function hasImageColumns(page = selectedPage) {
  return (page?.columns || []).some((column) => /PC图|H5图|图片|图标|角标|封面|LOGO|Logo|logo/i.test(column));
}

function isImageColumn(column) {
  return /PC图|H5图|图片|图标|角标|封面|LOGO|Logo|logo/i.test(column);
}

function imageLabel(column, row, index) {
  const name = row["游戏名称"] || row["场馆名称"] || row["名称"] || row["标题"] || row["活动名称"] || `素材 ${index + 1}`;
  if (/角标/.test(column)) return row[column] && row[column] !== "--" ? row[column] : "角标";
  if (/H5/i.test(column)) return `H5 ${name}`;
  if (/PC/i.test(column)) return `PC ${name}`;
  return String(name);
}

function renderImageCell(column, row, index) {
  const label = imageLabel(column, row, index);
  const className = /角标/.test(column) ? "mock-image badge-preview" : "mock-image";
  return `
    <div class="${className}" title="${escapeHtml(label)}">
      <span>${escapeHtml(label)}</span>
    </div>
  `;
}

function pageUrl(page = selectedPage) {
  return `${baseBackendUrl}${page.path}`;
}

function populatePageSelect() {
  const modules = orderedModules();
  pageSelect.innerHTML = modules.map((module) => {
    const options = pages
      .filter((page) => page.module === module)
      .map((page) => `<option value="${escapeHtml(page.key)}">${escapeHtml(page.fullTitle)}</option>`)
      .join("");
    return `<optgroup label="${escapeHtml(module)}">${options}</optgroup>`;
  }).join("");
  pageSelect.value = selectedPage.key;
}

function orderedModules() {
  const modules = [...new Set(pages.map((page) => page.module))];
  const preferred = ["数据中台", "会员", "代理", "优惠", "运营", "游戏", "财务", "报表", "风控", "系统", "TG Bot管理"];
  return preferred.filter((module) => modules.includes(module)).concat(modules.filter((module) => !preferred.includes(module)));
}

function pageParts(page) {
  return page.fullTitle.split(" / ").map((part) => part.trim()).filter(Boolean);
}

function buildModuleSections(modulePages) {
  const sections = new Map();
  modulePages.forEach((page) => {
    const parts = pageParts(page);
    const sectionName = parts.length > 2 ? parts[1] : "常用页面";
    if (!sections.has(sectionName)) sections.set(sectionName, []);
    sections.get(sectionName).push(page);
  });
  return sections;
}

function populateTopMenu() {
  const modules = orderedModules();
  topMenu.innerHTML = modules.map((module) => {
    const modulePages = pages.filter((page) => page.module === module);
    const sections = buildModuleSections(modulePages);
    const sectionsHtml = [...sections.entries()].map(([sectionName, sectionPages]) => `
      <section class="nav-section">
        <strong>${escapeHtml(sectionName)}</strong>
        <div>
          ${sectionPages.map((page) => {
            const parts = pageParts(page);
            const label = parts.length > 2 ? parts.slice(2).join(" / ") : page.title;
            return `<button class="nav-page" data-page-key="${escapeHtml(page.key)}" type="button">${escapeHtml(label)}</button>`;
          }).join("")}
        </div>
      </section>
    `).join("");

    return `
      <div class="nav-module" data-module="${escapeHtml(module)}">
        <button class="nav-module-trigger" type="button">${escapeHtml(module)}<span>${modulePages.length}</span></button>
        <div class="nav-dropdown">
          <div class="nav-dropdown-head">${escapeHtml(module)} <span>${modulePages.length} 个页面</span></div>
          <div class="nav-sections">${sectionsHtml}</div>
        </div>
      </div>
    `;
  }).join("");
}

function renderTopNav() {
  document.querySelectorAll(".nav-module").forEach((item) => {
    item.classList.toggle("active", item.dataset.module === selectedPage.module);
  });
  document.querySelectorAll(".nav-page").forEach((item) => {
    item.classList.toggle("active", item.dataset.pageKey === selectedPage.key);
  });
}

function renderInsights() {
  insightStrip.innerHTML = pageProfile().insights.map(([label, value, hint]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <small>${escapeHtml(hint)}</small>
    </article>
  `).join("");
}

function rowByModule(moduleName) {
  return selectedPage.rows.find((row) => row["业务模块"] === moduleName) || {};
}

function iconSvg(name) {
  const icons = {
    wallet: '<path d="M4 7.5h16v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z"/><path d="M16 12h4v3h-4a1.5 1.5 0 0 1 0-3Z"/><path d="M6.5 5 16 3.5l1.2 4"/>',
    trend: '<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
    users: '<path d="M16 19c0-2.2-1.8-4-4-4H8c-2.2 0-4 1.8-4 4"/><circle cx="10" cy="8" r="3"/><path d="M18 11c1.7.2 3 1.6 3 3.4V19"/><path d="M17 5.2a3 3 0 0 1 0 5.6"/>',
    gift: '<path d="M4 10h16v10H4z"/><path d="M3 7h18v3H3z"/><path d="M12 7v13"/><path d="M12 7H8.5A2.5 2.5 0 1 1 12 3.5V7Z"/><path d="M12 7h3.5A2.5 2.5 0 1 0 12 3.5V7Z"/>',
    shield: '<path d="M12 3 20 6v6c0 5-3.4 7.5-8 9-4.6-1.5-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-3"/>',
    funnel: '<path d="M4 5h16l-6 7v5l-4 2v-7L4 5Z"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>',
    command: '<path d="M9 9H5.5A2.5 2.5 0 1 1 8 6.5V18a2.5 2.5 0 1 1-2.5-2.5H18A2.5 2.5 0 1 1 15.5 18V6.5A2.5 2.5 0 1 1 18 9H6"/>',
    activity: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>'
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.chart}</svg>`;
}

function moduleIcon(moduleName = "") {
  if (/资产|充值|提现|资金|代理/.test(moduleName)) return "wallet";
  if (/经营|输赢|趋势|排行/.test(moduleName)) return "trend";
  if (/会员|在线/.test(moduleName)) return "users";
  if (/优惠|活动/.test(moduleName)) return "gift";
  return "chart";
}

function roleIcon(role) {
  return ({ 老板: "command", 运营: "activity", 产品: "funnel", 财务: "wallet", 客服: "users" })[role] || "target";
}

function roleSubtitle(role) {
  return ({ 老板: "全局经营视角", 运营: "拉新留存视角", 产品: "体验优化视角", 财务: "资金健康视角", 客服: "用户服务视角" })[role] || "业务视角";
}

function metricCard(row, tone = "") {
  const moduleName = row["业务模块"] || "";
  return `
    <article class="dashboard-card ${tone}">
      <div class="card-topline"><span>${escapeHtml(moduleName)}</span><i>${iconSvg(moduleIcon(moduleName))}</i></div>
      <h3>${escapeHtml(row["主指标"] || "")}</h3>
      <strong>${escapeHtml(row["数值"] || "--")}</strong>
      <small>${escapeHtml(row["子指标"] || row["备注"] || "")}</small>
    </article>
  `;
}

function kpiCard(item) {
  const direction = item.delta.startsWith("+") ? "up" : item.delta.startsWith("-") ? "down" : "flat";
  return `
    <article class="kpi-card ${item.tone || ""}">
      <div>
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <small>较昨日 <b class="${direction}">${escapeHtml(item.delta)}</b></small>
      </div>
      <i>${iconSvg(item.icon || "chart")}</i>
    </article>
  `;
}

function compactMetric(row) {
  const moduleName = row["业务模块"] || "";
  return `
    <article class="compact-card">
      <div>
        <span>${iconSvg(moduleIcon(moduleName))}${escapeHtml(moduleName)}</span>
        <strong>${escapeHtml(row["数值"] || "--")}</strong>
      </div>
      <small>${escapeHtml(row["人数"] || "")}${row["笔数"] && row["笔数"] !== "--" ? ` / ${escapeHtml(row["笔数"])}` : ""}</small>
      <p>${escapeHtml(row["子指标"] || "")}</p>
    </article>
  `;
}

const roleDashboards = {
  老板: {
    note: "先看公司输赢、优惠成本、在线人数和代理贡献。",
    chartType: "health",
    metrics: [
      ["公司输赢", "-13342.946", "含公司游戏输赢 1490.773"],
      ["优惠成本", "14573.94", "活动优惠 14314.16"],
      ["代理充值", "36724.5", "44 人 / 80 笔"]
    ],
    alerts: [
      ["high", "公司输赢为负", "需拆分体育、彩票、电子等品类，确认是否由单一场馆拉低。"],
      ["high", "优惠成本偏高", "活动优惠 14314.16 已接近经营输赢，需要同步看 ROI。"],
      ["medium", "代理提现波动", "代理提现 372，需确认是否为正常结算周期。"]
    ],
    todos: [
      ["经营复盘", "让运营补充活动 ROI 和渠道贡献"],
      ["资金复核", "让财务核对人工充值与代理提现"],
      ["风险确认", "让风控确认大额提款和异常账号"]
    ],
    chartTitle: "经营健康度",
    actions: ["先核对公司输赢为负的来源品类", "关注优惠成本是否吞噬游戏输赢", "查看代理充值贡献与提现波动"]
  },
  运营: {
    note: "重点看拉新、留存、活跃、转化和活动效果，并给出当天执行建议。",
    chartType: "operations",
    metrics: [
      ["拉新", "2", "今日注册人数"],
      ["首充转化", "1 人 / 1 笔", "每日注册会员充值 1.5"],
      ["活跃留存", "2 在线", "结合本周/本月趋势"]
    ],
    alerts: [
      ["medium", "拉新低于目标", "今日注册 2，需要看渠道曝光和落地页入口。"],
      ["high", "活动成本过高", "优惠成本 14573.94，需要看领取人数、首充和投注转化。"],
      ["medium", "活跃不足", "在线会员 2，需结合热门游戏和活动触达。"]
    ],
    todos: [
      ["渠道检查", "复查注册来源和推广渠道统计"],
      ["活动复盘", "拆分活动优惠和返现优惠的转化"],
      ["触达执行", "对新会员推送首充券或热门游戏"]
    ],
    chartTitle: "拉新留存活跃趋势",
    actions: ["拉新低于预期：检查渠道分布和落地页入口", "活跃人数低：推送热门游戏和活动提醒", "首充金额低：优化新会员首充券和客服触达", "活动成本高：优先复盘活动优惠 14314.16 的派发效果"]
  },
  产品: {
    note: "关注用户路径、终端/渠道分布、模块是否能支撑决策和异常定位。",
    chartType: "product",
    metrics: [
      ["核心路径", "注册-充值-投注", "看新增会员充提和注单趋势"],
      ["域名入口", "2 人", "www.aurora.test"],
      ["排行模块", "TOP5", "热门游戏与优惠排行"]
    ],
    alerts: [
      ["medium", "转化路径不完整", "注册、首充、投注、留存缺少连续漏斗展示。"],
      ["medium", "排行缺少下钻", "热门游戏与优惠排行需要能定位到详情和异常原因。"],
      ["low", "字段可读性不足", "终端、渠道、域名、币种口径需要统一标签。"]
    ],
    todos: [
      ["补漏斗", "把注册到首充到投注做成连续转化"],
      ["补下钻", "热门游戏、优惠排行支持查看贡献明细"],
      ["补口径", "统一站点、币种、时间范围说明"]
    ],
    chartTitle: "产品路径漏斗",
    actions: ["补齐终端、渠道、域名的可读标签", "把新增会员到首充的转化路径独立成漏斗", "热门游戏排行应支持点击下钻到游戏表现", "优惠排行应展示成本和转化的关系"]
  },
  财务: {
    note: "关注资金流入流出、人工调整、代理资金和口径一致性。",
    chartType: "finance",
    metrics: [
      ["会员充值", "0", "1 人 / 0 笔"],
      ["新会员充值", "1.5", "后台人工充值 1001000"],
      ["代理提现", "372", "1 人 / 4 笔"]
    ],
    alerts: [
      ["high", "后台人工充值异常", "新会员充值备注出现 1001000，需要核对来源和审批。"],
      ["medium", "代理提现待确认", "代理提现 372，需确认结算和手动提现口径。"],
      ["medium", "资金流入偏弱", "会员充值为 0，新会员充值仅 1.5。"]
    ],
    todos: [
      ["核对充值", "进入充值记录确认人工充值来源"],
      ["核对提现", "进入提款审核/提款派发查看待处理项"],
      ["核对代理", "进入代理资金或结算页面确认代理提现"]
    ],
    chartTitle: "资金流入流出对比",
    actions: ["重点核对后台人工充值 1001000 的来源", "代理提现与手动提现需分开看", "所有汇总默认标记币种口径为 USDT", "异常大额资金应能一键跳到资金记录"]
  },
  客服: {
    note: "关注在线会员入口、充提阻塞、异常反馈和需要主动触达的人群。",
    chartType: "support",
    metrics: [
      ["在线会员", "2", "www.aurora.test"],
      ["提现咨询", "1 人", "会员提现相关"],
      ["新会员提现", "2 笔", "金额 200"]
    ],
    alerts: [
      ["high", "新会员提现待跟进", "新会员提现 2 笔，金额 200，需确认审核状态。"],
      ["medium", "充值为 0", "有在线会员但充值为 0，需排查支付入口或用户卡点。"],
      ["low", "入口集中", "在线会员集中在 www.aurora.test，客服需要可复制入口。"]
    ],
    todos: [
      ["跟进提现", "联系新会员确认提款进度和资料完整性"],
      ["排查充值", "收集充值失败截图或支付通道反馈"],
      ["主动回访", "生成在线会员和新会员回访名单"]
    ],
    chartTitle: "客服处理优先级",
    actions: ["在线会员集中域名需要展示可复制入口", "提现 2 笔的新会员优先检查审核状态", "充值为 0 时关注支付入口是否异常", "客服视角需要待跟进会员清单"]
  }
};

function renderRoleView() {
  return `
    <section class="role-panel focus-panel data-command">
      <div class="role-dashboard" id="roleDashboard"></div>
    </section>
  `;
}

function renderRoleTabs() {
  return Object.keys(roleDashboards).map((role, index) => `
    <button class="role-tab ${index === 0 ? "active" : ""}" data-role="${escapeHtml(role)}" type="button">
      <i>${iconSvg(roleIcon(role))}</i>
      <span><strong>${escapeHtml(role)}</strong><small>${escapeHtml(roleSubtitle(role))}</small></span>
    </button>
  `).join("");
}

function renderRoleDashboard(role = "老板") {
  const config = roleDashboards[role] || roleDashboards["老板"];
  const roleDashboard = document.querySelector("#roleDashboard");
  const currentRole = document.querySelector("#currentRole");
  if (currentRole) currentRole.textContent = role;
  if (!roleDashboard) return;
  roleDashboard.innerHTML = `
    <div class="role-note">${escapeHtml(config.note)}</div>
    <div class="role-metrics">
      ${config.metrics.map(([label, value, hint]) => `
        <article>
          <span>${iconSvg(moduleIcon(label))}${escapeHtml(label)}</span>
          <strong>${escapeHtml(value)}</strong>
          <small>${escapeHtml(hint)}</small>
        </article>
      `).join("")}
    </div>
    <div class="role-command-grid">
      <article class="role-chart">
        <header>
          <strong>${escapeHtml(config.chartTitle)}</strong>
          <span>${escapeHtml(role)}视角</span>
        </header>
        ${roleChart(config.chartType)}
      </article>
      <div class="role-side-stack">
        <article class="alert-panel">
          <header>
            <strong>${iconSvg("bell")}风险报警</strong>
            <span>${escapeHtml(role)}负责关注</span>
          </header>
          ${config.alerts.map(([level, title, detail]) => `
            <div class="alert-item ${escapeHtml(level)}">
              <b>${level === "high" ? "高" : level === "medium" ? "中" : "低"}</b>
              <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></span>
              <button class="mini-action" data-global-action="${escapeHtml(title)}" type="button">查看</button>
            </div>
          `).join("")}
        </article>
        <article class="todo-panel">
          <header>
            <strong>${iconSvg("list")}待处理事项</strong>
            <span>今日优先级</span>
          </header>
          ${config.todos.map(([title, detail], index) => `
            <div class="todo-item">
              <b>${index + 1}</b>
              <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(detail)}</small></span>
              <button class="mini-action" data-global-action="${escapeHtml(title)}" type="button">处理</button>
            </div>
          `).join("")}
        </article>
      </div>
    </div>
    <article class="action-list">
      <header>
        <strong>${iconSvg("target")}执行建议</strong>
        <span>${escapeHtml(role)}视角</span>
      </header>
      ${config.actions.slice(0, 4).map((action, index) => `
        <div><b>${index + 1}</b><span>${escapeHtml(action)}</span></div>
      `).join("")}
    </article>
  `;
}

function roleChart(type) {
  if (type === "operations") return operationsChart();
  if (type === "product") return productChart();
  if (type === "finance") return financeChart();
  if (type === "support") return supportChart();
  return healthChart();
}

function funnelChart(items) {
  return `
    <div class="funnel-chart">
      ${items.map((item, index) => `
        <div class="funnel-step" style="width:${item.width}%">
          <strong>${escapeHtml(item.label)}</strong>
          <span>${escapeHtml(item.value)}</span>
          <small>${escapeHtml(item.hint)}</small>
        </div>
        ${index < items.length - 1 ? `<div class="funnel-arrow">↓</div>` : ""}
      `).join("")}
    </div>
  `;
}

function operationsChart() {
  return `
    <div class="role-chart-grid">
      <section>
        <h3>注册 → 首充 → 投注 → 留存</h3>
        ${funnelChart([
          { label: "注册", value: "2", hint: "今日新增会员", width: 100 },
          { label: "首充", value: "1人 / 1笔", hint: "充值 1.5", width: 78 },
          { label: "投注", value: "3类游戏有投注", hint: "体育/彩票为主", width: 58 },
          { label: "留存", value: "待观察", hint: "看本周/本月", width: 42 }
        ])}
      </section>
      <section>
        <h3>活跃与触达</h3>
        <div class="mini-bars">
          <article><span>在线</span><b style="height:72%"></b><strong>2</strong></article>
          <article><span>活动优惠</span><b style="height:96%"></b><strong>14314.16</strong></article>
          <article><span>返现</span><b style="height:28%"></b><strong>259.779</strong></article>
        </div>
      </section>
    </div>
  `;
}

function productChart() {
  return `
    <div class="role-chart-grid">
      <section>
        <h3>产品路径漏斗</h3>
        ${funnelChart([
          { label: "访问入口", value: "www.aurora.test", hint: "在线 2 人", width: 100 },
          { label: "注册", value: "2", hint: "今日新增", width: 82 },
          { label: "充值", value: "1人", hint: "新会员充值", width: 55 },
          { label: "投注", value: "体育/彩票", hint: "主路径", width: 48 }
        ])}
      </section>
      <section>
        <h3>模块可用性</h3>
        <div class="signal-list">
          <span>终端分布需要完整 UA 归类</span>
          <span>热门游戏排行需要下钻</span>
          <span>优惠排行需要展示转化</span>
        </div>
      </section>
    </div>
  `;
}

function financeChart() {
  return `
    <div class="role-chart-grid">
      <section>
        <h3>资金流入流出</h3>
        ${compareBars([
          { "业务模块": "会员充值", "数值": "0", "子指标": "1 人 / 0 笔" },
          { "业务模块": "会员提现", "数值": "0", "子指标": "1 人 / 0 笔" },
          { "业务模块": "新会员充值", "数值": "1.5", "子指标": "后台人工充值 1001000" },
          { "业务模块": "代理提现", "数值": "372", "子指标": "1 人 / 4 笔" }
        ])}
      </section>
      <section>
        <h3>异常口径</h3>
        <div class="signal-list danger-signals">
          <span>后台人工充值 1001000 需核对</span>
          <span>代理手动提现需单独拆分</span>
          <span>汇总口径固定为 USDT</span>
        </div>
      </section>
    </div>
  `;
}

function supportChart() {
  return `
    <div class="role-chart-grid">
      <section>
        <h3>客服处理优先级</h3>
        ${funnelChart([
          { label: "在线入口", value: "2人", hint: "www.aurora.test", width: 100 },
          { label: "充值关注", value: "1人", hint: "充值为 0", width: 70 },
          { label: "提现关注", value: "2笔", hint: "新会员提现 200", width: 58 },
          { label: "主动触达", value: "待跟进", hint: "生成名单", width: 45 }
        ])}
      </section>
      <section>
        <h3>待跟进原因</h3>
        <div class="signal-list">
          <span>新会员提现 2 笔</span>
          <span>在线入口集中在单域名</span>
          <span>充值为 0 需排查支付入口</span>
        </div>
      </section>
    </div>
  `;
}

function healthChart() {
  return `
    <div class="role-chart-grid">
      <section>
        <h3>经营趋势</h3>
        ${lineChart()}
      </section>
      <section>
        <h3>健康信号</h3>
        <div class="signal-list">
          <span>公司输赢为负，需要拆分品类</span>
          <span>优惠成本 14573.94，需要看 ROI</span>
          <span>代理充值 36724.5，是主要资金贡献</span>
        </div>
      </section>
    </div>
  `;
}

function lineChart() {
  return `
    <svg class="line-chart" viewBox="0 0 420 150" role="img" aria-label="会员趋势图">
      <polyline points="20,110 88,92 156,98 224,64 292,78 360,38 400,52" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
      <polyline points="20,124 88,118 156,104 224,108 292,86 360,76 400,70" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <g fill="#2563eb"><circle cx="20" cy="110" r="4"/><circle cx="88" cy="92" r="4"/><circle cx="156" cy="98" r="4"/><circle cx="224" cy="64" r="4"/><circle cx="292" cy="78" r="4"/><circle cx="360" cy="38" r="4"/><circle cx="400" cy="52" r="4"/></g>
      <g class="chart-grid"><line x1="20" y1="130" x2="400" y2="130"/><line x1="20" y1="90" x2="400" y2="90"/><line x1="20" y1="50" x2="400" y2="50"/></g>
    </svg>
  `;
}

function barChart(items) {
  const max = Math.max(...items.map((item) => Number.parseFloat(item["数值"]) || 0), 1);
  return `
    <div class="bar-chart">
      ${items.map((item) => {
        const value = Number.parseFloat(item["数值"]) || 0;
        const height = Math.max(8, Math.round((value / max) * 100));
        return `
          <div class="bar-item">
            <div class="bar-track"><span style="height:${height}%"></span></div>
            <strong>${escapeHtml(item["业务模块"])}</strong>
            <small>${escapeHtml(item["数值"])}</small>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function compareBars(items) {
  return `
    <div class="compare-bars">
      ${items.map((item, index) => `
        <article>
          <div><strong>${escapeHtml(item["业务模块"])}</strong><span>${escapeHtml(item["数值"])}</span></div>
          <div class="progress"><span style="width:${index < 2 ? 72 : 38}%"></span></div>
          <small>${escapeHtml(item["子指标"])}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderDashboard() {
  const assets = rowByModule("资产概览");
  const operation = rowByModule("经营总览");
  const member = rowByModule("会员概览");
  const bonus = rowByModule("优惠统计");
  const agent = rowByModule("代理统计");
  const online = rowByModule("在线会员分布");
  const trend = rowByModule("会员趋势");
  const rank = rowByModule("排行");
  const games = ["体育", "彩票", "棋牌", "视讯", "电竞", "电子"].map(rowByModule).filter((row) => row["业务模块"]);
  const funds = ["会员充值", "会员提现", "新会员充值", "新会员提现"].map(rowByModule).filter((row) => row["业务模块"]);
  const kpis = [
    { label: "公司输赢", value: "-13,342.946", delta: "-8.42% ↓", icon: "trend", tone: "blue" },
    { label: "优惠成本", value: "14,573.94", delta: "+12.65% ↑", icon: "gift", tone: "red" },
    { label: "在线人数", value: "2", delta: "-33.33% ↓", icon: "users", tone: "green" },
    { label: "新增会员", value: "2", delta: "-60.00% ↓", icon: "users", tone: "blue" },
    { label: "首充人数", value: "1", delta: "-50.00% ↓", icon: "wallet", tone: "purple" },
    { label: "充值金额(USDT)", value: "0", delta: "-100.00% ↓", icon: "wallet", tone: "green" },
    { label: "代理充值(USDT)", value: "36,724.5", delta: "-21.69% ↓", icon: "users", tone: "red" }
  ];

  dashboardView.innerHTML = `
    <section class="data-center-cover">
      <div class="cover-main">
        <span class="eyebrow">${iconSvg("chart")}数据中台</span>
        <h2>今日经营总览</h2>
        <p>把老版首页的余额、输赢、充提、优惠、代理和在线数据重组为可处理的经营工作台。</p>
        <div class="role-tabs top-role-tabs" aria-label="角色视角切换">
          ${renderRoleTabs()}
        </div>
        <div class="dashboard-controls">
          <span class="filter-chip">当前视角：<strong id="currentRole">老板</strong></span>
          <label class="filter-chip control-chip">站点<select data-dashboard-filter="site"><option>包网</option><option>测试新增站点01</option></select></label>
          <label class="filter-chip control-chip">时间<select data-dashboard-filter="range"><option>今日</option><option>昨日</option><option>近 7 天</option><option>本月</option></select></label>
          <label class="filter-chip control-chip">币种<select data-dashboard-filter="currency"><option>USDT</option><option>BRL</option><option>全部</option></select></label>
        </div>
      </div>
      <div class="cover-actions">
        <span class="status-pill ok">数据已同步</span>
        <span class="status-pill warn">3 个风险</span>
        <button class="btn ghost" data-global-action="导出角色看板" type="button">导出</button>
        <button class="btn ghost" data-global-action="刷新数据中台" type="button">刷新</button>
      </div>
    </section>

    ${renderRoleView()}

    <section class="section-title-row">
      <div>
        <span class="eyebrow">${iconSvg("activity")}全局经营指标</span>
        <h2>老版首页核心数据</h2>
      </div>
      <span>固定口径，用于和角色看板交叉验证</span>
    </section>

    <section class="kpi-strip">
      ${kpis.map(kpiCard).join("")}
    </section>

    <section class="dashboard-section secondary-section">
      <header>
        <div>
          <h2>游戏输赢分布</h2>
          <p>保留老版体育、彩票、棋牌、视讯、电竞、电子分组，直接看到人数、笔数和投注金额。</p>
        </div>
        <button class="btn ghost" data-global-action="查看游戏明细" type="button">查看明细</button>
      </header>
      <div class="compact-grid game-grid">
        ${games.map(compactMetric).join("")}
      </div>
      ${barChart(games)}
    </section>

    <section class="dashboard-columns">
      <div class="dashboard-section">
        <header>
          <div>
            <h2>资金充提</h2>
            <p>把会员充提和新会员充提放在同一组，方便看资金流入流出与转化。</p>
          </div>
        </header>
        <div class="compact-grid">
          ${funds.map(compactMetric).join("")}
        </div>
        ${compareBars(funds)}
      </div>

      <div class="dashboard-section">
        <header>
          <div>
            <h2>优惠与代理</h2>
            <p>保留老版优惠成本和代理经营两块，突出成本结构与代理贡献。</p>
          </div>
        </header>
        <div class="stacked-metrics">
          ${metricCard(bonus)}
          ${metricCard(agent)}
        </div>
      </div>
    </section>

    <section class="dashboard-columns lower">
      <div class="dashboard-section">
        <header>
          <div>
            <h2>在线会员分布</h2>
            <p>保留老版域名分布，快速定位在线人数集中在哪个入口。</p>
          </div>
        </header>
        <div class="domain-card">
          <strong>${escapeHtml(online["主指标"] || "")}</strong>
          <span>${escapeHtml(online["数值"] || "--")} 人在线</span>
          <small>${escapeHtml(online["子指标"] || "")}</small>
        </div>
      </div>

      <div class="dashboard-section">
        <header>
          <div>
            <h2>趋势与排行</h2>
            <p>延续老版新增会员、充提、注单、输赢趋势，以及热门游戏和优惠排行。</p>
          </div>
        </header>
        <div class="rank-list">
          <article class="chart-card"><strong>会员趋势图</strong>${lineChart()}<small>${escapeHtml(trend["子指标"] || "")}</small></article>
          <article><strong>${escapeHtml(trend["主指标"] || "")}</strong><span>${escapeHtml(trend["数值"] || "")}</span><small>${escapeHtml(trend["子指标"] || "")}</small></article>
          <article><strong>${escapeHtml(rank["主指标"] || "")}</strong><span>${escapeHtml(rank["数值"] || "")}</span><small>${escapeHtml(rank["子指标"] || "")}</small></article>
        </div>
      </div>
    </section>
  `;

  dashboardView.querySelectorAll("[data-global-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.globalAction}：已生成本地 mock 反馈`));
  });
  dashboardView.querySelectorAll("[data-dashboard-filter]").forEach((control) => {
    control.addEventListener("change", () => showToast(`${control.closest("label").childNodes[0].textContent.trim()}已切换为：${control.value}`));
  });
  dashboardView.querySelectorAll(".role-tab").forEach((button) => {
    button.addEventListener("click", () => {
      dashboardView.querySelectorAll(".role-tab").forEach((item) => item.classList.toggle("active", item === button));
      renderRoleDashboard(button.dataset.role);
    });
  });
  renderRoleDashboard("老板");
}

function inferredFilters() {
  if (isImageManagementPage()) return ["场馆名称", "游戏名称", "游戏ID"];

  const cleanFilter = (filter) => filter
    .replace(/当前汇率币种:.*/, "币种口径")
    .replace(/最后一次更新时间.*/, "")
    .replace(/全部\(汇总为USDT\)USDTBRL.*/, "")
    .replace(/全部待处理处理中已完成异常.*/, "")
    .replace(/请选择.*/, "")
    .trim();

  const columns = selectedPage.columns || [];
  const wanted = columns.filter((column) => /账号|会员|代理|订单|ID|名称|状态|类型|等级|渠道|币种|时间|日期|操作人|审核/.test(column));
  const unique = [...new Set(wanted)]
    .map(cleanFilter)
    .filter(Boolean)
    .filter((column) => !/操作|图片|备注|金额|余额|输赢|人数|笔数|内容|说明/.test(column))
    .slice(0, 5);

  if (unique.length >= 2) return unique;

  const menuWords = ["会员", "代理", "优惠", "运营", "游戏", "财务", "报表", "风控", "系统", "首页", "管理", "列表"];
  const rawFilters = selectedPage.filters
    .map(cleanFilter)
    .filter(Boolean)
    .filter((filter) => filter.length <= 12)
    .filter((filter) => !["全部", "至", "-", " "].includes(filter.trim()))
    .filter((filter) => !menuWords.some((word) => filter !== selectedPage.title && filter.includes(word)))
    .filter((filter) => !/全部待处理处理中已完成异常/.test(filter))
    .filter((filter) => !/当前汇率|更新时间|请选择/.test(filter))
    .slice(0, 6);

  if (rawFilters.length >= 2) return rawFilters;

  if (unique.length) return unique;
  if (selectedPage.kind === "report") return ["统计日期", "站点", "币种口径"];
  if (selectedPage.kind === "record") return ["关键词", "时间范围", "操作人"];
  return ["关键词", "状态", "时间范围"];
}

function renderFilters() {
  const filters = inferredFilters();
  const contextFilters = hasImageColumns()
    ? [
      `<label>站点<select data-context-filter="site"><option>包网</option></select></label>`,
      `<label>语言<select data-context-filter="language"><option>简体中文</option></select></label>`
    ]
    : [];
  optimizedFilters.innerHTML = contextFilters.concat(filters.map((filter, index) => {
    const lower = filter.toLowerCase();
    if (filter === "站点") {
      return `<label>${escapeHtml(filter)}<select data-filter="${index}"><option>包网</option></select></label>`;
    }
    if (filter === "语言") {
      return `<label>${escapeHtml(filter)}<select data-filter="${index}"><option>简体中文</option></select></label>`;
    }
    if (/统计周期|周期/.test(filter)) {
      return `<label>${escapeHtml(filter)}<select data-filter="${index}"><option>今日</option><option>昨日</option><option>本周</option><option>本月</option><option>上月</option></select></label>`;
    }
    if (/币种口径|币种/.test(filter)) {
      return `<label>${escapeHtml(filter)}<select data-filter="${index}"><option>全部(汇总为USDT)</option><option>USDT</option><option>BRL</option></select></label>`;
    }
    if (/状态|类型|等级|币种/.test(filter)) {
      return `<label>${escapeHtml(filter)}<select data-filter="${index}"><option value="">全部</option><option>待处理</option><option>处理中</option><option>已完成</option><option>异常</option></select></label>`;
    }
    if (/时间|日期/.test(filter)) {
      return `<label>${escapeHtml(filter)}<input data-filter="${index}" value="最近 7 天" /></label>`;
    }
    return `<label>${escapeHtml(filter)}<input data-filter="${index}" placeholder="${lower.includes("id") ? "输入 ID" : "请输入关键词"}" /></label>`;
  })).join("");
  optimizedFilters.querySelectorAll("input, select").forEach((control) => {
    control.addEventListener("change", () => {
      renderTable();
      showToast("筛选条件已应用");
    });
    control.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        renderTable();
        showToast("筛选条件已应用");
      }
    });
  });
}

function renderTabs() {
  const tabs = pageProfile().tabs?.filter((tab) => tab !== "全部");
  if (!tabs) {
    statusTabs.innerHTML = "";
    statusTabs.hidden = true;
    return;
  }
  statusTabs.hidden = false;
  statusTabs.innerHTML = [`<button class="tab active" data-tab="">全部 ${selectedPage.rows.length}</button>`]
    .concat(tabs.map((tab, index) => `<button class="tab" data-tab="${escapeHtml(tab)}">${escapeHtml(tab)} ${index === 0 ? selectedPage.rows.length : Math.max(1, selectedPage.rows.length - index)}</button>`))
    .join("");
  statusTabs.querySelectorAll(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab;
      statusTabs.querySelectorAll(".tab").forEach((item) => item.classList.toggle("active", item === button));
      renderTable();
    });
  });
}

function rowStatus(row) {
  const keys = Object.keys(row);
  const statusKey = keys.find((key) => /状态|审核|结果|是否|开关/.test(key));
  return row[statusKey] || (activeTab && activeTab !== "全部" ? activeTab : "待处理");
}

function primaryColumns() {
  const columns = selectedPage.columns.length ? selectedPage.columns : Object.keys(selectedPage.rows[0] || {});
  const cleanColumns = columns.filter((column) => !/最后一次更新时间|当前汇率/.test(column));
  const preferred = cleanColumns.filter((column) => /业务|模块|会员|代理|订单|账号|ID|名称|标题|活动|渠道|金额|状态|时间|备注|操作|指标|数值|今日|昨日|环比|同比|趋势|异常|人数|笔数|访问量|注册量|首充|ROI|留存率|PC图|H5图|图片|图标|角标|封面|LOGO|Logo|logo/.test(column));
  return (preferred.length ? preferred : cleanColumns).slice(0, 8);
}

function filteredRows() {
  const keyword = document.querySelector("#optimizedFilters input[placeholder]")?.value.trim() || "";
  return selectedPage.rows.filter((row) => {
    const matchKeyword = !keyword || Object.values(row).some((value) => String(value).includes(keyword));
    return matchKeyword;
  });
}

function renderTable() {
  const data = filteredRows();
  const columns = primaryColumns();
  const profile = pageProfile();
  toolbarHint.textContent = `优化点：${profile.hint || "关键字段与下一步动作前置"}`;
  tableTitle.textContent = selectedPage.title.endsWith("列表") ? selectedPage.title : `${selectedPage.title}列表`;
  resultCount.textContent = `共 ${data.length} 条`;
  emptyState.hidden = data.length > 0;
  tableHead.innerHTML = `<tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}<th>优化动作</th></tr>`;
  tableBody.innerHTML = data.map((row, index) => {
    const cells = columns.map((column, columnIndex) => {
      const value = row[column] ?? "--";
      if (isImageColumn(column)) {
        return `<td>${renderImageCell(column, row, index)}</td>`;
      }
      if (/状态|审核|结果|是否|开关/.test(column)) {
        return `<td><span class="status ${statusClass(value)}">${escapeHtml(value)}</span></td>`;
      }
      if (columnIndex === 0) {
        return `<td><strong>${escapeHtml(value)}</strong><br /><span class="muted">${escapeHtml(selectedPage.fullTitle)}</span></td>`;
      }
      return `<td>${escapeHtml(value)}</td>`;
    }).join("");
    return `<tr>${cells}<td class="row-actions"><button class="btn ghost" data-detail="${index}" type="button">${escapeHtml(profile.detailAction)}</button><button class="btn primary" data-action="${index}" type="button">${escapeHtml(profile.primaryAction)}</button></td></tr>`;
  }).join("");

  tableBody.querySelectorAll("[data-detail]").forEach((button) => {
    button.addEventListener("click", () => openDrawer(Number(button.dataset.detail)));
  });
  tableBody.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      openDrawer(Number(button.dataset.action));
      showToast(`${profile.primaryAction}已打开，当前为本地 mock 交互`);
    });
  });
}

function renderExplain() {
  const rows = selectedPage.pairs.length ? selectedPage.pairs : [["页面业务已读取，但原版问题尚需人工补充。", "新版先按统一流程模板生成，可继续基于真实使用反馈细化。"]];
  compareTable.innerHTML = `
    <div class="compare-head">原版问题</div>
    <div class="compare-head">新版优化</div>
    ${rows.map(([problem, improvement]) => `
      <div class="compare-cell">${escapeHtml(problem)}</div>
      <div class="compare-cell">${escapeHtml(improvement)}</div>
    `).join("")}
  `;
}

function renderPage() {
  if (!selectedPage) return;
  const profile = pageProfile();
  pageSelect.value = selectedPage.key;
  breadcrumbs.textContent = selectedPage.fullTitle;
  pageTitle.textContent = selectedPage.title;
  pageDesc.textContent = profile.desc;
  document.querySelector(".head-actions").innerHTML = profile.actions.map((action, index) => `
    <button class="btn ${index === 0 ? "primary" : "ghost"}" data-global-action="${escapeHtml(action)}" type="button">${escapeHtml(action)}</button>
  `).join("");
  backendFrame.src = pageUrl();
  liveOpenLink.href = pageUrl();
  renderTopNav();
  renderInsights();
  renderFilters();
  renderTabs();
  if (isDashboardPage()) {
    dashboardView.hidden = false;
    filterPanel.hidden = true;
    insightStrip.hidden = true;
    document.querySelector(".table-card").hidden = true;
    statusTabs.hidden = true;
    renderDashboard();
  } else {
    dashboardView.hidden = true;
    dashboardView.innerHTML = "";
    filterPanel.hidden = false;
    insightStrip.hidden = false;
    document.querySelector(".table-card").hidden = false;
    renderTable();
  }
  document.querySelectorAll("[data-global-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.globalAction}：已生成本地 mock 反馈`));
  });
  renderExplain();
  saveState();
}

function openDrawer(index) {
  const row = filteredRows()[index] || selectedPage.rows[index] || {};
  drawerTitle.textContent = row[primaryColumns()[0]] || selectedPage.title;
  drawerBody.innerHTML = `
    <div class="detail-grid">
      ${Object.entries(row).slice(0, 10).map(([key, value]) => `
        <div class="detail-item"><span>${escapeHtml(key)}</span><strong>${isImageColumn(key) ? renderImageCell(key, row, index) : escapeHtml(value)}</strong></div>
      `).join("")}
    </div>
    <section class="timeline">
      <strong>新版处理建议</strong>
      <div>页面业务：${escapeHtml(selectedPage.fullTitle)}</div>
      <div>当前状态：${escapeHtml(rowStatus(row))}</div>
      <div>建议：先确认关键状态和异常原因，再进入${escapeHtml(currentKind().action)}。</div>
      <div>反馈：操作完成后在当前列表内展示结果，减少反复跳转。</div>
    </section>
    <div class="drawer-actions">
      <button class="btn primary" data-drawer-action="记录处理进展" type="button">记录处理进展</button>
      <button class="btn ghost" data-drawer-action="复制关键编号" type="button">复制关键编号</button>
      <button class="btn" id="drawerCancel" type="button">关闭</button>
    </div>
  `;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  drawerMask.hidden = false;
  document.querySelector("#drawerCancel").addEventListener("click", closeDrawer);
  drawer.querySelectorAll("[data-drawer-action]").forEach((button) => {
    button.addEventListener("click", () => showToast(`${button.dataset.drawerAction}：已生成本地反馈`));
  });
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  drawerMask.hidden = true;
}

function openExplain() {
  explainModal.classList.add("open");
  explainModal.setAttribute("aria-hidden", "false");
  explainMask.hidden = false;
}

function hideExplain() {
  explainModal.classList.remove("open");
  explainModal.setAttribute("aria-hidden", "true");
  explainMask.hidden = true;
}

function showToast(text) {
  toast.textContent = text;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

document.querySelectorAll(".version-btn").forEach((button) => {
  button.addEventListener("click", () => {
    version = button.dataset.version;
    shell.dataset.version = version;
    document.querySelectorAll(".version-btn").forEach((item) => item.classList.toggle("active", item === button));
    document.body.classList.toggle("optimized", version === "optimized");
    closeDrawer();
    renderTable();
    saveState();
  });
});

pageSelect.addEventListener("change", () => {
  selectedPage = pages.find((page) => page.key === pageSelect.value) || selectedPage;
  activeTab = "";
  closeDrawer();
  renderPage();
  showToast(`已切换到：${selectedPage.fullTitle}`);
});

topMenu.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page-key]");
  if (pageButton) {
    const targetPage = pages.find((page) => page.key === pageButton.dataset.pageKey);
    if (!targetPage) return;
    selectedPage = targetPage;
    activeTab = "";
    closeDrawer();
    renderPage();
    showToast(`已切换到：${selectedPage.fullTitle}`);
    return;
  }

  const moduleButton = event.target.closest(".nav-module-trigger");
  if (moduleButton) {
    moduleButton.focus();
  }
});

document.querySelectorAll("[data-global-action]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.globalAction}：已生成本地 mock 反馈`);
  });
});

document.querySelector("#searchBtn").addEventListener("click", () => {
  renderTable();
  showToast("已更新筛选结果");
});

document.querySelector("#resetBtn").addEventListener("click", () => {
  optimizedFilters.querySelectorAll("input").forEach((input) => {
    input.value = input.value === "最近 7 天" ? "最近 7 天" : "";
  });
  optimizedFilters.querySelectorAll("select").forEach((select) => {
    select.value = "";
  });
  activeTab = "";
  renderTabs();
  renderTable();
});

document.querySelector("#closeDrawer").addEventListener("click", closeDrawer);
drawerMask.addEventListener("click", closeDrawer);
explainBtn.addEventListener("click", openExplain);
closeExplain.addEventListener("click", hideExplain);
explainMask.addEventListener("click", hideExplain);
window.addEventListener("hashchange", () => applyRouteState(readSavedState()));

populatePageSelect();
populateTopMenu();
shell.dataset.version = version;
document.body.classList.toggle("optimized", version === "optimized");
document.querySelectorAll(".version-btn").forEach((item) => item.classList.toggle("active", item.dataset.version === version));
renderPage();
