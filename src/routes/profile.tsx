import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "../lib/html-page";

const HTML = `
<!-- TopAppBar -->
<header class="w-full top-0 sticky bg-surface dark:bg-background flex justify-between items-center px-margin-mobile h-16 z-40">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary dark:text-primary-fixed" style="font-variation-settings: 'FILL' 1;">shield_with_heart</span>
<span class="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed tracking-tight">TrustNet</span>
</div>
<!-- Desktop Nav (Hidden on Mobile) -->
<nav class="hidden md:flex items-center gap-6">
<a class="font-title-md text-title-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Home</a>
<a class="font-title-md text-title-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Heatmap</a>
<a class="font-title-md text-title-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Circle</a>
<a class="font-title-md text-title-md text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-colors" href="#">Guardian</a>
<a class="font-title-md text-title-md text-primary dark:text-primary-fixed font-semibold border-b-2 border-primary pb-1" href="#">Profile</a>
</nav>
<button class="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center">
<span class="material-symbols-outlined">notifications</span>
</button>
</header>
<main class="flex-1 w-full max-w-5xl mx-auto px-margin-mobile md:px-margin-tablet pb-32 pt-6 flex flex-col gap-stack-gap">
<!-- Profile Header -->
<section class="flex flex-col items-center text-center gap-4">
<div class="relative inline-block">
<div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-surface shadow-sm relative bg-surface-container">
<img alt="Profile Avatar" class="w-full h-full object-cover" data-alt="A professional, well-lit studio portrait of a confident young woman with a warm smile. She is wearing modern, minimalist clothing against a clean, soft white background. The lighting is bright and even, creating a friendly and approachable corporate identity aesthetic suitable for a personal safety app profile." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZM9vRfoXlLfczSOKoGzm8o_1cUDAv_-qMMoWB_Z-Q6jdC1CzrLiTKW2m-RDoHYSlI9ScK-JwC--ScDqQEyfCyK3Ftsuw0Jzy869FrGH0IUq8F5gwrjaCQWawwFoQHB9wKrzbdUplsubuimLiJqTkMbkT_Q6foqAS21FJJgO90mnoX5p86h_on0YnmzinwiDcFIs5WSRxR5USAxLkHUEg8cXc96iGu7dR77EoudclAgsVkL-Rp-q_hK-14rlZEqwLrGrMqa1a7IkV7">
</div>
<div class="absolute bottom-1 right-1 bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center border-2 border-surface shadow-sm" title="Verified Safe User">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">verified</span>
</div>
</div>
<div>
<h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">Elena Rodriguez</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant mt-1">TrustNet Guardian Member</p>
</div>
</section>
<!-- Bento Grid Layout -->
<section class="grid grid-cols-1 md:grid-cols-12 gap-component-gap">
<!-- Safety Score Hero Card -->
<div class="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest border border-surface-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
<div class="flex justify-between items-start mb-6">
<div>
<h2 class="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
<span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1;">health_and_safety</span>
                            Safety Score
                        </h2>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Based on recent activity and trusted contacts.</p>
</div>
<div class="text-right">
<span class="font-headline-lg text-headline-lg text-primary block">98</span>
<span class="font-label-md text-label-md text-primary bg-primary-container px-2 py-1 rounded-full mt-1 inline-block">Excellent</span>
</div>
</div>
<!-- Mock Sparkline/Graph Area -->
<div class="w-full h-24 bg-surface-container rounded-lg relative overflow-hidden flex items-end px-2 gap-1 pb-2">
<div class="absolute inset-0 opacity-10 bg-gradient-to-t from-primary to-transparent"></div>
<!-- Bar mocks -->
<div class="w-full bg-primary/40 rounded-t-sm" style="height: 60%;"></div>
<div class="w-full bg-primary/60 rounded-t-sm" style="height: 75%;"></div>
<div class="w-full bg-primary/50 rounded-t-sm" style="height: 65%;"></div>
<div class="w-full bg-primary/80 rounded-t-sm" style="height: 90%;"></div>
<div class="w-full bg-primary rounded-t-sm shadow-[0_-2px_8px_rgba(13,99,27,0.4)]" style="height: 98%;"></div>
</div>
</div>
<!-- Emergency Preferences -->
<a class="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-6 flex flex-col gap-4 group" href="#">
<div class="w-12 h-12 bg-error-container text-on-error-container rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">sos</span>
</div>
<div>
<h3 class="font-title-md text-title-md text-on-surface">Emergency Setup</h3>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Configure SOS triggers (Voice, Power Button).</p>
</div>
<div class="mt-auto flex items-center text-primary font-label-lg text-label-lg pt-4">
                    Manage Triggers <span class="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
</div>
</a>
<!-- Privacy Controls -->
<a class="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-6 flex flex-col gap-4 group" href="#">
<div class="w-12 h-12 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined">visibility_off</span>
</div>
<div>
<h3 class="font-title-md text-title-md text-on-surface">Privacy Guard</h3>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Location sharing and data permissions.</p>
</div>
<div class="mt-auto pt-4 flex items-center justify-between">
<span class="font-label-lg text-label-lg text-on-surface-variant">Location: While Using</span>
<span class="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
</div>
</a>
<!-- Trusted Contacts -->
<a class="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-6 flex flex-col gap-4 group" href="#">
<div class="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">groups</span>
</div>
<div>
<h3 class="font-title-md text-title-md text-on-surface">Trusted Contacts</h3>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">3 active guardians configured.</p>
</div>
<div class="mt-auto pt-4 flex -space-x-2">
<div class="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface-container-low flex items-center justify-center text-[10px] font-bold">JD</div>
<div class="w-8 h-8 rounded-full bg-secondary-fixed-dim border-2 border-surface-container-low flex items-center justify-center text-[10px] font-bold text-on-secondary-fixed">MR</div>
<div class="w-8 h-8 rounded-full bg-primary-container border-2 border-surface-container-low flex items-center justify-center text-[10px] font-bold text-on-primary-container">AL</div>
<div class="w-8 h-8 rounded-full bg-surface border-2 border-surface-container-low flex items-center justify-center text-[12px] text-on-surface-variant"><span class="material-symbols-outlined text-[16px]">add</span></div>
</div>
</a>
<!-- Notifications -->
<a class="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-6 flex flex-col gap-4 group" href="#">
<div class="w-12 h-12 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
<span class="material-symbols-outlined">notifications_active</span>
</div>
<div>
<h3 class="font-title-md text-title-md text-on-surface">Alert Preferences</h3>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Manage push, SMS, and email alerts.</p>
</div>
<div class="mt-auto pt-4 flex items-center justify-between">
<span class="font-label-lg text-label-lg text-on-surface-variant">All Alerts On</span>
<span class="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
</div>
</a>
</section>
<!-- System Actions -->
<section class="mt-4 flex flex-col gap-3">
<button class="w-full py-4 px-6 bg-surface-container-lowest border border-surface-variant rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors text-on-surface">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">help</span>
<span class="font-title-md text-title-md">Help &amp; Support</span>
</div>
<span class="material-symbols-outlined text-on-surface-variant">chevron_right</span>
</button>
<button class="w-full py-4 px-6 bg-surface border border-error-container text-error rounded-xl flex items-center justify-center gap-2 hover:bg-error-container hover:text-on-error-container transition-colors font-title-md text-title-md mt-4">
<span class="material-symbols-outlined">logout</span>
                Log Out
            </button>
</section>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="md:hidden fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-lowest dark:bg-surface-container-low shadow-[0_-2px_10px_rgba(0,0,0,0.05)] dark:shadow-none flex justify-around items-center h-20 px-2 pb-safe border-t-0">
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-label-md text-label-md mt-1">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined">map</span>
<span class="font-label-md text-label-md mt-1">Heatmap</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined">group</span>
<span class="font-label-md text-label-md mt-1">Circle</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform rounded-xl" href="#">
<span class="material-symbols-outlined">security</span>
<span class="font-label-md text-label-md mt-1">Guardian</span>
</a>
<!-- Active Tab -->
<a class="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-xl px-3 py-1 active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="font-label-md text-label-md mt-1">Profile</span>
</a>
</nav>
`;

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "TrustNet - Profile" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased" dangerouslySetInnerHTML={{ __html: HTML }} />
  );
}
