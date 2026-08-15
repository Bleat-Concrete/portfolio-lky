import { Link, useParams } from "react-router-dom";
import { assetUrl, portfolioItems, t, type Locale } from "@/data/portfolio";

type ImageGroupPageProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

function findImageGroup(slug: string) {
  return portfolioItems
    .flatMap((item) => item.imageGroups ?? [])
    .find((group) => group.slug === slug);
}

export function ImageGroupPage({ locale, setLocale }: ImageGroupPageProps) {
  const { groupSlug = "" } = useParams();
  const group = findImageGroup(groupSlug);

  if (!group) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06162f] px-6 text-slate-100">
        <div className="max-w-md border border-cyan-300/30 bg-[#081b38]/90 p-6 shadow-[0_0_35px_rgba(34,211,238,0.16)]">
          <p className="font-mono text-sm text-pink-300">404 / LOST SIGNAL</p>
          <h1 className="mt-3 text-3xl font-black">图像分类不存在</h1>
          <Link className="mt-6 inline-flex text-cyan-200 underline" to="/#works">
            返回主页
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#06162f] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-cyan-300/20 pb-5">
          <Link
            to="/#works"
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
            {group.slug === "meme" ? "Text Class" : "Images"}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
            {t(group.title, locale)}
          </h1>
          <p className="mt-4 font-mono text-sm text-cyan-200">
            {group.images.length} images
          </p>
        </section>

        <section
          className={
            group.slug === "meme"
              ? "columns-1 gap-4 sm:columns-2 lg:columns-3"
              : "grid gap-4 md:grid-cols-2"
          }
        >
          {group.images.map((src) => (
            <img
              key={src}
              src={assetUrl(src)}
              alt=""
              className={`w-full border border-cyan-300/15 bg-[#020817] object-contain ${
                group.slug === "meme" ? "mb-4 break-inside-avoid" : "aspect-video"
              }`}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
