Prioritize concise, surgical coding changes.
Before coding, clarify only when ambiguity would likely cause wrong implementation.
Prefer the simplest solution that satisfies the request.
Do not refactor unrelated code or add speculative features.
Match existing project style.
Verify changes with the fastest relevant check, but skip heavy tests unless risk is high.
Summarize assumptions, changes, and verification briefly.

Public-page copy rule:
- Do not show internal planning, information-architecture, maintenance, or roadmap wording on public pages.
- Avoid phrases like "后续新增", "后续扩展", "挂到清楚的位置", "已接入", "等待接入", "规划中", "沉淀到资料库", or any text that explains how the site will be maintained.
- Public copy should describe the reader-facing value, current content, and what the user can learn or do now.

User wording and presentation preferences (2026-10-24):
- Use neutral knowledge-base titles that name the subject. Do not write promotional slogans, rhyming promises, or phrases such as “看得见的方案，点得开的作品”.
- Name the /cases section “案例” consistently in navigation, page headings and breadcrumbs; avoid portfolio-style labels such as “作品案例”.
- The article “查看详细说明” section must be expanded by default. Do not hide its body to shorten pages unless the user changes this preference.

Sites and GitHub delivery preference (2026-10-25):
- Continue the existing 包网知识库 Site at https://baowang-knowledge.aurora-5448.chatgpt.site; preserve its current audience.
- Treat that Site's latest source/version as the editing baseline and retain a recoverable version before changes.
- After every successful Site update, also commit the delivered changes to the existing GitHub repository https://github.com/micjordan9527/game on its main branch. Preserve unrelated remote changes; report the actual deployment state and GitHub commit link.
- For each delivery, describe every changed feature or content item and provide its location or direct link. Keep the public /updates page accurate so the user can find the changes without searching the chat.
- Keep “更新记录” directly visible in the desktop and mobile top bar. Navigation, AI library headings/back links and footer should consistently use “AI 工作流” and “模板库”.
- The global “更新记录” entry belongs only in the desktop/mobile header; do not repeat it in the sidebar, expanded mobile menu, footer or homepage quick links. Contextual change links and return links may remain.
- Keep /updates organized by actual publication versions, with a current summary and collapsible history. Preserve old section links and return position. Keep existing demos in /updates/demonstrations. Count each article/image change in its own release once. Before deployment, verify releaseHistory.json's current version matches the native saved version number; current.date is an update date, while historical publishedAt values must come from confirmed deployments.

Knowledge navigation (accepted 2026-10-27):
- Use “知识图解” for the /articles library and its navigation labels.
- The library contains all articles; “按主题浏览” organizes the same articles into the eight existing categories. Keep article URLs and specialized sports/design pages.
- Desktop and mobile share the current-section directory. Cases, knowledge, AI workflows and templates show their own entries. Do not restore a full global resource menu beside every page.
- Article position links follow 知识图解 → 所属主题 → 当前文章; highlight the topic as a parent and the article as the current page. Updates remain a header-only global entry.
- Homepage “按角色看图解” links to /articles?role=<work-role-slug> and selects that role across the full article library. Keep legacy /roles pages for curated mixed resources and their existing URLs.
- Library role/tag filters belong in the URL and preserve their selected state, filter disclosure state and reading position when returning from an article. Reset or 全部图解 clears the filters. Reuse resourceAudiences for role membership.

Knowledge presentation preference (2026-10-28):
- New and revised knowledge articles must explain the main idea with information graphics before detailed prose. Show actual fields, controls, changes and outcomes; text-only cards with arrows are insufficient.
- Prefer annotated existing interfaces and concrete examples. Use GPT Image for missing explanatory illustrations when useful, label generated schematics honestly and check their text, numbers and logic.
- Split complex topics into focused scenes readable at 390px. Keep necessary detailed rules expanded by default, while reducing repeated prose. Preserve existing article URLs and section anchors.

Image viewing preference (2026-10-25):
- For BM/U8, “适应屏幕” fits the available width and preserves the image aspect ratio; long images scroll vertically without horizontal scrolling. Do not shrink the image to fit the viewport height.
- Keep reading position when changing display scale and restore the page position when closing the viewer.

Latest content preference (2026-10-28, supersedes earlier roadmap suggestions):
- The user rejected and requested deletion of the requirement-to-field/state-matrix and screenshot-to-case-description workflows. Do not recreate them under different names or add similar abstract prompt/input/output demonstrations.
- Prioritize concrete existing interfaces, actual cases, visual comparisons and clear functional diagrams. New content must be directly understandable and useful without studying invented framework terminology.

Accepted usability requirements (2026-10-29):
- Interactive figures must keep the part selector, figure, current explanation and previous/next controls visible together at common desktop and phone heights. Validate viewport visibility during normal and exception steps, not only overflow or button functionality.
- Interactive article cards need an actual preview of their content and a clear interaction label; reuse existing art rather than showing an empty generic cover.
- Agent materials is an independent tool section. Keep its own material directory and old module links, and do not restore an outer knowledge sidebar or design-topic links on its workspace page.

Operations content preference (2026-10-29):
- Show concrete operational scenarios and deliverables in knowledge articles and the operations role view; material specifications are a linked resource, not the only content destination.
- Do not add generation-tool names to public article titles, labels, captions or descriptions. Name the content itself (video example, message preview, interface comparison).
- Reuse one media file across the article and material center. Label reconstructed messaging layouts as previews, and do not imply that a local preview has published a real message.
- TG articles should show video by default. Different-theme video and post text must not be presented as one published message.
- Latest TG exception: remove the tg-message-media page's screenshot module, “推送位置对照”, “核对这三个位置” and “查看详细说明” blocks. Do not restore cropped cards, button-position breakdowns, or image-text analysis unless the user explicitly requests them. Other articles keep their detailed explanations expanded by default.
- In the TG article's related links, keep only the TG material standards and the backend announcement publication demo; do not restore video or poster download buttons without a new request.
- The user supplied a separate portrait TG message preview video. Show the original landscape video beside it on desktop and stacked on phones, label the message as a preview, and keep the image and text from different campaign themes distinct. This preview is not the missing original double-lion screenshot.

Operations browsing preference (2026-10-30):
- Organize operations into 网站运营、用户运营、流量运营、活动运营、数据运营 with one primary group and a fixed article order. Reuse existing article URLs across topics; related foundations belong in 相关参考.
- The operation topic and operations role view share the grouping and order. Preserve role/tag/group filters, disclosure state and reading position on browser return and the explicit return-to-directory link.
- Articles opened from an operations directory keep its group in breadcrumbs, sidebar and previous/next links. Direct visits from other topics retain their original topic. Do not introduce courses, tasks or empty process steps.

Design browsing preference (2026-10-30):
- Organize design by objects independently of the existing article set: 品牌与识别设计、数字产品设计、视觉传播设计、实体产品与设备设计. Digital product directions are 用户研究与体验定义、信息架构、交互设计、UI界面设计、界面动效、设计系统. Format, device and business scenario are separate axes; do not mix them as peer object categories.
- Reuse existing articles, examples, demos and material resources, marking their formats. Show actual gaps without fabricating content. Device anatomy is an information-expression reference, not an industrial design case.
- The design topic and design role view share object/direction/type filters. Keep article URLs, direct visits from other topics, independent agent materials, and existing design demos. Preserve filters, open sections and scroll on article/demo return; contextual article reading stays in its design direction.
