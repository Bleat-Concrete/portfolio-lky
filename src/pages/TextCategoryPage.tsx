import { Link, useParams } from "react-router-dom";
import textData from "@/data/textWorks.json";
import type { Locale } from "@/data/portfolio";
import {
  textCategoryOverview,
  textCategoryTitle,
  textTagLabel,
  textWorkSummary,
  textWorkTitle,
} from "@/data/textTranslations";

type TextWork = {
  slug: string;
  category: string;
  categoryTitle: string;
  title: string;
  tags: string[];
  summary: string;
};

type TextCategory = {
  slug: string;
  title: string;
  description: string;
};

type TextCategoryPageProps = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const works = textData.works as TextWork[];
const categories = textData.categories as TextCategory[];

export function TextCategoryPage({ locale, setLocale }: TextCategoryPageProps) {
  const { categorySlug = "" } = useParams();
  const category = categories.find((item) => item.slug === categorySlug);
  const categoryWorks = works.filter((item) => item.category === categorySlug);

  if (!category) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#06162f] px-6 text-slate-100">
        <div className="max-w-md border border-cyan-300/30 bg-[#081b38]/90 p-6">
          <p className="font-mono text-sm text-pink-300">TEXT CLASS LOST</p>
          <h1 className="mt-3 text-3xl font-black">文本分类不存在</h1>
          <Link className="mt-6 inline-flex text-cyan-200 underline" to="/#works">
            返回主页
          </Link>
        </div>
      </main>
    );
  }

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
            Text Class
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-6xl">
            {textCategoryTitle(category.slug, category.title, locale)}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            {textCategoryOverview(
              category.description || category.title,
              locale
            )}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {categoryWorks.map((work) => (
            <Link
              key={work.slug}
              to={`/texts/${work.slug}`}
              className="border border-cyan-300/20 bg-[#081b38]/70 p-5 no-underline transition hover:-translate-y-1 hover:border-pink-300/70"
            >
              <h2 className="text-2xl font-black text-white">
                {textWorkTitle(work.slug, work.title, locale)}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {work.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-pink-300/35 bg-pink-300/10 px-2 py-1 font-mono text-xs text-pink-100"
                  >
                    #{textTagLabel(tag, locale)}
                  </span>
                ))}
              </div>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-300">
                {textWorkSummary(work.slug, work.summary, locale)}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
