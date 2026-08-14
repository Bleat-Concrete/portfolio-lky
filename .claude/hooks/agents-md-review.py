#!/usr/bin/env python3
"""
agents-md-review —— 团队基线自动维护 hook（agent-neutral）。

挂在 Stop 事件（Claude Code 与 Codex 都有 Stop；Codex 没有 SessionEnd，故统一用 Stop）。
**Stop 在两端均为 turn-scoped**：每次助手回复结束都触发，一次会话触发多次，每次都会 spawn 一个
无头 claude -p / codex exec（最长阻塞约 300s）——成本与延迟按「每轮一次」估，不是「每会话一次」。
每轮会话结束后，启动一个无头 agent 会话，读本次 git diff + 相关 AGENTS.md，
判断规则是否需要更新，把建议写到审查文件——**绝不直接改 AGENTS.md**，人工审查是最后安全锁。

成本警示（重要）：本 hook 跑无头 `claude -p` / `codex exec`。自 2026-06-15 起，
`claude -p` / Agent SDK 走独立 monthly credit 池、用完默认硬停（除非开 extra usage）。
因此本 hook 默认**不强制启用**；启用前评估成本，或设 AGENT_SPEC_REVIEW=off 关闭，
或在共享生产自动化里改用 Developer Platform API key。

读取：stdin JSON（含 cwd / session_id / hook_event_name，Claude 与 Codex 同形）。
退出码：恒 0（本 hook 只产出审查文件，不阻断 Stop）。
"""
import json
import os
import subprocess
import sys

REVIEW_FILE = ".agents-md-review.md"
LOCK_VAR = "AGENT_SPEC_REVIEW_LOCK"
OFF_VAR = "AGENT_SPEC_REVIEW"  # 设为 "off" 关闭


def main() -> int:
    # 防递归：无头会话进来直接退（否则审查者无限召唤审查者）
    if os.environ.get(LOCK_VAR):
        return 0
    if os.environ.get(OFF_VAR, "").lower() == "off":
        return 0

    # 读 stdin（Claude/Codex 同形，缺失则容忍）
    try:
        payload = json.load(sys.stdin) if not sys.stdin.isatty() else {}
    except Exception:
        payload = {}

    # 定位仓库根（hook 工作目录不固定，靠 git 而非 os.getcwd）
    try:
        root = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, cwd=payload.get("cwd") or None,
        ).stdout.strip()
    except Exception:
        return 0
    if not root:
        return 0
    os.chdir(root)

    # 本次改动：优先审当前工作区；若工作区干净，再回退最近一次 commit。
    diff, changed = _collect_change_snapshot()
    if not diff.strip():
        return 0
    if len(diff) > 12000:
        diff = diff[:12000] + "\n... (truncated)"

    # 顺改动文件向上收集 AGENTS.md（单一源真相；不收 CLAUDE.md，它只是 @import 桥接）
    agents_files = _collect_agents_md(changed)
    if not agents_files:
        return 0

    contents = []
    for f in sorted(agents_files):
        try:
            with open(f, encoding="utf-8") as fh:
                contents.append(f"=== {f} ===\n{fh.read()}")
        except OSError:
            continue

    prompt = _build_prompt(diff, contents)

    cli = _pick_headless_cli()
    if cli is None:
        # 优雅降级：无可用无头 CLI，只列改动区域 + 相关 AGENTS.md 路径
        _write_review(
            "# AGENTS.md Review（降级模式：未跑 LLM 审查）\n\n"
            "未检测到可用的无头 agent CLI（claude / codex）。以下是本次改动涉及的"
            "文件与相关 AGENTS.md，请人工判断是否需要更新规则：\n\n"
            f"## 改动文件\n" + "\n".join(f"- {c}" for c in changed if c) + "\n\n"
            f"## 相关 AGENTS.md\n" + "\n".join(f"- {f}" for f in sorted(agents_files))
        )
        return 0

    env = {**os.environ, LOCK_VAR: "1"}
    try:
        result = subprocess.run(
            cli,
            input=prompt,
            text=True,
            env=env,
            timeout=240,  # 严格小于注册的 300s，给「未产出→fallback 写文件」留余量
            cwd=root,
            capture_output=True,
        )
        if not os.path.exists(REVIEW_FILE):
            if result.stdout.strip():
                _write_review(result.stdout)
            elif result.returncode != 0 or result.stderr.strip():
                _write_review(
                    "# AGENTS.md Review（headless CLI 未产出审查文件）\n\n"
                    f"命令：`{' '.join(cli)}`\n\n"
                    f"退出码：{result.returncode}\n\n"
                    "```text\n"
                    f"{result.stderr[:4000]}"
                    "\n```"
                )
    except Exception as exc:
        # 跑挂也不阻断 Stop
        if not os.path.exists(REVIEW_FILE):
            _write_review(
                "# AGENTS.md Review（hook 执行异常）\n\n"
                "```text\n"
                f"{exc}"
                "\n```"
            )
    return 0


def _build_prompt(diff: str, contents: list) -> str:
    joined = "\n".join(contents)
    return f"""Review the following git diff against the relevant AGENTS.md files.
For each AGENTS.md, return ONE of:
- "No change needed" if conventions still hold
- "Propose edit" with the file path, the lines to change, and a one-sentence rationale
Only flag NEW conventions, commands, gotchas, or constraints that are missing or now wrong.
Do NOT suggest stylistic rewrites. Do NOT modify any source file.
Print your review results directly to stdout. Do NOT call any file-writing tool and do NOT modify any file.

## Git Diff
{diff}

## Relevant AGENTS.md Files
{joined}
"""


def _collect_agents_md(changed: list) -> set:
    found = set()
    for path in changed:
        d = os.path.dirname(path)
        while True:
            cand = os.path.join(d, "AGENTS.md") if d else "AGENTS.md"
            if os.path.exists(cand):
                found.add(cand)
            if not d:
                break
            d = os.path.dirname(d)
    return found


def _collect_change_snapshot() -> tuple[str, list]:
    # 路径一律走 -z（NUL 分隔）：默认 core.quotePath 会把非 ASCII 路径转义成 "\346..."，
    # 转义形态拿去 os.path.exists 找不到嵌套 AGENTS.md
    tracked_diff = _run(["git", "diff", "--no-ext-diff", "HEAD", "--", ":/"])
    tracked_changed = _run_paths(["git", "diff", "--name-only", "-z", "HEAD", "--", ":/"])
    untracked = _run_paths(["git", "ls-files", "--others", "--exclude-standard", "-z"])
    untracked = [p for p in untracked if p != REVIEW_FILE]  # 别把自己的审查产物喂进下一次审查

    if tracked_diff.strip() or untracked:
        parts = [tracked_diff] if tracked_diff.strip() else []
        parts.extend(_format_untracked_file(path) for path in untracked)
        return "\n".join(parts), tracked_changed + untracked

    if _has_ref("HEAD~1"):
        diff = _run(["git", "diff", "--no-ext-diff", "HEAD~1", "HEAD", "--", ":/"])
        changed = _run_paths(["git", "diff", "--name-only", "-z", "HEAD~1", "HEAD", "--", ":/"])
        return diff, changed

    return "", []


def _format_untracked_file(path: str) -> str:
    header = f"diff --git a/{path} b/{path}\nnew file mode 100644\n--- /dev/null\n+++ b/{path}\n@@\n"
    try:
        size = os.path.getsize(path)
        if size > 200_000:
            return header + "+<untracked file omitted: larger than 200KB>\n"
        with open(path, "rb") as fh:
            raw = fh.read(20_000)
    except OSError:
        return header + "+<untracked unreadable file omitted>\n"
    if b"\x00" in raw:
        return header + "+<untracked binary file omitted>\n"
    # 截断点可能切在多字节字符中间——宽容解码，别把文本文件误判成 binary
    text = raw.decode("utf-8", errors="replace")
    body = "".join(f"+{line}" for line in text.splitlines(keepends=True))
    if size > len(raw):
        body += "+... (truncated at 20KB)\n"
    return header + body


def _has_ref(ref: str) -> bool:
    return subprocess.run(["git", "rev-parse", "--verify", "--quiet", ref], capture_output=True).returncode == 0


def _pick_headless_cli():
    """按当前落点优先选同侧 CLI；都没有则 None（降级）。"""
    from shutil import which
    script_parts = set(os.path.normpath(sys.argv[0]).split(os.sep))
    preferred = ["claude", "codex"]
    if ".codex" in script_parts:
        preferred = ["codex", "claude"]
    elif ".claude" in script_parts:
        preferred = ["claude", "codex"]

    for name in preferred:
        if name == "claude" and which("claude"):
            return ["claude", "-p", "--output-format", "text"]
        if name == "codex" and which("codex"):
            return ["codex", "exec", "-"]
    return None


def _run(cmd: list) -> str:
    try:
        return subprocess.run(cmd, capture_output=True, text=True).stdout
    except Exception:
        return ""


def _run_paths(cmd: list) -> list:
    """跑带 -z 的 git 命令，按 NUL 切出路径列表。"""
    return [p for p in _run(cmd).split("\0") if p]


def _write_review(text: str) -> None:
    try:
        with open(REVIEW_FILE, "w", encoding="utf-8") as fh:
            fh.write(text)
    except OSError:
        pass


if __name__ == "__main__":
    sys.exit(main())
