import { ASTRA_FEED_EXTRA } from "./astra-feed-extra";

export type AstraSource = "official" | "astra-review" | "community" | "workshop";

export type AstraWork = {
  id: string;
  title: string;
  creator: string;
  handle: string;
  kind: "game" | "3d";
  source?: AstraSource;
  blurb: string;
  playUrl: string;
  sourceUrl: string;
  cover: string;
  coverRemote: string;
  href?: string;
};

export const ASTRA_SOURCE_LABEL: Record<AstraSource, string> = {
  official: "官方",
  "astra-review": "评测",
  community: "社区",
  workshop: "加的",
};

export const ASTRA_FEED: AstraWork[] = [
  {
    id: "void-explorer",
    title: "Void Explorer",
    creator: "Thomas Ricouard",
    handle: "Dimillian",
    kind: "game",
    source: "official",
    blurb: "从恒星飞到行星表面的程序化太空探索。官方页标 GPT-6 Astra，可直接在浏览器玩。",
    playUrl: "https://void-explorer.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/void-explorer",
    cover: "/astra/void-explorer.webp",
    coverRemote:
      "https://developers.openai.com/showcase/void-explorer/launch-cover-four-wing.webp",
  },
  {
    id: "sunwake",
    title: "Sunwake",
    creator: "Thomas Ricouard",
    handle: "Dimillian",
    kind: "game",
    source: "official",
    blurb: "开小船穿越程序化海洋，找灯塔。水面和船体是 Astra 在 Three.js / Blender 里做的。",
    playUrl: "https://sunwake-the-last-light.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/sunwake",
    cover: "/astra/sunwake.webp",
    coverRemote: "https://developers.openai.com/showcase/sunwake/gameplay-sailing.webp",
  },
  {
    id: "hollowflux",
    title: "Hollowflux",
    creator: "Thomas Ricouard",
    handle: "Dimillian",
    kind: "game",
    source: "official",
    blurb: "地下河地牢动作 RPG。洞穴、角色、装备全是代码画的，水会跟着走和打。",
    playUrl: "https://tideglass-drowned-vein.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/hollowflux",
    cover: "/astra/hollowflux.webp",
    coverRemote: "https://developers.openai.com/showcase/hollowflux/final.webp",
  },
  {
    id: "velocity-loop",
    title: "Velocity Loop",
    creator: "VB Srivastav",
    handle: "reach_vb",
    kind: "game",
    source: "official",
    blurb: "微型车间里的 3D 合金车计时赛，有回环赛道和氮气。",
    playUrl: "https://velocity-loop.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/velocity-loop",
    cover: "/astra/velocity-loop.webp",
    coverRemote:
      "https://developers.openai.com/showcase/velocity-loop/cover-generated-sep4.webp",
  },
  {
    id: "little-ritual",
    title: "Little Ritual",
    creator: "Jeff Wang",
    handle: "jeffwang",
    kind: "game",
    source: "official",
    blurb: "在一颗小球世界上送咖啡的 3D 小品。",
    playUrl: "https://little-ritual.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/little-ritual",
    cover: "/astra/little-ritual.webp",
    coverRemote:
      "https://developers.openai.com/showcase/little-ritual/cover-generated-sep4.webp",
  },
  {
    id: "physics-museum",
    title: "Physics Museum",
    creator: "Katia Gil Guzman",
    handle: "katiagg",
    kind: "3d",
    source: "official",
    blurb: "五件可动手的 3D 科学装置：玻璃珠、波动、三颗太阳。",
    playUrl: "https://astra-museum-of-motion.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/physics-museum",
    cover: "/astra/physics-museum.webp",
    coverRemote:
      "https://developers.openai.com/showcase/physics-museum/cover-generated-sep4.webp",
  },
  {
    id: "living-cell",
    title: "Living Cell",
    creator: "VB Srivastav",
    handle: "reach_vb",
    kind: "3d",
    source: "official",
    blurb: "可点选结构的活细胞剖面，磷脂膜和内部器官在动。",
    playUrl: "https://living-cell-astra-20260901.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/living-cell-cross-section",
    cover: "/astra/living-cell.webp",
    coverRemote:
      "https://developers.openai.com/showcase/living-cell-cross-section/cover-generated-sep4.webp",
  },
  {
    id: "clockwork-observatory",
    title: "Clockwork Observatory",
    creator: "VB Srivastav",
    handle: "reach_vb",
    kind: "3d",
    source: "official",
    blurb: "会变形的机械天文台：石阶、黄铜齿轮、桥，整座建筑在转。",
    playUrl: "https://kinetic-architecture-astra-20260901.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/impossible-kinetic-architecture",
    cover: "/astra/clockwork-observatory.webp",
    coverRemote:
      "https://developers.openai.com/showcase/impossible-kinetic-architecture/cover-generated-sep4.webp",
  },
  {
    id: "abyssal",
    title: "Abyssal",
    creator: "VB Srivastav",
    handle: "reach_vb",
    kind: "3d",
    source: "official",
    blurb: "热液喷口周围的深海生态：发光鱼群、水母、可调洋流。",
    playUrl: "https://abyssal-ecosystem-astra-20260901.openai.chatgpt.site/",
    sourceUrl: "https://developers.openai.com/showcase/abyssal-bioluminescent-ecosystem",
    cover: "/astra/abyssal.webp",
    coverRemote:
      "https://developers.openai.com/showcase/abyssal-bioluminescent-ecosystem/cover-generated-sep4.webp",
  },
  {
    id: "abyssal-living-deep",
    title: "ABYSSAL · The Living Deep",
    creator: "Ethan Mollick",
    handle: "emollick",
    kind: "3d",
    source: "community",
    blurb: "X / Bluesky 上公开的地址：Astra 把单文件海面风暴扩成整片海底，含礁石、鲸和生物行为。",
    playUrl: "https://abyssal-living-deep.netlify.app/?site=reef",
    sourceUrl: "https://bsky.app/profile/emollick.bsky.social/post/3munqaqt7kc2i",
    cover: "/astra/abyssal-living-deep.webp",
    coverRemote:
      "https://developers.openai.com/showcase/abyssal-bioluminescent-ecosystem/cover-generated-sep4.webp",
  },
];

export const ASTRA_FEED_ALL: AstraWork[] = [...ASTRA_FEED, ...ASTRA_FEED_EXTRA];
