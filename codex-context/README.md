# Codex 聊天入口备份

备份日期：2026-09-04  
用途：把当前电脑上为恢复项目创建的 Codex 聊天入口、上下文摘要和新电脑恢复步骤保存到 GitHub。

## 重要说明

这个仓库用于保存“可安全上传 GitHub 的 Codex 入口资料”，不是 Codex App 原始本机数据库。

不要把下面这些文件明文上传到 GitHub：

- `/Users/admin/.codex/auth.json`
- `/Users/admin/.codex/config.toml` 中的密钥或私密配置
- `/Users/admin/.codex/state_*.sqlite`
- `/Users/admin/.codex/thread_history_*.sqlite`
- 任何包含 token、cookie、密码、私钥的文件

如果以后要做到“另一台电脑完全原样恢复侧边栏和聊天数据库”，应把 Codex 本机状态做成加密包，单独保存或上传到私有仓库；不要明文提交。

## 当前需要无缝迁移的 3 个项目

| 项目 | 本机路径 | GitHub 文件备份状态 | Codex 入口状态 |
|---|---|---|---|
| TG-Gaming | `/Users/admin/Documents/Codex/2026-09-04/library-ai/TG-Gaming` | 已建本地 Git 初始提交 | 已创建入口聊天 |
| W-Gaming | `/Users/admin/Documents/Codex/2026-09-04/library-ai/W-Gaming` | 已建本地 Git 初始提交 | 已创建入口聊天 |
| 后台优化 | `/Users/admin/Documents/Codex/2026-09-04/library-ai/后台优化` | 已建本地 Git 初始提交 | 已创建入口聊天 |

## 新电脑恢复方式

1. 在新电脑安装并登录 Codex。
2. 从 GitHub clone 三个项目仓库。
3. 在 Codex 里为每个项目添加对应文件夹。
4. 打开本仓库 `entries/` 里的项目入口文件，把“新聊天启动提示”复制到对应项目的新 Codex 聊天里。
5. 如果你另外保存了加密的 Codex 本机状态包，再按加密包说明恢复侧边栏/历史状态。

## 文件说明

- `entries/TG-Gaming.md`：TG-Gaming 的 Codex 入口摘要和启动提示。
- `entries/W-Gaming.md`：W-Gaming 的 Codex 入口摘要和启动提示。
- `entries/admin-optimization.md`：后台优化的 Codex 入口摘要和启动提示。
- `restore-map.md`：三项目、入口线程 ID、本地提交 ID 和备份包映射。

## 与 GitHub 的关系

GitHub 负责保存可恢复项目资料：

- 项目源文件
- `.gitignore`
- 恢复说明
- Codex 入口摘要
- 新聊天启动提示

Codex 原始聊天数据库不建议明文放 GitHub；如需保存，必须加密。
