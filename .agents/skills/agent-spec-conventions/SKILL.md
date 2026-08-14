---
name: agent-spec-conventions
description: nexus-fe 团队通用编码 / git / commit / 命名规范与 CLAUDE.md·AGENTS.md 元写作纪律。在写代码、写规则文件、起 commit、发起 MR、做远端推送类操作时遵循。
---

# nexus-fe 团队通用规范

> 本 skill 是 agent-neutral 的，Claude Code 与 Codex 通用。厂商专属字段（Claude frontmatter 的 `allowed-tools`、Codex 的 `agents/openai.yaml`）由 baseline 渲染器（bin/render.mjs）渲染时附加，不写进本 body。

## 规则文件元写作纪律（写 AGENTS.md / 项目规则时）

1. **写指令，不写描述**：`技术栈：NestJS + TypeORM` ✅ 而非 `这是一个后端服务` ❌——前者可执行、后者只是背景。
2. **双重过滤**：每条规则过两道——(a) 是可执行指令吗？(b) 删掉它 agent 会犯错吗？两条都过才留。
3. **写成功标准 + 验证，不写僵化微步骤**：给「先写失败测试再让它过」「验收：tests 全绿」这类成功标准；**不要**为推理任务写僵化的 step-by-step 脚本（Opus 4.8 官方：*prefer general instructions over prescriptive steps*）。例外：确定性工作流闸门（如提测流程）该保持有序步骤——见 `agent-spec-ratchet-discipline`。
4. **规则物理预算**：前沿模型稳定遵循的指令是有限资源（社区经验约 150-200 条；**非 Anthropic 官方数字**）。`IMPORTANT/MUST/NEVER` 滥用 = 等于没标记。判据用 Anthropic 官方口径：「删掉它会让 agent 犯错吗？不会就删」。
5. **踩坑记录优于通用原则**：规则从真实摩擦增量长出，不靠预填猜测。新坑进 `agent-spec-failure-mode-dict`。
6. **正例优于负例**（Opus 4.8 官方）：要约束行为时，给「该这样」的正面示例比堆「别那样」的否定指令更有效。安全/合规类硬禁令仍可用否定式。

## Git 规范

- Commit 格式：`<type>: <message>` 或 `<type>(<scope>): <message>`
- Type：`feat` / `fix` / `docs` / `chore` / `refactor` / `release` / `test`
- 分支模型：`main`（发布）、`dev`（开发）、`feat-*`（功能）
- CHANGELOG（如项目有）：分组「新增功能 / 优化 / 修复」，每条重写成业务可读中文，不直接复制 commit message。

## 远端不可逆动作纪律（push / tag / 合 main / 发版）

- 涉及远端推送的动作，**先把命令打出来给用户确认再执行**。
- 不可逆动作（push、tag、合 main）**一次只做一件**，禁止合并执行。
- `--ff-only` 合并失败（分歧）→ 立即停下报告，**不**自行改成 merge commit 或 rebase，交用户处理。

## 命名

- 文件 / 目录：项目主流约定优先（前端 kebab-case 组件按框架惯例）。
- 标识符：`PascalCase`（类型 / 组件）/ `camelCase`（变量 / 函数）/ `UPPER_SNAKE_CASE`（常量）。
- 不与团队基线冲突的项目专属命名，写进项目 AGENTS.md「项目专属编码规范扩展」。

## 安全边界纪律（通用）

- 含密钥 / 密码的环境文件（如 `*.env.local`）禁止提交；token 仅经环境变量传入。
- 「必须每次成立」的安全/写区不变量，做成 hook / 权限 deny，而非只写散文——指令是 request 不是 guarantee。
