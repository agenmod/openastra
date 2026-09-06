"use client";

import { useState } from "react";

export function AstraEmbed({
  title,
  playUrl,
  cover,
  canEmbed,
}: {
  title: string;
  playUrl: string;
  cover: string;
  canEmbed: boolean;
}) {
  const [showFrame, setShowFrame] = useState(canEmbed);
  const [failed, setFailed] = useState(false);
  const blocked = !showFrame || failed;

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-black shadow-[0_20px_80px_rgba(0,0,0,.45)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0c0c14] px-4 py-2.5 text-xs">
        <p className="truncate text-mute">
          {blocked ? "原站不让嵌小窗，请去原站玩" : "原站小窗 · 没有搬运游戏文件"}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          {canEmbed && failed && (
            <button
              type="button"
              onClick={() => {
                setFailed(false);
                setShowFrame(true);
              }}
              className="text-mute hover:text-ink"
            >
              重试小窗
            </button>
          )}
          {showFrame && !failed && (
            <button
              type="button"
              onClick={() => setShowFrame(false)}
              className="text-mute hover:text-ink"
            >
              小窗打不开？
            </button>
          )}
          <a
            href={playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ion hover:underline"
          >
            去原站玩 ↗
          </a>
        </div>
      </div>
      {blocked ? (
        <div className="relative aspect-[16/10] bg-black">
          <img src={cover} alt={title} className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 grid place-items-center bg-black/45 p-6 text-center">
            <div>
              <p className="display text-2xl">{title}</p>
              <p className="mt-2 text-sm text-white/70">
                点下面打开作者的原站，在完整页面里玩。
              </p>
              <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid mt-5 inline-flex rounded-full px-5 py-2 text-sm"
              >
                去原站玩
              </a>
            </div>
          </div>
        </div>
      ) : (
        <iframe
          title={title}
          src={playUrl}
          className="block aspect-[16/10] w-full bg-black"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
          allow="fullscreen; gamepad; xr-spatial-tracking; autoplay; clipboard-write; accelerometer; gyroscope"
          referrerPolicy="no-referrer-when-downgrade"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
