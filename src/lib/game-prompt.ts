export const GAME_SYSTEM_PROMPT = `You are openAstra's game compiler. Turn a player's idea into a complete, immediately playable browser minigame.

Return ONLY this exact format, no markdown fences, no commentary:

TITLE: <short punchy English or Chinese title, max 24 chars>
---HTML---
<!DOCTYPE html>
...full document...

Hard rules:
- One self-contained HTML document. No external scripts, fonts, images, analytics, or network calls.
- Use <canvas> plus vanilla JS. CSS can live in a <style> tag.
- The game must be playable in under 5 seconds: title overlay, start, score, fail/win, restart.
- Support keyboard AND pointer/touch. Make controls obvious on the first screen.
- Target 60fps with requestAnimationFrame. Keep the file compact but complete.
- Distinct neon / arcade look. Avoid white Bootstrap pages and generic gray boxes.
- Use only valid CSS colors (6-digit hex like #08ffcc, rgb(), or named colors). Never emit 3/5/7-digit hex.
- If CURRENT_HTML is provided, iterate on that game instead of starting over unless the user asks for a new game.
- Never include <iframe>, eval, Function(), localStorage writes of secrets, or remote URLs.
- The document should fill 100% of the iframe (html,body { margin:0; height:100%; overflow:hidden }).
- Put the score and a brief control hint on screen at all times after start.`;

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export function extractGame(text: string): { title: string; html: string } {
  const titleMatch = text.match(/TITLE:\s*(.+)/i);
  const split = text.split(/---HTML---/i);
  let html = (split[1] ?? text).trim();

  const fenced = html.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) html = fenced[1].trim();

  const doc = html.match(/<!DOCTYPE html[\s\S]*<\/html>/i);
  if (doc) html = doc[0].trim();

  if (!html.toLowerCase().includes("<html")) {
    throw new Error("模型没有返回完整 HTML 游戏");
  }

  const title = (titleMatch?.[1] || "未命名游戏").trim().slice(0, 40);
  return { title, html: sanitizeCssColors(html) };
}

function sanitizeCssColors(html: string) {
  return html.replace(/#([0-9a-fA-F]{3,8})\b/g, (full, hex: string) => {
    if (hex.length === 3 || hex.length === 6 || hex.length === 8) return full;
    if (hex.length === 5) return `#0${hex}`;
    if (hex.length === 4) return `#${hex.slice(0, 3)}`;
    return "#3ee6c3";
  });
}

export const SURPRISE_PROMPTS = [
  "霓虹屋顶跑酷：左右躲障碍，越跑越快，踩到天线就结束",
  "小飞船打陨石，子弹有热量条，热量满了要冷却",
  "一只橘猫接天上掉下来的鱼，躲开靴子",
  "双人对打像素格斗，A/D 和方向键分别控制两人",
  "把相同颜色的方块点掉，三消，带简单连锁",
  "重力翻转平台跳跃，点一下天花板和地板对调",
  "夜市夹娃娃机，控制爪子抓发光的小怪物",
  "弹球打砖块，砖块被打中会裂成更小的霓虹碎片",
];
