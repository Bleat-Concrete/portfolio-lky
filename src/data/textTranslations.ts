import type { Locale } from "@/data/portfolio";

const categoryTitles: Record<string, string> = {
  "game-writing": "Game Writing",
  "fan-fiction": "Fan Fiction",
  "cyberpunk-world": "Original Cyberpunk Worldbuilding",
  "rules-horror": "Rule-Based Horror",
  "original-fiction": "Original Fiction",
  "english-screenplay": "English Screenplay",
};

const tagTranslations: Record<string, string> = {
  "二次元": "Anime-Inspired",
  "弹丸论破世界观": "Danganronpa Worldview",
  "赛博朋克": "Cyberpunk",
  "推理": "Mystery",
  "文字AVG": "Text AVG",
  "角色介绍": "Character Profiles",
  "3D心理探索AVG": "3D Psychological Exploration AVG",
  "外星从": "Fandom - Aliien",
  "爱情向": "Romance",
  "现代": "Contemporary",
  "搞笑": "Comedy",
  "精神分析心理描写流": "Psychoanalytic Interior Writing",
  "友情向": "Friendship",
  "2010s西南县城": "2010s Southwestern County Town",
  "幽默风生活流": "Humorous Slice of Life",
  "冷峻压抑": "Cold and Repressed",
  "暴力美学cult公路片": "Cult Road Story / Violent Aesthetics",
  "疯狂张扬": "Frenzied and Flamboyant",
  "世界观街区文化及历史设定": "District Culture and History",
  "意识流": "Stream of Consciousness",
  "基于时代历史的角色小传": "Character Sketch Rooted in Historical Context",
  "跨年节庆下的文化氛围幻想": "New Year Cultural Atmosphere",
  "多派系权斗文": "Multi-Faction Power Struggle",
  "叙事层": "Narrative Layers",
  "实验性文风": "Experimental Prose",
  "机器人视角幻想故事": "Robot-POV Speculative Fiction",
  "幻想主题公路文": "Speculative Road Story",
  "角色主观视角印象短句": "Subjective Character Impressions",
  "交互": "Interactive",
  "仿大语言模型": "LLM Simulation",
  "模拟恐怖": "Simulated Horror",
  "规则怪谈": "Rule-Based Horror",
  "现代背景": "Contemporary Setting",
  "多派系": "Multiple Factions",
  "架空世界观": "Fictional Worldbuilding",
  "宗教": "Religion",
  "群像": "Ensemble Cast",
  "现代幻想": "Contemporary Fantasy",
  "思辨": "Speculative / Philosophical",
  "对话为主短篇": "Dialogue-Driven Short Story",
  "命题要素短篇": "Prompt-Based Short Story",
  "科幻": "Sci-Fi",
  "异能": "Superpowers",
  "战斗短篇": "Combat Short Story",
  "少数群体（菲佣、儿童）": "Minority Groups (Domestic Workers, Children)",
  "现代香港": "Contemporary Hong Kong",
  "亲情向": "Family",
  "现代东北": "Contemporary Northeast China",
  "文字模拟经营": "Text Management Sim",
  "多结局": "Multiple Endings",
  "合作": "Collaboration",
  "生活流": "Slice of Life",
  "梦核": "Dreamcore",
  "哲学": "Philosophy",
  "现代性": "Modernity",
};

const workTitleTranslations: Record<string, string> = {
  "text-01": "Danganronpa Fan Game: Character Profiles",
  "text-02": "Danganronpa Fan Game: Class Trial",
  "text-03": "Vagus",
  "text-04": "Don Quixote Arrives",
  "text-05": "Deep Southwest: Skipping School, E-Bikes, and Aliens",
  "text-06": "Halfway Road, Murder Tune: Higher Animal Tune",
  "text-07": "Halfway Road, Murder Tune: Concrete Teeth Tune",
  "text-08": "A Socio-Cultural Gazetteer of Eastfront District",
  "text-09": "Madman Afloat",
  "text-10": "New Year's Eve (A Cultural Atmosphere Reconstruction Experiment)",
  "text-11": "Triple Moonshadow",
  "text-12": "Ocean, Do Not Speak: Rekindled",
  "text-13": "Autumn's Shadow Album",
  "text-14": "Interlude: Tide Without Hope",
  "text-15": "TQL Language Model",
  "text-16": "Jiulishan Residential Compound",
  "text-17": "Secondary Growth",
  "text-18": "Revolving Elevator",
  "text-19": "Theory of Everything: Entangled Threads of Fate",
  "text-20": "The Unspoken Goodbye",
  "text-21": "World Pot: Guo Bao Rou Saves The World",
};

const workSummaries: Record<string, string> = {
  "text-01": "An excerpt from the character-profile section of Danganronpa: CYBER, a fan-made text AVG that combines the Danganronpa framework with an original cyberpunk world and original characters.",
  "text-02": "An excerpt from the first chapter's class trial in Danganronpa: CYBER, focusing on the reasoning sequence after the body discovery and evidence collection while omitting some gameplay branches.",
  "text-03": "A script excerpt for a 3D psychological exploration AVG.",
  "text-04": "A fan-fiction excerpt using psychoanalytic theory, stream of consciousness, interior monologue, and comic rhythm to build character dynamics across selected chapters.",
  "text-05": "A fan-fiction chapter set in a 2010s southwestern county town, using dialect, daily-life detail, and grounded atmosphere to shape a humorous slice-of-life story.",
  "text-06": "A chapter-two character sketch from Alien Cong fan fiction. The piece is cold yet flamboyant, using symbolism and interior monologue to portray a distorted sense of reality in pursuit of violent aesthetics.",
  "text-07": "A fan-fiction excerpt covering the end of chapter seven and chapter eight, presenting the second case through a cold, serious, and extravagant road-story style.",
  "text-08": "A worldbuilding document for one district in the original cyberpunk setting, covering cultural overview, historical background, and resident interviews.",
  "text-09": "A character sketch in the original cyberpunk setting, combining subjective stream of consciousness with an interview to portray a collapsed mind living inside a machine body.",
  "text-10": "An exploration of New Year's cultural atmosphere and everyday life within the original cyberpunk world, arranged through multiple narrative units.",
  "text-11": "A multi-faction power-struggle story structured around moon phases, using shifts in available information to control suspense and reader perspective.",
  "text-12": "A rewritten speculative story that uses unstable narrative layers and a robot's perspective to construct an unreliable, disordered world.",
  "text-13": "A speculative road story about a melancholic man and a robot traveling toward an uncertain future while discussing psychoanalysis, fantasy, and existence.",
  "text-14": "A set of subjective character-impression fragments that capture a character's survival, perception, and emotional state within the worldbuilding setting.",
  "text-15": "A rule-based horror project centered on an LLM named TQL, using its imbalance, hallucinations, and procedural tone to create interactive fear.",
  "text-16": "A rule-based horror project about an anomalous residential compound, emphasizing how different factions and ideologies respond to the abnormal.",
  "text-17": "A contemporary fantasy short story that uses the images of a high-school girl and a magical girl to examine language, thought, and the formation of consciousness.",
  "text-18": "A prompt-based short story written for a platform event, using assigned elements to create an experimental narrative structure.",
  "text-19": "A battle-oriented speculative short story built around ability deduction, close combat, potions, resurrection, schemes, and shifting tactical information.",
  "text-20": "An English screenplay about Cloe's growth, mutual care, and the unspeakable helplessness surrounding marginalized lives in Hong Kong.",
  "text-21": "A text management game set in Hegang, following a laid-off tech worker who returns home to build the guo bao rou brand World Pot with a local troublemaker and a Russian deserter.",
};

export function textCategoryTitle(slug: string, fallback: string, locale: Locale) {
  return locale === "en" ? categoryTitles[slug] ?? fallback : fallback;
}

export function textCategoryHeading(title: string, locale: Locale) {
  if (locale !== "en") return title;
  const entry = Object.entries(categoryTitles).find(
    ([slug]) =>
      slug ===
      {
        "游戏文本": "game-writing",
        "同人文": "fan-fiction",
        "原创赛博朋克世界观": "cyberpunk-world",
        "规则怪谈": "rules-horror",
        "原创小说": "original-fiction",
        "剧本（英文）": "english-screenplay",
      }[title]
  );
  return entry?.[1] ?? title;
}

export function textTagLabel(tag: string, locale: Locale) {
  return locale === "en" ? tagTranslations[tag] ?? tag : tag;
}

export function textWorkTitle(slug: string, title: string, locale: Locale) {
  if (locale !== "en") return title;
  const translated = workTitleTranslations[slug];
  if (slug === "text-20") return translated ?? title;
  return translated ? `${title} (${translated})` : title;
}

export function textWorkSummary(slug: string, fallback: string, locale: Locale) {
  return locale === "en" ? workSummaries[slug] ?? fallback : fallback;
}

export function textCategoryOverview(description: string, locale: Locale) {
  return locale === "en"
    ? "At this stage, only English titles and summaries are available."
    : description;
}
