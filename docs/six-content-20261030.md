# 六项内容与演示更新

## 基线与范围

- 延续现有 Sites v47，源码 `612747f5ed5c21f8e74733242597de423dc4ed80`，访问范围 public。
- 已保留原生 v47、标签 `checkpoint-before-six-content-20261030-v47` 及源码归档 `/workspace/work/six-content-v47-source.tar.gz`。
- 本批对应用户确认的六项：活动完整案例、界面动效、设备面板、两篇运营文章、游艺机动作、BM/U8设计取舍。
- 新增两篇图解，补充四篇现有文章；不新增课程、答题或被删除的AI工作流。

## 实际入口

1. `/articles/campaign-risk-review#campaign-operations-case`：同一活动的后台配置、前台规则、申请审核与发放；规则更正保留旧申请快照，重复发放返回同一条记录。
2. `/articles/interface-motion-feedback#interface-motion-demo`：提交、筛选与弹层三组有限播放；暂停冻结计时和动画，支持静态步进、减少动态效果和焦点返回。
3. `/articles/device-controls-feedback#device-controls-demo`：三部位与四情景，主请求禁重复、票据确认取消、缺纸后重试同一票据。复用既有 Anatomy 75实体 SVG，无新几何引擎依赖。
4. `/articles/channel-quality-review#channel-quality-case` 与 `/articles/community-operations-governance#community-support-case`：渠道资料至复核归档；群内咨询至私密工单、回复与关闭。保留原有标题锚点。
5. `/articles/electronic-gaming-machine#machine-view`：进钞、退钞、收纳与出票连续动作，对应固定快照的余额和原票据；重播不产生新记录，选择部件停止自动推进。
6. `/cases/bm-optimization#bm-design-rationale` 与 `/cases/competitor-analysis#u8-design-rationale`：已有原图与生成式方案局部、设计取舍、材料边界及原型入口；保留原局部定位和图片查看行为。

## 导航、素材与真实性

- 两篇新图解进入设计对象、产品/开发/测试角色、搜索、站点地图和演示目录；保留原交互和新人各七篇集合。
- 五张16:10封面从本批正文界面拍摄；`scripts/capture-practice-covers.mjs` 可复拍，`public/images/articles/practice-cover-manifest.json` 保存页面、状态与素材类型。
- 活动、渠道、社群、设备面板均为明确标注的本页示例，无真实发布、账号操作、资金或硬件接入。
- BM/U8只依据现有图像解释，不虚构访谈、用户测试或效果提升。
- 更新记录按 v48 列逐项入口；新文章与修改文章在本版本各计一次。

## 验收

- 内容检查41篇文章、9个模板、4个案例通过；类型、差异检查及生产静态构建通过；104个导出页面的内部文件、canonical、素材来源与账务算术完整性通过。
- `CHECK_SCOPE=six-content` 在1440/390通过：三运营案例、三组界面动效、设备面板、游艺机、BM/U8取舍与局部查看、设计/运营/专业角色目录、搜索往返、官网定位及文章默认展开。无脚本/水合或同源图片脚本加载错误。
- 实际命令结果与发布、GitHub提交以本批交付记录为准。桌面浏览器手机宽度检查不等于iOS/Android真机验证。

## v49 封面与验收脚本修正

线上目视复查发现动效封面带入固定站点头部，现重新拍摄五张封面：采集时隐藏外层导航，并固定合成画布尺寸。v48的六项功能不变。GitHub CI另发现新案例验收重复拼接/game，以及长页定位检查过于依赖固定坐标，随本修正版修正并重新验证。

分段HTML回归进一步复现新案例说明锚点在目标出现前失效的情况，修正版为这两个锚点增加加载后定位，不影响其他位置或大图关闭后的阅读恢复。
