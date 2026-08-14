# 产品原型前端 — 开发指引

React + TypeScript + Vite + Tailwind CSS 的轻量产品原型模板。

## 面向用户与输出方式

本模板主要面向的是**非技术同学**（产品、设计、运营等），他们一般不关心代码与执行细节，过程信息过多反而是干扰。对话输出请遵守：

- **不做技术性逐步播报**：不要解说「现在更新字体」「修改全局样式」「项目结构清楚了」这类过程旁白。
- **阶段性用大白话汇报**：只在「开始做某个页面 / 做完某个页面」这种节点，用一句非技术语言说明进展，例如「首页框架搭好了，正在加数据卡片」。
- **结尾给人话总结**：完成后用 1～2 句说明「做了什么、怎么看效果」并给出本地预览地址，不罗列文件清单和代码细节。
- 用户主动问「怎么实现的」时，再展开技术细节。

（注：文件改动的 diff 展示由 AI 工具界面渲染，无法在此关闭；以上约束用于减少多余的文字解说。）

## 技术栈

- Node.js >= 22
- React 19 + react-router-dom v6
- Vite 7（开发端口 8820）
- TypeScript 5（strict 模式）
- Tailwind CSS v4
- ESLint + Prettier

默认不预装 Zustand、ahooks、axios、Ant Design 或其他 UI 组件库。只有需求明确需要时再添加依赖。

## 命令速查

| 命令 | 用途 |
|------|------|
| `pnpm run dev` | 启动开发环境（不阻塞类型检查，原型快速迭代） |
| `pnpm run build` | 类型检查并构建 |
| `pnpm run preview` | 预览构建产物 |
| `pnpm run lint` | ESLint 检查 |
| `pnpm run type-check` | TypeScript 类型检查 |

## 项目结构

```txt
src/
├── pages/        # 页面组件
├── routes/       # 路由配置
├── index.css     # Tailwind 入口与 @theme 设计 token
└── main.tsx      # 应用入口
```

## 修改模板自带文件（避免失败重试）

模板生成时已自带以下文件并含初始内容，**修改前必须先读取该文件再编辑**，否则首次写入会失败、产生多余的报错与重试：

- `index.html`、`src/index.css`、`src/main.tsx`
- `src/pages/HomePage.tsx`、`src/pages/NotFoundPage.tsx`、`src/routes/index.tsx`

对已存在文件优先用「局部编辑」而非整文件覆盖；同一文件的多处改动尽量一次完成，避免反复写入。

## 编码规范

- 路径：跨目录使用 `@/`，避免多层 `../../../`
- 导出：使用具名导出，避免 default export
- 命名：组件/页面 PascalCase，变量和函数 camelCase
- 原型优先：先验证产品方向和交互，不提前工程化抽象
- 依赖克制：不要为了示例提前引入状态库、请求库或 UI 组件库
- 样式：统一用 Tailwind CSS 工具类；需要设计 token 时在 `src/index.css` 的 `@theme` 中扩展

## Project AI Skills

项目内置 AI skills 位于 `.ai/skills/`。`.claude/skills/` 和 `.cursor/skills/` 会在项目生成时自动指向这些 skill。

常用调用：

| 用户写法 | 读取文件 | 适用场景 |
|----------|----------|----------|
| `/prototype` | `.ai/skills/prototype/SKILL.md` | 做可丢弃的 UI 或逻辑原型，快速回答一个设计问题 |
| `/frontend-design` | `.ai/skills/frontend-design/SKILL.md` | 在目标用户、使用场景和品牌气质明确后做高质量界面实现 |

如果用户没有指定 skill，按普通 React 项目开发流程处理；可以建议合适的 skill，但不要强制进入 skill 流程。

<!-- BEGIN baseline-reference（由 baseline 渲染器注入，请勿手改） -->
## 团队基线引用（必填，请勿删除本段）

本项目继承 nexus-fe 团队基线 `agent-spec@0.4.0`，由 baseline 渲染器渲染到本仓库：

- 编码规范 / git / commit / 命名 → skill `agent-spec-conventions`
- 棘轮 + 提测多步硬门 → skill `agent-spec-ratchet-discipline`
- 失败模式词典格式 → skill `agent-spec-failure-mode-dict`
- 自动维护本文件 → hook `agents-md-review`（挂 Stop 事件）

**跨 agent 说明**：本文件 `AGENTS.md` 是单一源真相，Codex 原生读取；Claude Code 经同目录 `CLAUDE.md` 的 `@AGENTS.md` import 读到同一份。两边的 skills / hooks 由 baseline 渲染器渲染到各自落点，内容同源。

升级方式：拉取新版 `agent-spec` 后重跑 `bin/render.mjs`（不手改本段）。基线问题反馈给 DRI / 提 MR 到 `agent-spec`。
<!-- END baseline-reference -->
