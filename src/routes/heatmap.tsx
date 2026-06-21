import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "../lib/html-page";

const HTML = `
<!-- Top App Bar (Shared Component) -->
<header class="bg-surface dark:bg-background w-full top-0 sticky flex justify-between items-center px-margin-mobile h-16 z-40 bg-surface-container dark:bg-surface-dim pt-safe">
<button aria-label="Menu" class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shield_with_heart</span>
</button>
<h1 class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">TrustNet</h1>
<button aria-label="Notifications" class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">notifications</span>
</button>
</header>
<!-- Main Content Canvas (Map Area) -->
<main class="flex-grow relative w-full md:ml-64 md:w-[calc(100vw-16rem)] h-full bg-surface-variant overflow-hidden">
<!-- Base Map Placeholder Image -->
<div class="absolute inset-0 w-full h-full">
<img alt="Map View" class="w-full h-full object-cover opacity-60 grayscale" data-alt="A modern, minimalist top-down city map view with light gray roads and pale beige city blocks. The aesthetic is clean and corporate, focusing on clear navigation routes without distracting satellite details. High-key lighting emphasizes a calm, analytical UI background suitable for safety overlays." data-location="City Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiV7v2c_Oz5S5jyhwVy1_LmacUsZXlDGfisrMjBuG675QUy7Zqwl3_XF1QJZY0qjuaUSvA6hCljF1YlK8lR0Se1Fdhy4v_Au3ftYsUShIH3rZGJ8BNPrZdJvlYTI7M9gLen61Z5Xzn4ceKbn0kKtJrw28gcEFRNzr5N8I0gdLhc-3W3doVjLNJJssDjJE6iCnYwLFA0fmiiDN9K60mzoUESugw7rj0ezSRjGGQsU6lC6eZV1guLjqTGdkT_9b7glYCoQG8DBcqp4Sv">
</div>
<!-- Semantic Safety Heatmap Overlay -->
<div class="absolute inset-0 w-full h-full map-overlay pointer-events-none z-10" data-stitch-orig-opacity="0.8"></div>
<!-- Top UI Controls: Day/Night Filter & Safety Score -->
<div class="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3 pointer-events-none">
<div class="flex justify-between items-start pointer-events-auto">
<!-- Day/Night Segmented Toggle -->
<div class="bg-surface rounded-full p-1 shadow-sm flex items-center border border-surface-container-highest">
<button class="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all">
<span class="material-symbols-outlined text-[18px]">light_mode</span>
                        Day
                    </button>
<button class="text-on-surface-variant hover:bg-surface-container px-4 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all">
<span class="material-symbols-outlined text-[18px]">dark_mode</span>
                        Night
                    </button>
</div>
<!-- Current Area Score Card -->
<div class="bg-surface rounded-xl shadow-sm border border-surface-container-highest p-3 flex flex-col items-end">
<span class="font-label-md text-label-md text-on-surface-variant">Current Area Safety</span>
<div class="flex items-baseline gap-1">
<span class="font-headline-md text-headline-md text-primary font-bold">7.4</span>
<span class="font-label-md text-label-md text-on-surface-variant">/10</span>
</div>
</div>
</div>
<!-- Legend Pill -->
<div class="self-end bg-surface/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-surface-container-highest flex items-center gap-3 pointer-events-auto">
<div class="flex items-center gap-1.5">
<div class="w-2.5 h-2.5 rounded-full bg-[#a3f69c]"></div>
<span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Safe</span>
</div>
<div class="flex items-center gap-1.5">
<div class="w-2.5 h-2.5 rounded-full bg-[#ffb74d]"></div>
<span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Caution</span>
</div>
<div class="flex items-center gap-1.5">
<div class="w-2.5 h-2.5 rounded-full bg-[#ef5350]"></div>
<span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Avoid</span>
</div>
</div>
</div>
<!-- Interactive Map Pins (Simulated) -->
<button aria-label="Safe Area Pin" class="absolute top-[45%] left-[30%] z-20 w-8 h-8 -ml-4 -mt-4 bg-[#a3f69c] rounded-full border-2 border-surface shadow-md flex items-center justify-center active:scale-90 transition-transform">
<span class="material-symbols-outlined text-on-primary-fixed text-[16px]">verified_user</span>
</button>
<button aria-label="Caution Area Pin" class="absolute top-[65%] left-[65%] z-20 w-8 h-8 -ml-4 -mt-4 bg-[#ffb74d] rounded-full border-2 border-surface shadow-md flex items-center justify-center active:scale-90 transition-transform">
<span class="material-symbols-outlined text-on-surface text-[16px]">warning</span>
</button>
<!-- Floating Action Button (FAB) - Rate Area -->
<button class="absolute bottom-[240px] right-4 z-30 bg-primary-container text-on-primary-container hover:bg-primary-fixed transition-colors shadow-lg rounded-2xl p-4 flex items-center justify-center active:scale-95">
<span class="material-symbols-outlined text-[24px]">rate_review</span>
</button>
<!-- Bottom Sheet Details Panel (Persistent on this view) -->
<div class="absolute bottom-20 md:bottom-4 left-0 md:left-4 md:right-4 md:w-auto z-30 bg-surface rounded-t-[24px] md:rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border-t border-surface-container-highest md:border px-4 pt-3 pb-6 flex flex-col gap-4 transition-transform duration-300">
<!-- Handle -->
<div class="w-8 h-1 bg-outline-variant rounded-full mx-auto mb-1 md:hidden"></div>
<div class="flex justify-between items-start">
<div class="flex flex-col">
<h2 class="font-title-lg text-title-lg text-on-surface">Downtown Transit Hub</h2>
<p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">distance</span> 0.2 miles away
                    </p>
</div>
<div class="bg-error-container text-on-error-container px-3 py-1 rounded-lg font-title-md text-title-md flex items-center gap-1">
<span class="material-symbols-outlined text-[18px]">warning</span>
                    4.2
                </div>
</div>
<!-- Crowd Reports Chips -->
<div class="flex flex-wrap gap-2">
<div class="bg-surface-container-high px-3 py-1.5 rounded-full font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">lightbulb</span> Poor Lighting
                </div>
<div class="bg-surface-container-high px-3 py-1.5 rounded-full font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">groups</span> Crowded
                </div>
<span class="text-on-surface-variant font-label-md text-label-md self-center ml-1 underline cursor-pointer">View all 12 reports</span>
</div>
<!-- Primary Action -->
<button class="w-full bg-primary text-on-primary font-title-md text-title-md py-3.5 rounded-xl mt-2 flex justify-center items-center gap-2 hover:bg-surface-tint active:scale-[0.98] transition-all">
<span class="material-symbols-outlined">directions_walk</span>
                Find Safest Route
            </button>
</div>
</main>
<!-- Bottom Nav Bar (Shared Component) - Map/Heatmap Active -->
<nav class="bg-surface-container-lowest dark:bg-surface-container-low shadow-sm dark:shadow-none fixed bottom-0 w-full z-50 rounded-t-xl flex justify-around items-center h-20 px-2 pb-safe md:hidden border-t border-surface-container-highest">
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">home</span>
<span class="font-label-md text-label-md">Home</span>
</a>
<!-- ACTIVE TAB: Heatmap -->
<a class="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-xl px-3 py-1 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">map</span>
<span class="font-label-md text-label-md">Heatmap</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">group</span>
<span class="font-label-md text-label-md">Circle</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">security</span>
<span class="font-label-md text-label-md">Guardian</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">person</span>
<span class="font-label-md text-label-md">Profile</span>
</a>
</nav>
<!-- Desktop Navigation Overlay (Hidden on Mobile) -->
<nav class="hidden md:flex fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-surface border-r border-surface-container-highest z-40 flex-col py-4 px-3 gap-2">
<a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-title-md text-title-md">Home</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-full bg-secondary-container text-on-secondary-container font-bold transition-colors" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">map</span>
<span class="font-title-md text-title-md">Heatmap</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" href="#">
<span class="material-symbols-outlined">group</span>
<span class="font-title-md text-title-md">Circle</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors" href="#">
<span class="material-symbols-outlined">security</span>
<span class="font-title-md text-title-md">Guardian</span>
</a>
</nav>
`;

export const Route = createFileRoute("/heatmap")({
  head: () => ({
    meta: [
      { title: "TrustNet - Heatmap" },
    ],
  }),
  component: Page,
});

function Page() {
  return <HtmlPage html={HTML} className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden pb-20 md:pb-0" />;
}
