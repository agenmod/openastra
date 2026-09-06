"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GamePlayer } from "@/components/GamePlayer";
import { captureGameCover } from "@/lib/capture-cover";
import { SURPRISE_PROMPTS, type ChatTurn } from "@/lib/game-prompt";

type Draft = {
  id?: string;
  title: string;
  html: string;
  prompt: string;
  published?: boolean;
  slug?: string;
};

export function CreateStudio({
  initial,
}: {
  initial?: {
    id: string;
    title: string;
    html: string;
    prompt: string;
    published: boolean;
    slug: string;
    conversation: ChatTurn[];
  };
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>(initial?.conversation ?? []);
  const [draft, setDraft] = useState<Draft | null>(
    initial
      ? {
          id: initial.id,
          title: initial.title,
          html: initial.html,
          prompt: initial.prompt,
          published: initial.published,
          slug: initial.slug,
        }
      : null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canPublish = Boolean(draft?.html && draft.id && !draft.published);

  const placeholder = useMemo(
    () => "例如：一只橘猫在夜市接住天上掉下来的鱼，躲开靴子",
    [],
  );

  async function persist(next: Draft, conversation: ChatTurn[]) {
    if (next.id) {
      const res = await fetch(`/api/games/${next.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: next.title,
          html: next.html,
          prompt: next.prompt,
          conversation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "保存失败");
      return data.game as Draft;
    }

    const res = await fetch("/api/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: next.title,
        html: next.html,
        prompt: next.prompt,
        conversation,
        published: false,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "保存失败");
    router.replace(`/create?game=${data.game.id}`);
    return data.game as Draft;
  }

  async function generate(text: string) {
    const prompt = text.trim();
    if (!prompt || busy) return;
    setBusy(true);
    setError("");
    const nextMessages: ChatTurn[] = [...messages, { role: "user", content: prompt }];
    setMessages(nextMessages);
    setInput("");

    try {
      const res = await fetch("/api/games/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          currentHtml: draft?.html,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");

      const conversation: ChatTurn[] = [
        ...nextMessages,
        { role: "assistant", content: `已生成《${data.title}》。继续说你想改什么。` },
      ];
      const saved = await persist(
        {
          id: draft?.id,
          title: data.title,
          html: data.html,
          prompt: draft?.prompt || prompt,
          published: draft?.published,
          slug: draft?.slug,
        },
        conversation,
      );
      setDraft({
        id: saved.id,
        title: saved.title,
        html: saved.html,
        prompt: saved.prompt,
        published: saved.published,
        slug: saved.slug,
      });
      setMessages(conversation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败");
      setMessages(nextMessages);
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft?.id) return;
    setBusy(true);
    setError("");
    try {
      const coverDataUrl = await captureGameCover(draft.id);
      const res = await fetch(`/api/games/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          published: true,
          coverDataUrl: coverDataUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "发布失败");
        return;
      }
      router.push(`/play/${data.game.slug}`);
      router.refresh();
    } catch {
      setError("发布失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-1px)] lg:grid-cols-[380px_1fr]">
      <section className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
        <div className="border-b border-line px-5 py-5">
          <p className="text-xs tracking-[0.25em] text-mute">做一局</p>
          <h1 className="display mt-1 text-3xl">{draft?.title || "做一局新游戏"}</h1>
        </div>
        <div className="flex-1 space-y-4 overflow-auto px-5 py-5">
          {messages.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line p-4 text-sm text-mute">
              先说玩法。生成后可以继续改：加 Boss、换操作、改配色都行。
              <div className="mt-4 flex flex-wrap gap-2">
                {SURPRISE_PROMPTS.slice(0, 3).map((item) => (
                  <button
                    key={item}
                    onClick={() => generate(item)}
                    className="rounded-full border border-line px-3 py-1 text-left text-xs text-ink"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                m.role === "user" ? "bg-nova/20" : "bg-white/5 text-mute"
              }`}
            >
              {m.content}
            </div>
          ))}
          {busy && <p className="text-sm text-ion">正在做成能玩的一局…</p>}
          {error && <p className="text-sm text-plasma">{error}</p>}
        </div>
        <form
          className="border-t border-line p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void generate(input);
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-2xl border border-line bg-panel px-4 py-3 outline-none focus:ring-2 focus:ring-nova/40"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                generate(SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)])
              }
              className="text-sm text-mute"
            >
              随机一局
            </button>
            <button
              disabled={busy}
              className="btn-solid rounded-full px-5 py-2 text-sm disabled:opacity-50"
            >
              {draft ? "按这个改" : "生成游戏"}
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-mute">
            {draft?.published
              ? "已经发布。封面是发布时截的实机画面，改完可再发。"
              : "草稿只有你能看。发布后会出现在广场，和 Astra 作品同一排。"}
          </p>
          <div className="flex gap-2">
            {draft?.published && draft.slug && (
              <a href={`/play/${draft.slug}`} className="rounded-full border border-line px-4 py-2 text-sm">
                去玩
              </a>
            )}
            <button
              onClick={publish}
              disabled={!canPublish || busy}
              className="rounded-full bg-plasma px-4 py-2 text-sm text-ink disabled:opacity-40"
            >
              发布到广场
            </button>
          </div>
        </div>
        {draft?.html ? (
          <GamePlayer title={draft.title} html={draft.html} />
        ) : (
          <div className="grid aspect-[16/10] place-items-center rounded-[28px] border border-dashed border-line text-mute">
            游戏会在这里立刻跑起来
          </div>
        )}
      </section>
    </div>
  );
}
