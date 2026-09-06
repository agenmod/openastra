<p align="center">
  <strong>openAstra</strong><br />
  Astra 游戏和 3D，开了就能玩。
</p>

<p align="center">
  <a href="https://openastra.cc">openastra.cc</a>
  ·
  <a href="https://github.com/agenmod/openastra/blob/main/LICENSE">MIT</a>
</p>

<p align="center">
  <img src="docs/readme/covers.jpg" alt="Void Explorer、Sunwake、Abyssal、MiniTown、AFTERHOURS 等封面" width="920" />
</p>

官方、评测、社区里翻来的，现在广场上有 110 个。封面是实机。点进去就能玩；有的作者把提示词也公开了。你自己看到好玩的，登录后加一条。

| 来源 | 数量 |
| --- | ---: |
| 官方 | 43 |
| 评测 | 32 |
| 社区 | 35 |

## 本地跑

Node 20+。

```bash
git clone https://github.com/agenmod/openastra.git
cd openastra
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

[http://localhost:3000](http://localhost:3000)。演示账号 `orbit@openastra.cc` / `demo1234`。

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | SQLite，默认 `file:./prisma/dev.db` |
| `AUTH_SECRET` | 登录用，换一长串 |
| `ANTHROPIC_API_KEY` | 可选 |
| `ANTHROPIC_BASE_URL` | 可选 |
| `ANTHROPIC_MODEL` | 默认 `claude-sonnet-4-6` |

`.env` 和本地数据库不要提交。封面在 `public/astra/`。

## 往代码里加一条

在 `src/lib/astra-feed.ts` 或 `src/lib/astra-feed-extra.ts` 里加：

```ts
{
  id: "void-explorer",
  title: "Void Explorer",
  creator: "Thomas Ricouard",
  handle: "Dimillian",
  kind: "game",          // game | 3d
  source: "official",    // official | astra-review | community
  blurb: "从恒星飞到行星表面的程序化太空探索。",
  playUrl: "https://void-explorer.openai.chatgpt.site/",
  sourceUrl: "https://developers.openai.com/showcase/void-explorer",
  cover: "/astra/void-explorer.webp",
  coverRemote: "https://…",
}
```

封面放到 `public/astra/<id>.webp`。提示词写进 `src/lib/astra-prompts.json`。开 PR 前自己点开 playUrl 确认还能玩。

站点代码 MIT。游戏归原作者，要改去问他们。

对外写 **openAstra**，域名和仓库用 **openastra**。
