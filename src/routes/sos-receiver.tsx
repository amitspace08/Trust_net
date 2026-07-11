import { createFileRoute, Link, useRouter, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type ReceiverSearch = {
  role?: string;
};

export const Route = createFileRoute("/sos-receiver")({
  validateSearch: (search: Record<string, unknown>): ReceiverSearch => {
    return {
      role: search.role as string | undefined,
    };
  },
  head: () => ({
    meta: [{ title: "TrustNet - SOS Responder" }],
  }),
  component: SosReceiverPage,
});

function SosReceiverPage() {
  const router = useRouter();
  const search = useSearch({ from: "/sos-receiver" });

  const [receiverState, setReceiverState] = useState<
    "alert" | "confirm" | "responding" | "thankyou" | "declined"
  >("alert");
  const [eta, setEta] = useState(6);
  const [distance, setDistance] = useState(0.85);

  // Tracking SOS status and layer information
  const [sosStatus, setSosStatus] = useState<"active" | "ended">("active");
  const [sosLayer, setSosLayer] = useState<number>(1);
  const [mutualContactName, setMutualContactName] = useState<string>("Riya");

  // Responder pin position coordinates (percentage-based on map container)
  const [pinPos, setPinPos] = useState({ top: 75, left: 65 });

  // Sync SOS status with localStorage to check for dynamic updates
  useEffect(() => {
    const checkSosState = () => {
      try {
        const raw = localStorage.getItem("trustnet_sos_state");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.status === "ended") {
            setSosStatus("ended");
            if (receiverState === "responding") {
              setReceiverState("thankyou");
            }
          } else {
            setSosStatus("active");
          }
          if (parsed.layer) {
            setSosLayer(parsed.layer);
          }
          // Set mutual contact dynamically if notified in state
          if (parsed.notifiedLayer2 && parsed.notifiedLayer2.length > 0) {
            setMutualContactName(parsed.notifiedLayer2[0].mutualContact || "Riya");
          }
        }
      } catch {
        // Safe fallback
      }
    };

    checkSosState();
    const interval = setInterval(checkSosState, 1000);
    return () => clearInterval(interval);
  }, [receiverState]);

  // Determine if this is a Layer 2 or Layer 3 view
  const isLayer2 = search.role === "layer2" || sosLayer === 2;
  const isLayer3 = search.role === "layer3" || sosLayer === 3;

  // Initialize L2 distance and eta correctly
  useEffect(() => {
    if (isLayer2) {
      setDistance(0.3);
      setEta(2);
    } else {
      setDistance(0.85);
      setEta(6);
    }
  }, [isLayer2]);

  // Animate responder pin towards distressed user when responding is active
  useEffect(() => {
    if (receiverState !== "responding" || sosStatus === "ended") return;

    // Distressed user pin is at (45, 50).
    const targetPos = isLayer2 ? { top: 46, left: 49 } : { top: 49, left: 52 };
    const interval = setInterval(() => {
      setPinPos((current) => {
        const dTop = targetPos.top - current.top;
        const dLeft = targetPos.left - current.left;

        // Step size
        const stepTop = dTop * 0.12;
        const stepLeft = dLeft * 0.12;

        const nextTop = current.top + stepTop;
        const nextLeft = current.left + stepLeft;

        // Calculate simulated distance reduction
        setDistance((prevDistance) => {
          const distRemaining = Math.max(0.05, prevDistance - 0.05);
          const nextEta = Math.max(1, Math.ceil(distRemaining * 7));
          setEta(nextEta);
          return Number(distRemaining.toFixed(2));
        });

        if (Math.abs(dTop) < 0.5 && Math.abs(dLeft) < 0.5) {
          clearInterval(interval);
          return targetPos;
        }

        return { top: nextTop, left: nextLeft };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [receiverState, sosStatus, isLayer2]);

  // Show Pre-Response confirmation before responding
  const handleStartHelp = () => {
    if (isLayer2) {
      setReceiverState("confirm");
    } else {
      handleConfirmRespond();
    }
  };

  const handleConfirmRespond = () => {
    setReceiverState("responding");
    // Write responder name to trigger update on distressed user's Active screen
    try {
      const raw = localStorage.getItem("trustnet_sos_state");
      const currentState = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({
          ...currentState,
          responderName: isLayer2 ? "Rahul Sharma" : "Rakesh Kumar",
        }),
      );
    } catch {
      // Safe fallback
    }
  };

  const handleDeclineRequest = () => {
    setReceiverState("declined");
    // Record decline to let SOS traversal know
    try {
      const raw = localStorage.getItem("trustnet_sos_state");
      const currentState = raw ? JSON.parse(raw) : {};
      const currentDeclined = currentState.declinedResponders || [];
      localStorage.setItem(
        "trustnet_sos_state",
        JSON.stringify({
          ...currentState,
          declinedResponders: [...currentDeclined, "+1 (555) 123-4567"], // Rahul Sharma declined
        }),
      );
    } catch {
      // Safe fallback
    }

    // Redirect to home dashboard after brief notice
    setTimeout(() => {
      router.navigate({ to: "/" });
    }, 2500);
  };

  const handleCleanEndedState = () => {
    localStorage.removeItem("trustnet_sos_state");
    router.navigate({ to: "/" });
  };

  // Render Thank You Screen for Layer 2 helpers who assisted
  if (receiverState === "thankyou") {
    return (
      <div className="w-full min-h-screen bg-[#faf9fc] flex flex-col justify-between items-center p-6 text-gray-800 select-none animate-fade-in">
        <div className="flex-grow flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-300 text-indigo-700 flex items-center justify-center shadow-lg animate-scale-in">
            <span className="material-symbols-outlined text-5xl font-black">favorite</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
              You helped someone feel safer today. Thank you.
            </h1>
            <p className="text-xs text-gray-500 font-semibold mt-2.5 leading-relaxed">
              Your swift response as a community helper makes a meaningful difference in our
              network.
            </p>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-4.5 shadow-sm">
            <p className="text-[11px] text-gray-600 leading-relaxed italic">
              "TrustNet functions because neighbors look out for one another. You provided
              reassurance when it mattered most."
            </p>
          </div>
        </div>
        <div className="w-full max-w-md pb-8">
          <button
            onClick={handleCleanEndedState}
            className="w-full bg-indigo-700 hover:bg-indigo-850 text-white font-bold py-4 rounded-xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render Declined screen
  if (receiverState === "declined") {
    return (
      <div className="w-full min-h-screen bg-[#faf9fc] flex flex-col justify-center items-center p-6 text-gray-800 select-none animate-fade-in">
        <div className="text-center max-w-sm flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-4xl text-gray-400 animate-pulse">
            cancel
          </span>
          <h2 className="text-base font-extrabold text-gray-800">Request Declined</h2>
          <p className="text-xs text-gray-500 leading-normal">
            Declining safety request. Alerting next ranked responder in the safety graph. Returning
            to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Render safety stand-down details if ended (receiverState "thankyou"/"declined" handled above)
  if (sosStatus === "ended") {
    return (
      <div className="w-full min-h-screen bg-[#faf9fc] flex flex-col justify-between items-center p-6 text-gray-800 select-none animate-fade-in">
        <div className="flex-grow flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-100 border-2 border-green-500 text-green-600 flex items-center justify-center shadow-lg animate-scale-in">
            <span className="material-symbols-outlined text-4xl font-black">shield</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">
              Priya has marked herself safe.
            </h1>
            <p className="text-sm text-gray-500 font-semibold mt-1">Thank you for responding.</p>
          </div>
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-600 leading-relaxed">
              The emergency broadcast has been successfully cancelled. Your alert access and route
              navigation keys have been safely cleared.
            </p>
          </div>
        </div>
        <div className="w-full max-w-md pb-8">
          <button
            onClick={handleCleanEndedState}
            className="w-full bg-[#0d631b] hover:bg-[#0a5215] text-white font-bold py-4 rounded-xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
            <h2 className="text-sm font-bold text-gray-900">Priya Sharma</h2>
            <p className="text-xs text-gray-500">Trust Score: 98</p>
            <p
              className={`text-xs font-semibold mt-0.5 ${isLayer2 ? "text-indigo-650" : "text-red-600"}`}
            >
              Safety Status: {isLayer2 ? "L2 Escalated" : "Distressed"}
            </p>
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-all text-sm font-medium"
              >
                <span className="material-symbols-outlined text-lg">group</span>
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

      {/* TopAppBar (Mobile Only) - Visually Distinct for Layer 2 */}
      <header
        className={`sticky top-0 z-40 text-white flex justify-between items-center px-4 h-16 w-full md:hidden shadow transition-colors ${isLayer2 ? "bg-indigo-900" : "bg-red-600"}`}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-black/10 transition"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-sm font-bold tracking-tight">
            {isLayer2 ? "Layer 2 Safety Request" : "SOS Responder Panel"}
          </h1>
        </div>
        <Link
          to="/notifications"
          className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-black/10 transition"
        >
          <span className="material-symbols-outlined">notifications</span>
        </Link>
      </header>

      {/* Main Map Area */}
      <main className="flex-grow relative w-full md:ml-72 h-[calc(100vh-4rem)] md:h-screen bg-gray-200 overflow-hidden flex flex-col">
        {/* Full Screen Map Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="City Map"
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCc5fg68OpWf72lAUfE0tDH7yk9rYFKbMyj79SG0VknavzL2u6XozKcTTGrgiBlqtSI330GAhhThg2uh3HVCn09EcagPMNkvsLA1xSzhrW17M0gDS88RkxYEMFHHjeLCEeOA73T4OY6-iuZ85rg81lDb4kUydqvnYIdfY2KbZQ8zoRNubvbGyuifD01nbH65Fq-yYh9vAFmiPtG2XbpURPKyCbzU9DK4DOhvU1HJOkbmTH_TGeUSb2nkl7jlSzb8-9R2pHg35gk0CvS"
          />
        </div>

        {/* SOS Alert HUD banner — distinct for each layer */}
        <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
          <div
            className={`text-white rounded-2xl shadow-xl p-4 flex gap-3 items-center pointer-events-auto max-w-lg mx-auto w-full border ${
              isLayer3
                ? "bg-amber-800/95 border-amber-600"
                : isLayer2
                  ? "bg-indigo-900/95 border-indigo-750"
                  : "bg-red-600/95 border-red-500"
            }`}
          >
            <span className="material-symbols-outlined text-2xl animate-bounce" style={{ fontVariationSettings: (isLayer3 || isLayer2) ? "'FILL' 1" : undefined }}>
              {isLayer3 ? "shield_with_heart" : isLayer2 ? "security" : "warning"}
            </span>
            <div className="flex-1 min-w-0">
              <h2 className="font-extrabold text-sm uppercase tracking-wide truncate">
                {isLayer3 ? "Guardian Angel Alert" : isLayer2 ? "Friends-of-Friends Alert" : "Emergency SOS Broadcast"}
              </h2>
              <p className="text-[11px] opacity-90 mt-0.5 font-medium leading-relaxed font-sans">
                {isLayer3
                  ? "Someone nearby needs urgent help (approximately 400m from you)"
                  : isLayer2
                    ? `A friend of ${mutualContactName} needs help nearby (approximately 300m from you)`
                    : "Priya Sharma has triggered an SOS alert!"}
              </p>
            </div>
          </div>
        </div>

        {/* Distressed User Pin (Priya Sharma) - Fuzzy Map for Layer 2 privacy */}
        {isLayer2 ? (
          <>
            {/* Transparent Circular Area showing 200m Privacy Radius */}
            <div
              style={{ top: "45%", left: "50%" }}
              className="absolute z-10 w-36 h-36 -ml-18 -mt-18 rounded-full border-2 border-indigo-500/50 bg-indigo-500/10 pointer-events-none animate-pulse"
            />
            {/* Fuzzy offset avatar */}
            <div
              style={{ top: "47%", left: "48%" }}
              className="absolute z-20 w-11 h-11 -ml-5.5 -mt-5.5 rounded-full border-4 border-indigo-400 bg-white shadow-lg flex items-center justify-center pointer-events-none"
            >
              <div className="relative w-full h-full rounded-full overflow-hidden p-0.5">
                <img
                  alt="Priya Sharma"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDevHM859wbGxE1v3bjGeHm9QWzqXVEu1HVSEmBx2_-6DJRnLenf3hfP69zFX6cte_YU-hRUie6BVS5exm7Pg4n-UQBVvi1CauceVEzf22expdXYW8mqW5REfMBoJFU8WOqZPKGVjLWDYrUS0R3pIwcPygxHj9pSgSUMBGB-6ahFiXHn3LIFkapfPw4KxRgIiYdB_QQLO4hAFryndltNDNOPJL54QzcNQjzGCJicOeeXAC1D_I34mAsicy2i2dnWE2wvsopYCefXkeA"
                  className="w-full h-full rounded-full object-cover grayscale-[0.25]"
                />
              </div>
            </div>
          </>
        ) : (
          /* Layer 1 Exact Tracking Pin */
          <div
            style={{ top: "45%", left: "50%" }}
            className="absolute z-20 w-12 h-12 -ml-6 -mt-6 rounded-full border-4 border-red-500 bg-white shadow-2xl flex items-center justify-center pointer-events-none"
          >
            <div className="relative w-full h-full rounded-full overflow-hidden p-0.5 animate-pulse">
              <img
                alt="Priya Sharma"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDevHM859wbGxE1v3bjGeHm9QWzqXVEu1HVSEmBx2_-6DJRnLenf3hfP69zFX6cte_YU-hRUie6BVS5exm7Pg4n-UQBVvi1CauceVEzf22expdXYW8mqW5REfMBoJFU8WOqZPKGVjLWDYrUS0R3pIwcPygxHj9pSgSUMBGB-6ahFiXHn3LIFkapfPw4KxRgIiYdB_QQLO4hAFryndltNDNOPJL54QzcNQjzGCJicOeeXAC1D_I34mAsicy2i2dnWE2wvsopYCefXkeA"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute inset-0 rounded-full border-4 border-red-650 animate-ping opacity-35" />
          </div>
        )}

        {/* Responder Pin (Moving GPS pin) */}
        <div
          style={{ top: `${pinPos.top}%`, left: `${pinPos.left}%` }}
          className={`absolute z-20 w-10 h-10 -ml-5 -mt-5 rounded-full border-2 bg-white shadow-xl flex items-center justify-center transition-all duration-1000 ease-out pointer-events-none ${isLayer2 ? "border-indigo-500" : "border-blue-500"}`}
        >
          <div
            className={`w-full h-full rounded-full flex items-center justify-center font-extrabold text-sm ${isLayer2 ? "bg-indigo-50 text-indigo-700" : "bg-blue-100 text-blue-600"}`}
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              directions_run
            </span>
          </div>
          {receiverState === "responding" && (
            <span
              className={`absolute inset-0 rounded-full border-2 animate-ping opacity-25 ${isLayer2 ? "border-indigo-500" : "border-blue-500"}`}
            />
          )}
        </div>

        {/* HUD Details & Action Panel */}
        <div className="absolute bottom-4 left-4 right-4 z-30 bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 flex flex-col gap-4 max-w-md mx-auto pointer-events-auto">
          {/* Trust Signal Badge — Layer 2 or Layer 3 */}
          {(isLayer2 || isLayer3) && (
            <div className={`flex justify-between items-center px-3 py-2 rounded-xl border ${
              isLayer3
                ? "bg-amber-50/60 border-amber-200"
                : "bg-indigo-50/60 border-indigo-105"
            }`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                isLayer3 ? "text-amber-800" : "text-indigo-750"
              }`}>
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isLayer3 ? "shield_with_heart" : "group"}
                </span>
                {isLayer3 ? "Guardian Angel Alert" : `Sent as friend of ${mutualContactName}`}
              </span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                isLayer3 ? "text-amber-700 bg-amber-100" : "text-indigo-650 bg-indigo-100"
              }`}>
                {isLayer3 ? "Layer 3" : "Layer 2"} Alert
              </span>
            </div>
          )}

          {receiverState === "responding" ? (
            // Responding status active card
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3
                    className={`font-bold text-gray-900 text-sm flex items-center gap-1.5 ${isLayer2 ? "text-indigo-950" : ""}`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full animate-pulse ${isLayer2 ? "bg-indigo-600" : "bg-blue-650"}`}
                    ></span>
                    En Route to Priya
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Simulated response navigation active
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold block ${isLayer2 ? "text-indigo-700" : "text-blue-650"}`}
                  >
                    ETA: {eta} mins
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">
                    {distance} km remaining
                  </span>
                </div>
              </div>

              <hr className="border-gray-150" />

              {isLayer2 ? (
                /* Privacy Offset Banner for L2 */
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex gap-2.5 items-start">
                  <span className="material-symbols-outlined text-indigo-700 text-lg mt-0.5">
                    info
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-indigo-900">Privacy Notice</h4>
                    <p className="text-[10px] text-indigo-900/80 leading-relaxed mt-0.5">
                      Approximate location shown for privacy purposes. A 200m circular search
                      boundary has been highlighted.
                    </p>
                  </div>
                </div>
              ) : (
                /* Regular Directions for L1 */
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex gap-2.5 items-start">
                  <span className="material-symbols-outlined text-blue-600 text-lg mt-0.5 font-bold">
                    navigation
                  </span>
                  <div>
                    <h4 className="font-bold text-xs text-blue-900">Directions</h4>
                    <p className="text-[10px] text-blue-900/80 leading-relaxed mt-0.5">
                      Head North on MG Road towards Residency Road. Proceed 300m, then turn left at
                      MG Road Metro Hub.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 mt-1">
                <button
                  onClick={() => setReceiverState("alert")}
                  className="flex-1 py-3 border border-red-200 hover:bg-red-50 text-red-650 text-xs font-bold rounded-xl transition flex justify-center items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">cancel</span>
                  Abort Response
                </button>
                <a
                  href="tel:+15550000000"
                  className="flex-1 py-3 bg-[#0d631b] hover:bg-[#0a5215] text-white text-xs font-bold rounded-xl transition flex justify-center items-center gap-1.5 shadow"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  Call Priya
                </a>
              </div>
            </div>
          ) : (
            // Initial Action required screen
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${isLayer2 ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-red-100 border-red-50 text-red-600"}`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isLayer2 ? "language" : "emergency_share"}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {isLayer3
                      ? "Guardian Angel SOS Alert"
                      : isLayer2
                        ? `Mutual Connection: ${mutualContactName}`
                        : "Immediate Action Required"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isLayer3
                      ? "Layer 1 & 2 contacts did not respond — you are being contacted as a Guardian Angel"
                      : isLayer2
                        ? `Priya Sharma is a mutual friend of ${mutualContactName}`
                        : "Triggered 1 min ago • Distance: 0.85 km"}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-655 leading-relaxed">
                {isLayer3
                  ? "You are registered as a verified Guardian Angel. Someone nearby needs urgent assistance and no other responders have confirmed."
                  : isLayer2
                    ? `Priya Sharma triggered an emergency safety alert. Since you are connected via ${mutualContactName}, you have been notified to assist nearby.`
                    : "Confirm your response to alert Priya and other circle guardians that you are on your way to assist."}
              </p>

              <div className="flex gap-2.5 w-full mt-1.5">
                {(isLayer2 || isLayer3) && (
                  <button
                    onClick={handleDeclineRequest}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-red-650 hover:text-red-750 font-bold text-xs py-3.5 rounded-xl transition active:scale-[0.98] flex justify-center items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">close</span>I cannot help right now
                  </button>
                )}
                <button
                  onClick={handleStartHelp}
                  className={`font-black text-xs py-3.5 rounded-xl transition active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-wider shadow-md ${
                    isLayer3
                      ? "flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      : isLayer2
                        ? "flex-1 bg-indigo-700 hover:bg-indigo-800 text-white"
                        : "w-full bg-red-600 hover:bg-red-700 text-white animate-pulse"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">directions_run</span>
                  {isLayer3 || isLayer2 ? "I can help" : "I am responding — I am on my way"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Pre-Response Confirmation Dialog Modal */}
      {receiverState === "confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 animate-scale-in border border-indigo-100">
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="material-symbols-outlined text-indigo-700 text-2xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                security
              </span>
              <h3 className="font-extrabold text-base text-gray-900">Confirm Assistance Request</h3>
            </div>

            <div className="flex flex-col gap-4 text-xs text-gray-600 leading-relaxed mb-6">
              <div className="bg-indigo-50/70 border border-indigo-100/60 rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex justify-between items-baseline font-bold text-indigo-950">
                  <span>Mutual Connection</span>
                  <span className="text-[11px] text-indigo-750">{mutualContactName}</span>
                </div>
                <div className="flex justify-between items-baseline font-bold text-indigo-950">
                  <span>Approximate Distance</span>
                  <span className="text-[11px] text-indigo-750">300m away</span>
                </div>
              </div>
              <p className="bg-gray-50 border border-gray-150 p-3 rounded-xl italic">
                "You are registered as a community helper. Someone nearby needs assistance."
              </p>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal">
                By confirming, Priya Sharma and her guardians will see that you are responding. Your
                location will be updated on their map.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReceiverState("alert")}
                className="flex-1 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition text-xs"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmRespond}
                className="flex-1 py-3 bg-indigo-700 hover:bg-indigo-850 text-white font-bold rounded-xl transition text-xs shadow-md"
              >
                Confirm & Respond
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
