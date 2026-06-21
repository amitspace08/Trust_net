import { createFileRoute } from "@tanstack/react-router";
import { HtmlPage } from "../lib/html-page";

const HTML = `
<!-- App Container -->
<div class="w-full min-h-screen relative flex flex-col md:flex-row pb-24 md:pb-0 bg-surface-bright">
<!-- NavigationDrawer (Web Only) -->
<nav class="hidden md:flex flex-col bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed h-full rounded-r-xl shadow-lg dark:shadow-none transition-all duration-200 ease-in-out w-72 max-w-[80vw] p-4 fixed left-0 top-0 z-50">
<div class="flex items-center gap-4 mb-8 pt-4">
<img alt="User Profile" class="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx1s7cKAePJFBmHojTu4cZFC5UuKj7jy18bCo1PM4SW_Vq5HYCCIWn0KyQnEhANOITgjZ26GcVwUeRHxoReatAnGazD1zxMKBI_VAR8nw3wmyMACxViNWxxjWKsY65vV9JapMbu3sUJ8E_GtOE9bhZVbsq_BDxFZWuatWbgXcZTrsz4dLzZ3Y_CsHGbVN-qt2bFi2MogcVI7L3uTSjiqjH2qo_WG1uJvJ8opyJqJ1uc15T-26Wlw-qNL4n_tMsUpUtWgG0AQUkufcK">
<div>
<h2 class="font-title-lg text-title-lg text-primary">User Name</h2>
<p class="font-label-md text-label-md text-on-surface-variant">Safety Status: Protected</p>
<p class="font-label-md text-label-md text-on-surface-variant">Trust Score: 98</p>
</div>
</div>
<ul class="flex flex-col gap-2">
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">settings_ethernet</span>Emergency Settings</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">history</span>Safety History</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">privacy_tip</span>Privacy Guard</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">help</span>Support</a></li>
</ul>
<div class="mt-auto">
<ul class="flex flex-col gap-2">
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">home</span>Home</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">map</span>Heatmap</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">group</span>Circle</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">security</span>Guardian</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">person</span>Profile</a></li>
</ul>
</div>
</nav>
<!-- TopAppBar (From JSON) -->
<header class="bg-surface w-full top-0 sticky flex justify-between items-center px-margin-mobile h-16 z-40 bg-surface-container flat no shadows md:hidden">
<div class="flex items-center gap-2">
<div class="w-8 h-8 flex items-center justify-center text-primary"><span class="material-symbols-outlined fill">shield_with_heart</span></div>
<span class="font-headline-md text-headline-md font-bold text-primary tracking-tight">TrustNet</span>
</div>
<button class="hover:bg-surface-container-highest transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined">notifications</span>
</button>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-6 md:ml-72 pb-64 md:pb-6 flex flex-col gap-stack-gap">
<!-- Page Header -->
<div>
<h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Guardian Angel</h1>
<p class="font-body-md text-body-md text-on-surface-variant mt-1">Profile &amp; Details</p>
</div>
<!-- Profile Hero Card (Level 1 Elevation equivalent) -->
<section class="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-surface-container-high relative overflow-hidden flex flex-col gap-4">
<!-- Abstract background shape for premium feel -->
<div class="absolute -right-12 -top-12 w-40 h-40 bg-primary-container rounded-full opacity-20 blur-2xl pointer-events-none"></div>
<div class="flex items-start justify-between relative z-10">
<div class="flex items-center gap-4">
<!-- Avatar -->
<div class="relative">
<img alt="Rakesh Kumar Profile Photo" class="w-16 h-16 rounded-full object-cover border-2 border-surface shadow-sm" data-alt="A professional headshot of a confident, reliable-looking man in his late 30s. He is wearing a clean, modern dark blue collared shirt. The lighting is soft, natural, and flattering, indicating a daytime outdoor or well-lit modern indoor setting. The background is softly blurred with subtle green and grey tones, creating a calm, trustworthy aesthetic suitable for a high-end personal safety application profile." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaKBoKnNqKnNn5PWbMTe5gomvq-dzgEhryLZvEmyIGoU30YSiiR4-St6_9_Cte3wBAE96suYIqP5G40Y3Ij-pIuS-3_VeijFL9KrOa14J2ydjNX4LnCH-4YzytJZ2XwKS7PiBxckvJUAt9Fr57N0zvO0nqmahe821JAgA-LnThrSqjX94bKcWMXdyFIbsASMGhhTBWkLnkPwdOWhyyrJ8x5yJ_6frJqo2cYzHFzFIpovNxfg3X2IzYM-gXmzQaJy7o5A9oEj4nydsg">
<!-- Availability Badge overlapping avatar slightly -->
<div class="absolute -bottom-1 -right-1 bg-primary text-on-primary w-5 h-5 rounded-full border-2 border-surface flex items-center justify-center">
<span class="w-2 h-2 bg-on-primary rounded-full pulse-dot"></span>
</div>
</div>
<!-- Name & Title -->
<div class="flex flex-col">
<h2 class="font-title-lg text-title-lg text-on-surface">Rakesh Kumar</h2>
<div class="flex items-center gap-1 text-primary mt-0.5">
<span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">verified</span>
<span class="font-label-md text-label-md">Verified Guardian</span>
</div>
<div class="flex items-center gap-1 text-on-surface-variant mt-1">
<span class="material-symbols-outlined text-[14px]">location_on</span>
<span class="font-label-md text-label-md">340m away</span>
</div>
</div>
</div>
</div>
<!-- Availability Banner -->
<div class="bg-primary-container text-on-primary-container rounded-xl py-3 px-4 flex items-center justify-between mt-2 z-10">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bolt</span>
<span class="font-title-md text-title-md">Available Now</span>
</div>
<span class="font-label-md text-label-md opacity-80">Ready to assist</span>
</div>
</section>
<!-- Verification Badges (Bento Style) -->
<section>
<h3 class="font-title-md text-title-md text-on-surface mb-3">Verification Status</h3>
<div class="grid grid-cols-3 gap-component-gap">
<div class="bg-surface-container rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 h-24 hover:bg-surface-container-highest transition-colors">
<div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">badge</span>
</div>
<span class="font-label-md text-label-md text-on-surface leading-tight">ID<br>Verified</span>
</div>
<div class="bg-surface-container rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 h-24 hover:bg-surface-container-highest transition-colors">
<div class="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">policy</span>
</div>
<span class="font-label-md text-label-md text-on-surface leading-tight">Background<br>Checked</span>
</div>
<div class="bg-surface-container rounded-xl p-3 flex flex-col items-center justify-center text-center gap-2 h-24 hover:bg-surface-container-highest transition-colors">
<div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]" style="font-variation-settings: 'FILL' 1;">military_tech</span>
</div>
<span class="font-label-md text-label-md text-on-surface leading-tight">Safety<br>Certified</span>
</div>
</div>
</section>
<!-- Community Ratings (Asymmetric Bento) -->
<section>
<h3 class="font-title-md text-title-md text-on-surface mb-3">Community Trust</h3>
<div class="grid grid-cols-2 gap-component-gap">
<!-- Main Rating -->
<div class="bg-secondary-fixed text-on-secondary-fixed rounded-xl p-4 flex flex-col justify-between col-span-1 row-span-2 shadow-sm relative overflow-hidden">
<div class="absolute top-0 right-0 p-2 opacity-20">
<span class="material-symbols-outlined text-[64px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
<div>
<span class="font-headline-lg-mobile text-headline-lg-mobile font-bold">4.8</span>
<span class="font-title-md text-title-md opacity-80">/5</span>
</div>
<div class="mt-4">
<div class="flex text-on-secondary-fixed gap-0.5">
<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[18px]">star_half</span>
</div>
<span class="font-label-md text-label-md opacity-90 mt-1 block">124 Ratings</span>
</div>
</div>
<!-- Stats Stack -->
<div class="bg-surface-container-high rounded-xl p-3 flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary">
<span class="material-symbols-outlined">group_add</span>
</div>
<div class="flex flex-col">
<span class="font-title-lg text-title-lg text-on-surface">52</span>
<span class="font-label-md text-label-md text-on-surface-variant">Assists Made</span>
</div>
</div>
<div class="bg-surface-container-high rounded-xl p-3 flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-tertiary">
<span class="material-symbols-outlined">timer</span>
</div>
<div class="flex flex-col">
<span class="font-title-lg text-title-lg text-on-surface">4m</span>
<span class="font-label-md text-label-md text-on-surface-variant">Avg Response</span>
</div>
</div>
</div>
</section>
<!-- Trust Indicators List -->
<section class="bg-surface-container-low rounded-xl p-4 flex flex-col gap-4 border border-surface-container">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">calendar_month</span>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface">Active since</span>
<span class="font-title-md text-title-md text-on-surface">August 2022</span>
</div>
</div>
<div class="h-px w-full bg-surface-container-highest"></div>
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-on-surface-variant">language</span>
<div class="flex flex-col">
<span class="font-body-md text-body-md text-on-surface">Speaks</span>
<span class="font-title-md text-title-md text-on-surface">English, Hindi, Marathi</span>
</div>
</div>
</section>
<!-- Recent Reviews -->
<section>
<div class="flex items-center justify-between mb-3">
<h3 class="font-title-md text-title-md text-on-surface">Recent Reviews</h3>
<button class="font-label-md text-label-md text-primary hover:underline">See All</button>
</div>
<div class="flex flex-col gap-3">
<!-- Review Item 1 -->
<div class="bg-surface-container-lowest rounded-xl p-4 border border-surface-container shadow-sm">
<div class="flex items-center justify-between mb-2">
<span class="font-title-md text-title-md text-on-surface">Priya S.</span>
<div class="flex text-primary">
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
</div>
</div>
<p class="font-body-md text-body-md text-on-surface-variant line-clamp-2">"Rakesh arrived in less than 5 minutes when I felt unsafe walking home from the station. Very professional and calming presence."</p>
</div>
</div>
</section>
<!-- Floating CTAs (Pinned above nav) -->
<div class="absolute bottom-24 md:relative md:bottom-auto md:left-auto md:w-auto md:bg-none md:p-0 md:pt-4 md:mt-4 left-0 w-full px-margin-mobile flex flex-col gap-3 z-30 bg-gradient-to-t from-surface-bright via-surface-bright to-transparent pt-6 pb-2">
<button class="w-full bg-primary text-on-primary font-title-lg text-title-lg py-4 rounded-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-surface-tint">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">sos</span>
                Request Help Now
            </button>
<button class="w-full text-primary font-label-lg text-label-lg py-2 text-center hover:bg-surface-container-low rounded-full transition-colors">
                Become a Guardian Angel
            </button>
</div>
<!-- Actions Area (Spacing for scroll clearance) -->
<div class="h-4"></div>
</main>
<!-- BottomNavBar (From JSON) -->
<nav class="fixed bottom-0 w-full max-w-md z-50 rounded-t-xl bg-surface-container-lowest flex justify-around items-center h-20 px-2 pb-safe shadow-sm border-t border-surface-container-lowest md:hidden">
<!-- Home (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-high active:scale-90 transition-transform rounded-xl">
<span class="material-symbols-outlined">home</span>
<span class="font-label-md text-label-md mt-1">Home</span>
</button>
<!-- Heatmap (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-high active:scale-90 transition-transform rounded-xl">
<span class="material-symbols-outlined">map</span>
<span class="font-label-md text-label-md mt-1">Heatmap</span>
</button>
<!-- Circle (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-high active:scale-90 transition-transform rounded-xl">
<span class="material-symbols-outlined">group</span>
<span class="font-label-md text-label-md mt-1">Circle</span>
</button>
<!-- Guardian (Active) -->
<button class="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-1.5 active:scale-90 transition-transform shadow-sm">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">security</span>
<span class="font-label-md text-label-md font-bold mt-0.5">Guardian</span>
</button>
<!-- Profile (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant px-3 py-1 hover:bg-surface-container-high active:scale-90 transition-transform rounded-xl">
<span class="material-symbols-outlined">person</span>
<span class="font-label-md text-label-md mt-1">Profile</span>
</button>
</nav>
</div>
`;

export const Route = createFileRoute("/guardian")({
  head: () => ({
    meta: [
      { title: "TrustNet - Guardian" },
    ],
  }),
  component: Page,
});

function Page() {
  return <HtmlPage html={HTML} className="bg-surface text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col md:flex-row overflow-x-hidden pb-20 md:pb-0" />;
}
