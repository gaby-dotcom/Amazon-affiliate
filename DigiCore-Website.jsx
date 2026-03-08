import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────
   CONFIG — edit these before deploying
───────────────────────────────────────────────────────────── */
const BRAND        = "DigiCore";
const WA_NUM       = "1234567890";          // digits only, no + or spaces
const WA_MSG       = encodeURIComponent("Hey DigiCore! I'm interested in your products.");
const WA_URL       = `https://wa.me/${WA_NUM}?text=${WA_MSG}`;
const SOCIALS = {
  instagram : "https://instagram.com/yourpage",
  twitter   : "https://twitter.com/yourpage",
  facebook  : "https://facebook.com/yourpage",
  linkedin  : "https://linkedin.com/company/yourpage",
  youtube   : "https://youtube.com/@yourpage",
  tiktok    : "https://tiktok.com/@yourpage",
};

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS — bold black / orange palette
───────────────────────────────────────────────────────────── */
const T = {
  bg      : "#080808",
  bg2     : "#111111",
  bg3     : "#181818",
  orange  : "#FF5C00",
  orangeL : "#FF7A2E",
  orangeD : "#CC4900",
  amber   : "#FFB800",
  white   : "#F5F0EB",
  muted   : "#888888",
  dim     : "#555555",
  border  : "rgba(255,92,0,0.2)",
  borderD : "rgba(255,255,255,0.07)",
  grad    : "linear-gradient(135deg,#FF5C00,#FFB800)",
  gradR   : "linear-gradient(135deg,#FFB800,#FF5C00)",
};

/* ─────────────────────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html { scroll-behavior:smooth; }
  body {
    font-family:'DM Sans',sans-serif;
    background:${T.bg};
    color:${T.white};
    overflow-x:hidden;
  }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:${T.bg}; }
  ::-webkit-scrollbar-thumb { background:${T.orange}; border-radius:2px; }
  a { color:inherit; text-decoration:none; }
  img { max-width:100%; }

  @keyframes ticker {
    0%   { transform:translateX(0); }
    100% { transform:translateX(-50%); }
  }
  @keyframes pulse-ring {
    0%   { transform:scale(1);   opacity:.6; }
    100% { transform:scale(1.9); opacity:0;  }
  }
  @keyframes float-y {
    0%,100% { transform:translateY(0px); }
    50%     { transform:translateY(-14px); }
  }
  @keyframes fade-up {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes scan {
    0%   { top:-10%; }
    100% { top:110%; }
  }
  @keyframes blink {
    0%,100% { opacity:1; }
    50%     { opacity:0; }
  }
  .fade-up { animation: fade-up .55s cubic-bezier(.22,1,.36,1) both; }
  .fade-up-2 { animation: fade-up .55s cubic-bezier(.22,1,.36,1) .12s both; }
  .fade-up-3 { animation: fade-up .55s cubic-bezier(.22,1,.36,1) .24s both; }
  .fade-up-4 { animation: fade-up .55s cubic-bezier(.22,1,.36,1) .36s both; }

  /* Noise overlay */
  body::before {
    content:'';
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
    opacity:.025;
  }
`;

/* ─────────────────────────────────────────────────────────────
   REUSABLE PRIMITIVES
───────────────────────────────────────────────────────────── */

// Gradient text
const GT = ({ children, style={} }) => (
  <span style={{ background:T.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", ...style }}>
    {children}
  </span>
);

// Section wrapper
const Section = ({ children, style={} }) => (
  <section style={{ padding:"100px 0", position:"relative", zIndex:1, ...style }}>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px" }}>
      {children}
    </div>
  </section>
);

// Section label
const Label = ({ children }) => (
  <div style={{
    display:"inline-flex", alignItems:"center", gap:8,
    fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700,
    letterSpacing:3, textTransform:"uppercase", color:T.orange,
    marginBottom:20,
  }}>
    <span style={{ width:20, height:2, background:T.grad, display:"block" }} />
    {children}
    <span style={{ width:20, height:2, background:T.grad, display:"block" }} />
  </div>
);

// Buttons
const Btn = ({ children, href, onClick, v="primary", sx={}, target="_blank" }) => {
  const [hov, setHov] = useState(false);
  const variants = {
    primary: {
      background: hov ? T.orangeL : T.orange,
      color:"#080808", border:"none",
      boxShadow: hov ? `0 8px 32px ${T.orange}66` : `0 4px 20px ${T.orange}44`,
    },
    outline: {
      background: "transparent",
      color: hov ? T.orange : T.white,
      border: `1.5px solid ${hov ? T.orange : T.borderD}`,
    },
    whatsapp: {
      background: hov ? "#25d366" : "#1ebe5d",
      color:"#fff", border:"none",
      boxShadow: hov ? "0 8px 24px #25d36666" : "0 4px 16px #25d36633",
    },
    ghost: {
      background:"transparent", color: hov ? T.orangeL : T.orange,
      border:"none", padding:"8px 0",
    },
  };
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    gap:8, padding:"13px 26px", borderRadius:6, fontWeight:700,
    fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
    transition:"all .2s", whiteSpace:"nowrap", letterSpacing:.5,
    textTransform:"uppercase", ...variants[v], ...sx,
  };
  if (href) return (
    <a href={href} target={target} rel="noopener noreferrer"
      style={base} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </a>
  );
  return (
    <button onClick={onClick} style={base}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </button>
  );
};

// Card
const Card = ({ children, sx={}, featured=false }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        background: T.bg2,
        border: `1px solid ${hov||featured ? T.border : T.borderD}`,
        borderRadius:12, padding:28, position:"relative", overflow:"hidden",
        transition:"all .3s cubic-bezier(.22,1,.36,1)",
        transform: hov ? "translateY(-6px)" : "none",
        boxShadow: hov||featured ? `0 12px 48px ${T.orange}22` : "none",
        ...sx,
      }}>
      {(hov||featured) && (
        <div style={{
          position:"absolute", inset:0,
          background:`radial-gradient(ellipse at top left, ${T.orange}0d, transparent 70%)`,
          pointerEvents:"none",
        }} />
      )}
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────── */
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home","Services","Products","Pricing","Contact"];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding: scrolled ? "12px 0" : "20px 0",
        background: scrolled ? "rgba(8,8,8,.96)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.borderD}` : "none",
        transition:"all .3s",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          {/* Logo */}
          <div onClick={()=>setPage("Home")} style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
            <div style={{
              width:36, height:36, background:T.orange, borderRadius:6,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:"#080808", fontWeight:700,
            }}>D</div>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:3, color:T.white }}>
              DIGI<GT>CORE</GT>
            </span>
          </div>

          {/* Desktop links */}
          <div style={{ display:"flex", gap:36 }}>
            {links.map(l => (
              <button key={l} onClick={()=>setPage(l)} style={{
                background:"none", border:"none", cursor:"pointer",
                fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700,
                letterSpacing:2, textTransform:"uppercase",
                color: page===l ? T.orange : T.muted,
                borderBottom: page===l ? `2px solid ${T.orange}` : "2px solid transparent",
                paddingBottom:3, transition:"color .2s",
              }}>{l}</button>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <Btn href={WA_URL} v="whatsapp" sx={{ padding:"10px 18px", fontSize:12 }}>
              💬 WhatsApp
            </Btn>
            <button onClick={()=>setMenu(true)} style={{
              background:"none", border:`1px solid ${T.borderD}`, borderRadius:6,
              padding:"9px 11px", cursor:"pointer", display:"flex", flexDirection:"column", gap:4,
            }}>
              {[0,1,2].map(i=><span key={i} style={{ width:18, height:2, background:T.white, display:"block", borderRadius:1 }}/>)}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile / Hamburger menu */}
      {menu && (
        <div style={{
          position:"fixed", inset:0, zIndex:1100,
          background:"rgba(8,8,8,.98)", display:"flex",
          flexDirection:"column", alignItems:"center", justifyContent:"center", gap:32,
        }}>
          <button onClick={()=>setMenu(false)} style={{
            position:"absolute", top:24, right:28,
            background:"none", border:"none", color:T.muted, fontSize:28, cursor:"pointer",
          }}>✕</button>
          {links.map((l,i) => (
            <button key={l} onClick={()=>{setPage(l);setMenu(false)}} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"'Bebas Neue',sans-serif", fontSize:"3.2rem",
              letterSpacing:4, color: page===l ? T.orange : T.white,
              transition:"color .2s", animationDelay:`${i*0.07}s`,
            }} className="fade-up">{l}</button>
          ))}
          <Btn href={WA_URL} v="whatsapp">💬 Chat on WhatsApp</Btn>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   TICKER TAPE
───────────────────────────────────────────────────────────── */
function Ticker() {
  const items = ["⚡ Instant Delivery","🔥 Premium Quality","💯 Money-Back Guarantee","🚀 1000+ Products","🤖 AI Tools","📦 Digital Downloads","🎨 UI Templates","🔑 License Keys"];
  const doubled = [...items,...items];
  return (
    <div style={{
      background:T.orange, overflow:"hidden", padding:"10px 0",
      position:"relative", zIndex:10,
    }}>
      <div style={{ display:"flex", gap:48, width:"max-content", animation:"ticker 28s linear infinite" }}>
        {doubled.map((t,i) => (
          <span key={i} style={{
            fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700,
            letterSpacing:2, color:"#080808", whiteSpace:"nowrap", textTransform:"uppercase",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLOATING WHATSAPP
───────────────────────────────────────────────────────────── */
function FloatWA() {
  const [hov, setHov] = useState(false);
  return (
    <a href={WA_URL} target="_blank" rel="noopener noreferrer"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        position:"fixed", bottom:28, right:28, zIndex:900,
        width:58, height:58, borderRadius:"50%",
        background:"#25d366", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:26,
        boxShadow: hov ? "0 8px 32px #25d36688" : "0 4px 20px #25d36644",
        transition:"all .25s", transform: hov ? "scale(1.1)" : "scale(1)",
      }}>
      <div style={{ position:"absolute", width:58, height:58, borderRadius:"50%", background:"#25d366", animation:"pulse-ring 2s ease-out infinite" }}/>
      💬
      {hov && (
        <span style={{
          position:"absolute", right:70, background:T.bg3, color:T.white,
          padding:"8px 14px", borderRadius:8, fontSize:12, fontWeight:600,
          whiteSpace:"nowrap", border:`1px solid ${T.borderD}`,
          boxShadow:"0 4px 16px #0008",
        }}>Chat on WhatsApp</span>
      )}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────── */
function Footer({ setPage }) {
  const cols = [
    { title:"Company", links:["Home","Services","Products","Pricing","Contact"] },
    { title:"Products", links:["SaaS Tools","E-Books","Templates","UI Kits","AI Tools","License Keys"] },
    { title:"Support",  links:["Help Center","Refund Policy","Privacy Policy","Terms of Service","FAQ"] },
  ];
  const socials = [
    { emoji:"💬", href:WA_URL,         label:"WhatsApp" },
    { emoji:"📸", href:SOCIALS.instagram, label:"Instagram" },
    { emoji:"🐦", href:SOCIALS.twitter,   label:"Twitter" },
    { emoji:"💼", href:SOCIALS.linkedin,  label:"LinkedIn" },
    { emoji:"▶️", href:SOCIALS.youtube,   label:"YouTube" },
    { emoji:"🎵", href:SOCIALS.tiktok,    label:"TikTok" },
  ];
  return (
    <footer style={{ borderTop:`1px solid ${T.borderD}`, position:"relative", zIndex:1 }}>
      {/* Orange rule */}
      <div style={{ height:3, background:T.grad }} />
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"64px 28px 32px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:48, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <div style={{ width:34, height:34, background:T.orange, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:"#080808" }}>D</div>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, letterSpacing:3 }}>DIGI<GT>CORE</GT></span>
            </div>
            <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, maxWidth:260, marginBottom:24 }}>
              Premium digital products, SaaS tools, software, and AI solutions. Instant delivery. No BS.
            </p>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {socials.map(s => {
                const [h, sH] = [useState(false)][0] ?? [false,()=>{}];
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    title={s.label}
                    style={{
                      width:40, height:40, borderRadius:8,
                      border:`1px solid ${T.borderD}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:18, transition:"all .2s",
                    }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=T.orange;e.currentTarget.style.transform="translateY(-2px)"}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=T.borderD;e.currentTarget.style.transform="none"}}
                  >{s.emoji}</a>
                );
              })}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily:"'Space Mono',monospace", fontSize:11, fontWeight:700, letterSpacing:2, color:T.orange, textTransform:"uppercase", marginBottom:20 }}>{col.title}</h4>
              <ul style={{ listStyle:"none" }}>
                {col.links.map(l => (
                  <li key={l} style={{ marginBottom:10 }}>
                    <button onClick={()=>["Home","Services","Products","Pricing","Contact"].includes(l)?setPage(l):null}
                      style={{ background:"none", border:"none", color:T.muted, fontSize:14, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"color .2s" }}
                      onMouseEnter={e=>e.target.style.color=T.orange}
                      onMouseLeave={e=>e.target.style.color=T.muted}
                    >{l}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:24, borderTop:`1px solid ${T.borderD}`, flexWrap:"wrap", gap:12 }}>
          <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:T.dim, letterSpacing:1 }}>© 2025 {BRAND}. ALL RIGHTS RESERVED.</span>
          <div style={{ display:"flex", gap:24 }}>
            {["Privacy","Terms","Cookies"].map(t=>(
              <span key={t} style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:T.dim, cursor:"pointer", letterSpacing:1 }}>{t.toUpperCase()}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────── */
function HomePage({ setPage }) {
  const services = [
    { icon:"🚀", title:"SaaS Platforms",    desc:"Launch-ready subscription software — CRMs, dashboards, booking systems, and more." },
    { icon:"📚", title:"E-Books & Courses",  desc:"Expert-written guides and structured video courses for business, tech, and marketing." },
    { icon:"🎨", title:"UI/UX Templates",   desc:"Pixel-perfect Figma and HTML templates to ship beautiful interfaces in record time." },
    { icon:"🔌", title:"Plugins & Tools",   desc:"Browser extensions, automation scripts, and dev utilities that 10× your productivity." },
    { icon:"🔐", title:"License Keys",      desc:"Official software keys for Office, Adobe, antivirus, and more — instant activation." },
    { icon:"🤖", title:"AI Solutions",      desc:"Custom AI agents, chatbots, and automations that run your business while you sleep." },
  ];
  const stats = [
    { n:"12K+", l:"Products Sold" },
    { n:"500+", l:"Digital Items" },
    { n:"99%",  l:"Satisfaction" },
    { n:"24/7", l:"Support" },
  ];
  const testimonials = [
    { name:"Rania S.",  role:"E-Commerce Founder",   text:"Their SaaS kit saved me 3 months of dev work. The quality is genuinely insane.",  init:"RS" },
    { name:"David M.",  role:"Freelance Developer",  text:"Best UI templates I've ever bought. The components are clean, modern, and fast.", init:"DM" },
    { name:"Keisha O.", role:"Digital Marketer",     text:"The AI writing tool pays for itself in an hour. $39 for something worth $200.",   init:"KO" },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", paddingTop:100, position:"relative", overflow:"hidden" }}>
        {/* Background elements */}
        <div style={{ position:"absolute", right:"-5%", top:"10%", width:700, height:700, borderRadius:"50%", background:`radial-gradient(circle, ${T.orange}18, transparent 70%)`, pointerEvents:"none" }} />
        <div style={{ position:"absolute", width:"100%", height:"100%", top:0, left:0,
          backgroundImage:`linear-gradient(${T.borderD} 1px, transparent 1px), linear-gradient(90deg, ${T.borderD} 1px, transparent 1px)`,
          backgroundSize:"80px 80px", opacity:.4, pointerEvents:"none",
        }} />
        {/* Scan line */}
        <div style={{ position:"absolute", left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${T.orange}33,transparent)`, animation:"scan 6s linear infinite", pointerEvents:"none" }} />

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px", position:"relative", zIndex:1, width:"100%" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
            <div>
              <div className="fade-up" style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${T.orange}18`, border:`1px solid ${T.border}`, borderRadius:4, padding:"6px 14px", fontSize:11, fontWeight:700, letterSpacing:2, color:T.orange, fontFamily:"'Space Mono',monospace", marginBottom:24, textTransform:"uppercase" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:T.orange, display:"inline-block", animation:"pulse-ring 1.5s ease-out infinite" }} />
                Premium Digital Products
              </div>
              <h1 className="fade-up-2" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(4rem,7vw,7rem)", lineHeight:.95, letterSpacing:2, marginBottom:28 }}>
                DIGITAL<br/>
                <GT>TOOLS</GT><br/>
                THAT HIT.
              </h1>
              <p className="fade-up-3" style={{ fontSize:"1.05rem", color:T.muted, maxWidth:460, lineHeight:1.8, marginBottom:36 }}>
                Premium software, AI tools, templates & digital products — everything to launch and scale your online business. Instant delivery. Zero fluff.
              </p>
              <div className="fade-up-4" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <Btn onClick={()=>setPage("Products")}>🛍 Shop Products</Btn>
                <Btn href={WA_URL} v="whatsapp">💬 WhatsApp</Btn>
                <Btn onClick={()=>setPage("Services")} v="outline">View Services</Btn>
              </div>
            </div>

            {/* Hero visual */}
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", position:"relative" }}>
              <div style={{ width:360, height:400, background:T.bg2, borderRadius:16, border:`1px solid ${T.border}`, padding:28, position:"relative", animation:"float-y 5s ease-in-out infinite" }}>
                <div style={{ height:3, background:T.grad, borderRadius:2, marginBottom:24 }} />
                {[
                  { label:"⚡ SaaS Tools",    price:"$49" },
                  { label:"📚 E-Books",       price:"$19" },
                  { label:"🎨 UI Templates",  price:"$29" },
                  { label:"🤖 AI Tools",      price:"$39" },
                  { label:"🔑 License Keys",  price:"$24" },
                ].map((item,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:`1px solid ${T.borderD}` }}>
                    <span style={{ fontSize:14, color:T.white }}>{item.label}</span>
                    <span style={{ fontFamily:"'Space Mono',monospace", fontSize:13, color:T.orange }}>{item.price}</span>
                  </div>
                ))}
                <div style={{ marginTop:24 }}>
                  <Btn href={WA_URL} v="primary" sx={{ width:"100%", justifyContent:"center" }}>Order via WhatsApp</Btn>
                </div>
                {/* Corner accents */}
                <div style={{ position:"absolute", top:-1, left:-1, width:20, height:20, borderTop:`2px solid ${T.orange}`, borderLeft:`2px solid ${T.orange}`, borderRadius:"4px 0 0 0" }} />
                <div style={{ position:"absolute", top:-1, right:-1, width:20, height:20, borderTop:`2px solid ${T.orange}`, borderRight:`2px solid ${T.orange}`, borderRadius:"0 4px 0 0" }} />
                <div style={{ position:"absolute", bottom:-1, left:-1, width:20, height:20, borderBottom:`2px solid ${T.orange}`, borderLeft:`2px solid ${T.orange}`, borderRadius:"0 0 0 4px" }} />
                <div style={{ position:"absolute", bottom:-1, right:-1, width:20, height:20, borderBottom:`2px solid ${T.orange}`, borderRight:`2px solid ${T.orange}`, borderRadius:"0 0 4px 0" }} />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, marginTop:80, paddingTop:48, borderTop:`1px solid ${T.borderD}` }}>
            {stats.map(s => (
              <div key={s.l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3.2rem", letterSpacing:2, background:T.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.n}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:T.muted, letterSpacing:2, textTransform:"uppercase", marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker />

      {/* ── SERVICES PREVIEW ── */}
      <Section>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <Label>What We Offer</Label>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", letterSpacing:2 }}>
            EVERYTHING YOU NEED TO <GT>WIN ONLINE</GT>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {services.map(s => (
            <Card key={s.title}>
              <div style={{ fontSize:32, marginBottom:16 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem", letterSpacing:1.5, marginBottom:8 }}>{s.title}</h3>
              <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, marginBottom:16 }}>{s.desc}</p>
              <Btn onClick={()=>setPage("Services")} v="ghost" sx={{ fontSize:12 }}>Explore →</Btn>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── TESTIMONIALS ── */}
      <Section style={{ background:T.bg2, padding:"80px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 28px" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <Label>Social Proof</Label>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4.5rem)", letterSpacing:2 }}>
              WHAT OUR <GT>CUSTOMERS SAY</GT>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
            {testimonials.map(t => (
              <Card key={t.name}>
                <div style={{ color:T.orange, fontSize:18, marginBottom:14, letterSpacing:2 }}>★★★★★</div>
                <p style={{ color:T.muted, fontSize:15, lineHeight:1.8, marginBottom:20, fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:T.orange, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:15, color:"#080808", flexShrink:0 }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{t.name}</div>
                    <div style={{ color:T.dim, fontSize:12, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CTA ── */}
      <Section>
        <div style={{
          background:`linear-gradient(135deg,${T.bg2},${T.bg3})`,
          border:`1px solid ${T.border}`,
          borderRadius:16, padding:"72px 56px", textAlign:"center",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.borderD} 1px,transparent 1px),linear-gradient(90deg,${T.borderD} 1px,transparent 1px)`, backgroundSize:"40px 40px", opacity:.3 }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,5rem)", letterSpacing:2, marginBottom:16 }}>
              READY TO GO <GT>DIGITAL?</GT>
            </h2>
            <p style={{ color:T.muted, fontSize:"1.05rem", marginBottom:36, maxWidth:480, margin:"0 auto 36px" }}>
              Browse our catalog or hit us up on WhatsApp. We'll find exactly what you need.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
              <Btn onClick={()=>setPage("Products")}>🛍 Browse Products</Btn>
              <Btn href={WA_URL} v="whatsapp">💬 Chat on WhatsApp</Btn>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SERVICES PAGE
───────────────────────────────────────────────────────────── */
function ServicesPage({ setPage }) {
  const services = [
    { icon:"🚀", title:"SaaS Platform Delivery",      desc:"Fully functional SaaS systems for project management, invoicing, booking, CRMs, and more. Ship your software product without writing a line of backend code." },
    { icon:"📚", title:"E-Books & Online Courses",     desc:"Expert-crafted e-books and structured video courses across business, coding, marketing, and finance. Real knowledge, real results." },
    { icon:"🎨", title:"Website & UI Templates",       desc:"Production-ready HTML, React, and Figma templates. Pixel-perfect design, fully responsive, clean code — just customize and ship." },
    { icon:"🔌", title:"Plugins & Browser Extensions", desc:"CMS plugins, VS Code extensions, Chrome extensions, and automation scripts. Power tools that save hours every week." },
    { icon:"🔐", title:"Software License Keys",        desc:"Official activation keys for Microsoft Office, Adobe Suite, antivirus, and hundreds of other premium tools. Instant delivery, 100% genuine." },
    { icon:"🤖", title:"AI & Automation Tools",        desc:"Custom AI agents, chatbots, and automated workflows that handle customer service, content, and operations so you can focus on growth." },
    { icon:"📊", title:"Business Document Templates",  desc:"Pitch decks, business plans, financial models, SOPs, and marketing kits. Professionally designed and instantly editable." },
    { icon:"🎮", title:"Game Assets & Digital Goods",  desc:"High-quality game assets, in-game currencies, digital accounts, and entertainment products — secured and delivered instantly." },
  ];
  const steps = [
    { n:"01", title:"Browse & Choose",   desc:"Explore our full catalog and pick the right product for your goals and budget." },
    { n:"02", title:"Order via WhatsApp",desc:"Message us on WhatsApp — we'll confirm your order and send payment details fast." },
    { n:"03", title:"Instant Delivery",  desc:"Your digital product is delivered to your inbox or dashboard immediately after payment." },
    { n:"04", title:"Lifetime Support",  desc:"Got questions after purchase? Our team is available 24/7 to help you succeed." },
  ];

  return (
    <div style={{ paddingTop:80 }}>
      {/* Page hero */}
      <div style={{ padding:"80px 0 60px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.borderD} 1px,transparent 1px),linear-gradient(90deg,${T.borderD} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:.3 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20, fontFamily:"'Space Mono',monospace", fontSize:11, color:T.dim, letterSpacing:2 }}>
            <button onClick={()=>setPage("Home")} style={{ background:"none", border:"none", color:T.orange, cursor:"pointer", fontFamily:"'Space Mono',monospace", fontSize:11, letterSpacing:2 }}>HOME</button>
            <span>/</span><span>SERVICES</span>
          </div>
          <Label>Our Services</Label>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,6vw,6rem)", letterSpacing:3, lineHeight:.9 }}>
            WHAT WE <GT>DELIVER</GT>
          </h1>
        </div>
      </div>
      <Ticker />

      <Section>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20, marginBottom:100 }}>
          {services.map(s => (
            <Card key={s.title}>
              <div style={{ fontSize:28, marginBottom:14 }}>{s.icon}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:1.5, marginBottom:10 }}>{s.title}</h3>
              <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, marginBottom:16 }}>{s.desc}</p>
              <Btn href={WA_URL} v="ghost" sx={{ fontSize:12 }}>Enquire on WhatsApp →</Btn>
            </Card>
          ))}
        </div>

        {/* Process */}
        <div style={{ textAlign:"center", marginBottom:52 }}>
          <Label>How It Works</Label>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,4vw,4rem)", letterSpacing:2 }}>
            SIMPLE <GT>4-STEP PROCESS</GT>
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:20, marginBottom:80 }}>
          {steps.map((s,i) => (
            <Card key={s.n}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"4rem", background:T.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:2, lineHeight:1, marginBottom:16 }}>{s.n}</div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", letterSpacing:1.5, marginBottom:10 }}>{s.title}</h3>
              <p style={{ color:T.muted, fontSize:14, lineHeight:1.8 }}>{s.desc}</p>
              {i < steps.length-1 && (
                <div style={{ position:"absolute", right:-10, top:"50%", transform:"translateY(-50%)", fontSize:20, color:T.orange, display:"none" }}>→</div>
              )}
            </Card>
          ))}
        </div>

        <div style={{ textAlign:"center" }}>
          <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(1.8rem,3vw,3rem)", letterSpacing:2, marginBottom:16 }}>
            NEED SOMETHING <GT>CUSTOM?</GT>
          </h3>
          <p style={{ color:T.muted, fontSize:"1rem", marginBottom:28, maxWidth:440, margin:"0 auto 28px" }}>
            Hit us up on WhatsApp. We'll find or build exactly what your business needs.
          </p>
          <Btn href={WA_URL} v="whatsapp" sx={{ fontSize:15, padding:"15px 32px" }}>💬 Chat on WhatsApp Now</Btn>
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRODUCTS PAGE
───────────────────────────────────────────────────────────── */
function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All","SaaS","E-Books","Templates","Tools","Keys","AI"];
  const products = [
    { cat:"SaaS",      icon:"📊", name:"ProjectFlow Pro",      desc:"Full PM SaaS — tasks, teams, time tracking, analytics.",     price:"$49", orig:"$120", hot:true },
    { cat:"Templates", icon:"🎨", name:"NexUI Dashboard",       desc:"React admin dashboard, 50+ components, dark & light modes.", price:"$29", orig:"$79",  hot:false },
    { cat:"E-Books",   icon:"📗", name:"Zero to $10K Online",   desc:"Complete blueprint to build a 5-figure digital business.",   price:"$19", orig:"$49",  hot:true },
    { cat:"AI",        icon:"🤖", name:"AI Content Writer",      desc:"GPT tool — blogs, ads, emails, scripts in seconds.",         price:"$39", orig:"$99",  hot:true },
    { cat:"Keys",      icon:"🔑", name:"Office 365 Lifetime",   desc:"Genuine Microsoft Office 365 Personal — lifetime key.",      price:"$24", orig:"$70",  hot:false },
    { cat:"Tools",     icon:"🔧", name:"DevKit Extension Pack", desc:"15-pack VS Code extensions for maximum developer flow.",     price:"$15", orig:"$40",  hot:false },
    { cat:"SaaS",      icon:"🧾", name:"InvoiceSend CRM",       desc:"Client management + invoicing SaaS for freelancers.",        price:"$59", orig:"$150", hot:false },
    { cat:"Templates", icon:"🌐", name:"SaaSify Landing Page",  desc:"High-converting SaaS landing page — HTML + Figma included.", price:"$22", orig:"$55",  hot:false },
    { cat:"E-Books",   icon:"📘", name:"Mastering Dropshipping","desc":"Step-by-step to a profitable dropship store in 30 days.",  price:"$17", orig:"$45",  hot:false },
    { cat:"AI",        icon:"🧠", name:"ChatBot Builder Kit",   desc:"No-code AI chatbot toolkit + full integration docs.",        price:"$45", orig:"$120", hot:true },
    { cat:"Keys",      icon:"🔒", name:"Antivirus Pro 2025",    desc:"Top-rated antivirus protection — 1 year, 3 devices.",        price:"$12", orig:"$35",  hot:false },
    { cat:"Tools",     icon:"⚡", name:"AutoTask Chrome Ext",   desc:"Browser automation — forms, scraping, scheduling, all-in-one.", price:"$18", orig:"$50", hot:false },
  ];
  const filtered = filter === "All" ? products : products.filter(p => p.cat === filter);

  return (
    <div style={{ paddingTop:80 }}>
      <div style={{ padding:"80px 0 44px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.borderD} 1px,transparent 1px),linear-gradient(90deg,${T.borderD} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:.3 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <Label>Product Catalog</Label>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,6vw,6rem)", letterSpacing:3, lineHeight:.9 }}>
            BROWSE THE <GT>VAULT</GT>
          </h1>
          <p style={{ color:T.muted, maxWidth:460, margin:"16px auto 0", fontSize:15, lineHeight:1.8 }}>Instant delivery. Premium quality. 7-day guarantee.</p>
        </div>
      </div>
      <Ticker />

      <Section>
        {/* Filter pills */}
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:40 }}>
          {cats.map(c => (
            <button key={c} onClick={()=>setFilter(c)} style={{
              padding:"8px 20px", borderRadius:4,
              border:`1.5px solid ${filter===c ? T.orange : T.borderD}`,
              background: filter===c ? T.orange : "transparent",
              color: filter===c ? "#080808" : T.muted,
              cursor:"pointer", fontFamily:"'Space Mono',monospace",
              fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase",
              transition:"all .2s",
            }}>{c}</button>
          ))}
        </div>

        {/* Products grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:20, marginBottom:60 }}>
          {filtered.map(p => (
            <Card key={p.name} sx={{ display:"flex", flexDirection:"column" }}>
              {p.hot && (
                <div style={{ position:"absolute", top:16, right:16, background:T.orange, color:"#080808", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:4, fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>HOT 🔥</div>
              )}
              {/* Thumb */}
              <div style={{ height:140, borderRadius:10, background:T.bg3, border:`1px solid ${T.borderD}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:52, marginBottom:18 }}>{p.icon}</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontFamily:"'Space Mono',monospace", fontSize:10, fontWeight:700, letterSpacing:2, color:T.orange, textTransform:"uppercase" }}>{p.cat}</span>
                <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:1, color:T.amber }}>{p.price}</span>
                  <span style={{ fontSize:12, color:T.dim, textDecoration:"line-through" }}>{p.orig}</span>
                </div>
              </div>
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem", letterSpacing:1.5, marginBottom:6 }}>{p.name}</h3>
              <p style={{ color:T.muted, fontSize:13, lineHeight:1.7, flex:1, marginBottom:18 }}>{p.desc}</p>
              <div style={{ display:"flex", gap:10 }}>
                <Btn href={WA_URL} v="primary" sx={{ flex:1, fontSize:12, padding:"10px 14px" }}>💬 Order</Btn>
                <Btn href={WA_URL} v="outline" sx={{ flex:1, fontSize:12, padding:"10px 14px" }}>Info</Btn>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICING PAGE
───────────────────────────────────────────────────────────── */
function PricingPage({ setPage }) {
  const plans = [
    {
      name:"Starter", price:"19", period:"/mo", badge:null, featured:false,
      desc:"For individuals just getting started.",
      features:["5 product downloads/month","E-books & templates access","Email support","Community access","Basic tools"],
    },
    {
      name:"Pro", price:"49", period:"/mo", badge:"MOST POPULAR", featured:true,
      desc:"Everything to grow your digital business.",
      features:["Unlimited downloads","All products & tools","Priority WhatsApp support","Commercial license","AI tools access","Early product access"],
    },
    {
      name:"Agency", price:"99", period:"/mo", badge:null, featured:false,
      desc:"For teams and agencies scaling fast.",
      features:["Everything in Pro","5 team seats","Custom solutions","Dedicated account manager","API access","White-label rights","Monthly invoicing"],
    },
  ];
  const faqs = [
    { q:"How do I receive my digital products?",  a:"All products are delivered instantly via email or through your account dashboard right after payment is confirmed." },
    { q:"Can I get a refund?",                     a:"Yes — we offer a 7-day money-back guarantee on all products. Just message us on WhatsApp or email if you're not satisfied." },
    { q:"Is there a free trial available?",        a:"No free trials, but message us on WhatsApp and we'll walk you through any product before you commit to buying." },
    { q:"Can I upgrade or downgrade my plan?",     a:"Absolutely. You can switch plans anytime from your account settings with prorated billing automatically applied." },
    { q:"Do you offer custom enterprise pricing?", a:"Yes! Hit us up on WhatsApp and we'll put together a custom package for your team size and specific needs." },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ paddingTop:80 }}>
      <div style={{ padding:"80px 0 52px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.borderD} 1px,transparent 1px),linear-gradient(90deg,${T.borderD} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:.3 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <Label>Pricing</Label>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,6vw,6rem)", letterSpacing:3, lineHeight:.9 }}>
            STRAIGHT UP <GT>PRICING</GT>
          </h1>
          <p style={{ color:T.muted, maxWidth:440, margin:"16px auto 0", fontSize:15, lineHeight:1.8 }}>No hidden fees. No lock-ins. Cancel anytime. All plans include instant product access.</p>
        </div>
      </div>
      <Ticker />

      <Section>
        {/* Plans */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))", gap:20, marginBottom:100 }}>
          {plans.map(p => (
            <Card key={p.name} featured={p.featured} sx={{ textAlign:"center" }}>
              {p.badge && (
                <div style={{ background:T.orange, color:"#080808", fontSize:10, fontWeight:700, padding:"4px 14px", borderRadius:4, display:"inline-block", marginBottom:20, fontFamily:"'Space Mono',monospace", letterSpacing:2 }}>{p.badge}</div>
              )}
              <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:2, marginBottom:6 }}>{p.name.toUpperCase()}</h3>
              <p style={{ color:T.muted, fontSize:13, marginBottom:20 }}>{p.desc}</p>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"4rem", letterSpacing:2, lineHeight:1, background:T.grad, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                <sup style={{ fontSize:"1.8rem", verticalAlign:"super" }}>$</sup>{p.price}
              </div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:11, color:T.dim, letterSpacing:1, marginBottom:28 }}>{p.period}</div>
              <ul style={{ listStyle:"none", textAlign:"left", marginBottom:28 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 0", color:T.muted, fontSize:14, borderBottom:`1px solid ${T.borderD}` }}>
                    <span style={{ color:T.orange, fontSize:14 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Btn onClick={()=>{}} v={p.featured?"primary":"outline"} sx={{ width:"100%" }}>Get {p.name}</Btn>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth:700, margin:"0 auto 80px" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <Label>FAQ</Label>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2rem,4vw,4rem)", letterSpacing:2 }}>
              COMMON <GT>QUESTIONS</GT>
            </h2>
          </div>
          {faqs.map((f,i) => (
            <div key={i} style={{ border:`1px solid ${openFaq===i ? T.orange : T.borderD}`, borderRadius:8, marginBottom:10, overflow:"hidden", transition:"border-color .2s" }}>
              <button onClick={()=>setOpenFaq(openFaq===i ? null : i)} style={{
                width:"100%", background:T.bg2, border:"none",
                padding:"18px 22px", display:"flex", justifyContent:"space-between", alignItems:"center",
                cursor:"pointer", color:T.white, fontFamily:"'DM Sans',sans-serif",
                fontSize:15, fontWeight:600, textAlign:"left",
              }}>
                {f.q}
                <span style={{ fontSize:20, color:T.orange, transition:"transform .3s", transform:openFaq===i?"rotate(45deg)":"none", marginLeft:16, flexShrink:0 }}>+</span>
              </button>
              {openFaq===i && (
                <div style={{ padding:"0 22px 18px", color:T.muted, fontSize:14, lineHeight:1.9, background:T.bg2 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center" }}>
          <p style={{ color:T.muted, fontSize:"1rem", marginBottom:20 }}>Still unsure? We'll help you pick the right plan.</p>
          <Btn href={WA_URL} v="whatsapp" sx={{ fontSize:15, padding:"15px 32px" }}>💬 Ask Us on WhatsApp</Btn>
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   CONTACT PAGE
───────────────────────────────────────────────────────────── */
function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const inputStyle = {
    width:"100%", background:T.bg3, border:`1px solid ${T.borderD}`,
    borderRadius:6, padding:"13px 16px", color:T.white,
    fontSize:15, fontFamily:"'DM Sans',sans-serif", transition:"border-color .2s", outline:"none",
  };
  const submit = () => {
    if (!form.name || !form.email || !form.message) return;
    const msg = encodeURIComponent(`Hi DigiCore!\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`);
    window.open(`https://wa.me/${WA_NUM}?text=${msg}`, "_blank");
    setSent(true);
  };

  const channels = [
    { emoji:"💬", title:"WhatsApp",   sub:"Fastest response — usually under 5 min",     href:WA_URL },
    { emoji:"📸", title:"Instagram",  sub:"@digicore.official",                           href:SOCIALS.instagram },
    { emoji:"🐦", title:"Twitter/X",  sub:"@DigiCore",                                   href:SOCIALS.twitter },
    { emoji:"💼", title:"LinkedIn",   sub:"DigiCore Ltd.",                                href:SOCIALS.linkedin },
    { emoji:"▶️", title:"YouTube",    sub:"@DigiCoreTech",                                href:SOCIALS.youtube },
    { emoji:"🎵", title:"TikTok",     sub:"@digicore",                                    href:SOCIALS.tiktok },
  ];

  return (
    <div style={{ paddingTop:80 }}>
      <div style={{ padding:"80px 0 52px", textAlign:"center", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${T.borderD} 1px,transparent 1px),linear-gradient(90deg,${T.borderD} 1px,transparent 1px)`, backgroundSize:"60px 60px", opacity:.3 }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <Label>Contact</Label>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3rem,6vw,6rem)", letterSpacing:3, lineHeight:.9 }}>
            LET'S <GT>TALK</GT>
          </h1>
          <p style={{ color:T.muted, maxWidth:440, margin:"16px auto 0", fontSize:15, lineHeight:1.8 }}>Hit us up on WhatsApp for the fastest reply. Or fill out the form and we'll come to you.</p>
        </div>
      </div>
      <Ticker />

      <Section>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48 }}>
          {/* Form */}
          <Card>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:2, marginBottom:28 }}>SEND A MESSAGE</h2>
            {sent ? (
              <div style={{ textAlign:"center", padding:"44px 0" }}>
                <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", letterSpacing:2, marginBottom:10 }}>SENT!</h3>
                <p style={{ color:T.muted, marginBottom:20 }}>WhatsApp is open — finish your message there. We'll reply fast.</p>
                <Btn onClick={()=>setSent(false)} v="outline">Send Another</Btn>
              </div>
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:0 }}>
                  {[["name","Name","Your full name"],["email","Email","you@example.com"]].map(([k,l,ph])=>(
                    <div key={k} style={{ marginBottom:16 }}>
                      <label style={{ display:"block", fontSize:11, fontWeight:700, marginBottom:8, color:T.orange, fontFamily:"'Space Mono',monospace", letterSpacing:2, textTransform:"uppercase" }}>{l}</label>
                      <input type={k==="email"?"email":"text"} placeholder={ph} value={form[k]} onChange={e=>upd(k,e.target.value)} style={inputStyle}
                        onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.borderD}/>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:16 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, marginBottom:8, color:T.orange, fontFamily:"'Space Mono',monospace", letterSpacing:2, textTransform:"uppercase" }}>Subject</label>
                  <input type="text" placeholder="How can we help?" value={form.subject} onChange={e=>upd("subject",e.target.value)} style={inputStyle}
                    onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.borderD}/>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:"block", fontSize:11, fontWeight:700, marginBottom:8, color:T.orange, fontFamily:"'Space Mono',monospace", letterSpacing:2, textTransform:"uppercase" }}>Message</label>
                  <textarea placeholder="Tell us what you need..." value={form.message} onChange={e=>upd("message",e.target.value)} rows={5}
                    style={{...inputStyle, resize:"vertical"}}
                    onFocus={e=>e.target.style.borderColor=T.orange} onBlur={e=>e.target.style.borderColor=T.borderD}/>
                </div>
                <Btn onClick={submit} v="whatsapp" sx={{ width:"100%", justifyContent:"center", fontSize:14 }}>💬 Send via WhatsApp</Btn>
                <p style={{ color:T.dim, fontSize:12, marginTop:10, textAlign:"center", fontFamily:"'Space Mono',monospace", letterSpacing:1 }}>Opens WhatsApp with your message pre-filled.</p>
              </>
            )}
          </Card>

          {/* Channels */}
          <div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:2, marginBottom:8 }}>FIND US ON</h2>
            <p style={{ color:T.muted, fontSize:14, lineHeight:1.8, marginBottom:28 }}>We're active across every major platform. Click any to reach us directly.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {channels.map(c => (
                <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer"
                  style={{ display:"flex", flexDirection:"column", gap:6, padding:"16px 18px", background:T.bg2, border:`1px solid ${T.borderD}`, borderRadius:10, transition:"all .25s", cursor:"pointer" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.orange;e.currentTarget.style.transform="translateY(-3px)"}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.borderD;e.currentTarget.style.transform="none"}}
                >
                  <span style={{ fontSize:22 }}>{c.emoji}</span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.1rem", letterSpacing:1.5 }}>{c.title.toUpperCase()}</span>
                  <span style={{ color:T.muted, fontSize:12 }}>{c.sub}</span>
                </a>
              ))}
            </div>
            {/* Big WhatsApp CTA */}
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"20px 24px", background:"linear-gradient(135deg,#25d366,#128c7e)", borderRadius:10, color:"#fff", fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", letterSpacing:2, boxShadow:"0 4px 20px #25d36644", transition:"all .25s" }}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 32px #25d36666"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px #25d36644"}}
            >
              <span style={{ fontSize:28 }}>💬</span>
              CHAT INSTANTLY ON WHATSAPP
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("Home");
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [page]);

  const renderPage = () => {
    switch(page) {
      case "Home":     return <HomePage setPage={setPage} />;
      case "Services": return <ServicesPage setPage={setPage} />;
      case "Products": return <ProductsPage />;
      case "Pricing":  return <PricingPage setPage={setPage} />;
      case "Contact":  return <ContactPage />;
      default:         return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg }}>
      <style>{GLOBAL_CSS}</style>
      <Navbar page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
      <FloatWA />
    </div>
  );
}
