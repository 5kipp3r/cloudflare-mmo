import { DurableObject } from "cloudflare:workers";

interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  GAME_ROOM: DurableObjectNamespace<GameRoom>;
}

const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{
  status:s,headers:{"content-type":"application/json; charset=utf-8"}
});
function cookie(n:string,v:string,a:number){
  return `${n}=${encodeURIComponent(v)}; Max-Age=${a}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}
function getCookie(r:Request,n:string){
  const x=r.headers.get("Cookie")||"";
  const y=x.split(";").map(v=>v.trim()).find(v=>v.startsWith(n+"="));
  return y?decodeURIComponent(y.slice(n.length+1)):null;
}
const uid=()=>crypto.randomUUID();
function b64(b:Uint8Array){let s="";for(const x of b)s+=String.fromCharCode(x);return btoa(s)}
function unb64(s:string){const x=atob(s);return Uint8Array.from(x,c=>c.charCodeAt(0))}
async function derive(p:string,s:Uint8Array){
  const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(p),"PBKDF2",false,["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits(
    {name:"PBKDF2",salt:s,iterations:100000,hash:"SHA-256"},k,256
  ));
}
async function hash(p:string){
  const s=crypto.getRandomValues(new Uint8Array(16));
  return `${b64(s)}.${b64(await derive(p,s))}`;
}
async function verify(p:string,v:string){
  const [a,b]=v.split(".");
  if(!a||!b)return false;
  const x=unb64(b),y=await derive(p,unb64(a));
  if(x.length!==y.length)return false;
  let d=0;for(let i=0;i<x.length;i++)d|=x[i]^y[i];
  return d===0;
}
async function user(r:Request,e:Env){
  const t=getCookie(r,"mmo_session");if(!t)return null;
  const z=await e.DB.prepare(`
    SELECT a.id account_id,a.username,c.id character_id,c.name character_name,
           c.level,c.exp,c.gold,c.map,c.sprite
    FROM sessions s
    JOIN accounts a ON a.id=s.account_id
    JOIN characters c ON c.account_id=a.id
    WHERE s.token=? AND s.expires_at>?
  `).bind(t,Date.now()).first<any>();
  return z?{
    accountId:z.account_id,username:z.username,
    character:{
      id:z.character_id,name:String(z.character_name||"Player").slice(0,8),
      level:z.level,exp:z.exp,gold:z.gold,map:z.map,sprite:String(z.sprite||"murid01")
    }
  }:null;
}
async function session(e:Env,accountId:string,username:string,c:any){
  const t=b64(crypto.getRandomValues(new Uint8Array(32))),now=Date.now();
  await e.DB.prepare(
    "INSERT INTO sessions(token,account_id,expires_at,created_at) VALUES(?,?,?,?)"
  ).bind(t,accountId,now+2592000000,now).run();
  const r=json({ok:true,user:{
    username,character:{
      id:c.id,name:String(c.name||"Player").slice(0,8),
      level:c.level,exp:c.exp,gold:c.gold,map:c.map,sprite:String(c.sprite||"murid01")
    }
  }});
  r.headers.append("Set-Cookie",cookie("mmo_session",t,2592000));
  return r;
}
async function register(r:Request,e:Env){
  const b=await r.json<any>();
  const u=String(b.username||"").trim().toLowerCase();
  const p=String(b.password||"");
  const n=String(b.characterName||"").trim();
  const sprite=String(b.sprite||"murid01").trim();
  const allowedSprites=Array.from({length:20},(_,i)=>`murid${String(i+1).padStart(2,"0")}`);

  if(!/^[a-z0-9_]{3,20}$/.test(u))
    return json({error:"Username 3-20 karakter: a-z, 0-9, _."},400);
  if(p.length<8||p.length>128)
    return json({error:"Password harus 8-128 karakter."},400);
  if(!/^[A-Za-z0-9_ ]{3,8}$/.test(n))
    return json({error:"Nickname harus 3-8 karakter: huruf, angka, spasi, _."},400);
  if(!allowedSprites.includes(sprite)) return json({error:"Pilihan karakter tidak valid."},400);

  if(await e.DB.prepare("SELECT id FROM accounts WHERE username=?").bind(u).first())
    return json({error:"Username sudah digunakan."},409);
  if(await e.DB.prepare("SELECT id FROM characters WHERE name=?").bind(n).first())
    return json({error:"Nama karakter sudah digunakan."},409);

  const aid=uid(),cid=uid(),now=Date.now();
  try{
    await e.DB.batch([
      e.DB.prepare(
        "INSERT INTO accounts(id,username,password_hash,created_at) VALUES(?,?,?,?)"
      ).bind(aid,u,await hash(p),now),
      e.DB.prepare(
        "INSERT INTO characters(id,account_id,name,sprite,created_at) VALUES(?,?,?,?,?)"
      ).bind(cid,aid,n,sprite,now)
    ]);
  }catch{
    return json({error:"Gagal membuat akun."},409);
  }
  return session(e,aid,u,{id:cid,name:n,level:1,exp:0,gold:100,map:"village",sprite});
}
async function login(r:Request,e:Env){
  const b=await r.json<any>();
  const u=String(b.username||"").trim().toLowerCase(),p=String(b.password||"");
  const a=await e.DB.prepare(
    "SELECT id,username,password_hash FROM accounts WHERE username=?"
  ).bind(u).first<any>();
  if(!a||!(await verify(p,a.password_hash)))
    return json({error:"Username atau password salah."},401);
  const c=await e.DB.prepare(
    "SELECT id,name,level,exp,gold,map,sprite FROM characters WHERE account_id=?"
  ).bind(a.id).first<any>();
  return session(e,a.id,a.username,c);
}

const MAP_BUILDINGS = [
  {x:255,y:155,w:250,h:180},
  {x:645,y:110,w:690,h:255},
  {x:1445,y:160,w:310,h:220},
  {x:1455,y:490,w:310,h:190},
  {x:295,y:435,w:310,h:190}
];
const MAP_TREES = [
  [150,190],[180,400],[130,690],[780,600],[890,610],[1200,620],[1370,800],
  [1780,780],[1830,350],[600,900],[850,1020],[1150,1000],[380,1020],[1740,1040],[530,370],[1360,380]
];
function blockedOnServer(x:number,y:number){
  if(x<12||y<12||x>1988||y>1188)return true;
  for(const o of MAP_BUILDINGS){
    const nx=Math.max(o.x-5,Math.min(x,o.x+o.w+5));
    const ny=Math.max(o.y-5,Math.min(y,o.y+o.h+5));
    if((x-nx)**2+(y-ny)**2<12**2)return true;
  }
  for(const [tx,ty] of MAP_TREES){
    const nx=Math.max(tx-17,Math.min(x,tx+17));
    const ny=Math.max(ty-13,Math.min(y,ty+17));
    if((x-nx)**2+(y-ny)**2<12**2)return true;
  }
  return false;
}

export class GameRoom extends DurableObject<Env>{
  positions=new Map<string,{x:number,y:number,name:string,sprite:string,direction:string,frame:number}>();
  lastMove=new Map<string,number>();

  constructor(ctx:DurableObjectState,env:Env){
    super(ctx,env);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair("ping","pong"));
  }

  async fetch(r:Request){
    if(r.headers.get("Upgrade")!=="websocket")
      return new Response("GameRoom OK");

    const id=r.headers.get("x-player-id");
    const name=String(r.headers.get("x-player-name")||"Player").slice(0,8);
    const sprite=String(r.headers.get("x-player-sprite")||"murid01");
    if(!id||!name)return new Response("Unauthorized",{status:401});
    if(!/^murid(?:0[1-9]|1[0-9]|20)$/.test(sprite))return new Response("Invalid sprite",{status:400});

    const pair=new WebSocketPair(),server=pair[1];
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({id,name,sprite});

    let spawnX=940+Math.floor(Math.random()*120),spawnY=430+Math.floor(Math.random()*55);
    if(blockedOnServer(spawnX,spawnY)){spawnX=1000;spawnY=455;}
    const p={x:spawnX,y:spawnY,name,sprite,direction:"down",frame:1};
    this.positions.set(id,p);
    this.lastMove.set(id,Date.now());

    server.send(JSON.stringify({
      type:"welcome",
      playerId:id,
      self:{id,...p},
      players:[...this.positions].map(([i,v])=>({id:i,...v}))
    }));
    this.broadcast(JSON.stringify({type:"join",id,...p}),[server]);
    return new Response(null,{status:101,webSocket:pair[0]});
  }

  webSocketMessage(ws:WebSocket,msg:string|ArrayBuffer){
    const a=ws.deserializeAttachment() as {id:string,name:string,sprite:string}|null;
    if(!a||typeof msg!=="string")return;

    let d:any;try{d=JSON.parse(msg)}catch{return}

    if(d?.type==="move"){
      const x=Number(d.x),y=Number(d.y),old=this.positions.get(a.id);
      if(!old||!Number.isFinite(x)||!Number.isFinite(y))return;
      const now=Date.now(),last=this.lastMove.get(a.id)||now;
      // Allow normal joystick movement with a little packet jitter tolerance, but reject teleporting.
      const maxDistance=Math.max(38,Math.min(420,(now-last)*0.36+18));
      const dx=x-old.x,dy=y-old.y,dist=Math.hypot(dx,dy);
      if(dist>maxDistance)return;
      let nx=Math.max(12,Math.min(1988,Math.round(x)));
      let ny=Math.max(12,Math.min(1188,Math.round(y)));
      if(blockedOnServer(nx,ny)){nx=old.x;ny=old.y;}
      const direction=["down","left","right","up"].includes(String(d.direction))?String(d.direction):old.direction;
      const frame=[1,2,3].includes(Number(d.frame))?Number(d.frame):1;
      const p={x:nx,y:ny,name:old.name,sprite:old.sprite||"murid01",direction,frame};
      this.positions.set(a.id,p);this.lastMove.set(a.id,now);
      this.broadcast(JSON.stringify({type:"move",id:a.id,x:p.x,y:p.y,name:p.name,direction:p.direction,frame:p.frame}),[ws]);
      return;
    }

    if(d?.type==="chat"){
      const message=String(d.message||"").trim().slice(0,120);
      if(!message)return;
      this.broadcast(JSON.stringify({
        type:"chat",id:a.id,name:a.name,message
      }));
    }
  }

  webSocketClose(ws:WebSocket){this.leave(ws)}
  webSocketError(ws:WebSocket){this.leave(ws)}

  leave(ws:WebSocket){
    const a=ws.deserializeAttachment() as {id:string}|null;
    if(!a)return;
    this.positions.delete(a.id);this.lastMove.delete(a.id);
    this.broadcast(JSON.stringify({type:"leave",id:a.id}),[ws]);
  }

  broadcast(m:string,ex:WebSocket[]=[]){
    const s=new Set(ex);
    for(const w of this.ctx.getWebSockets())
      if(!s.has(w))try{w.send(m)}catch{}
  }
}

export default {
  async fetch(r:Request,e:Env){
    const u=new URL(r.url);
    if(u.pathname==="/api/register"&&r.method==="POST")return register(r,e);
    if(u.pathname==="/api/login"&&r.method==="POST")return login(r,e);
    if(u.pathname==="/api/me"&&r.method==="GET"){
      const a=await user(r,e);
      return json({authenticated:!!a,user:a});
    }
    if(u.pathname==="/api/logout"&&r.method==="POST"){
      const t=getCookie(r,"mmo_session");
      if(t)await e.DB.prepare("DELETE FROM sessions WHERE token=?").bind(t).run();
      const x=json({ok:true});
      x.headers.append("Set-Cookie",cookie("mmo_session","",0));
      return x;
    }
    if(u.pathname==="/ws"){
      const a=await user(r,e);
      if(!a)return json({error:"Login diperlukan."},401);
      const room=e.GAME_ROOM.get(e.GAME_ROOM.idFromName("map:village"));
      const h=new Headers(r.headers);
      h.set("x-player-id",a.character.id);
      h.set("x-player-name",String(a.character.name).slice(0,8));
      h.set("x-player-sprite",String(a.character.sprite||"murid01"));
      return room.fetch(new Request(r,{headers:h}));
    }
    return e.ASSETS.fetch(r);
  }
};
