import { useRef } from "react";
import {
  Search, Smartphone, ShoppingBag, KeyRound, FileText, LayoutGrid, Star, Megaphone, Gift,
} from "lucide-react";

// ภาพดีไซน์หน้าแรก (ขนาดต้นฉบับ 1672x941) ตัดแถบเมนูด้านบนออก 100px เพราะแอปมี header/sidebar อยู่แล้ว
const HERO = "/images/spu-home-hero.png";
const STAR = "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)";

// ค่า v ต้องตรงกับชื่อหมวดหมู่ที่ใช้กรองรายการในแอป
const CATS = [
  { v: "โทรศัพท์", Icon: Smartphone, color: "#2563eb" },
  { v: "กระเป๋า", Icon: ShoppingBag, color: "#ea7a1a" },
  { v: "กุญแจ", Icon: KeyRound, color: "#4f46e5" },
  { v: "เอกสาร", Icon: FileText, color: "#2563eb" },
  { v: "อื่นๆ", Icon: LayoutGrid, color: "#2563eb" },
];

// ตำแหน่งประกาย (% ของกรอบภาพ)
const SPARKS = [
  { x: 47.2, y: 10.7, s: 1.5, d: 0 }, { x: 77.8, y: 13.7, s: 1.2, d: 0.8 },
  { x: 83.3, y: 33.3, s: 1.6, d: 0.4 }, { x: 91.5, y: 23.8, s: 1.2, d: 1.3 },
  { x: 40.7, y: 13.7, s: 1.1, d: 1.7 }, { x: 53.8, y: 27, s: 1.0, d: 2.1 },
  { x: 31, y: 35.7, s: 1.3, d: 0.9 }, { x: 86.5, y: 79, s: 1.5, d: 0.2 },
  { x: 93.3, y: 70, s: 1.1, d: 1.1 },
];

const css = `
.hh{container-type:inline-size;margin-bottom:16px}
.hh *{box-sizing:border-box}
.hh-box{--u:calc(100cqw/1672);position:relative;overflow:hidden;aspect-ratio:1672/841;border-radius:28px;background:#cfe3ff;box-shadow:0 14px 36px rgba(80,90,200,.22)}
.hh-art{position:absolute;inset:0;background:url(${HERO}) 0 100%/100% auto no-repeat}
.hh button,.hh input{margin:0}

/* ช่องค้นหา (ของจริง ทับช่องที่ฝังในภาพ) */
.hh-search{position:absolute;left:40.55%;top:45.9%;width:45.2%;height:11.2%;display:flex;align-items:center;gap:calc(var(--u)*12);padding:0 calc(var(--u)*10);margin:0;background:#eef3ff;border-radius:999px;box-shadow:inset 0 0 0 2px rgba(255,255,255,.9),0 calc(var(--u)*8) calc(var(--u)*24) rgba(70,110,230,.25);animation:hh-rise .6s cubic-bezier(.2,.9,.3,1.2) .15s both}
.hh-input{flex:1;min-width:0;height:calc(var(--u)*72);display:flex;align-items:center;gap:calc(var(--u)*14);padding:0 calc(var(--u)*22);background:#fff;border-radius:999px;transition:box-shadow .2s}
.hh-input:focus-within{box-shadow:0 0 0 calc(var(--u)*5) rgba(124,108,248,.3)}
.hh-input svg{flex:none;width:max(16px,calc(var(--u)*34));height:max(16px,calc(var(--u)*34));color:#6b7bb8}
.hh-input input{flex:1;min-width:0;padding:0;border:none;outline:none;box-shadow:none;background:none;font:inherit;font-size:max(12px,calc(var(--u)*23));color:#1e2a5a}
.hh-input input::placeholder{color:#8b93b8}
.hh-go{position:relative;overflow:hidden;flex:none;display:flex;align-items:center;gap:calc(var(--u)*8);height:calc(var(--u)*72);padding:0 calc(var(--u)*34);border:none;border-radius:999px;color:#fff;font:inherit;font-size:max(12px,calc(var(--u)*26));font-weight:700;cursor:pointer;background:linear-gradient(90deg,#2563eb,#ec4899);box-shadow:0 6px 18px rgba(99,102,241,.4);transition:transform .15s,filter .15s;animation:hh-glow 2.8s ease-in-out 1s infinite}
.hh-go svg{width:max(14px,calc(var(--u)*30));height:max(14px,calc(var(--u)*30))}
.hh-go::after{content:"";position:absolute;top:0;bottom:0;left:0;width:30%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.6),transparent);transform:translateX(-130%) skewX(-12deg);animation:hh-sheen 3.6s ease-in-out 1.5s infinite}
.hh-go:hover{filter:brightness(1.08);transform:translateY(-2px)}
.hh-go:active{transform:scale(.96)}

/* หมวดหมู่ยอดนิยม (ของจริง ทับแผงที่ฝังในภาพ) */
.hh-cats{position:absolute;left:40.7%;top:58.1%;width:43.9%;height:20.8%;display:flex;flex-direction:column;gap:calc(var(--u)*10);padding:calc(var(--u)*14) calc(var(--u)*22) calc(var(--u)*20);background:#eef3ff;border-radius:calc(var(--u)*34);box-shadow:inset 0 0 0 2px rgba(255,255,255,.9),0 calc(var(--u)*8) calc(var(--u)*24) rgba(70,110,230,.18);animation:hh-rise .6s cubic-bezier(.2,.9,.3,1.2) .3s both}
.hh-cats-title{display:flex;align-items:center;gap:calc(var(--u)*10);font-size:max(12px,calc(var(--u)*26));font-weight:700;color:#1e3a8a}
.hh-cats-title svg{width:max(14px,calc(var(--u)*30));height:max(14px,calc(var(--u)*30));color:#2563eb;fill:#2563eb}
.hh-tiles{flex:1;min-height:0;display:grid;grid-template-columns:repeat(5,1fr);gap:calc(var(--u)*12)}
.hh-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--u)*6);padding:0;border:none;border-radius:calc(var(--u)*24);background:#fff;color:#1e2a5a;font:inherit;font-size:max(11px,calc(var(--u)*24));font-weight:600;cursor:pointer;box-shadow:0 4px 12px rgba(80,100,200,.15);transition:transform .18s,box-shadow .18s,background .18s,color .18s;animation:hh-pop .5s cubic-bezier(.2,.9,.3,1.3) calc(.45s + var(--i)*.07s) both}
.hh-tile svg{width:max(16px,calc(var(--u)*46));height:max(16px,calc(var(--u)*46));color:var(--ic);transition:transform .2s}
.hh-tile:hover{transform:translateY(-4px);box-shadow:0 10px 20px rgba(80,100,200,.28)}
.hh-tile:hover svg{transform:scale(1.12) rotate(-6deg)}
.hh-tile.on{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff}
.hh-tile.on svg{color:#fff}

/* ประกาย + แสงวาบ */
.hh-spk{position:absolute;width:calc(var(--s)*1cqw);aspect-ratio:1;pointer-events:none;filter:drop-shadow(0 0 5px rgba(255,255,255,.95)) drop-shadow(0 0 10px rgba(180,200,255,.8));animation:hh-twinkle 3s ease-in-out infinite}
.hh-spk i{display:block;width:100%;height:100%;background:#fff;clip-path:${STAR}}
.hh-sheen{position:absolute;left:47%;top:7%;width:33%;height:31%;overflow:hidden;pointer-events:none;mix-blend-mode:overlay;-webkit-mask-image:radial-gradient(ellipse at center,#000 45%,transparent 75%);mask-image:radial-gradient(ellipse at center,#000 45%,transparent 75%)}
.hh-sheen::before{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:35%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.95),transparent);transform:translateX(-120%) skewX(-12deg);animation:hh-sheen 5s ease-in-out 1.5s infinite}

.hh-cta{display:none;gap:10px}
.hh-cta button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0;border:none;border-radius:999px;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.hh-cta .a{color:#fff;background:linear-gradient(90deg,#8b5cf6,#ec4899);box-shadow:0 8px 18px rgba(168,85,247,.3)}
.hh-cta .b{color:#4f46e5;background:#fff;box-shadow:inset 0 0 0 1.5px #c7c2f7}
.hh-cta svg{width:20px;height:20px}

@keyframes hh-rise{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
@keyframes hh-pop{from{opacity:0;transform:translateY(10px) scale(.85)}to{opacity:1;transform:none}}
@keyframes hh-glow{0%,100%{box-shadow:0 6px 18px rgba(99,102,241,.4)}50%{box-shadow:0 8px 28px rgba(236,72,153,.6)}}
@keyframes hh-sheen{0%{transform:translateX(-130%) skewX(-12deg)}45%,100%{transform:translateX(430%) skewX(-12deg)}}
@keyframes hh-twinkle{0%,100%{transform:translate(-50%,-50%) scale(.2) rotate(0);opacity:0}50%{transform:translate(-50%,-50%) scale(1) rotate(60deg);opacity:1}}

/* กรอบแคบ / มือถือ: แบนเนอร์จากภาพจริง + ช่องค้นหา + หมวดหมู่ + ปุ่มแจ้ง */
@container (max-width:719px){
  .hh-box{--u:.667px;aspect-ratio:auto;overflow:visible;background:none;box-shadow:none;border-radius:0;display:flex;flex-direction:column;gap:12px}
  .hh-art{position:relative;inset:auto;overflow:hidden;width:100%;aspect-ratio:2/1;border-radius:22px;background-size:261% auto;background-position:75.6% 24.2%;box-shadow:0 10px 28px rgba(60,80,180,.25)}
  .hh-art::after{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:30%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.8),transparent);mix-blend-mode:overlay;transform:translateX(-120%) skewX(-12deg);animation:hh-sheen 5s ease-in-out 1s infinite}
  .hh-sheen,.hh-spk{display:none}
  .hh-search,.hh-cats{position:static;width:auto;height:auto}
  .hh-search{padding:6px 8px}
  .hh-input,.hh-go{height:48px}
  .hh-input input{font-size:16px}
  .hh-go{font-size:16px;padding:0 20px}
  .hh-cats{padding:12px 14px 14px;border-radius:22px;gap:10px}
  .hh-cats-title{font-size:15px}
  .hh-tile{padding:10px 0;gap:6px}
  .hh-cta{display:flex}
}
@media (prefers-reduced-motion:reduce){
  .hh *,.hh *::before,.hh *::after{animation:none!important;transition:none!important}
}
`;

export default function HomeHero({ keyword = "", onKeyword, category = "ทั้งหมด", onCategory, onReport }) {
  const ref = useRef(null);

  const toList = () => {
    ref.current?.nextElementSibling?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const submit = (e) => {
    e.preventDefault();
    document.activeElement?.blur?.();
    toList();
  };
  const pick = (v) => {
    onCategory(category === v ? "ทั้งหมด" : v);
    toList();
  };

  return (
    <div className="hh" ref={ref}>
      <style>{css}</style>
      <div className="hh-box">
        <div className="hh-art" role="img" aria-label="เว็บไซต์แจ้งของหาย UniRetrieve มหาวิทยาลัยศรีปทุม" />
        <div className="hh-sheen" aria-hidden="true" />
        {SPARKS.map((p, i) => (
          <span key={i} className="hh-spk" aria-hidden="true"
            style={{ left: p.x + "%", top: p.y + "%", "--s": p.s, animationDelay: p.d + "s", animationDuration: 2.6 + (i % 4) * 0.4 + "s" }}>
            <i />
          </span>
        ))}

        <form className="hh-search" onSubmit={submit} role="search">
          <label className="hh-input">
            <Search />
            <input
              type="search"
              value={keyword}
              onChange={(e) => onKeyword(e.target.value)}
              placeholder="ค้นหาของที่หาย เช่น โทรศัพท์ กระเป๋า..."
              aria-label="ค้นหาของที่หาย"
            />
          </label>
          <button type="submit" className="hh-go">ค้นหา <Search /></button>
        </form>

        <div className="hh-cats">
          <div className="hh-cats-title"><Star /> หมวดหมู่ยอดนิยม</div>
          <div className="hh-tiles">
            {CATS.map(({ v, Icon, color }, i) => (
              <button key={v} type="button" className={"hh-tile" + (category === v ? " on" : "")}
                style={{ "--ic": color, "--i": i }} onClick={() => pick(v)} aria-pressed={category === v}>
                <Icon /> {v}
              </button>
            ))}
          </div>
        </div>

        <div className="hh-cta">
          <button type="button" className="a" onClick={() => onReport && onReport("lost")}><Megaphone /> แจ้งของหาย</button>
          <button type="button" className="b" onClick={() => onReport && onReport("found")}><Gift /> แจ้งของเจอ</button>
        </div>
      </div>
    </div>
  );
}