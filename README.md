# openAstra

玩别人做好的 Astra 游戏，也能用一句话做一局自己的。

站点：[openastra.cc](https://openastra.cc)  
仓库：<https://github.com/agenmod/openastra>

这不是 OpenAI 官方站。广场收集能在浏览器打开的游戏和 3D：官方、评测、社区，加上你在本站做的一局。点卡片进详情——小窗玩、看作者、抄已公开的制作步骤。社区作品不保证都是 GPT-6 Astra。

## 怎么跑

需要 Node 20+。

```bash
cp .env.example .env
# 填 AUTH_SECRET；要「做一局」再填 ANTHROPIC_API_KEY
npm install
npx prisma db push
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

演示账号（本地种子数据）：`orbit@openastra.cc` / `demo1234`。

`.env`、本地 SQLite 和用户封面不会进仓库。

## 本仓是什么

- 站点代码：MIT
- 本仓文案：可以自由引用
- 游戏版权归原作者。本站只做介绍和外链，不搬运游戏本体

## 品牌

对外写 **openAstra**。域名、仓库、cookie 用全小写 **openastra**。
