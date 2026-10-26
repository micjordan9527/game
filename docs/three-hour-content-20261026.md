# 包网知识库三小时内容完善

用户授权：2026-10-26约三小时自主完善、发布到现有Sites并每次同步GitHub。时间窗口为北京时间19:46–22:46，截止点2026-10-26T14:46:34Z。到期后不启动新内容，只核对已完成交付、记录仍未完成事项。保持原访问范围和顶部唯一全局更新入口。

## 已确认的工作顺序

1. 第一批：四个案例各增加三条“界面阅读说明”，复用现有材料，明确位置、可观察内容、判断边界和直达入口。四个案例为admin-optimization、bm-optimization、competitor-analysis、white-label-official。对应公开锚点均为/cases/对应slug#case-reading-guide。根会话负责本批。
2. 第二批：新增四篇专题，每篇有字段、正常流程、异常处理、虚构示例、实际案例链接和一张GPT生成示意图。具体选题：
   - export-masking-audit：数据导出、脱敏与下载审计。区分查看/导出/下载权限、筛选快照、脱敏版本、下载过期和审计；关联access-approval-audit及后台案例。
   - content-publication-versions：公告、帮助内容与发布版本。区分草稿/审核/定时发布/更正，明确适用站点、语言、有效期、规则版本与用户已读；关联官网案例和multi-tenant-site-config。
   - game-catalog-availability：游戏目录与可用状态。区分前台可见、厂商维护、账号受限、区域/币种条件与登录失败，保留游戏ID和原因码；关联game-provider-api及现有BM/U8的状态说明，不能把赛事暂停等同游戏下架。
   - transaction-limits-fees：交易限额、费用与金额校验。区分单笔/周期/剩余额度、原币精度、手续费和到账金额；未知结果沿原订单查询，不重发。演算为虚构规则，现有提现演示手续费为0，不声称已实现新的收费规则。
3. 第三批：在演示目录新增六个“按问题找入口”的短说明，每条有简短排查路径、具体演示和文章链接：充值成功但余额未变化；提现超时是否可重试；账号恢复后重新登录；归属变更与旧批次结算；个人中心空结果/失败/受限；官网表单反馈与真实送达的区别。复用既有搜索；问题区放在已有10个演示region之外，不改变演示计数。完成1440/390、搜索往返、图片、默认展开和最终发布检查。

## 运行和进度

先读AGENTS.md、.openai/hosting.json与.openai/three-hour-content-20261026.json。每次从Sites最新源码开始，保留恢复点，不重复制作已完成阶段。根会话完成第一批后，计划使用同一个绑定本Site的自动任务在20:46、21:46接续；22:46只作收尾核对。以实际保存的自动化为准，不把计划写成已经执行。

每次只做下一个未完成阶段；若进度中有70分钟内的in_progress且源分支仍由其他运行推进，避免并发改写，报告正在执行。开始前记录阶段和开始时间；提交完成后标记implementation_complete。进入下一阶段前确认前一版本实际已发布并且GitHub已同步；如果上一阶段仍有失败先修复。仅使用当前Site，不能另建项目。任务完成或截止后不再扩充范围。

## 源码和授权

使用Sites技能的source helper；若本环境没有插件脚本，可用普通Git与新返回的source_repository_write_credential，始终保留托管代理。现有云环境有/workspace/sites/baowang-knowledge以及/workspace/work/safe-sites-source.py；这些路径可复用但不假定新环境一定存在。凭据仅内存/隐藏stdin，不保存到文件或输出，不使用通用远端认证头，不绕过代理。

站点为https://baowang-knowledge.aurora-5448.chatgpt.site，项目ID以.openai/hosting.json为准。GitHub为micjordan9527/game的main；每次Sites发布成功后同步同一份文件，保留无关远端变更，不强推。原生GitHub读/建blob/tree/commit/update_ref工具已经可用；先读main，以最新tree为base，用expected_sha及force=false更新。二进制可分块读取后base64上传，单块原始字节不超过524286，校验Git blob SHA，不把base64输出给用户。

## 内容和配图约束

不增加课程、作业、答题、打卡或夸张承诺。每项说明是什么、在哪里和怎样查看。实际截图、交互原型和GPT图严格区分。四张新图只用短中文标签并逐张查看核对箭头；生成记录保存原路径、实际尺寸、提示及来源。图片注册到src/data/imagePrompts.ts；追加到public/images/knowledge-20261026/manifest.json，完整生成记录追加docs/knowledge-image-provenance-20261026.json，保留原始图片。没有必要不生成更多图。

新文章同时加入content/articles、src/data/articles.ts和src/data/knowledgeContentUpdates.ts。版本记录current.articleSlugs放本次新增文章slug；发布时把旧current连同真实部署时间和固定GitHub commit移到history。当前版本号必须等原生save_site_version返回确认后才部署，不能伪造发布时间或效果数据。累计文章和配图数量由实际条目计算。新增关联资料复用src/lib/knowledge-relations.ts与相关专题列表。

## 检查与交付

本地node_modules已存在。构建命令NEXT_PUBLIC_SITE_URL=https://baowang-knowledge.aurora-5448.chatgpt.site npm run build；内容npm run check:content；导出npm run check:integrity。浏览器可使用PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs，/usr/bin/chromium，必要时用支持的网络权限来监听本地端口。第一批用CHECK_SCOPE=case-reading、updates；第二批用knowledge；第三批最后用npm run check:release。不要为同一未变化输入反复跑重检查。没有浏览器能力时明确记录，不伪称浏览器已通过。

构建后推送精确源提交，再将.openai/hosting.json及out打包成绝对路径tar.gz，调用原生保存、核对版本号、部署，依据返回状态报告。源码和GitHub一致性用Git blob SHA核对。/updates必须描述本次实际变化并给链接；最终报告版本、站点、逐项入口、GitHub提交、通过的检查和未完成项。计划与发布中间状态保存在进度文件，不将未实现内容写到公开页面。

## 第一批验证记录

2026-10-26：内容检查通过（29篇文章、9个模板、4个案例、66张登记图片），生产构建通过，92个导出页面的内部文件、canonical、素材来源与已有账务演算检查通过。case-reading与updates范围在1440/390宽度通过，覆盖四案例12条说明、实际目标文件与锚点、点击后阅读区定位、案例搜索、原材料位置、无横向溢出，以及当前/历史版本、复制链接、旧锚点和往返阅读位置。浏览器未发现脚本初始化或资源失败。手机U8阅读区截图已查看。第一批未新增图片或业务接口；未将上述定向检查写成全站完整回归。
