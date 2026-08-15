import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  assetUrl,
  categoryTabs,
  portfolioItems,
  t,
  type Locale,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/data/portfolio";
import textData from "@/data/textWorks.json";

type HomePageProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

type TextWork = {
  slug: string;
  category: string;
  categoryTitle: string;
  title: string;
  tags: string[];
  summary: string;
};

const textWorks = textData.works as TextWork[];
const textCategories = textData.categories as {
  slug: string;
  title: string;
  description: string;
}[];

const memeGroup = portfolioItems
  .flatMap((item) => item.imageGroups ?? [])
  .find((group) => group.slug === "meme");
const memeTags = ["梦核", "哲学", "现代性"];
const activeTabStorageKey = "lk-portfolio-active-tab";

function readStoredActiveTab(): PortfolioCategory {
  if (typeof window === "undefined") return "games";

  const storedTab = window.localStorage.getItem(activeTabStorageKey);
  return categoryTabs.some((tab) => tab.id === storedTab)
    ? (storedTab as PortfolioCategory)
    : "games";
}

function itemPath(item: PortfolioItem) {
  if (item.category === "games") return `/games/${item.slug}`;
  if (item.category === "texts") return `/texts/${item.slug}`;
  return undefined;
}

function categoryTags(works: TextWork[]) {
  const tags = new Set<string>();
  works.forEach((work) => {
    work.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

function videoEmbedUrl(url: string) {
  const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (bilibiliMatch) {
    return `https://player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&page=1&autoplay=0`;
  }

  return undefined;
}

function FeaturedTitle({ title }: { title: string }) {
  const titleParts = title.split("——");

  if (titleParts.length === 1) return <>{title}</>;

  return (
    <>
      {titleParts[0]}
      <br />
      ——{titleParts.slice(1).join("——")}
    </>
  );
}

export function HomePage({ locale, setLocale }: HomePageProps) {
  const location = useLocation();
  const [activeTab, setActiveTab] =
    useState<PortfolioCategory>(readStoredActiveTab);
  const activeIndex = categoryTabs.findIndex((tab) => tab.id === activeTab);

  const featuredItems = useMemo(() => {
    const maskOfJade = portfolioItems.find(
      (item) => item.slug === "mask-of-jade"
    );
    const worldPot = portfolioItems.find(
      (item) => item.slug === "twine-text-game"
    );
    const advancedAnimal = textWorks.find((work) => work.slug === "text-06");

    return [
      maskOfJade && {
        key: maskOfJade.slug,
        path: itemPath(maskOfJade),
        meta: "GGJ HK 2026",
        title: t(maskOfJade.title, locale),
        summary: t(maskOfJade.summary, locale),
      },
      worldPot && {
        key: worldPot.slug,
        path: itemPath(worldPot),
        meta: locale === "zh" ? "文字游戏" : "Text Game",
        title: t(worldPot.title, locale),
        summary:
          locale === "zh"
            ? "玩家扮演回归鹤岗老城区的大厂下岗中年男子崔志强，经营锅包肉品牌“世界锅”，在直播销售、街区探索与固定事件中积累收入、经营员工关系，并走向不同结局。"
            : "The player controls Cui Zhiqiang, a laid-off tech worker returning to Hegang's old town to run the guo bao rou brand World Pot, building income and staff relationships through livestream sales, neighborhood exploration, and fixed events toward branching endings.",
      },
      advancedAnimal && {
        key: advancedAnimal.slug,
        path: `/texts/${advancedAnimal.slug}`,
        meta: advancedAnimal.categoryTitle,
        title: advancedAnimal.title,
        summary:
          locale === "zh"
            ? "外星从同人文，第二章人物小传。本文风格冷峻而张狂，使用了大量的象征与内心独白，展现了特定精神状态下扭曲的现实感知，意在实现暴力美学。"
            : "A fan-fiction character sketch from chapter two of Alien Cong. The piece is cold yet flamboyant, using symbolism and interior monologue to portray a distorted sense of reality under a particular mental state in pursuit of violent aesthetics.",
      },
    ].filter(Boolean) as {
      key: string;
      path?: string;
      meta: string;
      title: string;
      summary: string;
    }[];
  }, [locale]);

  const activeItems = portfolioItems
    .filter((item) => item.category === activeTab)
    .sort(
      (a, b) =>
        (a.displayOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.displayOrder ?? Number.MAX_SAFE_INTEGER)
    );
  const activeTabInfo = categoryTabs.find((tab) => tab.id === activeTab)!;

  useEffect(() => {
    if (location.hash !== "#works") return;
    requestAnimationFrame(() => {
      document
        .getElementById("works")
        ?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }, [location.hash]);

  useEffect(() => {
    window.localStorage.setItem(activeTabStorageKey, activeTab);
  }, [activeTab]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#06162f] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_18%,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_80%_8%,rgba(244,114,182,0.14),transparent_22%),linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:auto,auto,30px_30px,30px_30px]" />
      <div className="fixed inset-x-0 top-0 z-20 border-b border-cyan-300/20 bg-[#06162f]/88 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <a
            href="#top"
            className="font-mono text-sm uppercase tracking-[0.22em] text-cyan-200 no-underline"
          >
            CONCRETE ARCHIVE
          </a>
          <div className="flex border border-cyan-300/30 bg-[#071a35] font-mono text-xs">
            {(["zh", "en"] as const).map((nextLocale) => (
              <button
                key={nextLocale}
                type="button"
                onClick={() => setLocale(nextLocale)}
                className={`px-3 py-2 ${
                  locale === nextLocale
                    ? "bg-cyan-300 text-[#06162f]"
                    : "text-cyan-100 hover:bg-cyan-300/10"
                }`}
              >
                {nextLocale === "zh" ? "中文" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section
        id="top"
        className="relative mx-auto flex min-h-[78vh] w-full max-w-6xl flex-col justify-center px-5 pb-10 pt-24 sm:px-8"
      >
        <div className="max-w-4xl">
          <p className="font-mono text-sm uppercase tracking-[0.32em] text-pink-300">
            Game Design Portfolio
          </p>
          <h1 className="mt-5 text-3xl font-black leading-none text-white [text-shadow:1px_0_0_#22d3ee,-1px_0_0_#f472b6,0_0_22px_rgba(244,114,182,0.42)] sm:text-5xl lg:text-6xl">
            {locale === "zh" ? "梁稞崟" : "LIANG Keyin"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {locale === "zh"
              ? "热衷于幻想与创意表达，关注玩法、空间与叙事之间的相互转化。"
              : "Drawn to fantasy and creative expression, I focus on how gameplay, space, and narrative transform into one another."}
            <br />
            {locale === "zh"
              ? "7年创意写作经验，2年游戏制作经验，21年人生经验，致力于创作有趣的事物。"
              : "With 7 years of creative writing, 2 years of game production, and 21 years of life experience, I am committed to making interesting things."}
          </p>
          <div className="mt-6 grid max-w-2xl gap-3 border border-cyan-300/25 bg-[#081b38]/70 p-4 font-mono text-sm text-cyan-100 sm:grid-cols-3">
            <a
              href="tel:18275036417"
              className="grid gap-1 text-cyan-100 no-underline hover:text-pink-200"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300">
                TEL
              </span>
              <span>18275036417</span>
            </a>
            <a
              href="mailto:bleatliang@gmail.com"
              className="grid gap-1 text-cyan-100 no-underline hover:text-pink-200"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300">
                MAIL
              </span>
              <span>bleatliang@gmail.com</span>
            </a>
            <span className="grid gap-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-pink-300">
                WECHAT
              </span>
              <span>Bleat1701</span>
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {featuredItems.map((item) => (
            <Link
              key={item.key}
              to={item.path ?? "#"}
              className="group relative flex min-h-40 flex-col overflow-hidden border border-cyan-300/30 bg-[linear-gradient(135deg,rgba(8,27,56,0.86),rgba(8,27,56,0.58)),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[size:auto,12px_12px] p-4 text-left no-underline shadow-[0_0_26px_rgba(34,211,238,0.12),inset_0_0_18px_rgba(244,114,182,0.06)] transition before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-200 before:to-transparent hover:-translate-y-1 hover:border-pink-300/80 hover:shadow-[0_0_34px_rgba(244,114,182,0.24),0_0_24px_rgba(34,211,238,0.16),inset_0_0_20px_rgba(34,211,238,0.08)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
                {item.meta}
              </p>
              <h2 className="mt-4 text-xl font-black text-white">
                <FeaturedTitle title={item.title} />
              </h2>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-300">
                {item.summary}
              </p>
              <span className="mt-auto inline-block pt-5 font-mono text-xs text-pink-200">
                OPEN SIGNAL
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="works"
        className="relative scroll-mt-16 border-y border-cyan-300/20 bg-[#071a35]/88"
      >
        <div className="mx-auto max-w-6xl px-5 py-5 sm:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-pink-300 [text-shadow:1px_0_0_#22d3ee,0_0_12px_rgba(244,114,182,0.55)]">
                Section Tabs
              </p>
              <h2 className="mt-1 text-2xl font-black text-white [text-shadow:1px_0_0_#22d3ee,-1px_0_0_#f472b6,0_0_18px_rgba(34,211,238,0.45)]">
                {locale === "zh" ? "作品轨道" : "Work Orbit"}
              </h2>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categoryTabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`min-w-28 border px-4 py-3 text-left transition ${
                  activeTab === tab.id
                    ? "border-cyan-200 bg-cyan-300 text-[#06162f] shadow-[0_0_22px_rgba(34,211,238,0.3)]"
                    : "border-cyan-300/25 bg-[#06162f] text-cyan-100 hover:border-pink-300/70"
                }`}
              >
                <span className="block font-mono text-[11px]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block text-lg font-black">
                  {t(tab.label, locale)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto min-h-[72vh] max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-4xl font-black leading-none text-white [text-shadow:1px_0_0_#22d3ee,-1px_0_0_#f472b6,0_0_18px_rgba(34,211,238,0.45)] sm:text-5xl">
              {t(activeTabInfo.label, locale)}
            </h2>
          </div>
          <p className="font-mono text-sm text-slate-400">
            TAB {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(categoryTabs.length).padStart(2, "0")}
          </p>
        </div>

        {activeTab === "texts" ? (
          <div
            key={activeTab}
            className="grid animate-[orbitSlide_280ms_ease-out] gap-4 md:grid-cols-2"
          >
            {textCategories.map((category) => {
              const works = textWorks.filter(
                (work) => work.category === category.slug
              );
              if (works.length === 0) return null;
              const tags = categoryTags(works);

              return (
                <Link
                  key={category.slug}
                  to={`/texts/category/${category.slug}`}
                  className="border border-cyan-300/20 bg-[#081b38]/70 p-5 no-underline transition hover:-translate-y-1 hover:border-pink-300/70"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">
                      TEXT CLASS
                    </p>
                    <p className="font-mono text-sm text-slate-400">
                      {works.length} works
                    </p>
                  </div>
                  <h3 className="mt-4 text-3xl font-black text-white">
                    {category.title}
                  </h3>
                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-pink-300/35 bg-pink-300/10 px-2 py-1 font-mono text-xs text-pink-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
            {memeGroup && (
              <Link
                key={memeGroup.slug}
                to="/images/meme"
                className="border border-cyan-300/20 bg-[#081b38]/70 p-5 no-underline transition hover:-translate-y-1 hover:border-pink-300/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-pink-300">
                    TEXT CLASS
                  </p>
                  <p className="font-mono text-sm text-slate-400">
                    {memeGroup.images.length} images
                  </p>
                </div>
                <h3 className="mt-4 text-3xl font-black text-white">
                  {t(memeGroup.title, locale)}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {memeTags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-pink-300/35 bg-pink-300/10 px-2 py-1 font-mono text-xs text-pink-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            )}
          </div>
        ) : activeTab === "audiovisual" ? (
          <div
            key={activeTab}
            className="grid animate-[orbitSlide_280ms_ease-out] gap-5"
          >
            {activeItems.flatMap((item) =>
              item.links
                ?.map((link) => ({
                  item,
                  link,
                  embedUrl: videoEmbedUrl(link.url),
                })) ?? []
            ).map(({ item, link, embedUrl }) => (
              <article
                key={link.url}
                className="border border-cyan-300/20 bg-[#081b38]/78 p-4"
              >
                <div className="mb-4 flex flex-col justify-between gap-2 font-mono text-xs uppercase tracking-[0.14em] text-cyan-200 sm:flex-row sm:items-center">
                  <span>
                    {[link.year ?? item.year ?? item.category, link.tools?.join(" / ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                  <span>{t(link.label, locale)}</span>
                </div>
                {embedUrl ? (
                  <iframe
                    title={t(link.label, locale)}
                    src={embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="aspect-video w-full border border-cyan-300/15 bg-black"
                  />
                ) : (
                  <div className="flex aspect-video flex-col items-center justify-center gap-4 border border-cyan-300/15 bg-[#06162f] px-5 text-center">
                    <p className="max-w-md text-sm leading-7 text-slate-300">
                      {locale === "zh"
                        ? "该作品目前保留站酷链接，暂不支持站内直接播放。"
                        : "This work currently keeps a ZCOOL link and cannot be played inline yet."}
                    </p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
                    >
                      {t(link.label, locale)}
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : activeTab === "uiux" ? (
          <div
            key={activeTab}
            className="animate-[orbitSlide_280ms_ease-out]"
          >
            {activeItems.map((item) => (
              <section key={item.slug} className="grid gap-5">
                {item.links && (
                  <div className="flex flex-wrap gap-3">
                    {item.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-pink-300/50 bg-pink-300/10 px-4 py-3 font-mono text-sm text-pink-100 no-underline hover:border-cyan-200 hover:text-cyan-100"
                      >
                        {t(link.label, locale)}
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex flex-col justify-between gap-3 border-b border-cyan-300/20 pb-4 sm:flex-row sm:items-end">
                  <div>
                    <div className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-[0.14em] text-cyan-200">
                      {[item.year, item.tools?.join(" / ")]
                        .filter(Boolean)
                        .map((label) => (
                          <span key={label}>{label}</span>
                        ))}
                    </div>
                    <h3 className="mt-3 text-3xl font-black text-white">
                      {t(item.title, locale)}
                    </h3>
                  </div>
                  <p className="max-w-xl text-sm leading-7 text-slate-300">
                    {t(item.summary, locale)}
                  </p>
                </div>
                {item.gallery && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {item.gallery.map((src) => (
                      <img
                        key={src}
                        src={assetUrl(src)}
                        alt=""
                        className="w-full border border-cyan-300/15 bg-[#020817] object-contain"
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div
            key={activeTab}
            className="grid animate-[orbitSlide_280ms_ease-out] gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
          {activeItems.map((item) => {
            const path = itemPath(item);
            const hasRelatedText = item.links?.some((link) =>
              link.url.startsWith("/texts/")
            );
            const content = (
              <>
                {item.coverGallery && item.coverGallery.length > 0 ? (
                  <div className="mb-4 grid aspect-video grid-cols-3 gap-2 border border-cyan-300/15 bg-[#06162f] p-2">
                    {item.coverGallery.slice(0, 3).map((src) => (
                      <img
                        key={src}
                        src={assetUrl(src)}
                        alt=""
                        className="h-full w-full bg-[#020817] object-contain opacity-90"
                      />
                    ))}
                  </div>
                ) : item.image ? (
                  <img
                    src={assetUrl(item.image)}
                    alt=""
                    className="mb-4 aspect-video w-full border border-cyan-300/15 bg-[#06162f] object-contain opacity-85"
                  />
                ) : item.gallery && item.gallery.length > 0 ? (
                  <div className="mb-4 grid aspect-video grid-cols-2 gap-2 border border-cyan-300/15 bg-[#06162f] p-2">
                    {item.gallery.slice(0, 4).map((src, index) => (
                      <img
                        key={src}
                        src={assetUrl(src)}
                        alt=""
                        className={`h-full w-full bg-[#020817] object-contain opacity-90 ${
                          index === 0 && item.gallery!.length < 3
                            ? "col-span-2"
                            : ""
                        }`}
                      />
                    ))}
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-[0.14em] text-cyan-200">
                  <span>{item.year ?? item.category}</span>
                  {item.tools?.[0] && <span>{item.tools[0]}</span>}
                </div>
                <h3 className="mt-3 text-2xl font-black text-white">
                  {t(item.title, locale)}
                </h3>
                {item.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-pink-300/35 bg-pink-300/10 px-2 py-1 font-mono text-xs text-pink-100"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {t(item.summary, locale)}
                </p>
                {hasRelatedText && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="border border-cyan-300/30 px-2 py-1 font-mono text-xs uppercase tracking-[0.16em] text-cyan-100">
                      {locale === "zh" ? "关联文本" : "Writing Linked"}
                    </span>
                  </div>
                )}
              </>
            );

            if (path) {
              return (
                <Link
                  key={item.slug}
                  to={path}
                  className="group border border-cyan-300/20 bg-[#081b38]/78 p-4 no-underline transition hover:-translate-y-1 hover:border-pink-300/70 hover:shadow-[0_0_35px_rgba(244,114,182,0.12)]"
                >
                  {content}
                </Link>
              );
            }

            return (
              <article
                key={item.slug}
                className="border border-cyan-300/20 bg-[#081b38]/55 p-4"
              >
                {content}
              </article>
            );
          })}
          </div>
        )}
      </section>
    </main>
  );
}
