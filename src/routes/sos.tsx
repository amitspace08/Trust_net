import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadContacts, Contact, getLayer2Candidates, Layer2Candidate } from "../lib/contacts-db";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [{ title: "TrustNet - Emergency SOS" }],
  }),
  component: SosEmergencyPage,
});

function SosEmergencyPage() {
  const router = useRouter();
  const [activeState, setActiveState] = useState<"countdown" | "active" | "l2-searching" | "l3-searching">(
    "countdown",
  );
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [layer2Contacts, setLayer2Contacts] = useState<Layer2Candidate[]>([]);
  const [escalationTime, setEscalationTime] = useState(90); // L1 → L2 timeout
  const [layer3EscalationTime, setLayer3EscalationTime] = useState(90); // L2 → L3 timeout
  const [isLayer2Escalated, setIsLayer2Escalated] = useState(false);
  const [isLayer3Escalated, setIsLayer3Escalated] = useState(false);
  const [responderName, setResponderName] = useState<string | null>(null);
  const [declinedResponders, setDeclinedResponders] = useState<string[]>([]);

  // Safety confirmation states
  const [confirmSafety, setConfirmSafety] = useState(false);
  const [isSafeEnded, setIsSafeEnded] = useState(false);
  const [confirmTimeoutId, setConfirmTimeoutId] = useState<number | null>(null);

  // Load contacts lists
  useEffect(() => {
    setContacts(loadContacts());
    setLayer2Contacts(getLayer2Candidates());
  }, []);

  // Poll localStorage for responder status
  useEffect(() => {
    const checkResponder = () => {
      try {
        const raw = localStorage.getItem("trustnet_sos_state");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.responderName) {
            setResponderName(parsed.responderName);
          }
          if (parsed.layer === 2) {
            setIsLayer2Escalated(true);
          }
          if (parsed.declinedResponders) {
            setDeclinedResponders(parsed.declinedResponders);
          }
        }
      } catch {
        // Fallback
      }
    };

    checkResponder();
    const interval = setInterval(checkResponder, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle countdown logic
  useEffect(() => {
    if (activeState !== "countdown") return;

    if (secondsLeft <= 0) {
      setActiveState("active");
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({ status: "active", layer: 1, distressedUser: "Priya Sharma" }),
      );
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, activeState]);

  // L1 → L2 escalation timer
  useEffect(() => {
    if (activeState !== "active") return;
    if (isLayer2Escalated) return;
    if (responderName) return; // someone responded, stop
    if (escalationTime <= 0) {
      setActiveState("l2-searching");
      return;
    }
    const timer = setTimeout(() => setEscalationTime(escalationTime - 1), 1000);
    return () => clearTimeout(timer);
  }, [escalationTime, activeState, isLayer2Escalated, responderName]);

  // L2 → L3 escalation timer (starts after L2 activates, if still no responder)
  useEffect(() => {
    if (!isLayer2Escalated) return;
    if (isLayer3Escalated) return;
    if (responderName) return; // someone responded, stop
    if (layer3EscalationTime <= 0) {
      setActiveState("l3-searching");
      return;
    }
    const timer = setTimeout(() => setLayer3EscalationTime(layer3EscalationTime - 1), 1000);
    return () => clearTimeout(timer);
  }, [layer3EscalationTime, isLayer2Escalated, isLayer3Escalated, responderName]);

  // L2 searching screen → auto-advance to active L2 state
  useEffect(() => {
    if (activeState !== "l2-searching") return;
    const timer = setTimeout(() => {
      setIsLayer2Escalated(true);
      setActiveState("active");
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({
          status: "active",
          layer: 2,
          distressedUser: "Priya Sharma",
          notifiedLayer2: getLayer2Candidates(),
        }),
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeState]);

  // L3 searching screen → auto-advance to active L3 state
  useEffect(() => {
    if (activeState !== "l3-searching") return;
    const timer = setTimeout(() => {
      setIsLayer3Escalated(true);
      setActiveState("active");
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({
          status: "active",
          layer: 3,
          distressedUser: "Priya Sharma",
          notifiedLayer2: getLayer2Candidates(),
        }),
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [activeState]);

  // Cleanup safety double-tap timeout
  useEffect(() => {
    return () => {
      if (confirmTimeoutId) clearTimeout(confirmTimeoutId);
    };
  }, [confirmTimeoutId]);

  // Cancel before countdown completes
  const handleCancelCountdown = () => {
    localStorage.removeItem("trustnet_sos_state");
    router.navigate({ to: "/" });
  };

  // Double-tap safety stand-down
  const handleEndSosWithDoubleTap = () => {
    if (!confirmSafety) {
      setConfirmSafety(true);
      const timeout = window.setTimeout(() => {
        setConfirmSafety(false);
      }, 3500);
      setConfirmTimeoutId(timeout);
    } else {
      if (confirmTimeoutId) {
        clearTimeout(confirmTimeoutId);
      }
      // Safety stood down
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({
          status: "ended",
          distressedUser: "Priya Sharma",
          responderName: responderName || "Rakesh Kumar",
        }),
      );
      setIsSafeEnded(true);
    }
  };

  const r = 80;
  const c = 2 * Math.PI * r;

  // Render Post-SOS Screen if safety confirmed
  if (isSafeEnded) {
    return (
      <div className="w-full min-h-screen bg-[#faf9fc] flex flex-col justify-between items-center p-6 text-gray-800 select-none animate-fade-in">
        <div className="flex-grow flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-500 text-green-600 flex items-center justify-center shadow-lg animate-scale-in">
            <span className="material-symbols-outlined text-4xl font-black">check</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              SOS ended. You are safe.
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              {responderName || "Rakesh Kumar"} was on the way.
            </p>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-655 leading-relaxed">
              We appreciate the swift response from {responderName || "Rakesh Kumar"}. Your safety
              contacts have been notified that you are safe.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md pb-8">
          <button
            onClick={() => router.navigate({ to: "/" })}
            className="w-full bg-[#0d631b] hover:bg-[#0a5215] text-white font-bold py-4 rounded-xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render Layer 2 escalation searching status screen (Calm and Reassuring)
  if (activeState === "l2-searching") {
    return (
      <div className="w-full min-h-screen bg-indigo-900 flex flex-col justify-between items-center p-6 text-white select-none animate-fade-in relative">
        {/* Soft, calm background gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-850 opacity-95 pointer-events-none" />

        <header className="text-center pt-12 z-10">
          <span className="material-symbols-outlined text-4xl text-indigo-300 animate-pulse">
            security
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-3">Layer 2 Escalation</h1>
        </header>

        {/* Searching Loader Animation */}
        <div className="flex flex-col items-center justify-center gap-6 z-10 max-w-xs text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Pulsing indicator rings */}
            <span className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
            <span className="absolute inset-4 rounded-full border-4 border-indigo-400/30 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-300 flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined text-2xl text-indigo-200 animate-spin"
                style={{ animationDuration: "3s" }}
              >
                language
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white/95">
              No response from your contacts.
            </h2>
            <p className="text-xs text-indigo-200/90 leading-relaxed mt-2.5">
              Finding nearby people who know them...
            </p>
          </div>
        </div>

        {/* Cancel button available at the bottom under stress */}
        <div className="w-full max-w-md pb-8 z-10 flex flex-col items-center">
          <button
            onClick={handleEndSosWithDoubleTap}
            className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-xs"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>I am safe — end
            SOS
          </button>
        </div>
      </div>
    );
  }

  // Render Layer 3 Guardian Angel searching screen (Gold — calm, serious)
  if (activeState === "l3-searching") {
    return (
      <div className="w-full min-h-screen bg-amber-900 flex flex-col justify-between items-center p-6 text-white select-none animate-fade-in relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-950 via-amber-900 to-orange-900 opacity-95 pointer-events-none" />

        <header className="text-center pt-12 z-10">
          <span className="material-symbols-outlined text-4xl text-amber-300 animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            shield_with_heart
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-3">Layer 3 — Guardian Angels</h1>
        </header>

        <div className="flex flex-col items-center justify-center gap-6 z-10 max-w-xs text-center">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border-4 border-amber-400/20 animate-ping" />
            <span className="absolute inset-4 rounded-full border-4 border-amber-300/30 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border-2 border-amber-300 flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined text-2xl text-amber-200 animate-spin"
                style={{ animationDuration: "3s", fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white/95">
              No response from nearby contacts.
            </h2>
            <p className="text-xs text-amber-200/90 leading-relaxed mt-2.5">
              Alerting verified Guardian Angels in your area...
            </p>
            <p className="text-[10px] text-amber-300/70 mt-2 font-medium">
              These are community-verified helpers who have volunteered to respond.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md pb-8 z-10 flex flex-col items-center">
          <button
            onClick={handleEndSosWithDoubleTap}
            className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold py-4 rounded-xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2 uppercase text-xs"
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>I am safe — end SOS
          </button>
        </div>
      </div>
    );
  }

  if (activeState === "countdown") {
    // Countdown Cancel Screen: Full-screen red, countdown, circular progress, cancel button
    return (
      <div className="w-full min-h-screen bg-red-600 flex flex-col justify-between items-center p-6 text-white select-none animate-fade-in relative">
        <div className="absolute inset-0 bg-radial-gradient from-red-500 via-red-600 to-red-700 pointer-events-none" />
        <span className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />

        {/* Top Header */}
        <header className="text-center pt-8 z-10">
          <span className="material-symbols-outlined text-4xl animate-bounce">warning</span>
          <h1 className="text-2xl font-extrabold tracking-tight uppercase mt-2">
            Emergency Triggered
          </h1>
          <p className="text-sm opacity-85 max-w-xs mx-auto mt-2">
            An alert will be sent to your guardians and local emergency dispatch.
          </p>
        </header>

        {/* Circular Countdown Progress */}
        <div className="relative w-64 h-64 flex items-center justify-center z-10">
          <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={r}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r={r}
              stroke="#ffffff"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={Math.round(c)}
              strokeDashoffset={Math.round(c * (1 - secondsLeft / 5))}
              style={{ transition: "stroke-dashoffset 900ms linear" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-7xl font-black tracking-tight select-none">{secondsLeft}</span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-white/80 mt-1">
              Seconds
            </span>
          </div>
        </div>

        {/* Cancel button */}
        <div className="w-full max-w-md pb-8 z-10 flex flex-col items-center gap-4">
          <p className="text-xs text-red-100 font-semibold animate-pulse">
            Bypassing timer in {secondsLeft} seconds...
          </p>
          <button
            onClick={handleCancelCountdown}
            className="w-full bg-white hover:bg-red-50 text-red-600 font-black text-lg py-5 rounded-2xl shadow-2xl transition active:scale-[0.98] flex items-center justify-center gap-2 tracking-wide uppercase border-2 border-white"
          >
            <span className="material-symbols-outlined text-2xl font-bold">cancel</span>
            Cancel — I am safe
          </button>
        </div>
      </div>
    );
  }

  // Active SOS Screen
  const activeContacts = contacts.filter((c) => c.status === "Active");

  return (
    <div className="w-full min-h-screen relative flex flex-col pb-28 bg-[#faf9fc]">
      {/* Top Banner: color-coded by layer — purple/teal/gold */}
      <div
        className={`w-full py-4 px-4 flex items-center justify-center gap-2.5 sticky top-0 z-50 shadow-md text-white transition-colors duration-500 ${
          isLayer3Escalated
            ? "bg-amber-700"
            : isLayer2Escalated
              ? "bg-teal-700"
              : "bg-purple-700"
        }`}
      >
        <span className="material-symbols-outlined font-bold animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
          {isLayer3Escalated ? "shield_with_heart" : isLayer2Escalated ? "language" : "warning"}
        </span>
        <span className="font-extrabold text-xs md:text-sm uppercase tracking-wider text-center">
          {isLayer3Escalated
            ? "SOS L3 — GUARDIAN ANGELS ALERTED"
            : isLayer2Escalated
              ? "SOS L2 — FRIENDS-OF-FRIENDS ALERTED"
              : "SOS L1 — EMERGENCY ASSISTANCE NOTIFIED"}
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
        <section
          className={`bg-white border-2 rounded-2xl p-5 shadow-sm flex flex-col gap-3 transition-colors ${
            isLayer3Escalated ? "border-amber-500" : isLayer2Escalated ? "border-teal-500" : "border-purple-500"
          }`}
        >
          {/* Live location status bar */}
          <div className="bg-emerald-50 border border-emerald-250 rounded-xl px-3 py-1.5 flex items-center gap-2 self-start">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Location sharing — live</span>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h2
                className={`text-lg font-extrabold flex items-center gap-2 ${
                  isLayer3Escalated ? "text-amber-800" : isLayer2Escalated ? "text-teal-900" : "text-purple-800"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  isLayer3Escalated ? "bg-amber-500" : isLayer2Escalated ? "bg-teal-500" : "bg-purple-500"
                }`}></span>
                {isLayer3Escalated
                  ? "Guardian Angels Alerted"
                  : isLayer2Escalated
                    ? "Broadcasting to Friends-of-Friends"
                    : "Transmitting Location & Audio"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isLayer3Escalated
                  ? "Verified community Guardian Angels within 500m are receiving your alert."
                  : isLayer2Escalated
                    ? "Second degree contacts within proximity are receiving safety signals."
                    : "Your direct guardians are tracking your location in real time."}
              </p>
            </div>
            {isLayer3Escalated ? (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-200">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                Layer 3 — Guardian Angels
              </span>
            ) : !isLayer2Escalated ? (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  L2 escalation in {escalationTime}s
                </span>
                <button
                  onClick={() => { setEscalationTime(0); setActiveState("l2-searching"); }}
                  className="text-[9px] text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded px-2 py-0.5 transition font-semibold"
                >
                  Simulate L2 Timeout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-teal-100">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Layer 2 Active — L3 in {layer3EscalationTime}s
                </span>
                <button
                  onClick={() => { setLayer3EscalationTime(0); setActiveState("l3-searching"); }}
                  className="text-[9px] text-gray-400 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded px-2 py-0.5 transition font-semibold"
                >
                  Simulate L3 Timeout
                </button>
              </div>
            )}
          </div>

          {/* Privacy notice — L2 and L3 */}
          {(isLayer2Escalated || isLayer3Escalated) && (
            <div className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-[10px] font-medium leading-relaxed border ${
              isLayer3Escalated ? "bg-amber-50/70 border-amber-100 text-amber-900/85" : "bg-teal-50/70 border-teal-100 text-teal-900/85"
            }`}>
              <span className={`material-symbols-outlined text-sm shrink-0 mt-0.5 ${isLayer3Escalated ? "text-amber-600" : "text-teal-600"}`}>lock</span>
              <span>
                <strong className="font-bold">Privacy protected:</strong> Showing your approximate location only. Exact location shared when someone confirms they are helping.
              </span>
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mt-1 overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-1000 ${
              isLayer3Escalated ? "bg-amber-500 w-full" : isLayer2Escalated ? "bg-teal-500 w-[66%]" : "bg-purple-500 w-[33%]"
            }`}></div>
          </div>

          {/* 4-node Timeline: L1(purple) → L2(teal) → L3(gold) → Police */}
          <div className="flex justify-between relative mt-2 text-xs">
            <div className="absolute top-3 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

            {/* L1 */}
            <div className={`flex flex-col items-center gap-1 bg-white px-1 ${isLayer2Escalated ? "opacity-60" : ""}`}>
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-xs">check</span>
              </div>
              <span className="font-bold text-purple-700 text-[9px]">L1</span>
            </div>

            {/* L2 */}
            <div className={`flex flex-col items-center gap-1 bg-white px-1 ${isLayer2Escalated ? "" : "opacity-40"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isLayer2Escalated ? "bg-teal-600 text-white border-teal-600 shadow-sm" : "bg-gray-200 text-gray-500 border-gray-300"
              }`}>
                <span className="material-symbols-outlined text-xs">{isLayer2Escalated ? "check" : "2"}</span>
              </div>
              <span className={`font-bold text-[9px] ${isLayer2Escalated ? "text-teal-700" : "text-gray-400"}`}>L2</span>
            </div>

            {/* L3 */}
            <div className={`flex flex-col items-center gap-1 bg-white px-1 ${isLayer3Escalated ? "" : "opacity-40"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isLayer3Escalated ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-gray-200 text-gray-500 border-gray-300"
              }`}>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: isLayer3Escalated ? "'FILL' 1" : undefined }}>
                  {isLayer3Escalated ? "shield_with_heart" : "3"}
                </span>
              </div>
              <span className={`font-bold text-[9px] ${isLayer3Escalated ? "text-amber-600" : "text-gray-400"}`}>L3</span>
            </div>

            {/* Police */}
            <div className="flex flex-col items-center gap-1 bg-white px-1 opacity-40">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center border border-gray-300">
                <span className="material-symbols-outlined text-xs">local_police</span>
              </div>
              <span className="font-medium text-gray-400 text-[9px]">Police</span>
            </div>
          </div>

          {/* Narrative timeline text */}
          <div className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-150 text-[10px] text-gray-600 font-medium flex items-center gap-1.5 justify-center text-center leading-normal">
            <span className={`material-symbols-outlined text-xs ${
              isLayer3Escalated ? "text-amber-500" : isLayer2Escalated ? "text-teal-500" : "text-purple-500"
            }`}>route</span>
            {responderName ? (
              <span>L1 alerted &rarr; 90s no response &rarr; L2 alerted &rarr; {isLayer3Escalated ? "L3 alerted &rarr; " : ""}{responderName} responded</span>
            ) : isLayer3Escalated ? (
              <span>L1 alerted &rarr; 90s &rarr; L2 alerted &rarr; 90s &rarr; Guardian Angels alerted &rarr; Awaiting response...</span>
            ) : declinedResponders.length > 0 ? (
              <span>L1 alerted &rarr; 90s &rarr; L2 candidate declined &rarr; Alerting next... (L3 in {layer3EscalationTime}s)</span>
            ) : isLayer2Escalated ? (
              <span>L1 alerted &rarr; 90s no response &rarr; L2 alerted &rarr; Awaiting responder... (L3 in {layer3EscalationTime}s)</span>
            ) : (
              <span>L1 alerted &rarr; Awaiting response (L2 escalation in {escalationTime}s)</span>
            )}
          </div>
        </section>

        {/* Live Map Preview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-64 lg:h-80 relative flex flex-col pointer-events-auto">
            {/* Map background image */}
            <img
              alt="Map View"
              className="absolute inset-0 w-full h-full object-cover opacity-85 brightness-95"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc5fg68OpWf72lAUfE0tDH7yk9rYFKbMyj79SG0VknavzL2u6XozKcTTGrgiBlqtSI330GAhhThg2uh3HVCn09EcagPMNkvsLA1xSzhrW17M0gDS88RkxYEMFHHjeLCEeOA73T4OY6-iuZ85rg81lDb4kUydqvnYIdfY2KbZQ8zoRNubvbGyuifD01nbH65Fq-yYh9vAFmiPtG2XbpURPKyCbzU9DK4DOhvU1HJOkbmTH_TGeUSb2nkl7jlSzb8-9R2pHg35gk0CvS"
            />

            {/* Coverage radius circles (500m zone search indicator) */}
            {isLayer3Escalated ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-amber-400 bg-amber-400/5 animate-pulse pointer-events-none z-10" />
            ) : isLayer2Escalated ? (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-dashed border-teal-400 bg-teal-400/5 animate-pulse pointer-events-none z-10" />
            ) : (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-dashed border-purple-400 bg-purple-400/5 animate-pulse pointer-events-none z-10" />
            )}

            {/* Nearest Safe Space dashed green walking route */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <line
                x1="50%"
                y1="50%"
                x2="52%"
                y2="40%"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              {/* If responder is active, draw a blue route line to responder pin */}
              {responderName && (
                <line
                  x1="50%"
                  y1="50%"
                  x2="70%"
                  y2="30%"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeDasharray="1"
                />
              )}
            </svg>

            {/* GPS HUD Info overlay */}
            <div
              className={`absolute top-3 left-3 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1.5 z-20 ${
                isLayer3Escalated ? "bg-amber-700" : isLayer2Escalated ? "bg-teal-700" : "bg-purple-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Live GPS Broadcast
            </div>

            {/* Distressed User Center Pin (Priya) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-20">
              <div className="bg-white/95 shadow border border-gray-150 px-2 py-0.5 rounded text-[8px] font-black text-gray-800 -mt-7 absolute whitespace-nowrap">
                Priya (You)
              </div>
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center animate-pulse ${
                  isLayer3Escalated ? "bg-amber-500/20 border-amber-500/30" : isLayer2Escalated ? "bg-teal-500/20 border-teal-500/30" : "bg-purple-500/20 border-purple-500/30"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full shadow-lg border-2 border-white ${
                    isLayer3Escalated ? "bg-amber-500" : isLayer2Escalated ? "bg-teal-550" : "bg-purple-600"
                  }`}
                ></div>
              </div>
            </div>

            {/* Safe Space Highlight Green Pin */}
            <div style={{ top: "40%", left: "52%" }} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-20 hover:scale-105 transition cursor-pointer">
              <div className="bg-white border border-emerald-200 px-2 py-0.5 rounded shadow text-[8px] font-bold text-emerald-800 -mt-7 absolute whitespace-nowrap">
                Safe Space: Apollo
              </div>
              <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-white text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_pharmacy
                </span>
              </div>
              <div className="w-1.5 h-1.5 bg-emerald-650 rotate-45 -mt-0.5 shadow"></div>
            </div>

            {/* Layer 2 Candidates (Teal Pins) */}
            {isLayer2Escalated && !isLayer3Escalated && !responderName && (
              <>
                <div style={{ top: "30%", left: "70%" }} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-20">
                  <div className="bg-white border border-teal-200 px-2 py-0.5 rounded shadow text-[8px] font-semibold text-teal-800 -mt-6 absolute whitespace-nowrap">
                    Layer 2 — Rahul
                  </div>
                  <div className="w-5 h-5 rounded-full bg-teal-500 border border-white shadow flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
                <div style={{ top: "60%", left: "40%" }} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-20">
                  <div className="bg-white border border-teal-200 px-2 py-0.5 rounded shadow text-[8px] font-semibold text-teal-800 -mt-6 absolute whitespace-nowrap">
                    Layer 2 — Dev
                  </div>
                  <div className="w-5 h-5 rounded-full bg-teal-500 border border-white shadow flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                </div>
              </>
            )}

            {/* Layer 3 Candidate (Gold Pin) */}
            {isLayer3Escalated && !responderName && (
              <div style={{ top: "35%", left: "45%" }} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-20">
                <div className="bg-white border border-amber-200 px-2 py-0.5 rounded shadow text-[8px] font-semibold text-amber-800 -mt-6 absolute whitespace-nowrap">
                  GA — Rakesh
                </div>
                <div className="w-6 h-6 rounded-full bg-amber-500 border border-white shadow-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                </div>
              </div>
            )}

            {/* Active Responder (Blue Pin) */}
            {responderName && (
              <div style={{ top: "30%", left: "70%" }} className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center z-20 animate-bounce">
                <div className="bg-blue-600 text-white px-2 py-0.5 rounded shadow-[0_2px_8px_rgba(37,99,235,0.4)] text-[8px] font-black -mt-7 absolute whitespace-nowrap">
                  {responderName} is responding!
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">directions_run</span>
                </div>
                <div className="w-2 h-2 bg-blue-600 rotate-45 -mt-1 shadow"></div>
              </div>
            )}
          </div>

          {/* Notified Contacts Side List */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex-grow">
              <h3 className="font-bold text-sm text-gray-900 mb-3.5 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-500">group</span>
                {isLayer2Escalated ? "Notified (L1 + L2)" : "Notified Circle"}
              </h3>
              <ul className="flex flex-col gap-3">
                {/* Layer 1 lists */}
                {activeContacts.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between pb-1.5 border-b border-gray-50 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        alt={c.name}
                        src={c.avatar}
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-xs text-gray-800">{c.name}</p>
                        <p className="text-[9px] text-red-550 flex items-center gap-0.5 mt-0.5 font-semibold">
                          <span className="material-symbols-outlined text-xs">done_all</span>
                          L1: Alert Sent (Unanswered)
                        </p>
                      </div>
                    </div>
                  </li>
                ))}

                {/* Layer 2 lists (if escalated) */}
                {isLayer2Escalated &&
                  layer2Contacts.map((c) => {
                    const isDeclined =
                      declinedResponders.includes("+1 (555) 123-4567") && c.name === "Rahul Sharma";
                    return (
                      <li
                        key={c.id}
                        className="flex items-center justify-between pb-1.5 border-b border-gray-50 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={c.name}
                            src={c.avatar}
                            className={`w-10 h-10 rounded-full object-cover border-2 ${isDeclined ? "border-gray-200 opacity-60" : "border-indigo-200"}`}
                          />
                          <div>
                            {/* Task 3 S1.2 — Name + mutual contact + distance, NO phone number */}
                            <p
                              className={`font-semibold text-xs leading-snug ${isDeclined ? "text-gray-450" : "text-indigo-950"}`}
                            >
                              {c.name}
                              <span
                                className={`ml-1.5 text-[8px] px-1 rounded font-bold uppercase tracking-wider ${isDeclined ? "bg-gray-100 text-gray-500" : "bg-indigo-50 text-indigo-650"}`}
                              >
                                FoF
                              </span>
                            </p>
                            <p className={`text-[9px] mt-0.5 font-semibold leading-normal ${isDeclined ? "text-gray-400" : "text-indigo-700/80"}`}>
                              friend of {c.mutualContact} — {c.distance}
                            </p>
                            {isDeclined ? (
                              <p className="text-[9px] text-gray-400 flex items-center gap-0.5 mt-0.5 font-semibold">
                                <span className="material-symbols-outlined text-xs">cancel</span>
                                Declined — alerting next candidate
                              </p>
                            ) : (
                              <p className="text-[9px] text-indigo-600 flex items-center gap-0.5 mt-0.5 font-semibold">
                                <span className="material-symbols-outlined text-xs">language</span>
                                Approximate location sent
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Double-tap End SOS Button (Fixed at bottom) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#faf9fc] via-[#faf9fc] to-transparent pt-10 z-40 pb-safe flex flex-col items-center gap-2">

        {/* Nearest Safe Space persistent banner */}
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=12.9751,77.6072&travelmode=walking"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-4 py-2.5 flex items-center gap-3 transition shadow-md active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-white text-xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Nearest Safe Space</p>
            <p className="text-xs font-bold text-white truncate">Apollo Pharmacy — 140m away</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-white/20 px-2.5 py-1.5 rounded-lg">
            <span className="material-symbols-outlined text-sm text-white">directions_walk</span>
            <span className="text-[10px] font-bold text-white">Navigate</span>
          </div>
        </a>

        {confirmSafety && (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 animate-pulse">
            Accident prevention active. Tap once more to confirm safe status.
          </span>
        )}
        <button
          onClick={handleEndSosWithDoubleTap}
          className={`w-full max-w-md font-black text-sm py-4 rounded-xl shadow-lg border transition active:scale-[0.98] flex items-center justify-center gap-2 uppercase tracking-wider ${
            confirmSafety
              ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
              : "bg-gray-900 hover:bg-gray-800 text-white border-gray-800"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {confirmSafety ? "warning" : "check_circle"}
          </span>
          {confirmSafety ? "Confirm — I am safe" : "I am safe — end SOS"}
        </button>
      </div>
    </div>
  );
}
