---
name: agent-spec-ratchet-discipline
description: nexus-fe 团队棘轮机制（配对同步族：源改动 → 配对契约/单测同步）与提测多步硬门。当用户说「提测 / 准备提测」，或改动了 service / 业务逻辑准备提交时遵循。
---

# 棘轮 + 提测多步硬门

> **总闸**：契约 / 配对棘轮要求项目自有配对体系（独立契约层或单测文件配对）。项目不具备时，本 skill 的棘轮门**不生效**——不得据此声称「棘轮已就位」，**不得对棘轮门标 N/A 蒙混**；提测时须显式向用户报告「棘轮未接入」，由用户决定接入或按项目质量门（库走 coverage.thresholds / 前端走人工验证）放行。
> 抽自 atlas-ai-service / atlas-skillhub-cli 工业化实践，参数化为团队通用。项目专属命令（`{{...}}`）由 baseline 渲染器按 `agent-spec.config.json` 填充；需补齐时编辑该 config 并重跑 `bin/render.mjs`。**逃生口收紧**：棘轮这条 fail-closed 门不允许静默标 N/A（见上方总闸）；其余步骤（如 e2e 需 token）仍可走「询问 / 跳过」的合法路径。
> **cadence 说明**：本 skill 的「提测 N 步严格按序」是**确定性工作流闸门**，刻意保持有序——Opus 4.8「prefer general instructions over prescriptive steps」只针对推理任务，不针对确定性 gate，勿误删步骤。

## 棘轮机制（配对文件同步性检查）

目的：每次源改动都带上对应配对目标（契约 / 单测）的同步改动 / 新增，让覆盖随业务**单调增长**，不靠专门排期。脚本是**配对文件同步性检查器**——只看配对文件是否随源改动而改 / 新增，**不读文件内容、不跑测试、不算覆盖率**。

改动 service / 业务模块时的硬性规则：

- 改动了**已覆盖**模块 → 必须同步 review 对应配对目标（契约 / 单测），必要时补齐。
- 改动了**未覆盖**模块 → 至少为本次改动的接口 / 业务规则**新增 1 个配对目标**（契约或单测），跑通后再提交。
- 棘轮检查命令：`{{RATCHET_CHECK_CMD}}`（如 `npm run check:ratchet`）；契约跑通命令：`{{CONTRACT_SMOKE_CMD}}`。

### baseline ship 的配对棘轮框架（按族说清）

当项目 `agent-spec.config.json` 声明 `"ratchet": { "family": "pairing" }` 时，baseline 渲染器会 scaffold 一份 diff 驱动的配对棘轮框架 `scripts/check-test-ratchet.sh`（首次 scaffold，之后不覆盖，需项目编辑顶部 EDIT 块），覆盖两个已验证 profile：

- `CONTRACT_PAIRING`：`src/<mod>/` 改了 → `smoke/contracts/<mod>.contract.smoke.ts` 须同步 / 新增（atlas-ai-service）。
- `TEST_FILE_PAIRING`：`cli/src/<f>.ts` 改了 → `cli/src/__tests__/<f>.test.ts` 须同步 / 新增（含 `gateway/` 前缀拼接 + EXEMPT_FILES 白名单，atlas-skillhub-cli）。

**框架不覆盖、需项目自备命令的其余族**（别误以为这份骨架管它们）：

- **覆盖率阈值族**（coverage% 只升不降）：用 vitest/jest 的 `coverage.thresholds` 把当前覆盖率定档为地板（如 `vitest run --coverage`，在 config 里把 `lines/branches/functions/statements` 设为现值），`ratchetCheck` 指向该覆盖率检查命令。配对骨架不解此族。
- **lint 零警告**（`--max-warnings=0`）/ **类型严格度只增**（tsconfig strict flag 逐步收紧）/ **快照冻结显式批准** / **发布元数据完整性** / **pre-push 测试门**：均非配对族也非阈值族，用项目自有脚本。

脚本来源：`scripts/check-test-ratchet.sh` 由 baseline 渲染器从 `templates/check-test-ratchet.sh.tmpl` scaffold；算法主体逐字 ship 自上述两亲本仓，项目只编辑顶部 `>>> EDIT 此块 <<<`（选 profile + 填模块映射 + 派生函数）。

## 提测流程（确定性硬门，严格按序，任一步失败立即中断报告）

「Agent 主导开发」场景的质量门——把所有防线串成流水线，开发者点击合 MR 时检查已过完。

<!-- RATCHET_STEP1:BEGIN -->
1. **⚠ 棘轮未接入**（`commands.ratchetCheck` 为空）。
   - 如选择配对棘轮，在 `agent-spec.config.json` 增加 `"ratchet": { "family": "pairing" }` 后重跑渲染，生成
     `scripts/check-test-ratchet.sh`（配对棘轮骨架）。打开它，按顶部 EDIT 块
     选 `PROFILE`（CONTRACT_PAIRING / TEST_FILE_PAIRING）并填模块映射；在 package.json 加
     `"check:ratchet": "bash scripts/check-test-ratchet.sh"`，回填 `agent-spec.config.json` 的
     `commands.ratchetCheck` 后重跑渲染，本步即恢复为可执行棘轮门。
   - 在此之前**棘轮闸门不成立**：不得据此声称棘轮已就位，**不得标 N/A 蒙混**；提测时须显式向用户
     报告「棘轮未接入」，由用户决定是接入还是按项目质量门（库走 coverage.thresholds / 前端走人工验证）放行。
<!-- RATCHET_STEP1:END -->
2. **失败模式 sweep**：对照 `agent-spec-failure-mode-dict` 里项目的 F-1..F-N 逐条问「本次改动可能踩这条吗」；可能但无测试 → 当场补（参考词典每条的「测试范式」），补完回步骤 1 重跑棘轮。
3. **单元测试** `{{UNIT_TEST_CMD}}` —— 必须全绿。
4. **契约 / 集成测试** `{{CONTRACT_SMOKE_CMD}}` —— 必须全绿（条件性 skip 允许）。
5. **完整端到端（如需 token）**：询问用户提供凭证或「跳过只跑只读」，按回应执行 `{{E2E_CMD}}` / `{{E2E_READONLY_CMD}}`。
6. **生产环境（可选）**：test 通过后询问是否验生产，提供凭证则跑 `{{E2E_PROD_CMD}}`。

完成后输出「**提测验证通过**」+ 总结：棘轮 ✅ / 失败模式 sweep（命中·未命中·已补测）/ 单元 N/N / 契约 M/M+K skip / e2e 通过·跳过。

## 发布流程纪律（dev → main → tag，如项目走此模型）

- 发版是提测的下游：测试质量已在提测确认，发版只做**版本定档 + 变更总结 + 远端动作**，不重跑测试。
- 远端动作纪律见 `agent-spec-conventions` §远端不可逆动作。
- 「生产 smoke 是上线后回归、不是上线 gate」——push tag + 部署完成后才有意义，别当发版 gate。
