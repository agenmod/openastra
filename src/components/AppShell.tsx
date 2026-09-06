import Link from "next/link";
import { AccountMenu } from "@/components/AccountMenu";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/", label: "广场" },
  { href: "/create", label: "做一局" },
  { href: "/me", label: "我的游戏" },
];

export function AppShell({
  user,
  children,
}: {
  user: SessionUser | null;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-panel/80 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="flex flex-col px-5 py-4 lg:min-h-screen lg:py-6">
          <div className="flex items-center justify-between gap-3 lg:contents">
            <Link href="/" className="block min-w-0">
              <span className="display text-xl">openAstra</span>
              <span className="mt-1 block text-[11px] tracking-[0.18em] text-mute">
                openastra.cc
              </span>
            </Link>
            <div className="shrink-0 lg:order-last lg:mt-auto">
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="btn-solid inline-flex rounded-full px-4 py-2 text-sm"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex rounded-full border border-line px-4 py-2 text-sm"
                  >
                    注册
                  </Link>
                </div>
              )}
            </div>
          </div>
          <nav className="mt-4 flex gap-1 overflow-x-auto text-sm lg:mt-8 lg:flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-3 py-2 text-mute transition hover:bg-white/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
