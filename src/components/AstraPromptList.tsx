"use client";

import { useState } from "react";
import type { AstraPromptRecord } from "@/lib/astra-work";

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        window.setTimeout(() => setDone(false), 1400);
      }}
      className="rounded-full border border-line px-3 py-1 text-xs text-mute hover:border-ion/50 hover:text-ion"
    >
      {done ? "已复制" : "复制"}
    </button>
  );
}

export function AstraPromptList({ record }: { record: AstraPromptRecord }) {
  return (
    <div className="mt-4 space-y-4">
      {record.steps.map((step, index) => (
        <article key={`${step.title}-${index}`} className="rounded-2xl border border-line bg-panel px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-ion">
              第 {index + 1} 步 · {step.title}
            </p>
            {step.prompts[0] && <CopyButton text={step.prompts.join("\n\n")} />}
          </div>
          {step.prompts.map((prompt) => (
            <pre
              key={prompt.slice(0, 48)}
              className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink/85"
            >
              {prompt}
            </pre>
          ))}
        </article>
      ))}
      <p className="text-xs text-mute">
        原文来自作者公布的制作步骤，不是平行的多个版本。
        <a
          href={record.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ion hover:underline"
        >
          打开出处页
        </a>
        。
      </p>
    </div>
  );
}
