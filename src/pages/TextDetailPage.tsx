import { Link, useParams } from "react-router-dom";
import textData from "@/data/textWorks.json";
import { assetUrl, type Locale } from "@/data/portfolio";
import { textTagLabel, textWorkSummary } from "@/data/textTranslations";

type TextBlock = {
  text: string;
  bold: boolean;
  italic: boolean;
  underline?: boolean;
};

type RichParagraph = {
  text: string;
  align: "left" | "center";
  runs: TextBlock[];
  isBlank?: boolean;
  image?: string;
  alt?: string;
};

type TextWork = {
  slug: string;
  category: string;
  categoryTitle: string;
  sourcePath: string;
  title: string;
  tags: string[];
  summary: string;
  intro: RichParagraph[];
  body: RichParagraph[];
  isPreview: boolean;
};

type TextDetailPageProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const works = textData.works as TextWork[];

const relatedGameByTextSlug: Record<string, { title: string; href: string; note: string }> = {
  "text-03": {
    title: "迷走 Vagus",
    href: "/games/vagus",
    note: "查看完整游戏项目页",
  },
  "text-21": {
    title: "世界锅",
    href: "/games/twine-text-game",
    note: "查看完整游戏项目页",
  },
};

function RichParagraphView({ paragraph }: { paragraph: RichParagraph }) {
  if (paragraph.image) {
    return (
      <figure className="my-5 overflow-hidden border border-cyan-300/20 bg-[#06162f]/70 p-2">
        <img
          src={assetUrl(paragraph.image)}
          alt={paragraph.alt ?? "文本插图"}
          loading="lazy"
          className="mx-auto max-h-[72vh] w-auto max-w-full object-contain"
        />
      </figure>
    );
  }

  if (paragraph.isBlank) {
    return <div aria-hidden="true" className="h-[1lh]" />;
  }

  return (
    <p
      className={[
        paragraph.align === "center" ? "text-center" : "",
        "whitespace-pre-line",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {paragraph.runs.map((run, index) => {
        const className = [
          run.bold ? "font-bold text-white" : "",
          run.italic ? "italic" : "",
          run.underline ? "underline underline-offset-4 decoration-cyan-200/80" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <span key={index} className={className || undefined}>
            {run.text}
          </span>
        );
      })}
    </p>
  );
}

export function TextDetailPage({ locale, setLocale }: TextDetailPageProps) {
  const { slug = "" } = useParams();
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06162f] px-6 text-slate-100">
        <div className="max-w-md border border-cyan-300/30 bg-[#081b38]/90 p-6">
          <p className="font-mono text-sm text-pink-300">TEXT NOT FOUND</p>
          <h1 className="mt-3 text-3xl font-black">文本不存在</h1>
          <Link className="mt-6 inline-flex text-cyan-200 underline" to="/#works">
            返回主页
          </Link>
        </div>
      </main>
    );
  }

  const siblingWorks = works.filter((item) => item.category === work.category);
  const hasIntro = work.intro.some((paragraph) => !paragraph.isBlank);
  const relatedGame = relatedGameByTextSlug[work.slug];
  return (
    <main className="min-h-screen bg-[#06162f] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:30px_30px]" />
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
            {work.categoryTitle}
          </p>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-5xl">
            {work.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {textWorkSummary(work.slug, work.summary, locale)}
          </p>
          {relatedGame ? (
            <Link
              to={relatedGame.href}
              className="mt-5 inline-flex max-w-sm flex-col border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 no-underline transition hover:border-pink-300/60 hover:bg-pink-300/10"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200">
                Related Game
              </span>
              <span className="mt-1 text-lg font-bold text-white">{relatedGame.title}</span>
              <span className="mt-1 text-sm text-slate-300">{relatedGame.note}</span>
            </Link>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="border border-pink-300/40 bg-pink-300/10 px-3 py-1 font-mono text-sm text-pink-100"
              >
                #{textTagLabel(tag, locale)}
              </span>
            ))}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <nav className="border border-cyan-300/20 bg-[#081b38]/80 p-4">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-200">
                Articles
              </p>
              <div className="mt-4 grid gap-2">
                {siblingWorks.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/texts/${item.slug}`}
                    className={`text-sm no-underline ${
                      item.slug === work.slug
                        ? "text-pink-200"
                        : "text-slate-300 hover:text-pink-200"
                    }`}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          <article className="min-w-0 pb-16">
            {hasIntro ? (
              <section
                id="intro"
                className="scroll-mt-8 border border-cyan-300/20 bg-[#081b38]/60 p-5"
              >
                <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                  Intro
                </h2>
                <div className="mt-4 leading-8 text-slate-300">
                  {work.intro.map((paragraph, index) => (
                    <RichParagraphView key={index} paragraph={paragraph} />
                  ))}
                </div>
              </section>
            ) : null}

            <section
              className={`border border-cyan-300/20 bg-[#081b38]/45 p-5 ${
                hasIntro ? "mt-6" : ""
              }`}
            >
              <h2 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                Text
              </h2>
              <div className="mt-5 text-[17px] leading-9 text-slate-200">
                {work.body.map((paragraph, index) => (
                  <RichParagraphView key={index} paragraph={paragraph} />
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
