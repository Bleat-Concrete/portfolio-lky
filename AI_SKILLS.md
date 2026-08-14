# AI Skills

本模板内置项目级 AI 辅助技能，供 Cursor、Codex、Claude Code 等 agent 在开发时参考。

## 目录约定

```txt
.ai/skills/                 # 通用 skill 本体目录
├── frontend-design/         # 高质量前端界面设计与实现
└── prototype/               # 可丢弃 UI / 逻辑原型工作流

.claude/skills/             # Claude Code 项目级 skills 入口
.cursor/skills/             # Cursor 项目级 skills 入口
```

`.claude/skills/` 和 `.cursor/skills/` 下的入口会在项目生成时自动指向 `.ai/skills/`，避免维护多份 skill 内容。

## frontend-design

使用场景：

- 设计或重做首页、页面、组件和交互体验
- 需要更明确的视觉方向、排版、色彩、动效和响应式质量
- 已经知道目标用户、使用场景和品牌气质，准备进入界面实现

Skill 本体：

```txt
.ai/skills/frontend-design/SKILL.md
```

## prototype

来源：

```txt
https://www.skills.sh/mattpocock/skills/prototype
npx skills add https://github.com/mattpocock/skills --skill prototype
```

使用场景：

- 想先“玩一下”一个产品想法，而不是直接写生产代码
- 想看同一个 UI 的多个结构差异明显的方案
- 想用一个临时交互脚本验证状态模型、数据结构或业务流程

Skill 本体：

```txt
.ai/skills/prototype/SKILL.md
```

补充说明：

```txt
.ai/skills/prototype/UI.md
.ai/skills/prototype/LOGIC.md
```

## 使用原则

这些 skills 是可选能力，不强制自动调用。用户明确写出 `/prototype` 或 `/frontend-design` 时，先读取对应 `SKILL.md`，再按其中流程执行。
