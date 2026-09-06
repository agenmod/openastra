import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function snakeHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
html,body{margin:0;height:100%;background:#07070c;color:#f4f1ff;font-family:system-ui,sans-serif;overflow:hidden}
canvas{display:block;margin:auto;background:#0c0c14}
#ui{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
h1{margin:0 0 8px;font-size:36px;letter-spacing:.12em}
p{opacity:.7}.score{position:fixed;top:16px;left:20px;font-size:20px}
</style></head><body>
<div class="score" id="score">0</div>
<div id="ui"><h1>NEON SNAKE</h1><p>方向键 / 滑动 · 点击开始</p></div>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),x=c.getContext('2d'),ui=document.getElementById('ui'),scoreEl=document.getElementById('score');
let W,H,cell,snake,dir,next,food,score,run=false,acc=0;
function resize(){W=innerWidth;H=innerHeight;c.width=W;c.height=H;cell=Math.floor(Math.min(W,H)/24)}
addEventListener('resize',resize);resize();
function reset(){snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];dir={x:1,y:0};next=dir;place();score=0;scoreEl.textContent=score}
function place(){food={x:2+Math.floor(Math.random()*18),y:2+Math.floor(Math.random()*18)}}
function start(){if(run)return;run=true;ui.style.display='none';reset();last=performance.now();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};if(m[e.key]&&(m[e.key][0]!==-dir.x||m[e.key][1]!==-dir.y))next={x:m[e.key][0],y:m[e.key][1]};if(!run)start()});
let sx,sy;addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;if(!run)start()});
addEventListener('pointerup',e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)<20)return;next=Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)};if(next.x===-dir.x&&next.y===-dir.y)next=dir});
let last=0;
function loop(t){if(!run)return;acc+=t-last;last=t;if(acc>110){acc=0;step()}draw();requestAnimationFrame(loop)}
function step(){dir=next;const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};if(h.x<0||h.y<0||h.x>21||h.y>21||snake.some(s=>s.x===h.x&&s.y===h.y)){run=false;ui.style.display='flex';ui.innerHTML='<h1>GAME OVER</h1><p>点击重新开始</p>';return}snake.unshift(h);if(h.x===food.x&&h.y===food.y){score+=10;scoreEl.textContent=score;place()}else snake.pop()}
function draw(){x.fillStyle='#07070c';x.fillRect(0,0,W,H);const ox=(W-22*cell)/2,oy=(H-22*cell)/2;x.strokeStyle='#1b1b2c';for(let i=0;i<=22;i++){x.beginPath();x.moveTo(ox+i*cell,oy);x.lineTo(ox+i*cell,oy+22*cell);x.stroke();x.beginPath();x.moveTo(ox,oy+i*cell);x.lineTo(ox+22*cell,oy+i*cell);x.stroke()}snake.forEach((s,i)=>{x.fillStyle=i? '#7c5cff':'#ff4d9a';x.fillRect(ox+s.x*cell+1,oy+s.y*cell+1,cell-2,cell-2)});x.fillStyle='#3ee6c3';x.beginPath();x.arc(ox+food.x*cell+cell/2,oy+food.y*cell+cell/2,cell*0.32,0,7);x.fill()}
</script></body></html>`;
}

function shooterHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
html,body{margin:0;height:100%;background:#05060a;overflow:hidden;color:#e8f6ff;font-family:system-ui}
canvas{display:block}#hud{position:fixed;top:14px;left:18px;font-size:18px}
#cover{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,6,10,.55)}
h1{letter-spacing:.2em;font-size:40px;margin:0 0 10px}
</style></head><body>
<div id="hud">SCORE 0</div>
<div id="cover"><h1>VOID SHOTS</h1><p>拖动或方向键移动 · 自动开火</p></div>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),g=c.getContext('2d'),hud=document.getElementById('hud'),cover=document.getElementById('cover');
let W,H,ship,shots,rocks,stars,score,alive,heat;
function fit(){W=c.width=innerWidth;H=c.height=innerHeight}
addEventListener('resize',fit);fit();
function boot(){ship={x:W/2,y:H*0.78,vx:0};shots=[];rocks=[];stars=Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H,z:Math.random()*2+0.3}));score=0;alive=true;heat=0;cover.style.display='none'}
let keys={};addEventListener('keydown',e=>{keys[e.key]=true;if(!alive)boot()});addEventListener('keyup',e=>keys[e.key]=false);
addEventListener('pointermove',e=>{if(alive)ship.x=e.clientX});addEventListener('pointerdown',()=>{if(!alive)boot()});
let last=performance.now(),spawn=0;
function loop(t){const dt=Math.min(32,t-last);last=t;g.fillStyle='#05060a';g.fillRect(0,0,W,H);
stars.forEach(s=>{s.y+=s.z*0.6;if(s.y>H)s.y=0;g.fillStyle='rgba(255,255,255,'+(0.2+s.z*0.3)+')';g.fillRect(s.x,s.y,s.z,s.z)});
if(alive){if(keys.ArrowLeft||keys.a)ship.x-=0.5*dt;if(keys.ArrowRight||keys.d)ship.x+=0.5*dt;ship.x=Math.max(24,Math.min(W-24,ship.x));heat=Math.max(0,heat-dt*0.02);if(heat<8){shots.push({x:ship.x,y:ship.y-18,v:0.9});heat+=3}
g.fillStyle='#3ee6c3';g.beginPath();g.moveTo(ship.x,ship.y-16);g.lineTo(ship.x-14,ship.y+12);g.lineTo(ship.x+14,ship.y+12);g.closePath();g.fill();
spawn+=dt;if(spawn>480){spawn=0;rocks.push({x:40+Math.random()*(W-80),y:-20,r:12+Math.random()*18,v:0.12+Math.random()*0.18})}
shots.forEach(s=>s.y-=s.v*dt);shots=shots.filter(s=>s.y>-10);shots.forEach(s=>{g.fillStyle='#ff4d9a';g.fillRect(s.x-2,s.y,4,10)});
rocks.forEach(r=>{r.y+=r.v*dt;g.fillStyle='#7c5cff';g.beginPath();g.arc(r.x,r.y,r.r,0,7);g.fill();
if(Math.hypot(r.x-ship.x,r.y-ship.y)<r.r+10){alive=false;cover.style.display='flex';cover.innerHTML='<h1>WRECKED</h1><p>点击再来一局</p>'}
shots.forEach(s=>{if(Math.hypot(s.x-r.x,s.y-r.y)<r.r){r.r=-1;s.y=-99;score+=20;hud.textContent='SCORE '+score}})});
rocks=rocks.filter(r=>r.r>0&&r.y<H+40)}
requestAnimationFrame(loop)}
requestAnimationFrame(loop);
</script></body></html>`;
}

function jumpHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
html,body{margin:0;height:100%;background:#12071a;overflow:hidden;color:#ffe8f4;font-family:system-ui}
#hud{position:fixed;top:16px;right:20px;font-size:22px}
#cover{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
h1{font-size:42px;margin:0 0 8px;letter-spacing:.08em}
</style></head><body>
<div id="hud">0</div>
<div id="cover"><h1>PULSE JUMP</h1><p>点击 / 空格跳跃</p></div>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),g=c.getContext('2d'),hud=document.getElementById('hud'),cover=document.getElementById('cover');
let W,H,p,obs,t,alive,grav;
function fit(){W=c.width=innerWidth;H=c.height=innerHeight}addEventListener('resize',fit);fit();
function start(){p={x:W*0.28,y:H*0.62,vy:0,on:true};obs=[];t=0;alive=true;grav=0.0016;cover.style.display='none'}
function jump(){if(!alive){start();return}if(p.on){p.vy=-0.72;p.on=false}}
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();jump()}});
addEventListener('pointerdown',jump);
let last=performance.now(),spawn=0;
function loop(now){const dt=Math.min(32,now-last);last=now;g.fillStyle='#12071a';g.fillRect(0,0,W,H);
const ground=H*0.7;g.fillStyle='#2a1038';g.fillRect(0,ground,W,H-ground);
if(alive){p.vy+=grav*dt;p.y+=p.vy*dt;if(p.y>ground-28){p.y=ground-28;p.vy=0;p.on=true}
t+=dt;hud.textContent=Math.floor(t/10);spawn+=dt;if(spawn>900){spawn=0;obs.push({x:W+20,w:24+Math.random()*18,h:30+Math.random()*50})}
obs.forEach(o=>o.x-=0.42*dt);obs=obs.filter(o=>o.x>-80);
obs.forEach(o=>{g.fillStyle='#ff4d9a';g.fillRect(o.x,ground-o.h,o.w,o.h);if(p.x+18>o.x&&p.x<o.x+o.w&&p.y+28>ground-o.h){alive=false;cover.style.display='flex';cover.innerHTML='<h1>DOWN</h1><p>点击重开</p>'}})}
g.fillStyle='#3ee6c3';g.fillRect(p?p.x:W*0.28,p?p.y:ground-28,22,28);
requestAnimationFrame(loop)}
requestAnimationFrame(loop);
</script></body></html>`;
}

function brickHtml() {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
html,body{margin:0;height:100%;background:#081018;overflow:hidden;color:#e7fff8;font-family:system-ui}
#hud{position:fixed;top:14px;left:18px;font-size:18px}
#cover{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
h1{letter-spacing:.18em;font-size:38px}
</style></head><body>
<div id="hud">0</div>
<div id="cover"><h1>BRICK NOVA</h1><p>拖动挡板 · 点击开球</p></div>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),g=c.getContext('2d'),hud=document.getElementById('hud'),cover=document.getElementById('cover');
let W,H,pad,ball,bricks,score,live;
function fit(){W=c.width=innerWidth;H=c.height=innerHeight}addEventListener('resize',fit);fit();
function make(){pad={x:W/2,y:H-40,w:110};ball={x:W/2,y:H-60,vx:0.28,vy:-0.32,r:8};bricks=[];score=0;live=true;const cols=8,rows=5;for(let r=0;r<rows;r++)for(let i=0;i<cols;i++)bricks.push({x:40+i*((W-80)/cols),y:70+r*32,w:(W-80)/cols-8,h:22,hp:rows-r});cover.style.display='none'}
addEventListener('pointermove',e=>{if(pad)pad.x=e.clientX});addEventListener('pointerdown',()=>{if(!live)make();else if(cover.style.display!=='none')make()});
addEventListener('keydown',e=>{if(!pad)return;if(e.key==='ArrowLeft')pad.x-=24;if(e.key==='ArrowRight')pad.x+=24});
let last=performance.now();
function loop(t){const dt=Math.min(32,t-last);last=t;g.fillStyle='#081018';g.fillRect(0,0,W,H);
if(!pad){requestAnimationFrame(loop);return}
pad.x=Math.max(pad.w/2,Math.min(W-pad.w/2,pad.x));
if(live){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<8||ball.x>W-8)ball.vx*=-1;if(ball.y<8)ball.vy*=-1;
if(ball.y>pad.y-8&&ball.x>pad.x-pad.w/2&&ball.x<pad.x+pad.w/2&&ball.vy>0){ball.vy*=-1;ball.vx+=(ball.x-pad.x)*0.004}
if(ball.y>H){live=false;cover.style.display='flex';cover.innerHTML='<h1>DROPPED</h1><p>点击重开</p>'}
bricks.forEach(b=>{if(b.hp<=0)return;if(ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){b.hp--;ball.vy*=-1;score+=15;hud.textContent=score}})}
g.fillStyle='#3ee6c3';g.fillRect(pad.x-pad.w/2,pad.y,pad.w,10);
g.fillStyle='#fff';g.beginPath();g.arc(ball.x,ball.y,8,0,7);g.fill();
bricks.forEach(b=>{if(b.hp<=0)return;g.fillStyle=b.hp>3?'#7c5cff':b.hp>1?'#ff4d9a':'#ffd166';g.fillRect(b.x,b.y,b.w,b.h)});
requestAnimationFrame(loop)}
make();cover.style.display='flex';requestAnimationFrame(loop);
</script></body></html>`;
}

const DEMOS = [
  {
    slug: "neon-snake",
    title: "Neon Snake",
    prompt: "霓虹贪吃蛇，网格发光，吃到青绿色食物变长",
    html: snakeHtml(),
    playCount: 12840,
    likeCount: 932,
  },
  {
    slug: "void-shots",
    title: "Void Shots",
    prompt: "竖版太空射击，自动开火，躲开陨石",
    html: shooterHtml(),
    playCount: 9021,
    likeCount: 744,
  },
  {
    slug: "pulse-jump",
    title: "Pulse Jump",
    prompt: "一键跳跃的节奏跑酷，障碍越来越密",
    html: jumpHtml(),
    playCount: 6540,
    likeCount: 501,
  },
  {
    slug: "brick-nova",
    title: "Brick Nova",
    prompt: "霓虹打砖块，挡板接球，砖块分层掉血",
    html: brickHtml(),
    playCount: 3880,
    likeCount: 290,
  },
];

let seeded = false;

export async function ensureDemoData() {
  if (seeded) return;

  const user = await prisma.user.upsert({
    where: { username: "orbit" },
    update: {
      displayName: "openAstra",
      email: "orbit@openastra.cc",
    },
    create: {
      email: "orbit@openastra.cc",
      username: "orbit",
      displayName: "openAstra",
      passwordHash: await hashPassword("demo1234"),
    },
  });

  for (const game of DEMOS) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: {
        ...game,
        authorId: user.id,
        published: true,
        conversation: JSON.stringify([
          { role: "user", content: game.prompt },
          { role: "assistant", content: `已生成 ${game.title}` },
        ]),
      },
    });
  }

  seeded = true;
}
