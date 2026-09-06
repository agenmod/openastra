<p align="center">
  <strong>openAstra</strong><br />
  玩别人做好的 Astra 游戏，也能用一句话做一局自己的。
</p>

<p align="center">
  <a href="https://openastra.cc">openastra.cc</a>
  ·
  <a href="https://github.com/agenmod/openastra/blob/main/LICENSE">MIT</a>
  ·
  不是 OpenAI 官方站
</p>

<p align="center">
  <img src="docs/readme/covers.jpg" alt="广场里正在玩的作品：Void Explorer、Sunwake、Abyssal、MiniTown、AFTERHOURS 等" width="920" />
</p>

GPT-6 Astra 和 ChatGPT Sites 已经做出一批能在浏览器里打开的游戏和 3D。它们散落在官方页、评测和作者自己的站点上。openAstra 把能打开的地址收成一张广场：点卡片进详情，小窗玩、看作者、抄已公开的制作步骤。想自己上手，就在本站用一句话说玩法，立刻做一局。

这不是清单站，也不搬运游戏文件。游戏仍在作者原站。

## 广场里现在有什么

110 个带可玩地址的作品，封面是实机画面，不是占位图。

| 来源 | 数量 | 从哪来 |
| --- | ---: | --- |
| 官方 | 43 | OpenAI Showcase 上挂了试玩地址的 |
| 评测 | 32 | Astra 评测里能点开的 demo |
| 社区 | 35 | ChatGPT Sites 和作者自己挂出来的 |

另外还有本站做完并发布的一局，和上面同一排卡片。

社区条目**不保证**都是 GPT-6 Astra。官方页怎么标，我们就怎么写；作者没写模型的，不当官方货卖。

## 点进去能干什么

**看别人的。** 卡片进 `/work/[id]`。能嵌就小窗玩，原站不让嵌就留封面，并给你「去原站玩」。作者、出处、评论都在同一页。38 个作品整理了作者自己公布的制作步骤原文——按时间一步步做出来的，不是平行的多个版本。

**做自己的。** 登录后打开「做一局」，说一句玩法。本站生成一整个能玩的 HTML5 小游戏，改手感、加 Boss、换配色都可以接着说。发布后回到广场。别人也可以点「改一局」，在你的基础上继续改。

```text
广场 ── 详情 ── 小窗玩 / 去原站 / 抄步骤
  │
做一局 ── 一句话 ── 本站立刻能玩 ── 发布回广场
```

## 自己跑一份

需要 Node 20+。

```bash
git clone https://github.com/agenmod/openastra.git
cd openastra
cp .env.example .env
npm install
npx prisma db push
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。本地种子账号：`orbit@openastra.cc` / `demo1234`。

| 变量 | 要不要 | 做什么 |
| --- | --- | --- |
| `DATABASE_URL` | 要 | SQLite，默认 `file:./prisma/dev.db` |
| `AUTH_SECRET` | 要 | 登录 cookie 签名。随便换一长串 |
| `ANTHROPIC_API_KEY` | 做一局才要 | 生成游戏。可走 OpenAI 兼容中转 |
| `ANTHROPIC_BASE_URL` | 可选 | 中转地址 |
| `ANTHROPIC_MODEL` | 可选 | 默认 `claude-sonnet-4-6` |

`.env`、本地数据库、用户自己截的封面不会进仓库。广场那 110 张封面在 `public/astra/`。

## 加一条到广场

只收**能打开的地址**，不收“我觉得很酷但打不开”的条目。

在 `src/lib/astra-feed.ts` 或 `src/lib/astra-feed-extra.ts` 加一条：

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

封面放到 `public/astra/<id>.webp`（或 `.jpg`）。作者如果公布了制作步骤，写进 `src/lib/astra-prompts.json`。批量探测和截图在 `scripts/`。

开 PR 时写清：你点过这条 playUrl，现在还能打开。

## 这不是什么

- 不是 OpenAI / ChatGPT 官方站，也不是 Astra 官方目录
- 不托管、不转存、不重新打包别人的游戏
- 不做“全网最全”。打不开的不收
- 社区条目可能是别的模型、别的工具，或作者没写清楚

## 版权

站点代码是 [MIT](LICENSE)。本仓文案可以自由引用。

游戏、3D、封面和提示词的版权归原作者。openAstra 只做介绍、外链和小窗。要商用、要改、要再发布，去问作者。

## 品牌

对外写 **openAstra**。域名、仓库、cookie、邮箱用全小写 **openastra**。
