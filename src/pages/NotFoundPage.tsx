import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#06162f] px-6 text-slate-100">
      <div className="max-w-md border border-cyan-300/30 bg-[#081b38]/90 p-6 shadow-[0_0_35px_rgba(34,211,238,0.16)]">
        <p className="font-mono text-sm uppercase tracking-[0.22em] text-pink-300">
          404 / Lost Signal
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">页面不存在</h1>
        <p className="mt-3 leading-7 text-slate-300">
          这个坐标暂时没有作品记录。返回主页可以继续浏览作品轨道。
        </p>
        <Link
          to="/#works"
          className="mt-6 inline-flex border border-cyan-300/40 px-4 py-3 font-mono text-sm text-cyan-100 no-underline hover:border-pink-300 hover:text-pink-100"
        >
          返回主页
        </Link>
      </div>
    </main>
  );
}
