import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import {
  loadContacts,
  saveContacts,
  loadRequests,
  saveRequests,
  Contact,
  ContactRequest,
} from "../lib/contacts-db";

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [{ title: "TrustNet - My Trust Circle" }],
  }),
  component: TrustCirclePage,
});

function TrustCirclePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    setContacts(loadContacts());
    setRequests(loadRequests());
  }, []);

  // Update localStorage when state changes
  const updateContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    saveContacts(newContacts);
  };

  const updateRequests = (newRequests: ContactRequest[]) => {
    setRequests(newRequests);
    saveRequests(newRequests);
  };

  // Toggle Active/Inactive status
  const toggleContactStatus = (id: string) => {
    const next = contacts.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === "Active" ? ("Inactive" as const) : ("Active" as const),
        };
      }
      return c;
    });
    updateContacts(next);
    setActiveMenuId(null);
  };

  // Remove contact
  const removeContact = (id: string) => {
    const next = contacts.filter((c) => c.id !== id);
    updateContacts(next);
    setActiveMenuId(null);
  };

  // Accept incoming request
  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    // Change request status to Accepted
    const nextRequests = requests.map((r) =>
      r.id === reqId ? { ...r, status: "Accepted" as const } : r,
    );
    updateRequests(nextRequests);

    const directoryUser = MOCK_USER_DIRECTORY.find((u) => u.phone === req.phone);
    const newContact: Contact = {
      id: crypto.randomUUID(),
      name: req.name,
      phone: req.phone,
      relation: req.relation,
      avatar: req.avatar,
      online: req.online,
      status: "Active",
      at: Date.now(),
      shareLocation: directoryUser ? directoryUser.shareLocation : true,
      lastUpdated: directoryUser ? directoryUser.lastUpdated : "Just now",
      distance: directoryUser ? directoryUser.distance : "Unknown",
      latitude: directoryUser ? directoryUser.latitude : 12.9716,
      longitude: directoryUser ? directoryUser.longitude : 77.5946,
    };
    updateContacts([newContact, ...contacts]);
  };

  // Reject incoming request
  const handleRejectRequest = (reqId: string) => {
    const nextRequests = requests.map((r) =>
      r.id === reqId ? { ...r, status: "Rejected" as const } : r,
    );
    updateRequests(nextRequests);
  };

  // Cancel outgoing request
  const handleCancelRequest = (reqId: string) => {
    const nextRequests = requests.filter((r) => r.id !== reqId);
    updateRequests(nextRequests);
  };

  // Clear a processed (Accepted/Rejected) request from list view
  const handleDismissRequest = (reqId: string) => {
    const nextRequests = requests.filter((r) => r.id !== reqId);
    updateRequests(nextRequests);
  };

  const pendingRequests = requests.filter((r) => r.status === "Pending");
  const processedRequests = requests.filter((r) => r.status !== "Pending");

  return (
    <div className="w-full min-h-screen relative flex flex-col md:flex-row pb-24 md:pb-0 bg-[#faf9fc]">
      {/* NavigationDrawer (Web Only) */}
      <nav className="hidden md:flex flex-col bg-white text-gray-800 h-full rounded-r-2xl shadow-sm border-r border-gray-150 w-72 max-w-[80vw] p-5 fixed left-0 top-0 z-50">
        <div className="flex items-center gap-4 mb-8 pt-4">
          <img
            alt="User Profile"
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWpKa7rM0MgxTGa8wnfmmRkJeuGrzTo8jtAmjh4fqS-GiR5uxyDguW4QfV0cpJwBalWWxWMi9c-g6ZEjsg_Vj1IxropD6jiDRVi_0LRMNdlWAM0CaWPXnQjNSAvaqLi06IE69BRgSRKjN4BCRb3LwMft0l0Qrdynv2dm5l12QmFntTea0P2AeCWygqodfIfwXzVOdcOJH_IkGyPJGnmwA5I_B7U7YJbi_DP3FxhUYWqpfKToHJefY-1b88Qdnd-m_r3Xy4yXbRyUBP"
          />
          <div>
            <h2 className="text-sm font-bold text-gray-900">{user?.name || "Priya Sharma"}</h2>
            <p className="text-xs text-gray-500">Trust Score: 98</p>
            <p className="text-xs text-[#0d631b] font-semibold mt-0.5">Safety Status: Protected</p>
          </div>
        </div>
        <ul className="flex flex-col gap-1.5">
          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">settings_ethernet</span>
              Emergency Settings
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">history</span>
              Safety History
            </Link>
          </li>
          <li>
            <Link
              to="/privacy"
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">privacy_tip</span>
              Privacy Guard
            </Link>
          </li>
          <li>
            <Link
              to="/support"
              className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">help</span>
              Support
            </Link>
          </li>
        </ul>
        <div className="mt-auto">
          <ul className="flex flex-col gap-1.5">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">home</span>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/heatmap"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">map</span>
                Heatmap
              </Link>
            </li>
            <li>
              <Link
                to="/circle"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0d631b]/10 text-[#0d631b] font-bold text-sm"
              >
                <span
                  className="material-symbols-outlined text-lg fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  group
                </span>
                Circle
              </Link>
            </li>
            <li>
              <Link
                to="/guardian"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">security</span>
                Guardian
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                Profile
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* TopAppBar (Mobile Only) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 flex justify-between items-center px-4 h-16 w-full md:hidden">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-[#0d631b] hover:bg-gray-100 transition">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">TrustNet</h1>
        </div>
        <Link
          to="/notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 transition"
        >
          <span className="material-symbols-outlined">notifications</span>
        </Link>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 md:ml-72 pb-24 md:pb-6">
        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            My Trust Circle
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage the people who keep you safe and build your network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Layer 1 Section */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Direct Trusted Contacts</h2>
              <span className="text-xs font-semibold bg-[#0d631b]/10 text-[#0d631b] px-2.5 py-1 rounded-full">
                Layer 1
              </span>
            </div>

            {/* Contacts Container */}
            <div className="bg-white border border-gray-200/80 rounded-2xl p-4 flex flex-col gap-3.5 shadow-sm">
              {contacts.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">
                  No trusted contacts in your Circle yet.
                </div>
              ) : (
                contacts.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 hover:border-gray-200/65 transition relative ${
                      c.status === "Inactive" ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Avatar with Online/Offline Indicator */}
                      <div className="relative">
                        <img
                          alt={`${c.name} Profile`}
                          className={`w-12 h-12 rounded-full object-cover border-2 ${
                            c.status === "Active"
                              ? "border-[#0d631b]/30"
                              : "border-gray-200 grayscale"
                          }`}
                          src={c.avatar}
                        />
                        {/* Visual indicator of online status */}
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            c.online ? "bg-green-500" : "bg-gray-400"
                          }`}
                          title={c.online ? "Online" : "Offline"}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-1.5">
                          {c.name}
                          <span className="text-[11px] font-normal text-gray-400">
                            ({c.relation})
                          </span>
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          {c.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status pill */}
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                          c.status === "Active"
                            ? "bg-[#0d631b]/10 text-[#0d631b]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" ? "bg-[#0d631b]" : "bg-gray-400"}`}
                        ></span>
                        {c.status}
                      </span>

                      {/* Dropdown Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                          className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                        {activeMenuId === c.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-20">
                            <button
                              onClick={() => toggleContactStatus(c.id)}
                              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 font-medium flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-sm">
                                {c.status === "Active" ? "toggle_off" : "toggle_on"}
                              </span>
                              Set {c.status === "Active" ? "Inactive" : "Active"}
                            </button>
                            <button
                              onClick={() => removeContact(c.id)}
                              className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 border-t border-gray-100"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Remove Contact
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Add Contact Button */}
              <Link
                to="/add-contact"
                className="w-full py-3 mt-1 border-2 border-dashed border-[#0d631b]/30 hover:border-[#0d631b]/50 rounded-xl text-[#0d631b] font-semibold text-sm hover:bg-[#0d631b]/5 transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">person_add</span>
                Add Contact
              </Link>
            </div>

            {/* Pending Requests & Contact Request UI (States: Pending, Accepted, Rejected) */}
            <div className="mt-2">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                Pending Circle Requests
                {pendingRequests.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {pendingRequests.length}
                  </span>
                )}
              </h3>

              <div className="flex flex-col gap-2.5">
                {requests.length === 0 && (
                  <p className="text-xs text-gray-400 bg-white border border-gray-200 rounded-xl p-4 text-center">
                    No pending invites or request actions.
                  </p>
                )}

                {requests.map((r) => {
                  if (r.status === "Pending") {
                    return (
                      <div
                        key={r.id}
                        className="bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between shadow-sm border-l-4 border-amber-400"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              alt={r.name}
                              src={r.avatar}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                                r.online ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">
                              {r.name}
                              <span className="text-[10px] ml-1.5 text-gray-400 font-normal bg-gray-100 px-1.5 py-0.5 rounded">
                                {r.relation}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {r.type === "incoming"
                                ? "Wants to join your circle"
                                : "Awaiting Acceptance"}
                            </p>
                          </div>
                        </div>

                        {r.type === "incoming" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptRequest(r.id)}
                              className="bg-[#0d631b] hover:bg-[#0a5215] text-white text-xs font-bold px-3 py-1.5 rounded-full transition shadow-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectRequest(r.id)}
                              className="border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold px-3 py-1.5 rounded-full transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCancelRequest(r.id)}
                            className="text-xs text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    );
                  } else {
                    // Accepted or Rejected states UI
                    return (
                      <div
                        key={r.id}
                        className={`bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between shadow-sm opacity-80 ${
                          r.status === "Accepted"
                            ? "border-l-4 border-[#0d631b]"
                            : "border-l-4 border-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={r.name}
                            src={r.avatar}
                            className="w-8 h-8 rounded-full object-cover grayscale"
                          />
                          <div>
                            <p className="font-semibold text-xs text-gray-700">{r.name}</p>
                            <p className="text-[10px] text-gray-400">Request {r.status}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              r.status === "Accepted"
                                ? "bg-green-150 text-[#0d631b]"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {r.status}
                          </span>
                          <button
                            onClick={() => handleDismissRequest(r.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Dismiss notification"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </section>

          {/* Desktop Right Side Panel: L2 Info & Friends of Friends */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            {/* Info Banner */}
            <div className="bg-[#54a0fe]/10 border border-[#54a0fe]/20 rounded-2xl p-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-[#005faf] mt-0.5">info</span>
              <div>
                <h3 className="font-bold text-sm text-[#003567] mb-1">Layer 2 Explained</h3>
                <p className="text-xs text-[#003567] leading-relaxed">
                  Friends of Friends form your extended safety net. They are vetted by your direct
                  contacts, expanding your safe zones.
                </p>
              </div>
            </div>

            {/* Layer 2 Contacts */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-base font-bold text-gray-900">Friends of Friends</h2>
                <span className="text-[10px] font-semibold bg-[#54a0fe]/10 text-[#005faf] px-2 py-0.5 rounded-full">
                  Layer 2
                </span>
              </div>

              {/* L2 Item 1: Rahul Sharma */}
              <div className="p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between transition">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      alt="Rahul Sharma"
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqKJau6jwMTr6vH6d26Tv1qITburRYz5wRShmY_rp2XWgZwlsXLRNIMprBXGfg3xXzitKpE8W2f0CTQ_ss8J8V3-COU8_KlfOYetVtYGoaBJnVUDQ7arjALd787_L-ETvHWv0IlhC1cftMJATFEEdl-pBEpD_J-CsOsIIocB9dBKBtkWT0RY_cWs4igh9MPAc2YdebZYLyTGZ_HdlZGrzFjMEEScMjznDRa28mL86-k4hoZRkAtLYj7rT4-xIsyoM3yronrBklG06K"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <span className="material-symbols-outlined text-[10px] text-white bg-[#005faf] rounded-full p-0.5">
                        verified
                      </span>
                    </div>
                    {/* Visual indicator of online status */}
                    <span
                      className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border border-white bg-green-500"
                      title="Online"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Rahul Sharma</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">group</span>3 mutuals
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-xs text-[#0d631b]">92%</span>
                  <span className="text-[9px] text-gray-400">Trust Score</span>
                </div>
              </div>

              {/* L2 Item 2: Sara Jones */}
              <div className="p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between transition">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      alt="Sara Jones"
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz7NXTobBoxZS1LdenK3OFVM6-ycj1Al0vdt_05W4mAnVc1HKeAU5X0wjI4mOW_96iJATXDwzN-KX96CFeKDO8aO5kU1HyKVdYegXeE9YTmQb2Kix9oUmHDQEHhucM6cypQ8UlakJgcpMGTHzXNQkEjTfm_AzkyYwrEfI9Smfr9IQDRqdex7Wv-1va9Yfj7UROZo-uWN3zTHBjlrZ-dZeQpt1dseQjejo3DphHZV9e69BUGJ_0bUb_2zzgaycMWMNkgSGKmHcq05Zn"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <span className="material-symbols-outlined text-[10px] text-white bg-[#005faf] rounded-full p-0.5">
                        verified
                      </span>
                    </div>
                    {/* Visual indicator of offline status */}
                    <span
                      className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border border-white bg-gray-400"
                      title="Offline"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-900">Sara Jones</h4>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[12px]">group</span>1 mutual
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-xs text-[#0d631b]">85%</span>
                  <span className="text-[9px] text-gray-400">Trust Score</span>
                </div>
              </div>

              {/* Invite Button */}
              <button className="mt-2 w-full bg-[#0d631b] text-white text-xs font-semibold py-3 rounded-xl hover:bg-[#0a5215] transition-all flex items-center justify-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-sm">share</span>
                Invite Friends to Network
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
