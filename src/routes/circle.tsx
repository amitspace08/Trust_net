import { createFileRoute } from "@tanstack/react-router";

const HTML = `
<!-- TopAppBar (Mobile Only) / Header (Web) -->
<header class="bg-surface dark:bg-background text-primary dark:text-primary-fixed w-full top-0 sticky bg-surface-container dark:bg-surface-dim flat no shadows flex justify-between items-center px-margin-mobile h-16 z-40 md:hidden">
<div class="flex items-center gap-4">
<button class="hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center text-on-surface-variant dark:text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="shield_with_heart" style="font-variation-settings: 'FILL' 1;">shield_with_heart</span>
</button>
<h1 class="font-title-lg text-title-lg font-bold">TrustNet</h1>
</div>
<button class="hover:bg-surface-container-highest dark:hover:bg-surface-variant transition-colors active:scale-95 duration-100 p-2 rounded-full flex items-center justify-center text-on-surface-variant dark:text-on-surface-variant">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</header>
<!-- NavigationDrawer (Web Only) -->
<nav class="hidden md:flex flex-col bg-surface dark:bg-surface-dim text-primary dark:text-primary-fixed h-full rounded-r-xl bg-surface dark:bg-surface-dim shadow-lg dark:shadow-none transition-all duration-200 ease-in-out w-72 max-w-[80vw] p-4 fixed left-0 top-0 bottom-0 z-50">
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
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary font-bold font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span>Circle</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">security</span>Guardian</a></li>
<li><a class="flex items-center gap-3 px-4 py-3 rounded-full text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-variant transition-all font-label-lg text-label-lg" href="#"><span class="material-symbols-outlined">person</span>Profile</a></li>
</ul>
</div>
</nav>
<!-- Main Canvas -->
<main class="flex-1 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet py-6 md:ml-72 pb-32 md:pb-6">
<!-- Header -->
<div class="mb-stack-gap">
<h1 class="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-background mb-2">My Trust Circle</h1>
<p class="font-body-md text-body-md text-on-surface-variant">Manage the people who keep you safe and build your network.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-gutter md:gap-stack-gap">
<!-- Layer 1: Direct Trusted Contacts (Bento Grid Style) -->
<section class="col-span-1 md:col-span-8 flex flex-col gap-component-gap">
<div class="flex justify-between items-center mb-2">
<h2 class="font-title-lg text-title-lg text-on-background">Direct Trusted Contacts</h2>
<span class="font-label-md text-label-md bg-primary-container text-on-primary-container px-2 py-1 rounded-full">Layer 1</span>
</div>
<!-- Contact List -->
<div class="bg-surface-container-low rounded-xl p-4 flex flex-col gap-4 border border-outline-variant/30">
<!-- Contact Item -->
<div class="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30">
<div class="flex items-center gap-4">
<img alt="Mom Profile" class="w-12 h-12 rounded-full object-cover border-2 border-primary-container" data-alt="A portrait of a middle-aged woman with a warm smile, set against a light background. The lighting is soft and flattering, creating a sense of trust and approachability. Professional studio photography style, keeping with a modern, high-key app aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiQElO-UMyGEASHYNtlKiY2V8wSQC7vzZ9fMK06sQGomHuEuqyMVCDiTN6MH5TXHCtjFXXbR7OOH5MFbq_wF-GdjwhfTO_v1RzsBpu76Cfubg8BV_UlYknOutPmLxoi6WMUDKGryKolfqL-iWNPCltt1PnVxAYjJMlg4lLLPR4iF7BTAM0CgJRW4VvCQERaQVoqRnJ8A53NoX6zH_zvwNRWjFnk6RmrsWSSi3xd4NZ-ISqWEJdWm8TrtEWOxJbxG7WdzKeO5E-QkNc">
<div>
<h3 class="font-title-md text-title-md text-on-background group-hover:text-primary transition-colors">Mom</h3>
<p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">call</span> +1 (555) 012-3456
                                </p>
</div>
</div>
<div class="flex items-center gap-3">
<span class="font-label-md text-label-md bg-primary-container text-on-primary-container px-3 py-1 rounded-full flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span> Active
                            </span>
<button class="text-on-surface-variant hover:text-on-background p-2 rounded-full hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
<!-- Contact Item -->
<div class="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-surface-container transition-colors group cursor-pointer border border-transparent hover:border-outline-variant/30">
<div class="flex items-center gap-4">
<img alt="Riya Profile" class="w-12 h-12 rounded-full object-cover border-2 border-primary-container" data-alt="A portrait of a young adult woman looking confident and friendly. Light, neutral background with modern, soft lighting. The aesthetic is clean and professional, matching a trusted safety application user profile." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Fk8OzxEG0bBzVgPeewMDP75pPjhy6jJ2MsBqCHkJfuXUvT71nTGR3phzeH3hj-70poLiXJKnj-sIX_b_2pLTRo17YooMxXiFnKj-gJ_aivhSGpP2VYfL5BMvWZHx7C64I0sUmHc3hSTJSPnca2tvMKiUaQE0xbpYz2mM16cEYC55o-H-IxlElcFAeNNKjOFFefgwdEW5ep_hp5bqKi5kBcAj7AB71dDwKql9f002IPouhr9WH4UDdMXh5zFnOrmrqXcEz38yxPAp">
<div>
<h3 class="font-title-md text-title-md text-on-background group-hover:text-primary transition-colors">Riya</h3>
<p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">call</span> +1 (555) 987-6543
                                </p>
</div>
</div>
<div class="flex items-center gap-3">
<span class="font-label-md text-label-md bg-primary-container text-on-primary-container px-3 py-1 rounded-full flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-primary inline-block"></span> Active
                            </span>
<button class="text-on-surface-variant hover:text-on-background p-2 rounded-full hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
<!-- Contact Item (Inactive) -->
<div class="flex items-center justify-between p-3 bg-surface/50 rounded-lg group cursor-pointer border border-transparent">
<div class="flex items-center gap-4 opacity-70">
<img alt="Arjun Profile" class="w-12 h-12 rounded-full object-cover grayscale" data-alt="A portrait of a young adult man, rendered in grayscale to indicate an inactive status. The lighting is soft and neutral, typical of a professional profile picture in a modern app. The overall tone is subdued but clear." src="https://lh3.googleusercontent.com/aida-public/AB6AXuACfjmYlU8iii7s7LSbJSHv5rNHFTq8s5ueejb8WApJ4UJAG1DJcBIm5jvGlGCsfXMERiUSg06hIP9l7xxQCHqUmwTtV-K3Yvcke2jBbdmFXPCz7GgagQxecialWRuVNCZMk3R7LnAMmUHkZaOgZ--WF1-iwsbzqKfmjq0JjaZ5l4ySiP6631z2YZD8headhQ9tdTvA3rvRkiOPAicDDaHBhc5fTM-YP-im6sQbdLpADTo7aYyOVKPuVBQhCXd0BozbWa-BH6Rtk17t">
<div>
<h3 class="font-title-md text-title-md text-on-background">Arjun</h3>
<p class="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
<span class="material-symbols-outlined text-[16px]">call</span> +1 (555) 456-7890
                                </p>
</div>
</div>
<div class="flex items-center gap-3">
<span class="font-label-md text-label-md bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full flex items-center gap-1">
<span class="w-2 h-2 rounded-full bg-outline inline-block"></span> Inactive
                            </span>
<button class="text-on-surface-variant hover:text-on-background p-2 rounded-full hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
<button class="w-full py-3 mt-2 border-2 border-dashed border-primary/30 rounded-lg text-primary font-label-lg text-label-lg hover:bg-primary-container/20 hover:border-primary/50 transition-all flex items-center justify-center gap-2">
<span class="material-symbols-outlined">person_add</span> Add Contact
                    </button>
</div>
<!-- Pending Requests -->
<div class="mt-4">
<h3 class="font-title-md text-title-md text-on-background mb-3">Pending Requests</h3>
<div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between shadow-sm">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
<span class="material-symbols-outlined">hourglass_empty</span>
</div>
<div>
<p class="font-title-md text-title-md text-on-background">Neha</p>
<p class="font-body-md text-body-md text-on-surface-variant text-sm">Awaiting Acceptance</p>
</div>
</div>
<button class="text-error font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-error-container transition-colors">Cancel</button>
</div>
</div>
</section>
<!-- Layer 2 & Info (Side Panel on Desktop) -->
<section class="col-span-1 md:col-span-4 flex flex-col gap-component-gap">
<!-- Info Banner -->
<div class="bg-secondary-container/30 border border-secondary/20 rounded-xl p-4 flex gap-3 items-start">
<span class="material-symbols-outlined text-secondary mt-0.5">info</span>
<div>
<h3 class="font-title-md text-title-md text-on-secondary-container mb-1">Layer 2 Explained</h3>
<p class="font-body-md text-body-md text-on-secondary-container/80 text-sm">Friends of Friends form your extended safety net. They are vetted by your direct contacts, expanding your safe zones.</p>
</div>
</div>
<!-- Layer 2 Network -->
<div class="bg-surface-container rounded-xl p-4 flex flex-col gap-4">
<div class="flex justify-between items-center mb-1">
<h2 class="font-title-lg text-title-lg text-on-background">Friends of Friends</h2>
<span class="font-label-md text-label-md bg-secondary-container text-on-secondary-container px-2 py-1 rounded-full">Layer 2</span>
</div>
<!-- L2 Item -->
<div class="bg-surface p-3 rounded-lg flex items-center justify-between border border-outline-variant/20">
<div class="flex items-center gap-3">
<div class="relative">
<img alt="Rahul Profile" class="w-10 h-10 rounded-full object-cover" data-alt="A small, circular profile picture of a young man, presented in a clean, bright aesthetic suitable for a modern trust and safety app network list. Soft, high-key lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqKJau6jwMTr6vH6d26Tv1qITburRYz5wRShmY_rp2XWgZwlsXLRNIMprBXGfg3xXzitKpE8W2f0CTQ_ss8J8V3-COU8_KlfOYetVtYGoaBJnVUDQ7arjALd787_L-ETvHWv0IlhC1cftMJATFEEdl-pBEpD_J-CsOsIIocB9dBKBtkWT0RY_cWs4igh9MPAc2YdebZYLyTGZ_HdlZGrzFjMEEScMjznDRa28mL86-k4hoZRkAtLYj7rT4-xIsyoM3yronrBklG06K">
<div class="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
<span class="material-symbols-outlined text-[12px] text-secondary bg-secondary-container rounded-full p-0.5">verified</span>
</div>
</div>
<div>
<h4 class="font-title-md text-title-md text-on-background text-sm">Rahul Sharma</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-xs flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">group</span> 3 mutuals
                                </p>
</div>
</div>
<div class="flex flex-col items-end">
<span class="font-title-md text-title-md text-primary">92%</span>
<span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Trust Score</span>
</div>
</div>
<!-- L2 Item -->
<div class="bg-surface p-3 rounded-lg flex items-center justify-between border border-outline-variant/20">
<div class="flex items-center gap-3">
<div class="relative">
<img alt="Sara Profile" class="w-10 h-10 rounded-full object-cover" data-alt="A small, circular profile picture of a young woman, presented in a clean, bright aesthetic suitable for a modern trust and safety app network list. Soft, high-key lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCz7NXTobBoxZS1LdenK3OFVM6-ycj1Al0vdt_05W4mAnVc1HKeAU5X0wjI4mOW_96iJATXDwzN-KX96CFeKDO8aO5kU1HyKVdYegXeE9YTmQb2Kix9oUmHDQEHhucM6cypQ8UlakJgcpMGTHzXNQkEjTfm_AzkyYwrEfI9Smfr9IQDRqdex7Wv-1va9Yfj7UROZo-uWN3zTHBjlrZ-dZeQpt1dseQjejo3DphHZV9e69BUGJ_0bUb_2zzgaycMWMNkgSGKmHcq05Zn">
<div class="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
<span class="material-symbols-outlined text-[12px] text-secondary bg-secondary-container rounded-full p-0.5">verified</span>
</div>
</div>
<div>
<h4 class="font-title-md text-title-md text-on-background text-sm">Sara Jones</h4>
<p class="font-body-md text-body-md text-on-surface-variant text-xs flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">group</span> 1 mutual
                                </p>
</div>
</div>
<div class="flex flex-col items-end">
<span class="font-title-md text-title-md text-primary">85%</span>
<span class="font-label-md text-label-md text-on-surface-variant text-[10px]">Trust Score</span>
</div>
</div>
<!-- Invite CTA -->
<button class="mt-2 w-full bg-primary text-on-primary font-label-lg text-label-lg py-3 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm">
<span class="material-symbols-outlined">share</span> Invite Friends to Network
                    </button>
</div>
</section>
</div>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="bg-surface-container-lowest dark:bg-surface-container-low text-primary dark:text-primary-fixed-dim font-label-md text-label-md fixed bottom-0 w-full z-50 rounded-t-xl bg-surface-container-lowest dark:bg-surface-container-low shadow-sm dark:shadow-none flex justify-around items-center w-full h-20 px-2 pb-safe md:hidden">
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="mt-1">Home</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="map">map</span>
<span class="mt-1">Heatmap</span>
</a>
<a class="flex flex-col items-center justify-center bg-primary-container dark:bg-primary text-on-primary-container dark:text-on-primary rounded-xl px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="group" style="font-variation-settings: 'FILL' 1;">group</span>
<span class="mt-1 font-semibold">Circle</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="security">security</span>
<span class="mt-1">Guardian</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant px-3 py-1 hover:bg-surface-container-high dark:hover:bg-surface-variant active:scale-90 transition-transform" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="mt-1">Profile</span>
</a>
</nav>
`;

export const Route = createFileRoute("/circle")({
  head: () => ({
    meta: [
      { title: "TrustNet - MyCircle" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased md:flex-row" dangerouslySetInnerHTML={{ __html: HTML }} />
  );
}
