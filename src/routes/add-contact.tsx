import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  loadContacts,
  saveContacts,
  loadRequests,
  saveRequests,
  MOCK_USER_DIRECTORY,
  Contact,
  ContactRequest,
} from "../lib/contacts-db";

export const Route = createFileRoute("/add-contact")({
  head: () => ({ meta: [{ title: "TrustNet — Add Contact" }] }),
  component: AddContactPage,
});

function AddContactPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [customName, setCustomName] = useState("");
  const [customRelation, setCustomRelation] = useState("Friend");
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Load state on mount
  useEffect(() => {
    setContacts(loadContacts());
    setRequests(loadRequests());
  }, []);

  const updateContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    saveContacts(newContacts);
  };

  const updateRequests = (newRequests: ContactRequest[]) => {
    setRequests(newRequests);
    saveRequests(newRequests);
  };

  // Remove contact from Layer 1
  const removeContact = (id: string) => {
    const next = contacts.filter((c) => c.id !== id);
    updateContacts(next);
  };

  // Send request to a user from directory
  const handleSendRequest = (
    name: string,
    phone: string,
    relation: string,
    avatar: string,
    online: boolean,
  ) => {
    const newRequest: ContactRequest = {
      id: crypto.randomUUID(),
      name,
      phone,
      relation,
      avatar,
      online,
      type: "outgoing",
      status: "Pending",
      at: Date.now(),
    };
    const next = [newRequest, ...requests];
    updateRequests(next);
  };

  // Cancel outgoing pending request
  const handleCancelRequest = (phone: string) => {
    const next = requests.filter((r) => r.phone !== phone);
    updateRequests(next);
  };

  // Accept incoming pending request
  const handleAcceptRequest = (phone: string) => {
    const req = requests.find((r) => r.phone === phone && r.type === "incoming");
    if (!req) return;

    // Change status of request to Accepted
    const nextRequests = requests.map((r) =>
      r.phone === phone && r.type === "incoming" ? { ...r, status: "Accepted" as const } : r,
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

  // Reject incoming pending request
  const handleRejectRequest = (phone: string) => {
    const nextRequests = requests.map((r) =>
      r.phone === phone && r.type === "incoming" ? { ...r, status: "Rejected" as const } : r,
    );
    updateRequests(nextRequests);
  };

  // Custom User invite submission
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !searchQuery.trim()) return;

    // Generate an outgoing request
    const newRequest: ContactRequest = {
      id: crypto.randomUUID(),
      name: customName.trim(),
      phone: searchQuery.trim(),
      relation: customRelation,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCWpKa7rM0MgxTGa8wnfmmRkJeuGrzTo8jtAmjh4fqS-GiR5uxyDguW4QfV0cpJwBalWWxWMi9c-g6ZEjsg_Vj1IxropD6jiDRVi_0LRMNdlWAM0CaWPXnQjNSAvaqLi06IE69BRgSRKjN4BCRb3LwMft0l0Qrdynv2dm5l12QmFntTea0P2AeCWygqodfIfwXzVOdcOJH_IkGyPJGnmwA5I_B7U7YJbi_DP3FxhUYWqpfKToHJefY-1b88Qdnd-m_r3Xy4yXbRyUBP", // Default/fallback avatar
      online: false, // Custom invited contact is offline initially
      type: "outgoing",
      status: "Pending",
      at: Date.now(),
    };

    updateRequests([newRequest, ...requests]);
    setCustomName("");
    setShowCustomForm(false);
  };

  // Determine relationship status of a user relative to current contacts/requests
  const getContactState = (phone: string) => {
    const isContact = contacts.some((c) => c.phone === phone);
    if (isContact) return { status: "Added" };

    const req = requests.find((r) => r.phone === phone);
    if (req) {
      return { status: req.status, type: req.type };
    }

    return { status: "None" };
  };

  // Filter mock directory by phone search query
  const filteredUsers = searchQuery.trim()
    ? MOCK_USER_DIRECTORY.filter((u) =>
        u.phone.replace(/\D/g, "").includes(searchQuery.replace(/\D/g, "")),
      )
    : [];

  return (
    <div className="min-h-screen bg-[#faf9fc] pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 flex items-center gap-3 px-4 h-14">
        <Link
          to="/circle"
          className="material-symbols-outlined text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition"
        >
          arrow_back
        </Link>
        <h1 className="text-base font-semibold flex-1">Search &amp; Add Contacts</h1>
        <button
          onClick={() => router.navigate({ to: "/circle" })}
          className="text-xs font-semibold text-[#0d631b] hover:bg-[#0d631b]/5 px-3 py-1.5 rounded-full transition"
        >
          Done
        </button>
      </header>

      <div className="max-w-md md:max-w-2xl mx-auto p-4 flex flex-col gap-6">
        {/* Search Panel */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-2">Search TrustNet Network</h2>
          <p className="text-xs text-gray-500 mb-4">
            Enter a phone number to search for registered guardians and contacts.
          </p>

          <div className="relative">
            <input
              type="tel"
              placeholder="e.g. +1 (555) 123-4567"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowCustomForm(false); // Hide custom form when query changes
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0d631b]/30 focus:border-[#0d631b] transition"
            />
            <span className="material-symbols-outlined absolute left-3.5 top-3 text-gray-400 text-lg">
              search
            </span>
          </div>

          {/* Search Results */}
          {searchQuery.trim() && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Search Results ({filteredUsers.length})
              </h3>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-500">
                    No registered user found with that number.
                  </p>
                  {!showCustomForm ? (
                    <button
                      onClick={() => setShowCustomForm(true)}
                      className="mt-2 text-xs font-bold text-[#0d631b] hover:underline"
                    >
                      Invite "+ {searchQuery}" manually to Circle?
                    </button>
                  ) : (
                    <form
                      onSubmit={handleCustomSubmit}
                      className="mt-4 px-4 text-left flex flex-col gap-3"
                    >
                      <hr className="border-gray-200 my-1" />
                      <p className="text-[11px] font-semibold text-gray-700">
                        Invite Out-of-Network Contact
                      </p>
                      <label className="text-xs text-gray-600 flex flex-col gap-1">
                        Full Name
                        <input
                          required
                          type="text"
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs"
                          placeholder="Mom, Friend Name, etc."
                        />
                      </label>
                      <label className="text-xs text-gray-600 flex flex-col gap-1">
                        Relationship
                        <select
                          value={customRelation}
                          onChange={(e) => setCustomRelation(e.target.value)}
                          className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white"
                        >
                          {["Family", "Friend", "Partner", "Colleague", "Neighbor", "Other"].map(
                            (r) => (
                              <option key={r}>{r}</option>
                            ),
                          )}
                        </select>
                      </label>
                      <button
                        type="submit"
                        className="bg-[#0d631b] hover:bg-[#0a5215] text-white text-xs font-bold py-2 rounded-lg transition"
                      >
                        Send Circle Invite
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {filteredUsers.map((u) => {
                    const state = getContactState(u.phone);

                    return (
                      <div
                        key={u.phone}
                        className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              alt={u.name}
                              src={u.avatar}
                              className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            />
                            {/* Online/Offline status indicator */}
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                                u.online ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-gray-900 flex items-center gap-1.5">
                              {u.name}
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({u.relation})
                              </span>
                            </p>
                            <p className="text-[10px] text-gray-500">{u.phone}</p>
                          </div>
                        </div>

                        <div>
                          {state.status === "Added" && (
                            <span className="text-[11px] font-bold text-[#0d631b] bg-[#0d631b]/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">check</span>
                              Added
                            </span>
                          )}

                          {state.status === "Pending" && state.type === "outgoing" && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-semibold">
                                Pending
                              </span>
                              <button
                                onClick={() => handleCancelRequest(u.phone)}
                                className="text-[10px] font-bold text-red-600 hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {state.status === "Pending" && state.type === "incoming" && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleAcceptRequest(u.phone)}
                                className="bg-[#0d631b] text-white text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-[#0a5215]"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleRejectRequest(u.phone)}
                                className="border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-red-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {state.status === "Rejected" && (
                            <button
                              onClick={() =>
                                handleSendRequest(u.name, u.phone, u.relation, u.avatar, u.online)
                              }
                              className="bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full hover:bg-gray-700"
                            >
                              Rejected (Retry)
                            </button>
                          )}

                          {state.status === "None" && (
                            <button
                              onClick={() =>
                                handleSendRequest(u.name, u.phone, u.relation, u.avatar, u.online)
                              }
                              className="bg-[#0d631b] text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#0a5215] transition shadow-sm"
                            >
                              Send Invite
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Existing Contacts Section */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
            Your Trust Circle contacts ({contacts.length})
          </h2>

          {contacts.length === 0 ? (
            <p className="text-xs text-gray-400 bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-center shadow-sm">
              No trusted contacts yet. Use the search bar above to invite members.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {contacts.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-gray-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-gray-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        alt={c.name}
                        src={c.avatar}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                      {/* Visual indicator of online status */}
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
                          c.online ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-900 flex items-center gap-1.5">
                        {c.name}
                        <span className="text-[10px] text-gray-400 font-normal">
                          ({c.relation})
                        </span>
                      </p>
                      <p className="text-[10px] text-gray-500">{c.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === "Active"
                          ? "bg-green-50 text-[#0d631b]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={() => removeContact(c.id)}
                      className="text-gray-400 hover:text-red-600 transition p-1 rounded-full hover:bg-gray-55"
                      aria-label="Remove Contact"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
