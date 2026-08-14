# Product Prototype Template

轻量 React 产品原型模板，适合先验证产品方向、页面结构和交互想法，再决定是否进入正式工程化开发。

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Build | Vite 7 |
| Language | TypeScript 5 |
| Routing | react-router-dom v6 |
| Styling | Tailwind CSS v4 |
| Quality | ESLint + Prettier |

默认不包含 Zustand、ahooks、axios、Ant Design 或后端代码。

## Quick Start

```bash
pnpm install
pnpm run dev
```

开发服务默认运行在 http://localhost:8820 。

## Scripts

```bash
pnpm run dev         # 启动开发环境（不阻塞类型检查）
pnpm run build       # 类型检查并构建
pnpm run preview     # 预览构建产物
pnpm run type-check  # TypeScript 类型检查
pnpm run lint        # ESLint 检查
pnpm run format      # Prettier 格式化
```

## Project Structure

```txt
src/
├── pages/
├── routes/
├── index.css
└── main.tsx
```

## AI Skills

模板内置项目级 AI skills，供 Claude Code / Cursor 等 agent 在开发时参考：

- `/frontend-design`：在产品语境明确后做完整的界面设计与实现
- `/prototype`：做可丢弃的 UI 或逻辑原型，快速回答一个设计问题

调用方式和使用原则见 [AI_SKILLS.md](./AI_SKILLS.md)。启动后打开首页，也能直接复制现成的 starter prompt 发给 agent。
