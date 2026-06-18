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
  return out;
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
