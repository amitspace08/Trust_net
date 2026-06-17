import { useAuth } from "./auth";

function timeGreeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function personalize(html: string, fullName: string, email: string): string {
  const first = (fullName || "").trim().split(/\s+/)[0] || "Friend";
  const initial = first.charAt(0).toUpperCase();
  const greeting = timeGreeting();

  let out = html;
  // Full names
  out = out.replace(/Priya Sharma/g, fullName || first);
  out = out.replace(/Elena Rodriguez/g, fullName || first);
  // "Priya S." style (first + initial)
  out = out.replace(/\bPriya\s+S\./g, `${first} ${initial}.`);
  out = out.replace(/\bElena\s+R\./g, `${first} ${initial}.`);
  // First names
  out = out.replace(/\bPriya\b/g, first);
  out = out.replace(/\bElena\b/g, first);
  // Greetings — normalize any hardcoded time-of-day to match current time
  out = out.replace(/Good\s+(Morning|Afternoon|Evening),\s*[A-Za-z]+/g, `${greeting}, ${first}`);
  // Email placeholders
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
