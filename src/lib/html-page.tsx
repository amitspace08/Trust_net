import { useAuth } from "./auth";

function timeGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

// Indian map embed (OpenStreetMap, centered on Bengaluru MG Road area)
const INDIA_MAP_IFRAME = `<iframe
  title="India Map"
  class="absolute inset-0 w-full h-full border-0"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  src="https://www.openstreetmap.org/export/embed.html?bbox=77.5800%2C12.9550%2C77.6300%2C12.9900&layer=mapnik&marker=12.9716%2C77.5946"
></iframe>`;

function indianize(html: string): string {
  let out = html;
  // Swap static map images for a live OSM embed of an Indian city
  out = out.replace(/<img\b[^>]*data-location="[^"]*"[^>]*>/gi, INDIA_MAP_IFRAME);
  // Location names
  out = out.replace(/Downtown Transit Hub/g, "MG Road Metro Hub");
  out = out.replace(/Downtown/g, "MG Road");
  out = out.replace(/\bLondon\b/g, "Bengaluru");
  out = out.replace(/\bNew York\b/g, "Mumbai");
  out = out.replace(/\bManhattan\b/g, "Bandra");
  // Units: miles → km
  out = out.replace(/(\d+(?:\.\d+)?)\s*miles?\b/gi, (_m, n) => `${(parseFloat(n) * 1.609).toFixed(1)} km`);
  // Currency
  out = out.replace(/\$(\d)/g, "₹$1");
  return out;
}

function addInteractivity(html: string): string {
  let out = html;

  // Tactile press + ripple class to all buttons
  out = out.replace(/<button(\s[^>]*?)class="([^"]*)"/g, (m, attrs, c) => {
    if (/\btn-btn\b/.test(c)) return m;
    return `<button${attrs}class="${c} tn-btn"`;
  });

  // Card lift on common rounded container backgrounds
  out = out.replace(/class="((?:[^"]*\s)?bg-(?:surface-container[\w-]*|primary-container|secondary-container|tertiary-container|surface-container-lowest|surface-container-low)\b[^"]*)"/g,
    (m, c) => {
      if (/\btn-card\b/.test(c)) return m;
      return `class="${c} tn-card"`;
    });

  // Subtle rise-in for major rounded blocks
  out = out.replace(/class="((?:[^"]*\s)?rounded-xl\b[^"]*)"/g, (m, c) => {
    if (/\btn-rise\b/.test(c)) return m;
    return `class="${c} tn-rise"`;
  });

  return out;
}

const INTERACTIVE_CSS = `
<style>
@keyframes tn-rise-kf { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
@keyframes tn-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(99,102,241,.0);} 50% { box-shadow: 0 0 0 8px rgba(99,102,241,.08);} }
.tn-rise { animation: tn-rise-kf .5s cubic-bezier(.16,1,.3,1) both; }
.tn-card { transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease, background-color .2s ease; }
.tn-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px -14px rgba(0,0,0,.22); }
.tn-card:active { transform: translateY(-1px) scale(.995); }
.tn-btn { position: relative; overflow: hidden; transition: transform .15s ease, filter .2s ease, background-color .2s ease; }
.tn-btn:hover { filter: brightness(1.06); }
.tn-btn:active { transform: scale(.94); }
.tn-btn::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: radial-gradient(circle at var(--rx,50%) var(--ry,50%), rgba(255,255,255,.4) 0%, transparent 50%);
  opacity: 0; transition: opacity .45s ease;
}
.tn-btn:active::after { opacity: 1; transition: opacity .05s; }
button:focus-visible, a:focus-visible { outline: 2px solid rgb(99 102 241 / .6); outline-offset: 2px; border-radius: 12px; }
.material-symbols-outlined { transition: transform .2s ease; }
.tn-btn:hover .material-symbols-outlined { transform: scale(1.1); }
iframe[title="India Map"] { transition: filter .35s ease, transform .5s ease; }
.group:hover iframe[title="India Map"] { filter: saturate(1.15) contrast(1.05); transform: scale(1.02); }
.tn-rise:nth-child(2){animation-delay:.05s}.tn-rise:nth-child(3){animation-delay:.1s}.tn-rise:nth-child(4){animation-delay:.15s}.tn-rise:nth-child(5){animation-delay:.2s}.tn-rise:nth-child(6){animation-delay:.25s}
</style>
<script>(function(){if(window.__tnRipple)return;window.__tnRipple=1;document.addEventListener('pointerdown',function(e){var t=e.target.closest&&e.target.closest('.tn-btn');if(!t)return;var r=t.getBoundingClientRect();t.style.setProperty('--rx',((e.clientX-r.left)/r.width*100)+'%');t.style.setProperty('--ry',((e.clientY-r.top)/r.height*100)+'%');},true);})();</script>
`;

export function personalize(html: string, fullName: string, email: string): string {
  const first = (fullName || "").trim().split(/\s+/)[0] || "Friend";
  const initial = first.charAt(0).toUpperCase();
  const greeting = timeGreeting();

  let out = indianize(html);
  out = out.replace(/Priya Sharma/g, fullName || first);
  out = out.replace(/Elena Rodriguez/g, fullName || first);
  out = out.replace(/\bPriya\s+S\./g, `${first} ${initial}.`);
  out = out.replace(/\bElena\s+R\./g, `${first} ${initial}.`);
  out = out.replace(/\bPriya\b/g, first);
  out = out.replace(/\bElena\b/g, first);
  out = out.replace(/Good\s+(Morning|Afternoon|Evening),\s*[A-Za-z]+/g, `${greeting}, ${first}`);
  if (email) {
    out = out.replace(/[a-z0-9._%+-]+@example\.(com|org)/gi, email);
    out = out.replace(/priya\.sharma@[^\s"'<]+/gi, email);
    out = out.replace(/elena\.rodriguez@[^\s"'<]+/gi, email);
  }
  out = addInteractivity(out);
  return INTERACTIVE_CSS + out;
}

export function HtmlPage({ html, className }: { html: string; className?: string }) {
  const { user } = useAuth();
  const name = user?.name || "Friend";
  const email = user?.email || "";
  const finalHtml = personalize(html, name, email);
  return (
    <div
      className={className ?? "bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased"}
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
}
