"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

export function AccountMenu({ user }: { user: SessionUser }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2 lg:block lg:rounded-2xl lg:border lg:border-line lg:px-3 lg:py-2">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-nova text-sm text-ink">
          {user.displayName.slice(0, 1).toUpperCase()}
        </span>
        <div className="hidden min-w-0 lg:block">
          <p className="truncate text-sm">{user.displayName}</p>
          <p className="truncate text-xs text-mute">{user.email || `@${user.username}`}</p>
        </div>
      </div>
      <div className="hidden lg:mt-3 lg:flex lg:flex-col lg:gap-1 lg:text-sm">
        <Link href="/me" className="rounded-full px-2 py-1 text-mute hover:bg-white/5 hover:text-ink">
          我的游戏
        </Link>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full px-2 py-1 text-left text-mute hover:bg-white/5 hover:text-ink"
        >
          退出
        </button>
      </div>
      <button
        type="button"
        onClick={() => void logout()}
        className="rounded-full px-2 py-1 text-sm text-mute hover:bg-white/5 hover:text-ink lg:hidden"
      >
        退出
      </button>
    </div>
  );
}
