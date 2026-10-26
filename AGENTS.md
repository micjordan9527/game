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

Image viewing preference (2026-10-25):
- For BM/U8, “适应屏幕” fits the available width and preserves the image aspect ratio; long images scroll vertically without horizontal scrolling. Do not shrink the image to fit the viewport height.
- Keep reading position when changing display scale and restore the page position when closing the viewer.
