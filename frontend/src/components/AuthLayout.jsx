import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

// ภาพ Artwork จริง (ขนาดต้นฉบับ 1821x864)
const ART = "/images/spu-lost-found.png";
const ART_W = 1821;
const ART_H = 864;

// ตำแหน่งการ์ดที่ฝังอยู่ในภาพ (หน่วย % ของภาพ) เผื่อขอบเล็กน้อยให้ปิดสนิท
// ถ้าเปลี่ยนภาพ ให้ปรับ 4 ค่านี้ที่เดียว
const CARD = { left: 35.5, top: 29.5, width: 29, minHeight: 55.3 };

// เรียกฟังก์ชันนี้ตอนสมัครสำเร็จเพื่อให้มีดาวฉลอง
export const celebrate = () => window.dispatchEvent(new Event("auth-celebrate"));

// ตำแหน่งประกาย (% ของภาพ) หลีกเลี่ยงบริเวณการ์ดฟอร์ม
const SPARKLES = [
  { x: 13, y: 19, s: 1.5, d: 0, t: 2.6 }, { x: 25, y: 12, s: 1.1, d: 0.8, t: 3.1 },
  { x: 57, y: 6, s: 1.3, d: 0.3, t: 2.8 }, { x: 67, y: 15, s: 1.0, d: 1.4, t: 3.4 },
  { x: 75, y: 33, s: 1.4, d: 0.6, t: 2.7 }, { x: 84, y: 22, s: 1.6, d: 1.1, t: 3.0 },
  { x: 10, y: 52, s: 1.2, d: 1.7, t: 3.2 }, { x: 30, y: 66, s: 1.5, d: 0.4, t: 2.9 },
  { x: 68, y: 58, s: 1.1, d: 1.2, t: 3.3 }, { x: 73, y: 76, s: 1.4, d: 0.9, t: 2.6 },
  { x: 90, y: 62, s: 1.2, d: 1.9, t: 3.1 }, { x: 20, y: 84, s: 1.3, d: 0.2, t: 3.5 },
  { x: 6, y: 30, s: 1.0, d: 1.5, t: 2.8 }, { x: 48, y: 24, s: 0.9, d: 2.1, t: 3.2 },
];

const COLORS = ["#ffffff", "#ffd166", "#ff8fc2", "#8ab4ff", "#b79cff"];
const STAR = "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)";

const css = `
@import url("https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap");
.auth-root{position:fixed;inset:0;z-index:50;overflow-x:hidden;overflow-y:auto;background:#dbe9ff;color:#1e2a5a;text-align:left;font-family:"Prompt","Noto Sans Thai",system-ui,sans-serif}
.auth-root *{box-sizing:border-box}
.auth-bg{position:fixed;inset:-40px;z-index:0;background:url(${ART}) center/cover no-repeat;filter:blur(22px)}
.auth-veil{position:fixed;inset:0;z-index:0;background:rgba(255,255,255,.4)}
.auth-page{position:relative;z-index:1;min-height:100%;display:flex;align-items:center;justify-content:center}

/* ---------- Mobile / แคบ (ค่าเริ่มต้น) ---------- */
.auth-stage{width:100%;max-width:560px;padding:14px 14px 26px;display:flex;flex-direction:column;align-items:center}
.auth-art,.auth-sparkles,.auth-sheen{display:none}
.auth-banner{position:relative;overflow:hidden;width:100%;aspect-ratio:3.12/1;border-radius:22px;background:url(${ART}) 50% 2.7%/250% auto no-repeat;box-shadow:0 10px 28px rgba(60,80,180,.25);animation:auth-pan 9s ease-in-out infinite alternate}
.auth-banner::after{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:30%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.9),transparent);mix-blend-mode:overlay;transform:translateX(-120%) skewX(-12deg);animation:auth-sheen 5s ease-in-out 1s infinite}
.auth-card{--u:1px;width:100%;margin-top:14px;padding:calc(var(--u)*18) calc(var(--u)*22) calc(var(--u)*12);background:#fff;border-radius:calc(var(--u)*30);box-shadow:0 18px 44px rgba(80,90,200,.25)}
.auth-secure{display:flex;align-items:center;gap:8px;margin-top:16px;padding:9px 16px;border-radius:999px;background:rgba(255,255,255,.9);font-size:12.5px;color:#374151;text-align:center}
.auth-secure svg{flex:none;width:18px;height:18px;color:#2563eb}

/* ---------- องค์ประกอบในการ์ด (ทุกขนาดใช้หน่วย --u) ---------- */
.auth-badge{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:calc(var(--u)*10);width:max-content;max-width:100%;height:calc(var(--u)*40);margin:0 auto calc(var(--u)*12);padding:0 calc(var(--u)*28);border-radius:999px;color:#fff;font-size:calc(var(--u)*20);font-weight:700;white-space:nowrap;background:linear-gradient(90deg,#2563eb,#6366f1);box-shadow:0 8px 18px rgba(79,70,229,.35)}
.auth-badge svg{width:calc(var(--u)*21);height:calc(var(--u)*21);animation:auth-wiggle 3.6s ease-in-out 1.4s infinite}
.auth-badge::after{content:"";position:absolute;top:0;bottom:0;left:0;width:35%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-130%) skewX(-12deg);animation:auth-sheen 3.6s ease-in-out 1.4s infinite}
.auth-field{position:relative;margin-bottom:calc(var(--u)*10)}
.auth-lead{position:absolute;left:calc(var(--u)*17);top:50%;transform:translateY(-50%);width:calc(var(--u)*20);height:calc(var(--u)*20);color:#6b7bb8;pointer-events:none;transition:color .2s,transform .2s}
.auth-field:focus-within .auth-lead{color:#7c6cf8;transform:translateY(-50%) scale(1.18)}
.auth-field input{width:100%;height:calc(var(--u)*44);padding:0 calc(var(--u)*46);border-radius:999px;border:1.5px solid #dfe3f5;background:#fff;font:inherit;font-size:max(15px,calc(var(--u)*16));color:#1e2a5a;outline:none;transition:border-color .2s,box-shadow .2s,transform .2s}
.auth-field input::placeholder{color:#8b93b8}
.auth-field input:hover{border-color:#bcb6f4}
.auth-field input:focus{border-color:#7c6cf8;box-shadow:0 0 0 4px rgba(124,108,248,.18);transform:translateY(-1px)}
.auth-eye{position:absolute;right:calc(var(--u)*12);top:50%;transform:translateY(-50%);display:flex;padding:4px;border:none;border-radius:50%;background:none;color:#6b7bb8;cursor:pointer;transition:color .2s}
.auth-eye:hover{color:#7c6cf8}
.auth-eye svg{width:calc(var(--u)*20);height:calc(var(--u)*20)}
.auth-msg{margin:0 0 calc(var(--u)*8);text-align:center;font-size:calc(var(--u)*14);font-weight:500}
.auth-msg.error{color:#e11d48;animation:auth-shake .45s}
.auth-msg.ok{color:#059669;animation:auth-pop .5s cubic-bezier(.2,.9,.3,1.4)}
.auth-submit{position:relative;overflow:hidden;width:100%;display:flex;align-items:center;justify-content:center;gap:calc(var(--u)*8);height:calc(var(--u)*44);border:none;border-radius:999px;color:#fff;font:inherit;font-size:calc(var(--u)*18);font-weight:600;cursor:pointer;background:linear-gradient(90deg,#8b5cf6,#ec4899);box-shadow:0 8px 20px rgba(168,85,247,.32);transition:filter .15s,transform .15s}
.auth-submit svg{width:calc(var(--u)*20);height:calc(var(--u)*20)}
.auth-submit::after{content:"";position:absolute;top:0;bottom:0;left:0;width:30%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(-130%) skewX(-12deg)}
.auth-submit:hover:not(:disabled){filter:brightness(1.07);transform:translateY(-2px)}
.auth-submit:hover:not(:disabled)::after{animation:auth-sheen .8s ease-out}
.auth-submit:active:not(:disabled){transform:scale(.97)}
.auth-submit:disabled{opacity:.8;cursor:not-allowed}
.auth-submit:disabled svg{animation:auth-spin 1s linear infinite}
.auth-or{display:flex;align-items:center;gap:calc(var(--u)*12);margin:calc(var(--u)*8) 0 calc(var(--u)*6);color:#6b7280;font-size:calc(var(--u)*13)}
.auth-or::before,.auth-or::after{content:"";flex:1;height:1px;background:#dfe3f5}
.auth-switch{text-align:center;font-size:calc(var(--u)*15);color:#374151}
.auth-switch a{color:#4f46e5;font-weight:600;text-decoration:underline;transition:color .2s}
.auth-switch a:hover{color:#ec4899}
.auth-back{margin-top:calc(var(--u)*2);text-align:center;font-size:calc(var(--u)*13)}
.auth-back a{color:#6b7280;text-decoration:none;transition:color .2s}
.auth-back a:hover{color:#4f46e5}

/* ---------- จังหวะเด้งเข้าของเนื้อหาในการ์ด (พื้นการ์ดทึบเสมอ จึงไม่เห็นการ์ดเดิมในภาพ) ---------- */
.auth-card>*,.auth-card form>*{animation:auth-rise .55s cubic-bezier(.2,.9,.3,1.2) var(--d,0s) both}
.auth-card>:nth-child(1){--d:.05s}
.auth-card>:nth-child(3){--d:.5s}
.auth-card>:nth-child(4){--d:.58s}
.auth-card>:nth-child(5){--d:.66s}
.auth-card form>:nth-child(1){--d:.15s}
.auth-card form>:nth-child(2){--d:.23s}
.auth-card form>:nth-child(3){--d:.31s}
.auth-card form>:nth-child(4){--d:.39s}
.auth-card form>:nth-child(5){--d:.43s}
.auth-card>.auth-badge{animation:auth-rise .55s cubic-bezier(.2,.9,.3,1.2) var(--d,0s) both,auth-bob 3.2s ease-in-out 1s infinite}
.auth-card form>.auth-submit{animation:auth-rise .55s cubic-bezier(.2,.9,.3,1.2) var(--d,0s) both,auth-glow 2.8s ease-in-out 1s infinite}

/* ---------- อนุภาคดาว (คลิก / ตามเมาส์ / ฉลอง) ---------- */
.auth-p{position:fixed;z-index:100;width:var(--s,14px);height:var(--s,14px);margin:calc(var(--s,14px)/-2) 0 0 calc(var(--s,14px)/-2);pointer-events:none;background:var(--c,#fff);clip-path:${STAR};animation:auth-pfly .85s ease-out forwards}
.auth-p.t{animation:auth-ptrail .7s ease-out forwards}

@keyframes auth-rise{from{opacity:0;transform:translateY(calc(var(--u)*16)) scale(.97)}to{opacity:1;transform:none}}
@keyframes auth-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(calc(var(--u)*-3))}}
@keyframes auth-wiggle{0%,70%,100%{transform:rotate(0)}76%{transform:rotate(-14deg)}84%{transform:rotate(12deg)}92%{transform:rotate(-6deg)}}
@keyframes auth-sheen{0%{transform:translateX(-130%) skewX(-12deg)}45%,100%{transform:translateX(430%) skewX(-12deg)}}
@keyframes auth-glow{0%,100%{box-shadow:0 8px 20px rgba(168,85,247,.32)}50%{box-shadow:0 10px 30px rgba(236,72,153,.55)}}
@keyframes auth-shake{10%,90%{transform:translateX(-1px)}20%,80%{transform:translateX(3px)}30%,50%,70%{transform:translateX(-6px)}40%,60%{transform:translateX(6px)}}
@keyframes auth-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes auth-spin{to{transform:rotate(360deg)}}
@keyframes auth-pan{from{background-position:44% 2.7%}to{background-position:56% 2.7%}}
@keyframes auth-twinkle{0%,100%{transform:translate(-50%,-50%) scale(.2) rotate(0);opacity:0}50%{transform:translate(-50%,-50%) scale(1) rotate(60deg);opacity:1}}
@keyframes auth-pfly{0%{transform:translate(0,0) scale(.3) rotate(0);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1) rotate(var(--rot));opacity:0}}
@keyframes auth-ptrail{0%{transform:scale(.9) rotate(0);opacity:.9}100%{transform:translate(var(--dx),var(--dy)) scale(.1) rotate(120deg);opacity:0}}

/* ---------- Desktop: ภาพเต็มจอแบบ cover ไม่มีขอบ เลื่อน/ลากได้ + เอฟเฟกต์ ---------- */
@media (min-width:1000px) and (min-aspect-ratio:13/10){
  .auth-root{overflow:auto;cursor:grab;scrollbar-width:none}
  .auth-root::-webkit-scrollbar{display:none}
  .auth-root.grabbing{cursor:grabbing;user-select:none}
  .auth-root input{cursor:text}
  .auth-root button,.auth-root a{cursor:pointer}
  .auth-bg,.auth-veil{display:none}
  .auth-page{display:block;min-height:0}
  .auth-stage{position:relative;display:block;max-width:none;padding:0;width:max(100%,calc(100vh*${ART_W}/${ART_H}));container-type:inline-size;will-change:transform;transform:translate3d(calc(var(--px,0)*-8px),calc(var(--py,0)*-6px),0) scale(1.025)}
  .auth-art{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}
  .auth-banner,.auth-secure{display:none}
  .auth-card{--u:calc(${CARD.width}cqw/400);position:absolute;z-index:2;left:${CARD.left}%;top:${CARD.top}%;width:${CARD.width}%;min-height:${CARD.minHeight}%;margin:0;transform:perspective(1000px) rotateY(calc(var(--px,0)*1.4deg)) rotateX(calc(var(--py,0)*-1.2deg))}

  .auth-sparkles{display:block;position:absolute;inset:0;z-index:1;pointer-events:none;transform:translate3d(calc(var(--px,0)*-10px),calc(var(--py,0)*-8px),0)}
  .auth-spk{position:absolute;width:var(--s);height:var(--s);filter:drop-shadow(0 0 5px rgba(255,255,255,.95)) drop-shadow(0 0 10px rgba(180,200,255,.8));animation:auth-twinkle 3s ease-in-out infinite}
  .auth-spk i{display:block;width:100%;height:100%;background:#fff;clip-path:${STAR}}
  .auth-sheen{display:block;position:absolute;z-index:1;left:32%;top:2%;width:37%;height:26%;overflow:hidden;pointer-events:none;mix-blend-mode:overlay;-webkit-mask-image:radial-gradient(ellipse at center,#000 45%,transparent 75%);mask-image:radial-gradient(ellipse at center,#000 45%,transparent 75%)}
  .auth-sheen::before{content:"";position:absolute;top:-10%;bottom:-10%;left:0;width:35%;background:linear-gradient(105deg,transparent,rgba(255,255,255,.95),transparent);transform:translateX(-120%) skewX(-12deg);animation:auth-sheen 5s ease-in-out 1.5s infinite}
}

@media (prefers-reduced-motion:reduce){
  .auth-root *,.auth-root *::before,.auth-root *::after{animation:none!important;transition:none!important}
  .auth-stage,.auth-card,.auth-sparkles{transform:none!important}
}
`;

export function Field({ icon: Icon, type = "text", value, onChange, placeholder, autoComplete, minLength }) {
  const [show, setShow] = useState(false);
  const isPw = type === "password";
  return (
    <div className="auth-field">
      <Icon className="auth-lead" />
      <input
        type={isPw && show ? "text" : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
      />
      {isPw && (
        <button type="button" className="auth-eye" onClick={() => setShow((s) => !s)} aria-label="แสดงหรือซ่อนรหัสผ่าน">
          {show ? <EyeOff /> : <Eye />}
        </button>
      )}
    </div>
  );
}

export default function AuthLayout({ badgeIcon: BadgeIcon, badge, children }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // เริ่มที่กึ่งกลางแนวนอน
    const center = () => { el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; };
    center();
    window.addEventListener("resize", center);

    // สร้างอนุภาคดาว
    function spawn(x, y, n, trail) {
      for (let i = 0; i < n; i++) {
        const p = document.createElement("span");
        p.className = "auth-p" + (trail ? " t" : "");
        const a = Math.random() * Math.PI * 2;
        const d = trail ? 10 + Math.random() * 14 : 36 + Math.random() * 52;
        p.style.left = x + "px";
        p.style.top = y + "px";
        p.style.setProperty("--dx", (Math.cos(a) * d).toFixed(1) + "px");
        p.style.setProperty("--dy", (Math.sin(a) * d + (trail ? 14 : 0)).toFixed(1) + "px");
        p.style.setProperty("--rot", (Math.random() * 240 - 120).toFixed(0) + "deg");
        p.style.setProperty("--s", (trail ? 6 + Math.random() * 6 : 10 + Math.random() * 12).toFixed(0) + "px");
        p.style.setProperty("--c", COLORS[(Math.random() * COLORS.length) | 0]);
        p.addEventListener("animationend", () => p.remove());
        document.body.appendChild(p);
      }
    }

    // พารัลแลกซ์ตามเมาส์ (ค่อยๆ ไหลตาม)
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, lastTrail = 0, lastX = 0, lastY = 0;
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e) => {
      if (reduce) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
      // ประกายตามเมาส์ (ไม่ทำเหนือการ์ดฟอร์ม)
      const now = performance.now();
      if (now - lastTrail > 80 && Math.hypot(e.clientX - lastX, e.clientY - lastY) > 14 && !e.target.closest(".auth-card")) {
        spawn(e.clientX, e.clientY, 1, true);
        lastTrail = now;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    // คลิกค้างแล้วลากเพื่อเลื่อนหน้า (ไม่ทำงานบนช่องกรอก ปุ่ม ลิงก์)
    let drag = null, moved = false;
    const down = (e) => {
      if (e.button !== 0 || e.target.closest("input,button,a,textarea,select,label")) return;
      drag = { x: e.clientX, y: e.clientY, l: el.scrollLeft, t: el.scrollTop };
      moved = false;
      el.classList.add("grabbing");
    };
    const move = (e) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 6) moved = true;
      el.scrollLeft = drag.l - (e.clientX - drag.x);
      el.scrollTop = drag.t - (e.clientY - drag.y);
    };
    const up = () => { drag = null; el.classList.remove("grabbing"); };

    // คลิกแล้วดาวพุ่งกระจาย
    const click = (e) => {
      if (reduce) return;
      if (moved) { moved = false; return; }
      if (e.target.closest("input")) return;
      spawn(e.clientX, e.clientY, 10, false);
    };

    // ฉลองตอนสมัครสำเร็จ
    const party = () => {
      if (reduce) return;
      const card = el.querySelector(".auth-card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      for (let k = 0; k < 6; k++) {
        setTimeout(() => spawn(r.left + Math.random() * r.width, r.top + Math.random() * r.height * 0.6, 14, false), k * 120);
      }
    };

    el.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", up);
    el.addEventListener("click", click);
    window.addEventListener("auth-celebrate", party);

    return () => {
      window.removeEventListener("resize", center);
      el.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", up);
      el.removeEventListener("click", click);
      window.removeEventListener("auth-celebrate", party);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="auth-root" ref={rootRef}>
      <style>{css}</style>
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-veil" aria-hidden="true" />
      <div className="auth-page">
        <div className="auth-stage">
          {/* Desktop: ภาพเต็ม (ไม่ยืด ไม่บิด) */}
          <img className="auth-art" src={ART} width={ART_W} height={ART_H} alt="เว็บไซต์แจ้งของหาย มหาวิทยาลัยศรีปทุม" draggable="false" />
          <div className="auth-sheen" aria-hidden="true" />
          <div className="auth-sparkles" aria-hidden="true">
            {SPARKLES.map((p, i) => (
              <span key={i} className="auth-spk"
                style={{ left: p.x + "%", top: p.y + "%", "--s": p.s + "cqw", animationDelay: p.d + "s", animationDuration: p.t + "s" }}>
                <i />
              </span>
            ))}
          </div>
          {/* Mobile: ส่วนหัวของภาพจริง */}
          <div className="auth-banner" role="img" aria-label="เว็บไซต์แจ้งของหาย มหาวิทยาลัยศรีปทุม" />
          <div className="auth-card">
            <div className="auth-badge"><BadgeIcon /> {badge}</div>
            {children}
          </div>
          <div className="auth-secure"><ShieldCheck /> ข้อมูลของคุณปลอดภัย เราให้ความสำคัญกับความเป็นส่วนตัว</div>
        </div>
      </div>
    </div>
  );
}
