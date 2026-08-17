import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { WorkDetailPage } from "@/pages/WorkDetailPage";
import { TextDetailPage } from "@/pages/TextDetailPage";
import { TextCategoryPage } from "@/pages/TextCategoryPage";
import { ImageGroupPage } from "@/pages/ImageGroupPage";
import type { Locale } from "@/data/portfolio";

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (location.hash === "#works") {
        document
          .getElementById("works")
          ?.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [location.pathname, location.hash]);

  return null;
}

export function AppRoutes() {
  const [locale, setLocale] = useState<Locale>("zh");

  return (
    <>
      <ScrollManager />
      <Routes>
        <Route
          path="/"
          element={<HomePage locale={locale} setLocale={setLocale} />}
        />
        <Route
          path="/games/:slug"
          element={<WorkDetailPage locale={locale} setLocale={setLocale} />}
        />
        <Route
          path="/texts/category/:categorySlug"
          element={<TextCategoryPage locale={locale} setLocale={setLocale} />}
        />
        <Route
          path="/texts/:slug"
          element={<TextDetailPage locale={locale} setLocale={setLocale} />}
        />
        <Route
          path="/images/:groupSlug"
          element={<ImageGroupPage locale={locale} setLocale={setLocale} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
