import { Link, useLocation, useParams } from "react-router-dom";
import { assetUrl, findItem, t, type Locale } from "@/data/portfolio";

type WorkDetailPageProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

function videoEmbedUrl(url: string) {
  const bilibiliMatch = url.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (bilibiliMatch) {
    return `https://player.bilibili.com/player.html?bvid=${bilibiliMatch[1]}&page=1&autoplay=0`;
  }

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  return undefined;
}

function isVideoLink(label: string, url: string) {
  return (
    Boolean(videoEmbedUrl(url)) ||
    /zcool\.com\.cn\/work\//.test(url) ||
    /视频|演示|demo|video/i.test(label)
  );
}

export function WorkDetailPage({ locale, setLocale }: WorkDetailPageProps) {
  const { slug = "" } = useParams();
  const location = useLocation();
  const item = findItem(slug);
  const videoLinks =
    item?.links
      ?.filter((link) => isVideoLink(t(link.label, locale), link.url))
      .map((link) => ({ ...link, embedUrl: videoEmbedUrl(link.url) })) ?? [];
  const otherLinks =
    item?.links?.filter((link) => !isVideoLink(t(link.label, locale), link.url)) ??
    [];
  const textLinks = otherLinks.filter((link) => link.url.startsWith("/texts/"));
  const externalLinks = otherLinks.filter(
    (link) => !link.url.startsWith("/texts/")
  );

  if (!item) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06162f] px-6 text-slate-100">
        <div className="max-w-md border border-cyan-300/30 bg-[#081b38]/90 p-6 shadow-[0_0_35px_rgba(34,211,238,0.16)]">
          <p className="font-mono text-sm text-pink-300">404 / LOST SIGNAL</p>
          <h1 className="mt-3 text-3xl font-black">项目不存在</h1>
          <Link className="mt-6 inline-flex text-cyan-200 underline" to="/">
            返回主页
          </Link>
        </div>
      </main>
    );
  }

  const playableSrc = item.playableUrl ? assetUrl(item.playableUrl) : undefined;
  const backTo = (location.state as { backTo?: string } | null)?.backTo ?? "/#works";

  return (
    <main className="min-h-screen bg-[#06162f] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative mx-auto w-full max-w-[96rem] px-3 py-8 sm:px-4">
        <header className="flex items-center justify-between gap-4 border-b border-cyan-300/20 pb-5">
          <Link
            to={backTo}
            className="font-mono text-sm uppercase tracking-[0.22em] text-cyan-200 no-underline hover:text-pink-200"
          >
            Back / 返回
          </Link>
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
        </header>

        <section className="py-10">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-pink-300">
            {item.category}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
            {t(item.title, locale)}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {t(item.summary, locale)}
          </p>
          <dl className="mt-7 grid gap-3 font-mono text-sm text-slate-300 sm:grid-cols-3">
            {item.year && (
              <div className="border border-cyan-300/20 bg-white/[0.03] p-3">
                <dt className="text-cyan-200">YEAR</dt>
                <dd className="mt-1">{item.year}</dd>
              </div>
            )}
            {item.tools && (
              <div className="border border-cyan-300/20 bg-white/[0.03] p-3">
                <dt className="text-cyan-200">TOOLS</dt>
                <dd className="mt-1">{item.tools.join(" / ")}</dd>
              </div>
            )}
            {item.role && (
              <div className="border border-cyan-300/20 bg-white/[0.03] p-3">
                <dt className="text-cyan-200">ROLE</dt>
                <dd className="mt-1">{t(item.role, locale)}</dd>
              </div>
            )}
          </dl>
        </section>

        {textLinks.length > 0 && (
          <section className="pb-8">
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
              {locale === "zh" ? "关联文本" : "Related Writing"}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {textLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  state={{ backTo: `/games/${item.slug}` }}
                  className="border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
                >
                  {t(link.label, locale)}
                  {link.pending ? " / 待校正" : ""}
                </Link>
              ))}
            </div>
          </section>
        )}

        {videoLinks.length > 0 && (
          <section className="py-8">
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
              {locale === "zh" ? "展示视频" : "Video"}
            </h2>
            <div className="mt-4 grid gap-5">
              {videoLinks.map((link) => (
                <article
                  key={link.url}
                  className="border border-cyan-300/25 bg-[#020817] p-2 shadow-[0_0_45px_rgba(34,211,238,0.12)]"
                >
                  {link.embedUrl ? (
                    <iframe
                      title={t(link.label, locale)}
                      src={link.embedUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="aspect-video w-full bg-black"
                    />
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-4 bg-[#06162f] px-5 text-center">
                      <p className="max-w-md text-sm leading-7 text-slate-300">
                        {locale === "zh"
                          ? "当前视频暂时保留站酷链接，后续替换成 B 站后会在这里直接播放。"
                          : "This video is currently kept as a ZCOOL link. Once replaced with Bilibili, it will play inline here."}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
                      >
                        {t(link.label, locale)}
                        {link.pending ? " / 待校正" : ""}
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {playableSrc && (
          <section className="py-8">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                  Play Twine
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">
                  {locale === "zh" ? "站内游玩" : "Playable Build"}
                </h2>
              </div>
              <a
                href={playableSrc}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-pink-200 no-underline hover:text-pink-100"
              >
                {locale === "zh" ? "全屏打开" : "Open Fullscreen"}
              </a>
            </div>
            <div className="border border-cyan-300/25 bg-[#020817] p-2 shadow-[0_0_45px_rgba(34,211,238,0.12)]">
              <iframe
                title={t(item.title, locale)}
                src={playableSrc}
                className="h-[78vh] min-h-[620px] w-full bg-white"
              />
            </div>
          </section>
        )}

        {item.tags && (
          <section className="border-y border-cyan-300/20 py-5">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-pink-300/40 bg-pink-300/10 px-3 py-1 font-mono text-sm text-pink-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {item.sections && (
          <section className="grid gap-5 py-8">
            {item.sections.map((section) => (
              <article
                key={section.title.zh}
                className="border border-cyan-300/20 bg-[#081b38]/70 p-5"
              >
                <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                  {t(section.title, locale)}
                </h2>
                {item.characterProfiles && section.title.zh === "角色设计" ? (
                  <div className="mt-5 grid gap-4">
                    {item.characterProfiles.map((character) => (
                      <div
                        key={character.name.zh}
                        className="grid gap-4 border border-cyan-300/15 bg-[#06162f]/80 p-3 sm:grid-cols-[180px_1fr]"
                      >
                        <img
                          src={assetUrl(character.image)}
                          alt={t(character.name, locale)}
                          className="h-64 w-full border border-cyan-300/15 bg-[#020817] object-contain sm:h-56"
                        />
                        <div className="flex flex-col justify-center">
                          <h3 className="text-2xl font-black text-white">
                            {t(character.name, locale)}
                          </h3>
                          <p className="mt-3 whitespace-pre-line leading-8 text-slate-300">
                            {t(character.body, locale)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-line leading-8 text-slate-300">
                    {t(section.body, locale)}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}

        {item.gallery && item.gallery.length > 0 && (
          <section
            className={
              item.slug === "board-game"
                ? "relative left-1/2 w-screen -translate-x-1/2 px-2 py-8"
                : "py-8"
            }
          >
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
              {locale === "zh" ? "图片" : "Images"}
            </h2>
            <div
              className={`mt-4 grid ${
                item.galleryLayout === "single"
                  ? "grid-cols-1 gap-4"
                  : item.slug === "board-game"
                    ? "grid-cols-3 gap-1"
                  : item.slug === "ballot-battleground"
                    ? "grid-cols-2 gap-2"
                  : "gap-4 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {item.gallery.map((src) => (
                <img
                  key={src}
                  src={assetUrl(src)}
                  alt=""
                  className={`w-full object-contain ${
                    item.slug === "board-game" || item.slug === "ballot-battleground"
                      ? ""
                      : "border border-cyan-300/20 bg-[#06162f]"
                  } ${
                    item.slug === "board-game" || item.slug === "ballot-battleground"
                      ? ""
                      : item.tallGalleryImages?.includes(src)
                      ? "aspect-[9/16]"
                      : "aspect-video"
                  }`}
                />
              ))}
            </div>
          </section>
        )}

        {externalLinks.length > 0 && (
          <section className="pb-12">
            <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
              Links
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {externalLinks.map((link) =>
                link.url.startsWith("/") ? (
                  <Link
                    key={link.url}
                    to={link.url}
                    className="border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
                  >
                    {t(link.label, locale)}
                    {link.pending ? " / 待校正" : ""}
                  </Link>
                ) : (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
                  >
                    {t(link.label, locale)}
                    {link.pending ? " / 待校正" : ""}
                  </a>
                )
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
