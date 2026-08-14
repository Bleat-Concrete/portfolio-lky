from __future__ import annotations

import json
import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH

WORK_ROOT = Path(
    r"C:\Users\liangkeyin\Documents\Codex\2026-08-13\atlas-https-atlas-ai-api-lilithgames\work\texts"
)
OUT_PATH = Path(r"C:\Users\liangkeyin\Desktop\portfolio\src\data\textWorks.json")

CATEGORY_META = {
    "1": (
        "game-writing",
        "游戏文本",
        "游戏文本类保留项目说明、角色介绍、推理流程和互动叙事能力展示。",
    ),
    "2": (
        "fan-fiction",
        "同人文",
        "同人文类展示角色关系、情绪调度、喜剧节奏和类型化叙事。",
    ),
    "3": (
        "cyberpunk-world",
        "原创赛博朋克世界观",
        "原创赛博朋克世界观类展示设定写作、文化志、历史、派系与角色视角。",
    ),
    "4": (
        "rules-horror",
        "规则怪谈",
        "规则怪谈类展示交互式文本、模拟系统口吻、规则文本和恐怖氛围设计。",
    ),
    "5": (
        "original-fiction",
        "原创小说",
        "原创小说类展示主题表达、对话节奏、意象系统和长文本控制力。",
    ),
    "6": (
        "english-screenplay",
        "剧本（英文）",
        "英文剧本类展示英文叙事、角色对白和团队协作项目中的剧作能力。",
    ),
}

INTRO_COUNTS = {
    1: 4,
    2: 3,
    3: 7,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 4,
    9: 2,
    10: 1,
    11: 3,
    12: 2,
    13: 2,
    14: 0,
    15: 2,
    16: 3,
    17: 5,
    18: 3,
    19: 3,
    20: 4,
    21: 6,
}

TITLE_OVERRIDES = {
    1: "弹丸论破同人：角色介绍剧情",
    2: "弹丸论破同人：班级审判环节",
    3: "迷走 Vagus",
    11: "月影三叠",
    12: "海洋，勿语：再次点燃",
    13: "穷秋影集",
    14: "幕间曲：无望之潮",
    18: "回旋电梯",
    19: "万物理论：交缠的命运脉络",
    21: "世界锅——锅包肉拯救世界计划",
}

TAG_OVERRIDES = {
    1: ["二次元", "弹丸论破世界观", "赛博朋克", "推理", "文字AVG", "角色介绍"],
    2: ["二次元", "弹丸论破世界观", "赛博朋克", "推理", "文字AVG"],
    21: ["现代东北", "文字模拟经营", "多结局", "搞笑"],
}

BODY_MARKERS = {
    "正文部分",
    "正文部分：",
    "正文部分:",
    "公开发表正文部分",
    "公开发表正文部分：",
    "公开发表正文部分:",
}

TITLE_BODY_MARKERS = {
    11: "月影三叠",
    18: "回旋电梯",
    19: "万物理论：交缠的命运脉络",
}

TITLE_INTRO_MARKERS = {
    12: "海洋，勿语：再次点燃",
    13: "穷秋影集",
    14: "幕间曲：无望之潮",
}

INTRO_TEXT_REPLACEMENTS = {
    3: [("本文为3D心理探索AVG《迷走Vagus》文案。", "本文为3D心理探索AVG文案。")],
    20: [("《无声的告别》讲述了", "本作讲述了")],
}

SUMMARY_OVERRIDES = {
    3: "本文为3D心理探索AVG文案。",
    9: (
        "本文为该世界观下的角色小传，由角色主观意识流思考和专访两部分组成。"
        "该角色现在的身份是寄宿在机体内的意识，在转为数字生命之前精神崩溃，所以第一部分以混乱、癫狂的风格写就。"
        "第二部分是对第一部分角色的采访，内容结合世界观街区文化设定里第二部分提到的历史概览内容。"
    ),
    11: "使用月相盈亏的规律，设计好故事不同阶段读者所知的信息量。",
}

INTRO_DROP_MARKERS = {
    3: {
        "游戏内文案：",
        "游戏内文案:",
        "本文为3D心理探索AVG《迷走Vagus》文案。本游戏已经全部由本人独立制作出可游玩版本，游玩演示视频请见：https://www.bilibili.com/video/BV1vWVazPEWX/?share_source=copy_web&vd_source=95e84585e1678f0d89ea6bb795712097（注：视频内文案为英文版本）",
        "本文为3D心理探索AVG文案。本游戏已经全部由本人独立制作出可游玩版本，游玩演示视频请见：https://www.bilibili.com/video/BV1vWVazPEWX/?share_source=copy_web&vd_source=95e84585e1678f0d89ea6bb795712097（注：视频内文案为英文版本）",
    },
    9: {
        "本文为该世界观下的角色小传，由角色主观意识流思考和专访两部分组成。",
        "该角色现在的身份是寄宿在机体内的意识，在转为数字生命之前精神崩溃，所以第一部分以混乱、癫狂的风格写就。第二部分是对第一部分角色的采访，内容结合世界观街区文化设定里第二部分提到的历史概览内容。"
    },
    11: {"本文创作主旨为：使用月相盈亏的规律，设计好故事不同阶段读者所知的信息量。"},
}


def load_manifest():
    rows = []
    for line in (WORK_ROOT / "manifest.tsv").read_text(encoding="utf-8-sig").splitlines():
        if not line.strip():
            continue
        idx, rel, dst = line.split("\t")
        rows.append((int(idx), rel, Path(dst)))
    return rows


def clean_filename(name: str) -> str:
    stem = Path(name).stem.strip()
    return re.sub(r"^\d+(?:\.\d+)?-", "", stem).strip()


def clean_tag(tag: str) -> str:
    tag = tag.strip()
    if "：" in tag:
        prefix, rest = tag.split("：", 1)
        if prefix in {"同人", "个人项目"}:
            tag = rest
    elif ":" in tag:
        prefix, rest = tag.split(":", 1)
        if prefix in {"同人", "个人项目"}:
            tag = rest
    return tag.strip()


def tags_from_name(name: str) -> list[str]:
    stem = clean_filename(name)
    if "：" in stem:
        prefix, rest = stem.split("：", 1)
        if prefix in {"同人", "个人项目"}:
            pieces = rest.split("+")
        else:
            pieces = [stem]
    elif ":" in stem:
        prefix, rest = stem.split(":", 1)
        if prefix in {"同人", "个人项目"}:
            pieces = rest.split("+")
        else:
            pieces = [stem]
    else:
        pieces = stem.split("+")
    return [clean_tag(piece) for piece in pieces if clean_tag(piece)]


def ensure_category_tags(category_slug: str, tags: list[str]) -> list[str]:
    required_tags = {
        "fan-fiction": ["外星从"],
    }.get(category_slug, [])

    next_tags = list(tags)
    for tag in required_tags:
        if tag not in next_tags:
            next_tags.insert(0, tag)
    return next_tags


def category_for(folder: str):
    match = re.match(r"^(\d+)-", folder)
    if not match:
        return ("texts", folder, folder)
    return CATEGORY_META[match.group(1)]


def is_blank(paragraph: dict) -> bool:
    return not paragraph["text"].strip()


def nonblank(paragraphs: list[dict]) -> list[dict]:
    return [paragraph for paragraph in paragraphs if not is_blank(paragraph)]


def paragraph_to_rich(paragraph) -> dict | None:
    runs = []
    full_text = ""
    for run in paragraph.runs:
        text = run.text
        if not text:
            continue
        full_text += text
        runs.append(
            {
                "text": text,
                "bold": bool(run.bold),
                "italic": bool(run.italic),
                "underline": bool(run.underline),
            }
        )

    stripped = full_text.strip()
    align = "center" if paragraph.alignment == WD_ALIGN_PARAGRAPH.CENTER else "left"
    if not stripped:
        return {"text": "", "align": align, "runs": [], "isBlank": True}

    # Trim whitespace at paragraph edges without losing internal run formatting.
    leading = len(full_text) - len(full_text.lstrip())
    trailing = len(full_text.rstrip())
    cursor = 0
    trimmed_runs = []
    for run in runs:
        text = run["text"]
        start = cursor
        end = cursor + len(text)
        cursor = end
        keep_start = max(start, leading)
        keep_end = min(end, trailing)
        if keep_start >= keep_end:
            continue
        new_run = dict(run)
        new_run["text"] = text[keep_start - start : keep_end - start]
        trimmed_runs.append(new_run)

    return {"text": stripped, "align": align, "runs": trimmed_runs}


def read_docx(path: Path) -> list[dict]:
    document = Document(path)
    paragraphs = []
    for paragraph in document.paragraphs:
        rich = paragraph_to_rich(paragraph)
        if rich:
            paragraphs.append(rich)
    return paragraphs


def title_from_body(idx: int, rel: str, paragraphs: list[dict], tags: list[str]) -> str:
    if idx in TITLE_OVERRIDES:
        return TITLE_OVERRIDES[idx]

    texts = [p["text"] for p in nonblank(paragraphs)]
    if idx in {1, 2}:
        return tags[0] if tags else clean_filename(rel)
    intro_count = INTRO_COUNTS.get(idx, 0)
    if idx == 20:
        for text in texts:
            if text == "The Unspoken Goodbye":
                return "无声的告别 / The Unspoken Goodbye"
    if intro_count < len(texts):
        candidate = texts[intro_count]
        if len(candidate) <= 40:
            return candidate
    return tags[0] if tags else clean_filename(rel)


def summarize(paragraphs: list[dict]) -> str:
    for paragraph in paragraphs:
        if not is_blank(paragraph):
            return paragraph["text"]
    return ""


def split_after_nonblank_count(
    paragraphs: list[dict], count: int
) -> tuple[list[dict], list[dict]]:
    if count <= 0:
        return [], paragraphs

    seen = 0
    for index, paragraph in enumerate(paragraphs):
        if not is_blank(paragraph):
            seen += 1
        if seen == count:
            return paragraphs[: index + 1], paragraphs[index + 1 :]

    return paragraphs, []


def remove_first_body_title(title: str, body: list[dict]) -> list[dict]:
    for index, paragraph in enumerate(body):
        if is_blank(paragraph):
            continue
        if paragraph["text"] == title:
            return body[:index] + body[index + 1 :]
        break
    return body


def split_intro_body(intro: list[dict], body: list[dict]) -> tuple[list[dict], list[dict]]:
    for index, paragraph in enumerate(body):
        marker = paragraph["text"].strip()
        if marker in BODY_MARKERS:
            return intro + body[:index], body[index + 1 :]
    return intro, body


def split_by_title_marker(
    idx: int, intro: list[dict], body: list[dict]
) -> tuple[list[dict], list[dict]]:
    marker = TITLE_BODY_MARKERS.get(idx)
    if not marker:
        return intro, body

    for index, paragraph in enumerate(body):
        if paragraph["text"].strip() == marker:
            return intro + body[:index], body[index + 1 :]

    return intro, body


def plain_run(text: str) -> dict:
    return {"text": text, "bold": False, "italic": False, "underline": False}


def replace_paragraph_text(paragraph: dict, replacements: list[tuple[str, str]]) -> dict:
    text = paragraph["text"]
    for old, new in replacements:
        text = text.replace(old, new)
    new_paragraph = dict(paragraph)
    new_paragraph["text"] = text
    new_paragraph["runs"] = [plain_run(text)]
    return new_paragraph


def bold_intro_label(paragraph: dict) -> dict:
    if is_blank(paragraph):
        return paragraph
    if any(run.get("bold") for run in paragraph["runs"]):
        return paragraph

    text = paragraph["text"]
    if text.endswith(("：", ":")):
        new_paragraph = dict(paragraph)
        new_paragraph["runs"] = [
            {"text": text, "bold": True, "italic": False, "underline": False}
        ]
        return new_paragraph

    label_end = text.find("：")
    if label_end < 0:
        label_end = text.find(":")
    if label_end < 0 or label_end > 18:
        return paragraph

    label = text[: label_end + 1]
    rest = text[label_end + 1 :]
    new_paragraph = dict(paragraph)
    new_paragraph["runs"] = [
        {"text": label, "bold": True, "italic": False, "underline": False}
    ]
    if rest:
        new_paragraph["runs"].append(
            {"text": rest, "bold": False, "italic": False, "underline": False}
        )
    return new_paragraph


def restore_intro_emphasis(intro: list[dict]) -> list[dict]:
    return [bold_intro_label(paragraph) for paragraph in intro]


def clean_intro_titles(idx: int, title: str, intro: list[dict]) -> list[dict]:
    title_markers = {title}
    if " / " in title:
        title_markers.update(piece.strip() for piece in title.split(" / ") if piece.strip())
    if idx in TITLE_INTRO_MARKERS:
        title_markers.add(TITLE_INTRO_MARKERS[idx])

    cleaned = []
    for paragraph in intro:
        text = paragraph["text"].strip()
        if text in INTRO_DROP_MARKERS.get(idx, set()):
            continue
        normalized = text.strip("《》")
        if normalized.startswith("标题："):
            normalized = normalized.removeprefix("标题：").strip().strip("《》")
        elif normalized.startswith("标题:"):
            normalized = normalized.removeprefix("标题:").strip().strip("《》")

        if normalized in title_markers:
            continue

        replacements = INTRO_TEXT_REPLACEMENTS.get(idx, [])
        if replacements:
            paragraph = replace_paragraph_text(paragraph, replacements)
        cleaned.append(paragraph)

    return cleaned


def remove_summary_from_intro(summary: str, intro: list[dict]) -> list[dict]:
    if intro and intro[0]["text"] == summary:
        return intro[1:]
    return intro


def remove_summary_from_body(summary: str, body: list[dict]) -> list[dict]:
    for index, paragraph in enumerate(body):
        if is_blank(paragraph):
            continue
        if paragraph["text"] == summary:
            return body[:index] + body[index + 1 :]
        break
    return body


def trim_edge_blanks(paragraphs: list[dict]) -> list[dict]:
    start = 0
    end = len(paragraphs)
    while start < end and is_blank(paragraphs[start]):
        start += 1
    while end > start and is_blank(paragraphs[end - 1]):
        end -= 1
    return paragraphs[start:end]


def merge_paragraphs(paragraphs: list[dict], separator: str = "") -> dict:
    runs = []
    text = ""
    for index, paragraph in enumerate(paragraphs):
        if index:
            text += separator
            if separator:
                runs.append(
                    {
                        "text": separator,
                        "bold": False,
                        "italic": False,
                        "underline": False,
                    }
                )
        text += paragraph["text"]
        runs.extend(paragraph["runs"])
    return {"text": text, "align": paragraphs[0]["align"], "runs": runs}


def refine_title(idx: int, title: str, body: list[dict]) -> str:
    body_text = nonblank(body)
    if idx in {6, 7} and body_text:
        subtitle = body_text[0]["text"]
        if subtitle and subtitle not in title:
            return f"{title}——{subtitle}"
    return title


def postprocess_body(idx: int, body: list[dict]) -> list[dict]:
    body_text_positions = [
        (index, paragraph) for index, paragraph in enumerate(body) if not is_blank(paragraph)
    ]
    if idx == 7 and len(body_text_positions) >= 5:
        _, term = body_text_positions[1]
        if term["text"] == "砼，人工石，混凝土":
            for run in term["runs"]:
                run["underline"] = True
        quote_start_index, quote_start = body_text_positions[2]
        attribution_index, attribution = body_text_positions[4]
        if quote_start["text"].startswith("“窗外") and attribution["text"].startswith("——周二下午谁没来"):
            lyric = merge_paragraphs(body[quote_start_index:attribution_index])
            citation = merge_paragraphs([lyric, attribution], separator="\n")
            body = body[:quote_start_index] + [citation] + body[attribution_index + 1 :]

    return body


def main():
    categories = []
    seen_categories = set()
    works = []

    for idx, rel, path in load_manifest():
        folder, filename = rel.split("\\", 1)
        category_slug, category_title, category_description = category_for(folder)
        if category_slug not in seen_categories:
            seen_categories.add(category_slug)
            categories.append(
                {
                    "slug": category_slug,
                    "title": category_title,
                    "description": category_description,
                }
            )

        paragraphs = read_docx(path)
        intro, body = split_after_nonblank_count(paragraphs, INTRO_COUNTS.get(idx, 0))
        tags = TAG_OVERRIDES.get(idx, tags_from_name(filename))
        tags = ensure_category_tags(category_slug, tags)

        title = title_from_body(idx, rel, paragraphs, tags)
        # If the formal title sits at the start of body, keep it out of the body text.
        body = remove_first_body_title(title, body)
        intro, body = split_intro_body(intro, body)
        intro, body = split_by_title_marker(idx, intro, body)
        title = refine_title(idx, title, body)
        intro = clean_intro_titles(idx, title, intro)
        intro = restore_intro_emphasis(intro)
        intro = trim_edge_blanks(intro)
        body = trim_edge_blanks(body)
        summary = SUMMARY_OVERRIDES.get(idx, summarize(intro + body))
        intro = remove_summary_from_intro(summary, intro)
        body = remove_summary_from_body(summary, body)
        intro = trim_edge_blanks(intro)
        body = postprocess_body(idx, body)
        body = trim_edge_blanks(body)

        works.append(
            {
                "slug": f"text-{idx:02d}",
                "category": category_slug,
                "categoryTitle": category_title,
                "sourcePath": rel,
                "title": title,
                "tags": tags,
                "summary": summary,
                "intro": intro,
                "body": body,
                "isPreview": False,
            }
        )

    OUT_PATH.write_text(
        json.dumps({"categories": categories, "works": works}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"Wrote {OUT_PATH}")
    print(f"Works: {len(works)}")


if __name__ == "__main__":
    main()
