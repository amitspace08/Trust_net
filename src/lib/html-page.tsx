import { useAuth } from "./auth";

const NAME_PLACEHOLDERS = [
  /Priya Sharma/g,
  /Elena Rodriguez/g,
];
const FIRST_NAME_PLACEHOLDERS = [
  /\bPriya\b/g,
  /\bElena\b/g,
];

export function personalize(html: string, fullName: string): string {
  const first = (fullName || "").trim().split(/\s+/)[0] || "Friend";
  let out = html;
  for (const re of NAME_PLACEHOLDERS) out = out.replace(re, fullName || first);
  for (const re of FIRST_NAME_PLACEHOLDERS) out = out.replace(re, first);
  return out;
}

export function HtmlPage({ html, className }: { html: string; className?: string }) {
  const { user } = useAuth();
  const name = user?.name || "Friend";
  const finalHtml = personalize(html, name);
  return (
    <div
      className={className ?? "bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased"}
      dangerouslySetInnerHTML={{ __html: finalHtml }}
    />
  );
}
