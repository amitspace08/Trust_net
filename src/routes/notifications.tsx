import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "TrustNet — Notifications" }] }),
  component: NotificationsPage,
});

type N = { id: string; icon: string; title: string; body: string; time: string; tone: "info" | "warn" | "ok" };

const SEED: N[] = [
  { id: "1", icon: "warning", title: "Incident reported nearby", body: "Suspicious activity reported 320m from your location.", time: "2m", tone: "warn" },
  { id: "2", icon: "verified_user", title: "Guardian approved", body: "Rahul accepted your guardian request.", time: "1h", tone: "ok" },
  { id: "3", icon: "location_on", title: "Geofence entered", body: "You arrived at Home safely.", time: "3h", tone: "info" },
  { id: "4", icon: "groups", title: "Circle update", body: "Aisha shared her live location with you.", time: "Yesterday", tone: "info" },
];

function NotificationsPage() {
  const [items, setItems] = useState(SEED);
  const clear = () => setItems([]);

  return (
    <div className="min-h-screen bg-[#faf9fc] pb-24 md:pb-8">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center gap-3 px-4 h-14">
        <Link to="/" className="material-symbols-outlined text-gray-700">arrow_back</Link>
        <h1 className="text-base font-semibold flex-1">Notifications</h1>
        <button onClick={clear} className="text-xs font-medium text-[#0d631b]">Clear all</button>
      </header>
      <div className="max-w-md md:max-w-2xl mx-auto p-4 flex flex-col gap-3">
        {items.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-16">You're all caught up.</div>
        )}
        {items.map((n) => (
          <div key={n.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              n.tone === "warn" ? "bg-red-100 text-red-600" : n.tone === "ok" ? "bg-green-100 text-[#0d631b]" : "bg-blue-100 text-blue-600"
            }`}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{n.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-semibold text-sm text-gray-900 truncate">{n.title}</p>
                <span className="text-[11px] text-gray-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>
            </div>
            <button
              onClick={() => setItems((s) => s.filter((x) => x.id !== n.id))}
              className="material-symbols-outlined text-gray-400 self-start"
              style={{ fontSize: 18 }}
              aria-label="Dismiss"
            >close</button>
          </div>
        ))}
      </div>
    </div>
  );
}
