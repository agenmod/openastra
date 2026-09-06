#!/usr/bin/env python3
"""Build 100 extra Astra/Sites feed items from verified public play URLs."""

from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path("/Volumes/T92T/AIcodedesk/AIdianzi/aaagame")
OUT_TS = ROOT / "src/lib/astra-feed-extra.ts"
COVER_DIR = ROOT / "public/astra"
EXISTING = {
    "https://void-explorer.openai.chatgpt.site/",
    "https://sunwake-the-last-light.openai.chatgpt.site/",
    "https://tideglass-drowned-vein.openai.chatgpt.site/",
    "https://velocity-loop.openai.chatgpt.site/",
    "https://little-ritual.openai.chatgpt.site/",
    "https://astra-museum-of-motion.openai.chatgpt.site/",
    "https://living-cell-astra-20260901.openai.chatgpt.site/",
    "https://kinetic-architecture-astra-20260901.openai.chatgpt.site/",
    "https://abyssal-ecosystem-astra-20260901.openai.chatgpt.site/",
    "https://abyssal-living-deep.netlify.app/?site=reef",
}

UA = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) openAstraFeed/1.0"
}
CTX = ssl.create_default_context()

# source: official | astra-review | community
ITEMS: list[dict] = [
    # Official Showcase — games / 3D / interactive 3D
    {"id":"architecture-studio","title":"Architecture Studio","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"浏览器里的建筑工作室：调材质、光线和体块，官方页 可玩。","playUrl":"https://architecture-studio.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/architecture-studio","coverRemote":"https://developers.openai.com/showcase/architecture-studio/cover.webp"},
    {"id":"asterism","title":"Asterism","creator":"Charlie Guo","handle":"charlieg","kind":"game","source":"official","blurb":"用有限的命名星组成星座，点亮夜空。","playUrl":"https://asterism.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/asterism","coverRemote":"https://developers.openai.com/showcase/asterism/cover.webp"},
    {"id":"backroom-center","title":"Backroom Center: Corrupted","creator":"Thomas Ricouard","handle":"Dimillian","kind":"game","source":"official","blurb":"第一人称数据中心迷宫，程序化走廊加 VHS 劣化。","playUrl":"https://backroom-center-corrupted.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/backroom-center-corrupted","coverRemote":"https://developers.openai.com/showcase/backroom-center-corrupted/cover.webp"},
    {"id":"below-the-surface","title":"Below the Surface","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"可下潜的海洋剖面，官方 3D 场景。","playUrl":"https://below-the-surface-ocean.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/below-the-surface","coverRemote":"https://developers.openai.com/showcase/below-the-surface/cover.webp"},
    {"id":"biome-lab","title":"Biome Lab","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"可调生态的程序化 terrarium 沙盒。","playUrl":"https://interactive-studies-56.openai.chatgpt.site/biome-lab/","sourceUrl":"https://developers.openai.com/showcase/biome-lab","coverRemote":"https://developers.openai.com/showcase/biome-lab/cover.webp"},
    {"id":"codex-modeling-studio","title":"Codex Modeling Studio","creator":"Eric Provencher","handle":"eProvencher","kind":"3d","source":"official","blurb":"浏览器里摆 3D 形体、看光影的建模台。","playUrl":"https://codex-modeling-studio.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/codex-modeling-studio","coverRemote":"https://developers.openai.com/showcase/codex-modeling-studio/cover.webp"},
    {"id":"codex-pet-arena","title":"Codex Pet Arena","creator":"Gabriel Chua","handle":"gabrielchua","kind":"game","source":"official","blurb":"宠物平台竞技场：吃代币变大，把对手撞飞。","playUrl":"https://codex-pet-arena-20260709.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/codex-pet-arena","coverRemote":"https://developers.openai.com/showcase/codex-pet-arena/cover.webp"},
    {"id":"courtyard-house","title":"Courtyard House","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"可走的庭院住宅，调时间和材质。","playUrl":"https://alder-courtyard-house.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/courtyard-house","coverRemote":"https://developers.openai.com/showcase/courtyard-house/cover.webp"},
    {"id":"crossword-desk","title":"Crossword Desk","creator":"Aaron Levine","handle":"aaronlevine","kind":"game","source":"official","blurb":"浏览器填字台，官方页可玩。","playUrl":"https://crossword-desk-studio.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/crossword-desk","coverRemote":"https://developers.openai.com/showcase/crossword-desk/cover.webp"},
    {"id":"cubecade","title":"Cubecade","creator":"Niall McCormack","handle":"niall","kind":"game","source":"official","blurb":"魔方式 3D 方块解谜。","playUrl":"https://cubecade.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/cubecade-rubiks","coverRemote":"https://developers.openai.com/showcase/cubecade-rubiks/cover.webp"},
    {"id":"field-day","title":"Field Day","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"野餐用品店面，带可交互商品和礼篮。","playUrl":"https://store-fronts-56.openai.chatgpt.site/field-day/","sourceUrl":"https://developers.openai.com/showcase/field-day","coverRemote":"https://developers.openai.com/showcase/field-day/cover.webp"},
    {"id":"frame-studio","title":"Frame Studio","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"给 3D 角色摆姿势、做定格动画的工作台。","playUrl":"https://frame-studio-motion.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/frame-studio","coverRemote":"https://developers.openai.com/showcase/frame-studio/cover.webp"},
    {"id":"glass-towers","title":"Glass Towers","creator":"Eric Provencher","handle":"eProvencher","kind":"game","source":"official","blurb":"半透明体块堆叠的物理平衡游戏。","playUrl":"https://glass-towers.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/glass-towers","coverRemote":"https://developers.openai.com/showcase/glass-towers/cover.webp"},
    {"id":"kiln","title":"Kiln","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"陶瓷店面，杯子可旋转看釉面。","playUrl":"https://store-fronts-56.openai.chatgpt.site/kiln/","sourceUrl":"https://developers.openai.com/showcase/kiln","coverRemote":"https://developers.openai.com/showcase/kiln/cover.webp"},
    {"id":"material-lab","title":"Material Lab","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"实时测材质、灯光和形体的 3D 实验室。","playUrl":"https://interactive-studies-56.openai.chatgpt.site/material-lab/","sourceUrl":"https://developers.openai.com/showcase/material-lab","coverRemote":"https://developers.openai.com/showcase/material-lab/cover.webp"},
    {"id":"nightjar","title":"Nightjar Listening Room","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"夜间听音室，空间和器材可转。","playUrl":"https://nightjar-listening-room.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/nightjar-listening-room","coverRemote":"https://developers.openai.com/showcase/nightjar-listening-room/cover.webp"},
    {"id":"paper-glider","title":"Paper Glider","creator":"Katia Gil Guzman","handle":"katiagg","kind":"game","source":"official","blurb":"在程序化阳光房间里飞纸飞机。","playUrl":"https://paper-glider-56.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/paper-glider","coverRemote":"https://developers.openai.com/showcase/paper-glider/cover.webp"},
    {"id":"pattern-studio","title":"Pattern Studio","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"三维图案工作室，调重复纹样和材质。","playUrl":"https://pattern-studio.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/pattern-studio","coverRemote":"https://developers.openai.com/showcase/pattern-studio/cover.webp"},
    {"id":"stop-motion-desk","title":"Stop-Motion Desk","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"给 3D 角色摆帧的定格动画桌。","playUrl":"https://stop-motion-desk.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/stop-motion-desk","coverRemote":"https://developers.openai.com/showcase/stop-motion-desk/cover.webp"},
    {"id":"sunday-table","title":"Sunday Table","creator":"James Sun","handle":"jamessun","kind":"3d","source":"official","blurb":"周日餐桌场景，菜品和器皿可看。","playUrl":"https://sundaytable.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/sunday-table","coverRemote":"https://developers.openai.com/showcase/sunday-table/cover.webp"},
    {"id":"terrain-mixer","title":"Terrain Mixer","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"程序化地形，三维视图和分析视图同步。","playUrl":"https://interactive-studies-56.openai.chatgpt.site/terrain-mixer/","sourceUrl":"https://developers.openai.com/showcase/terrain-mixer","coverRemote":"https://developers.openai.com/showcase/terrain-mixer/cover.webp"},
    {"id":"tidal-house","title":"Tidal House","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"潮汐边的retreat住宅，可绕行观看。","playUrl":"https://tidal-house-retreat.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/tidal-house","coverRemote":"https://developers.openai.com/showcase/tidal-house/cover.webp"},
    {"id":"tiny-rails","title":"Tiny Rails Rollercoaster","creator":"VB Srivastav","handle":"reach_vb","kind":"game","source":"official","blurb":"迷你过山车，八条路线和多种驾驶模式。","playUrl":"https://sol-on-rails.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/tiny-rails-rollercoaster","coverRemote":"https://developers.openai.com/showcase/tiny-rails-rollercoaster/cover.webp"},
    {"id":"type-field","title":"Type Field","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"三维字体展览场，字母是可绕行的雕塑。","playUrl":"https://type-field-exhibition.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/type-field","coverRemote":"https://developers.openai.com/showcase/type-field/cover.webp"},
    {"id":"verdant-market","title":"Verdant Market","creator":"Niall McCormack","handle":"niall","kind":"3d","source":"official","blurb":"蔬果杂货店面，货架和商品是三维的。","playUrl":"https://verdant-market-grocery.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/verdant-market","coverRemote":"https://developers.openai.com/showcase/verdant-market/cover.webp"},
    {"id":"webroom","title":"Webroom","creator":"Matias Castello","handle":"mcastello","kind":"3d","source":"official","blurb":"可走进去的网页房间。","playUrl":"https://webroom.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/webroom","coverRemote":"https://developers.openai.com/showcase/webroom/cover.webp"},
    {"id":"minitown","title":"MiniTown","creator":"Thomas Ricouard","handle":"Dimillian","kind":"game","source":"official","blurb":"袖珍小镇：分区生长、居民通勤、夜里亮灯。","playUrl":"https://minitown-cozy-sim.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/minitown","coverRemote":"https://developers.openai.com/showcase/minitown/cover.webp"},
    {"id":"phantasy-codex-adventure","title":"Phantasy Codex Adventure","creator":"Thomas Ricouard","handle":"Dimillian","kind":"game","source":"official","blurb":"持久复古动作 RPG，程序化世界和共享排名。","playUrl":"https://phantasy-codex-adventure.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/phantasy-codex-adventure","coverRemote":"https://developers.openai.com/showcase/phantasy-codex-adventure/cover.webp"},
    {"id":"phantasy-codex-online","title":"Phantasy Codex Online","creator":"Thomas Ricouard","handle":"Dimillian","kind":"game","source":"official","blurb":"带城镇、掉落和世界层级的浏览器动作 RPG。","playUrl":"https://phantasy-codex-online.openai.chatgpt.site/","sourceUrl":"https://the-infinite-build.openai.chatgpt.site/","coverRemote":"https://developers.openai.com/showcase/phantasy-codex-adventure/cover.webp"},
    {"id":"ridge-pack","title":"Ridge Pack","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"背包店面，可交互装箱指南。","playUrl":"https://ridge-pack.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/ridge-pack","coverRemote":"https://developers.openai.com/showcase/ridge-pack/cover.webp"},
    {"id":"scent-cartography","title":"Scent Cartography","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"植物香氛店，自己调一瓶气味。","playUrl":"https://store-fronts-56.openai.chatgpt.site/scent-cartography/","sourceUrl":"https://developers.openai.com/showcase/scent-cartography","coverRemote":"https://developers.openai.com/showcase/scent-cartography/cover.webp"},
    {"id":"paperie","title":"Paperie","creator":"James Sun","handle":"jamessun","kind":"3d","source":"official","blurb":"立体贺卡工作室，纸面可翻可写。","playUrl":"https://paperie-webmcp-greeting-cards.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/paperie","coverRemote":"https://developers.openai.com/showcase/paperie/cover.webp"},
    {"id":"fieldwork-12","title":"Fieldwork // 12","creator":"Justin Rushing","handle":"jrushing","kind":"3d","source":"official","blurb":"田间节拍机，旋钮和波形都在三维台上。","playUrl":"https://fieldwork-beat-machine.openai.chatgpt.site/","sourceUrl":"https://developers.openai.com/showcase/ko-field-beat-machine","coverRemote":"https://developers.openai.com/showcase/ko-field-beat-machine/cover.webp"},
    {"id":"waveform-studio","title":"Waveform Studio","creator":"Katia Gil Guzman","handle":"katiagg","kind":"3d","source":"official","blurb":"把音频变成可调波形雕塑。","playUrl":"https://interactive-studies-56.openai.chatgpt.site/waveform-studio/","sourceUrl":"https://developers.openai.com/showcase/waveform-studio","coverRemote":"https://developers.openai.com/showcase/waveform-studio/cover.webp"},

    # Matthew Berman Astra review — here.now + hosted demos
    {"id":"seven-little-worlds","title":"Seven Little Worlds","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"Astra 评测里的七个小行星世界。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/seven-little-worlds/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/seven-worlds.webp"},
    {"id":"cloudtop-chaos","title":"Cloudtop Chaos","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"云上障碍赛，Astra 评测里的 Fall Guys 风一局。","playUrl":"https://royal-pebble-6azj.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/obstacle-course.jpg"},
    {"id":"newhaven","title":"Newhaven","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"ASCII 搭起来的整座城，可走进去。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/newhaven/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/newhaven.webp"},
    {"id":"afterhours","title":"AFTERHOURS","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"夜间城市空间，Astra 评测可玩 demo。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/afterhours/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/afterhours.webp"},
    {"id":"commons","title":"COMMONS","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"公共空间三维场景，评测磁贴直达。","playUrl":"https://crystal-pagoda-b6ka.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/commons.webp"},
    {"id":"little-planet-berman","title":"Little Planet","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"一颗可绕行的小球世界。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/little-planet/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/little-planet.webp"},
    {"id":"pip-orchard","title":"Pip & Orchard","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"果园小品，评测 here.now 托管。","playUrl":"https://grassy-nirvana-xwhj.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/pip.webp"},
    {"id":"dgx-spark","title":"DGX Spark","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"DGX Spark 机箱三维拆解。","playUrl":"https://presto-basin-gd5w.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/dgx.webp"},
    {"id":"quack-club","title":"Quack Club","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"鸭子俱乐部小游戏。","playUrl":"https://vast-vortex-dg57.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/quack.webp"},
    {"id":"galaxy-z-fold7","title":"Galaxy Z Fold7","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"折叠屏产品三维展示。","playUrl":"https://zephyr-haven-cepc.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/fold.webp"},
    {"id":"model-y","title":"Model Y","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"Model Y 车身三维浏览。","playUrl":"https://marble-ferry-da7y.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/modely.webp"},
    {"id":"pelagic","title":"PELAGIC","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"远洋三维场景。","playUrl":"https://russet-onyx-z85r.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/pelagic.webp"},
    {"id":"form-factor","title":"FORM / FACTOR","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"工业造型三维研究。","playUrl":"https://blazing-lichen-3v5s.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/form.webp"},
    {"id":"the-threshold","title":"THE THRESHOLD","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"门槛空间 walkthrough。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/threshold/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/threshold.webp"},
    {"id":"prism-berman","title":"PRISM","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"棱镜立方体交互。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/cube/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/cube.jpg"},
    {"id":"needle-haystack","title":"Needle in a Haystack","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"草垛里找针的交互小品。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/needle/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/needle.webp"},
    {"id":"ratstronaut-riot","title":"Ratstronaut Riot!","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"老鼠宇航员闹事，评测游戏磁贴。","playUrl":"https://tropic-wreath-q2hc.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/rat.webp"},
    {"id":"verdant-bastion","title":"Verdant Bastion","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"绿色堡垒三维场景。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/verdant-bastion/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/verdant.webp"},
    {"id":"vice-signal","title":"VICE // SIGNAL","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"浏览器里的信号台。","playUrl":"https://quartz-igloo-d2ah.here.now/browser/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/vice.webp"},
    {"id":"moon-swallowed-names","title":"The Moon That Swallowed Our Names","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"可翻的漫画卷，月亮吞掉名字。","playUrl":"https://signals.forwardfuture.com/astra-review/demos/manga/index.html","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/manga.webp"},
    {"id":"browser-in-action","title":"Browser in Action","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"Astra 操作浏览器的可视化回放。","playUrl":"https://open-nebula-akqx.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/browser.webp"},
    {"id":"chronoshift","title":"CHRONOSHIFT","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"时间错位题材交互。","playUrl":"https://regal-poplar-5ay6.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/chrono.webp"},
    {"id":"periapsis","title":"PERIAPSIS","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"近拱点轨道三维。","playUrl":"https://unfold-valley-ydt7.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/periapsis.webp"},
    {"id":"glassbox","title":"GLASSBOX","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"玻璃盒实验装置。","playUrl":"https://saffron-spirit-3a8y.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/glassbox.webp"},
    {"id":"grid-atlas","title":"GRID ATLAS","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"网格地图册三维界面。","playUrl":"https://brave-tinsel-8625.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/grid.webp"},
    {"id":"evidence-room","title":"THE EVIDENCE ROOM","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"证据室阅读器，空间里翻档案。","playUrl":"https://lively-rocket-95s2.here.now/reader/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/evidence.webp"},
    {"id":"polyrhythm","title":"POLYRHYTHM","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"复节奏可视化。","playUrl":"https://calm-signal-zmp2.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/poly.webp"},
    {"id":"dead-letter","title":"DEAD LETTER","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"死信局叙事交互。","playUrl":"https://marine-warden-2hd5.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/deadletter.webp"},
    {"id":"switchyard","title":"SWITCHYARD","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"编组站三维系统。","playUrl":"https://cedar-plover-r47w.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/switch.webp"},
    {"id":"neural-observatory","title":"NEURAL OBSERVATORY","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"神经观测台三维装置。","playUrl":"https://wistful-rocket-bbsd.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/neural.webp"},
    {"id":"launchpad","title":"LAUNCHPAD","creator":"Matthew Berman","handle":"matthewberman","kind":"3d","source":"astra-review","blurb":"发射台看板，三维面板。","playUrl":"https://blazing-forge-tfh2.here.now/board/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/launch.webp"},
    {"id":"spin-cycle","title":"Spin Cycle","creator":"Matthew Berman","handle":"matthewberman","kind":"game","source":"astra-review","blurb":"旋转循环小游戏。","playUrl":"https://dusty-cliff-y6me.here.now/","sourceUrl":"https://signals.forwardfuture.com/astra-review/","coverRemote":"https://signals.forwardfuture.com/astra-review/projects/spin.webp"},

    # Community ChatGPT Sites / public Astra shares — games or 3D only
    {"id":"buzz-game-lab","title":"Buzz Game Lab","creator":"sora-jp","handle":"sora-jp","kind":"game","source":"community","blurb":"日式免登录小游戏合集，短挑战和分数循环。","playUrl":"https://buzz-game-lab.sora-jp.chatgpt.site/","sourceUrl":"https://github.com/pyth0nb3st/awesome-chatgpt-sites","coverRemote":""},
    {"id":"dailies","title":"Dailies","creator":"Jon Abrams","handle":"jonabrams","kind":"game","source":"community","blurb":"浏览器逻辑谜题：Net、温度计、斜线、点灯。","playUrl":"https://dailies.jonabrams.chatgpt.site/","sourceUrl":"https://dailies.jonabrams.chatgpt.site/","coverRemote":""},
    {"id":"mabomabo","title":"MaboMabo","creator":"LUCIAN LAMP","handle":"lucianlamp","kind":"game","source":"community","blurb":"四灵连锁消消乐，fever 和排行榜。","playUrl":"https://mabomabo.lucianlamp.chatgpt.site/","sourceUrl":"https://mabomabo.lucianlamp.chatgpt.site/","coverRemote":""},
    {"id":"pechipechi-awake","title":"Pechipechi Awake","creator":"neneneai","handle":"neneneai","kind":"game","source":"community","blurb":"像素生存，360 度移动和无尽战斗。","playUrl":"https://pechipechi-awake.neneneai.chatgpt.site/","sourceUrl":"https://pechipechi-awake.neneneai.chatgpt.site/","coverRemote":""},
    {"id":"tiny-blockworld","title":"Tiny Blockworld","creator":"Diego Cabezas","handle":"diegocabezas01","kind":"game","source":"community","blurb":"六种方块的体素沙盒，能挖能建。","playUrl":"https://tiny-blockworld.diegocabezas01.chatgpt.site/game/","sourceUrl":"https://tiny-blockworld.diegocabezas01.chatgpt.site/game/","coverRemote":""},
    {"id":"cubewild","title":"方境 / Cubewild","creator":"xiaohaoyopt0","handle":"xiaohaoyopt0","kind":"game","source":"community","blurb":"浏览器体素沙盒，创造模式和本地存档。","playUrl":"https://fangjing-voxel-71026.xiaohaoyopt0.chatgpt.site/","sourceUrl":"https://fangjing-voxel-71026.xiaohaoyopt0.chatgpt.site/","coverRemote":""},
    {"id":"novacade-slingshift","title":"Slingshift","creator":"NovaCade","handle":"thatgamer253","kind":"game","source":"community","blurb":"把碎片钩进轨道再甩出去的动作 roguelite。","playUrl":"https://novacade.thatgamer253.chatgpt.site/games/slingshift/","sourceUrl":"https://novacade.thatgamer253.chatgpt.site/","coverRemote":""},
    {"id":"novacade-brickfuse","title":"Brickfuse","creator":"NovaCade","handle":"thatgamer253","kind":"game","source":"community","blurb":"打砖块同时现场编 techno / hip-hop。","playUrl":"https://novacade.thatgamer253.chatgpt.site/games/brickfuse/","sourceUrl":"https://novacade.thatgamer253.chatgpt.site/","coverRemote":""},
    {"id":"novacade-bumper","title":"Bumper Punks","creator":"NovaCade","handle":"thatgamer253","kind":"game","source":"community","blurb":"指向转向的碰碰车，可开房间联机。","playUrl":"https://novacade.thatgamer253.chatgpt.site/games/bumper/","sourceUrl":"https://novacade.thatgamer253.chatgpt.site/","coverRemote":""},
    {"id":"novacade-hexhand","title":"Hexhand","creator":"NovaCade","handle":"thatgamer253","kind":"game","source":"community","blurb":"7×7 场上的三维生物卡牌对决。","playUrl":"https://novacade.thatgamer253.chatgpt.site/games/hexhand/","sourceUrl":"https://novacade.thatgamer253.chatgpt.site/","coverRemote":""},
    {"id":"novacade-battlerips","title":"BattleRips","creator":"NovaCade","handle":"thatgamer253","kind":"game","source":"community","blurb":"钢盘上的 1v1，用旋转打 Rip Burst。","playUrl":"https://novacade.thatgamer253.chatgpt.site/games/battlerips/","sourceUrl":"https://novacade.thatgamer253.chatgpt.site/","coverRemote":""},
    {"id":"macos-27-simulator","title":"macOS 27 Simulator","creator":"mweinbach","handle":"mweinbach","kind":"3d","source":"community","blurb":"浏览器里的 macOS 桌面模拟。","playUrl":"https://macos-27-simulator.mweinbach.chatgpt.site/","sourceUrl":"https://macos-27-simulator.mweinbach.chatgpt.site/","coverRemote":""},
    {"id":"felicia-last-memory","title":"FELICIA: The Last Memory","creator":"Sombra-1","handle":"ayx1","kind":"3d","source":"community","blurb":"濒死 AI 档案里的 3D 叙事，按 Identity / Fear / Hope 改空间。","playUrl":"https://felicia-the-last-memory.ayx1.chatgpt.site/","sourceUrl":"https://github.com/Sombra-1/felicia-the-last-memory","coverRemote":""},
    {"id":"untwine","title":"Untwine: The Great Restoration","creator":"Alvan Chow","handle":"alvanchow","kind":"game","source":"community","blurb":"果园里抽枝条的可玩 demo。","playUrl":"https://untwine-playable-demo.alvanchow.chatgpt.site/","sourceUrl":"https://untwine-playable-demo.alvanchow.chatgpt.site/","coverRemote":""},
    {"id":"temple-of-eden","title":"Temple of Eden","creator":"patcoolman67","handle":"patcoolman67","kind":"game","source":"community","blurb":"有记忆的单人 5e 战役，浏览器里掷骰。","playUrl":"https://temple-of-eden.patcoolman67.chatgpt.site/","sourceUrl":"https://temple-of-eden.patcoolman67.chatgpt.site/","coverRemote":""},
    {"id":"atom-architecture","title":"Atom Architecture Lab","creator":"jgalicea","handle":"jgalicea","kind":"3d","source":"community","blurb":"浏览器 SDF / raymarching 引擎，拖动物体旋转。","playUrl":"https://atom-architecture-lab.jgalicea.chatgpt.site/","sourceUrl":"https://atom-architecture-lab.jgalicea.chatgpt.site/","coverRemote":""},
    {"id":"taletree","title":"Taletree Kids","creator":"friarpuck","handle":"friarpuck","kind":"game","source":"community","blurb":"一句话生成可玩故事冒险。","playUrl":"https://taletree-adventure-maker.friarpuck.chatgpt.site/","sourceUrl":"https://taletree-adventure-maker.friarpuck.chatgpt.site/","coverRemote":""},
    {"id":"descent-flashback","title":"Descent: Flashback","creator":"dylanwoo","handle":"dylanwoo757047","kind":"game","source":"community","blurb":"六自由度矿井飞行射击致敬作。","playUrl":"https://descent-flashback.dylanwoo757047.chatgpt.site/","sourceUrl":"https://github.com/dylanwoo/descent-flashback","coverRemote":""},
    {"id":"super-bash-folds","title":"Super Bash Folds","creator":"blancmathis","handle":"spry-crumb-3668","kind":"game","source":"community","blurb":"开源平台格斗，角色和关卡都是内容包。","playUrl":"https://super-bash-folds.spry-crumb-3668.chatgpt.site/play/index.html","sourceUrl":"https://github.com/blancmathis/Super_Bash_Folds","coverRemote":"https://raw.githubusercontent.com/blancmathis/Super_Bash_Folds/main/docs/media/gameplay.webp"},
    {"id":"redacted-sky","title":"The Redacted Sky","creator":"moonbow166","handle":"moonbow166","kind":"3d","source":"community","blurb":"把官方 UAP 档案铺进三维深空场。","playUrl":"https://the-redacted-sky.moonbow166.chatgpt.site/","sourceUrl":"https://github.com/moonbow166/the-redacted-sky","coverRemote":""},
    {"id":"fire-hose-hero","title":"Fire Hose Hero","creator":"Manse","handle":"ran584000","kind":"game","source":"community","blurb":"体感浇灭火焰的旗舰小游戏。","playUrl":"https://fire-hose-hero.ran584000.chatgpt.site/","sourceUrl":"https://github.com/ahndohun/manse","coverRemote":""},
    {"id":"manse-playground","title":"Manse Playground","creator":"Manse","handle":"ran584000","kind":"game","source":"community","blurb":"不用摄像头的体感游戏模拟器。","playUrl":"https://manse-showcase.ran584000.chatgpt.site/playground?provider=simulated","sourceUrl":"https://manse-showcase.ran584000.chatgpt.site/","coverRemote":""},
    {"id":"zork-underground","title":"Zork · Underground Empire","creator":"Ethan Mollick","handle":"emollick","kind":"game","source":"community","blurb":"Astra 把 1977 文本 Zork 做成第一人称 3D 动作冒险。","playUrl":"https://zork-underground-empire.netlify.app/","sourceUrl":"https://github.com/emollick/zork-underground-empire","coverRemote":""},
    {"id":"library-of-babel","title":"Library of Babel","creator":"Ethan Mollick","handle":"emollick","kind":"3d","source":"community","blurb":"博尔赫斯巴别图书馆的无限六角厅，可走路可搜书。","playUrl":"https://library-of-babel-3d.netlify.app/","sourceUrl":"https://github.com/emollick/library-of-babel","coverRemote":""},
    {"id":"annals-kingdom","title":"The Annals","creator":"Ethan Mollick","handle":"emollick","kind":"3d","source":"community","blurb":"单文件中世纪王国：经济、王朝、战争和龙。","playUrl":"https://annals-kingdom.netlify.app/","sourceUrl":"https://github.com/emollick/annals-kingdom","coverRemote":""},
    {"id":"guess-teenieping","title":"Guess Teenieping","creator":"teamcmcbot","handle":"zenellie","kind":"game","source":"community","blurb":"给孩子的猜角色小游戏，Codex + Sites 发布。","playUrl":"https://guess-teeniping.zenellie.chatgpt.site/","sourceUrl":"https://github.com/teamcmcbot/guess-teenieping","coverRemote":""},
    {"id":"safari-math","title":"Serena's Safari Math","creator":"Peter G. Yang","handle":"petergyang","kind":"game","source":"community","blurb":"safari 主题数学小游戏。","playUrl":"https://serenas-safari-math.petergyang.chatgpt.site/","sourceUrl":"https://github.com/petergyang/safari-math-game","coverRemote":""},
    {"id":"english-adventure-3d","title":"English Adventure 720 3D","creator":"arisa008","handle":"arisa008","kind":"3d","source":"community","blurb":"720 度三维英语冒险。","playUrl":"https://english-adventure-720-3d.arisa008.chatgpt.site/","sourceUrl":"https://github.com/nakahara-health/english-adventure-720-3d","coverRemote":""},
    {"id":"mike-moonlight-run","title":"Mike Moonlight Run","creator":"rojii","handle":"rojii","kind":"game","source":"community","blurb":"月光跑酷。","playUrl":"https://mike-moonlight-run.rojii.chatgpt.site/","sourceUrl":"https://github.com/rsakao/mike-moonlight-run","coverRemote":""},
    {"id":"null-trace","title":"Null Trace SQL Mystery","creator":"scottcampbelldata","handle":"scottcampbell8419138","kind":"game","source":"community","blurb":"用 SQL 破案的谜题。","playUrl":"https://null-trace-nadir9-0217.scottcampbell8419138.chatgpt.site/","sourceUrl":"https://github.com/scottcampbelldata/null-trace-sql-mystery","coverRemote":""},
    {"id":"shipwright","title":"Shipwright","creator":"Kevin Whinnery","handle":"kevinwhinnery","kind":"3d","source":"community","blurb":"给 ChatGPT Sites 做的三维飞船编辑器。","playUrl":"https://shipwright-editor.kevinwhinnery.chatgpt.site/","sourceUrl":"https://github.com/kwhinnery/shipwright","coverRemote":""},
    {"id":"bron","title":"BRON","creator":"akdok","handle":"akdok","kind":"game","source":"community","blurb":"无对白草原动作条漫，七集可点。","playUrl":"https://bron-savana.akdok.chatgpt.site/","sourceUrl":"https://bron-savana.akdok.chatgpt.site/","coverRemote":""},
    {"id":"aether-path","title":"Aether Path","creator":"rick595425034","handle":"rick595425034","kind":"3d","source":"community","blurb":"最短路径可视化，三维路线。","playUrl":"https://aether-path-cn.rick595425034.chatgpt.site/","sourceUrl":"https://github.com/rick595425034-arch/world-shortest-route","coverRemote":""},
    {"id":"simplex-studio","title":"Simplex Studio","creator":"jbayham","handle":"csu-bayham-2831","kind":"3d","source":"community","blurb":"单纯形可视化工作室。","playUrl":"https://simplex-studio.csu-bayham-2831.chatgpt.site/","sourceUrl":"https://github.com/jbayham/simplex-studio","coverRemote":""},
    {"id":"hermes-lab","title":"Hermes Hibernation Lab","creator":"Max Gibson","handle":"maxgibson","kind":"3d","source":"community","blurb":"冬眠实验室三维场景。","playUrl":"https://hermes-hibernation-lab.maxgibson.chatgpt.site/","sourceUrl":"https://github.com/moshehbenavraham/hermes-lab","coverRemote":""},
]

SOURCE_LABEL = {
    "official": "官方",
    "astra-review": "评测",
    "community": "社区",
}


def fetch_status(url: str) -> tuple[str, int | None]:
    req = urllib.request.Request(url, headers=UA, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=18, context=CTX) as r:
            return url, r.status
    except urllib.error.HTTPError as e:
        return url, e.code
    except Exception:
        return url, None


def download(url: str, dest: Path) -> bool:
    if not url:
        return False
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=18, context=CTX) as r:
            data = r.read()
        if len(data) < 800:
            return False
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        return True
    except Exception:
        return False


def svg_cover(item: dict) -> str:
    tones = {
        "official": ("#1b1433", "#3ee6c3", "#7c5cff"),
        "astra-review": ("#1a1020", "#ff4d9a", "#7c5cff"),
        "community": ("#101820", "#3ee6c3", "#f4c15d"),
    }
    bg, a, b = tones[item["source"]]
    title = item["title"].replace("&", "&amp;")
    label = SOURCE_LABEL[item["source"]]
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{a}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="{b}" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="{bg}"/>
  <rect width="800" height="500" fill="url(#g)"/>
  <circle cx="640" cy="90" r="120" fill="{a}" fill-opacity="0.12"/>
  <circle cx="120" cy="420" r="160" fill="{b}" fill-opacity="0.16"/>
  <text x="48" y="80" fill="#9a96b5" font-size="22" font-family="ui-sans-serif,system-ui">{label}</text>
  <text x="48" y="280" fill="#f4f1ff" font-size="42" font-family="ui-sans-serif,system-ui" font-weight="700">{title}</text>
  <text x="48" y="430" fill="#9a96b5" font-size="20" font-family="ui-sans-serif,system-ui">@{item["handle"]}</text>
</svg>
'''


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main() -> None:
    COVER_DIR.mkdir(parents=True, exist_ok=True)
    seen = set()
    unique = []
    for item in ITEMS:
        url = item["playUrl"].rstrip("/") + ("/" if "?" not in item["playUrl"] else "")
        key = item["playUrl"]
        if key in EXISTING or key in seen:
            continue
        seen.add(key)
        unique.append(item)
    print("candidates", len(unique))

    statuses = {}
    with ThreadPoolExecutor(max_workers=16) as pool:
        futs = {pool.submit(fetch_status, it["playUrl"]): it["id"] for it in unique}
        for fut in as_completed(futs):
            url, status = fut.result()
            statuses[url] = status
            print(f"{status}\t{url}")

    live = []
    dead = []
    for it in unique:
        st = statuses.get(it["playUrl"])
        if st in {200, 301, 302, 307, 308}:
            live.append(it)
        else:
            dead.append((it["id"], it["playUrl"], st))

    print("live", len(live), "dead", len(dead))
    for row in dead:
        print("DEAD", row)

    kept = live[:100]
    print("kept", len(kept))

    for it in kept:
        local_webp = COVER_DIR / f"{it['id']}.webp"
        local_jpg = COVER_DIR / f"{it['id']}.jpg"
        local_svg = COVER_DIR / f"{it['id']}.svg"
        ok = False
        remotes = []
        if it.get("coverRemote"):
            remotes.append(it["coverRemote"])
            if "/cover.webp" in it["coverRemote"]:
                remotes.append(it["coverRemote"].replace("/cover.webp", "/cover-generated-sep4.webp"))
        for remote in remotes:
            ext = ".jpg" if remote.endswith(".jpg") else ".webp"
            dest = COVER_DIR / f"{it['id']}{ext}"
            if download(remote, dest):
                it["cover"] = f"/astra/{it['id']}{ext}"
                ok = True
                break
        if not ok:
            local_svg.write_text(svg_cover(it), encoding="utf-8")
            it["cover"] = f"/astra/{it['id']}.svg"
            it["coverRemote"] = it.get("coverRemote") or ""

    lines = [
        'import type { AstraWork } from "./astra-feed";',
        "",
        "export const ASTRA_FEED_EXTRA: AstraWork[] = [",
    ]
    for it in kept:
        lines.append("  {")
        for key in ("id", "title", "creator", "handle", "kind", "source", "blurb", "playUrl", "sourceUrl", "cover"):
            val = it[key]
            if key in {"kind", "source"}:
                lines.append(f"    {key}: \"{val}\",")
            else:
                lines.append(f"    {key}: \"{ts_escape(str(val))}\",")
        lines.append(f"    coverRemote: \"{ts_escape(it.get('coverRemote') or '')}\",")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    OUT_TS.write_text("\n".join(lines), encoding="utf-8")
    print("wrote", OUT_TS, "items", len(kept))
    Path("/tmp/astra-extra-report.json").write_text(
        json.dumps({"kept": [i["id"] for i in kept], "dead": dead, "count": len(kept)}, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
