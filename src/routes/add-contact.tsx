import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/add-contact")({
  head: () => ({ meta: [{ title: "TrustNet — Add Contact" }] }),
  component: AddContactPage,
});

export type Contact = { id: string; name: string; phone: string; relation: string; at: number };

export function loadContacts(): Contact[] {
  try { return JSON.parse(localStorage.getItem("trustnet_contacts") || "[]"); } catch { return []; }
}
export function saveContacts(c: Contact[]) {
  localStorage.setItem("trustnet_contacts", JSON.stringify(c));
}

function AddContactPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("Friend");
  const [list, setList] = useState<Contact[]>([]);

  useEffect(() => { setList(loadContacts()); }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const next = [{ id: crypto.randomUUID(), name: name.trim(), phone: phone.trim(), relation, at: Date.now() }, ...list];
    saveContacts(next);
    setList(next);
    setName(""); setPhone("");
  }

  function remove(id: string) {
    const next = list.filter((c) => c.id !== id);
    saveContacts(next); setList(next);
  }

  return (
    <div className="min-h-screen bg-[#faf9fc] pb-24 md:pb-8">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center gap-3 px-4 h-14">
        <Link to="/circle" className="material-symbols-outlined text-gray-700">arrow_back</Link>
        <h1 className="text-base font-semibold flex-1">Trusted contacts</h1>
        <button onClick={() => router.navigate({ to: "/circle" })} className="text-xs font-medium text-[#0d631b]">Done</button>
      </header>
      <div className="max-w-md md:max-w-2xl mx-auto p-4 flex flex-col gap-5">
        <form onSubmit={submit} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
          <label className="text-sm text-gray-700 flex flex-col gap-1">Name
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className="border border-gray-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm text-gray-700 flex flex-col gap-1">Phone
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required
              className="border border-gray-300 rounded-lg px-3 py-2" />
          </label>
          <label className="text-sm text-gray-700 flex flex-col gap-1">Relation
            <select value={relation} onChange={(e) => setRelation(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white">
              {["Family", "Friend", "Partner", "Colleague", "Neighbor", "Other"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="bg-[#0d631b] text-white font-semibold py-2.5 rounded-full">
            Add contact
          </button>
        </form>

        <section>
          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Your contacts ({list.length})</p>
          {list.length === 0 && (
            <p className="text-sm text-gray-500 bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-center">
              No trusted contacts yet. Add someone above.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {list.map((c) => (
              <div key={c.id} className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0d631b]/10 text-[#0d631b] flex items-center justify-center font-semibold">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 truncate">{c.relation} · {c.phone}</p>
                </div>
                <button onClick={() => remove(c.id)} className="material-symbols-outlined text-gray-400" aria-label="Remove">delete</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
