import { createFileRoute } from "@tanstack/react-router";

const HTML = `
<!-- Navigation Drawer (Desktop) -->
<nav class="hidden md:flex flex-col w-72 max-w-[80vw] h-full p-4 bg-surface dark:bg-surface-dim shadow-lg dark:shadow-none rounded-r-xl z-50">
<div class="flex items-center gap-4 mb-8 p-2">
<img alt="User Profile" class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWpKa7rM0MgxTGa8wnfmmRkJeuGrzTo8jtAmjh4fqS-GiR5uxyDguW4QfV0cpJwBalWWxWMi9c-g6ZEjsg_Vj1IxropD6jiDRVi_0LRMNdlWAM0CaWPXnQjNSAvaqLi06IE69BRgSRKjN4BCRb3LwMft0l0Qrdynv2dm5l12QmFntTea0P2AeCWygqodfIfwXzVOdcOJH_IkGyPJGnmwA5I_B7U7YJbi_DP3FxhUYWqpfKToHJefY-1b88Qdnd-m_r3Xy4yXbRyUBP">
<div>
<h2 class="font-title-lg text-title-lg text-primary">Priya Sharma</h2>
<p class="font-label-md text-label-md text-on-surface-variant">Trust Score: 98</p>
<p class="font-label-md text-label-md text-primary font-medium mt-1">Safety Status: Protected</p>
</div>
</div>
<div class="flex flex-col gap-2">
<button class="flex items-center gap-3 p-3 w-full text-left bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined fill">home</span>
<span class="font-label-lg text-label-lg">Home</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">map</span>
<span class="font-label-lg text-label-lg">Heatmap</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">group</span>
<span class="font-label-lg text-label-lg">Circle</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">security</span>
<span class="font-label-lg text-label-lg">Guardian</span>
</button>
<hr class="my-4 border-surface-variant">
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">settings_ethernet</span>
<span class="font-label-lg text-label-lg">Emergency Settings</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">history</span>
<span class="font-label-lg text-label-lg">Safety History</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">privacy_tip</span>
<span class="font-label-lg text-label-lg">Privacy Guard</span>
</button>
<button class="flex items-center gap-3 p-3 w-full text-left text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-full transition-all duration-200 ease-in-out">
<span class="material-symbols-outlined">help</span>
<span class="font-label-lg text-label-lg">Support</span>
</button>
</div>
</nav>
<!-- Main Content Area -->
<main class="flex-1 flex flex-col h-full overflow-y-auto pb-24 md:pb-0 relative">
<!-- TopAppBar (Mobile) -->
<header class="md:hidden flex justify-between items-center px-margin-mobile h-16 w-full z-40 bg-surface dark:bg-background top-0 sticky bg-surface-container dark:bg-surface-dim">
<button class="w-10 h-10 flex items-center justify-center rounded-full text-primary dark:text-primary-fixed hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100">
<span class="material-symbols-outlined">shield_with_heart</span>
</button>
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">TrustNet</h1>
<button class="w-10 h-10 flex items-center justify-center rounded-full text-primary dark:text-primary-fixed hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100">
<span class="material-symbols-outlined">notifications</span>
</button>
</header>
<!-- Canvas Container -->
<div class="px-margin-mobile md:px-margin-tablet py-6 flex flex-col gap-stack-gap max-w-5xl mx-auto w-full">
<!-- Welcome Header (Mobile mainly, desktop has drawer) -->
<div class="md:hidden flex items-center justify-between">
<div>
<h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Good Evening, Priya</h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Ready to stay safe tonight?</p>
</div>
<img alt="Profile avatar of a young professional woman with dark hair." class="w-14 h-14 rounded-full border-2 border-primary-container object-cover" data-alt="A close-up profile avatar of a confident young professional woman with dark hair, set against a soft, neutral studio background. The lighting is bright and evenly distributed, creating a clean, modern aesthetic suitable for a high-end app profile. The overall tone is approachable and trustworthy." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDevHM859wbGxE1v3bjGeHm9QWzqXVEu1HVSEmBx2_-6DJRnLenf3hfP69zFX6cte_YU-hRUie6BVS5exm7Pg4n-UQBVvi1CauceVEzf22expdXYW8mqW5REfMBoJFU8WOqZPKGVjLWDYrUS0R3pIwcPygxHj9pSgSUMBGB-6ahFiXHn3LIFkapfPw4KxRgIiYdB_QQLO4hAFryndltNDNOPJL54QzcNQjzGCJicOeeXAC1D_I34mAsicy2i2dnWE2wvsopYCefXkeA">
</div>
<!-- Desktop Welcome -->
<div class="hidden md:block">
<h2 class="font-headline-lg text-headline-lg text-on-surface">Good Evening, Priya</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant mt-2">All systems active. You are currently in a secure zone.</p>
</div>
<!-- Safety Status Card -->
<div class="bg-primary-container text-on-primary-container rounded-xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
<div class="absolute inset-0 bg-gradient-to-r from-primary-container/50 to-transparent pointer-events-none"></div>
<div class="relative z-10 flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center">
<span class="material-symbols-outlined fill text-2xl">verified_user</span>
</div>
<div>
<h3 class="font-title-lg text-title-lg">Safe Area</h3>
<p class="font-body-md text-body-md opacity-90">8.4/10 Safety Score • Verified 2 mins ago</p>
</div>
</div>
<div class="relative z-10">
<button class="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-label-md hover:bg-primary/90 transition-colors">Details</button>
</div>
</div>
<!-- Dashboard Grid -->
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- Live Map Preview -->
<div class="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col h-64 md:h-80 relative group">
<img alt="Map view showing safe routes" class="absolute inset-0 w-full h-full object-cover opacity-80" data-alt="A stylized, modern digital map interface displaying a city street layout with soft, glowing green route lines indicating safe pathways. The map uses a minimalist color palette primarily consisting of light gray, white, and subtle green accents, fitting a clean, high-tech safety app aesthetic. The lighting is bright and flat, emphasizing clarity and navigation." data-location="London" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0_mjB-9zilExVl153uNBx4pz2nq5UhlWh2z3yjHQ5ACtL-NUhLTSMc8A-RVmUAX2TCZML22Kmr5RH5PuwhHZLVkmzPKb04sD9Lyk0s_dArLLtDbFqcYYpoQnQpZxtugG6wY_9Qi2aHTrGXCg357ZA1vOLEutYsXdavFXlc7hwZy-dirGRlX3nTp4QMrmG1XTNvEDPwN1B0oHSBH8lA6zGpQ1_JJvG9K0YbPvXNym7n3p7LzTMJG6dm-mhWCmV6-rvtoH6-VQZFSJ0">
<div class="absolute inset-0 bg-gradient-to-t from-surface-container-highest/90 via-transparent to-transparent"></div>
<div class="absolute top-4 left-4 bg-surface text-on-surface px-3 py-1.5 rounded-full font-label-md text-label-md shadow-sm flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-primary"></span>
                        Live Tracking Active
                    </div>
<div class="mt-auto p-4 relative z-10">
<h3 class="font-title-md text-title-md text-on-surface">Current Location</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Near Oxford St • 3 Safe Spaces nearby</p>
</div>
</div>
<!-- Quick Actions Grid -->
<div class="md:col-span-4 grid grid-cols-2 gap-component-gap">
<button class="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
<span class="material-symbols-outlined text-primary text-3xl">map</span>
<span class="font-label-md text-label-md text-center">Safety Heatmap</span>
</button>
<button class="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
<span class="material-symbols-outlined text-secondary text-3xl">route</span>
<span class="font-label-md text-label-md text-center">Safe Route</span>
</button>
<button class="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
<span class="material-symbols-outlined text-tertiary text-3xl">group</span>
<span class="font-label-md text-label-md text-center">Trust Circle</span>
</button>
<button class="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface active:scale-95">
<span class="material-symbols-outlined text-primary text-3xl">security</span>
<span class="font-label-md text-label-md text-center">Guardian Angels</span>
</button>
</div>
</div>
<!-- Recent Activity List -->
<div class="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-24 md:mb-8">
<h3 class="font-title-lg text-title-lg text-on-surface mb-4">Recent Activity</h3>
<div class="flex flex-col gap-4">
<div class="flex items-start gap-4 pb-4 border-b border-surface-variant">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
<span class="material-symbols-outlined">location_on</span>
</div>
<div>
<p class="font-body-md text-body-md text-on-surface">Arrived safely at <strong>Office</strong></p>
<p class="font-label-md text-label-md text-on-surface-variant mt-1">Today, 08:45 AM</p>
</div>
</div>
<div class="flex items-start gap-4 pb-4 border-b border-surface-variant">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
<span class="material-symbols-outlined">group_add</span>
</div>
<div>
<p class="font-body-md text-body-md text-on-surface"><strong>Sarah M.</strong> accepted your Trust Circle invite</p>
<p class="font-label-md text-label-md text-on-surface-variant mt-1">Yesterday, 19:20 PM</p>
</div>
</div>
<div class="flex items-start gap-4">
<div class="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-tertiary shrink-0">
<span class="material-symbols-outlined">warning</span>
</div>
<div>
<p class="font-body-md text-body-md text-on-surface">Caution advised near <strong>King's Cross</strong> due to reported incident</p>
<p class="font-label-md text-label-md text-on-surface-variant mt-1">Yesterday, 14:10 PM</p>
</div>
</div>
</div>
</div>
</div>
<!-- Persistent SOS Floating Action Button -->
<div class="fixed bottom-24 md:bottom-8 right-margin-mobile md:right-margin-tablet z-50">
<button class="w-20 h-20 bg-error text-on-error rounded-full shadow-lg flex flex-col items-center justify-center hover:bg-error/90 active:scale-95 transition-all duration-200 border-4 border-error-container relative group">
<span class="absolute inset-0 rounded-full border-2 border-error animate-ping opacity-20"></span>
<span class="font-headline-md text-headline-md font-bold tracking-widest">SOS</span>
</button>
</div>
</main>
<!-- BottomNavBar (Mobile) -->
<nav class="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-lowest dark:bg-surface-container-low shadow-sm dark:shadow-none flex justify-around items-center h-20 px-2 pb-safe">
<button class="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-xl px-3 py-1 active:scale-90 transition-transform">
<span class="material-symbols-outlined fill">home</span>
<span class="font-label-md text-label-md mt-1">Home</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl active:scale-90 transition-transform">
<span class="material-symbols-outlined">map</span>
<span class="font-label-md text-label-md mt-1">Heatmap</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl active:scale-90 transition-transform">
<span class="material-symbols-outlined">group</span>
<span class="font-label-md text-label-md mt-1">Circle</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl active:scale-90 transition-transform">
<span class="material-symbols-outlined">security</span>
<span class="font-label-md text-label-md mt-1">Guardian</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant rounded-xl active:scale-90 transition-transform">
<span class="material-symbols-outlined">person</span>
<span class="font-label-md text-label-md mt-1">Profile</span>
</button>
</nav>
`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrustNet - Home" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="bg-background text-on-background font-body-md h-screen flex flex-col md:flex-row overflow-hidden" dangerouslySetInnerHTML={{ __html: HTML }} />
  );
}
