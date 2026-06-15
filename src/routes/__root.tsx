import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const TW_CONFIG = `tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-low": "#f5f3f7",
        "secondary-fixed-dim": "#a5c8ff",
        "on-secondary-fixed": "#001c3a",
        "tertiary-container": "#9e45c4",
        "on-tertiary-fixed-variant": "#721199",
        "on-primary-fixed": "#002204",
        "on-primary-container": "#cbffc2",
        "on-background": "#1b1b1e",
        "surface-container": "#efedf1",
        "on-tertiary": "#ffffff",
        "surface": "#faf9fc",
        "error": "#ba1a1a",
        "surface-bright": "#faf9fc",
        "primary": "#0d631b",
        "surface-container-highest": "#e3e2e6",
        "on-secondary-fixed-variant": "#004786",
        "on-error-container": "#93000a",
        "error-container": "#ffdad6",
        "surface-container-high": "#e9e7eb",
        "tertiary-fixed-dim": "#ebb2ff",
        "secondary": "#005faf",
        "on-secondary-container": "#003567",
        "on-tertiary-fixed": "#320047",
        "primary-fixed": "#a3f69c",
        "inverse-surface": "#303033",
        "background": "#faf9fc",
        "outline": "#707a6c",
        "inverse-primary": "#88d982",
        "primary-fixed-dim": "#88d982",
        "inverse-on-surface": "#f2f0f4",
        "surface-variant": "#e3e2e6",
        "on-tertiary-container": "#feecff",
        "primary-container": "#2e7d32",
        "on-primary": "#ffffff",
        "surface-dim": "#dbd9dd",
        "on-surface": "#1b1b1e",
        "on-error": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "tertiary": "#8228a9",
        "secondary-container": "#54a0fe",
        "outline-variant": "#bfcaba",
        "surface-tint": "#1b6d24",
        "tertiary-fixed": "#f8d8ff",
        "on-secondary": "#ffffff",
        "on-primary-fixed-variant": "#005312",
        "on-surface-variant": "#40493d",
        "secondary-fixed": "#d4e3ff"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "margin-tablet": "2rem",
        "stack-gap": "1.5rem",
        "gutter": "1rem",
        "margin-mobile": "1rem",
        "component-gap": "0.75rem"
      },
      fontFamily: {
        "body-md": ["Inter"], "body-lg": ["Inter"], "label-md": ["Inter"],
        "title-md": ["Inter"], "headline-lg": ["Inter"], "label-lg": ["Inter"],
        "headline-md": ["Inter"], "title-lg": ["Inter"], "headline-lg-mobile": ["Inter"]
      },
      fontSize: {
        "body-md": ["14px", { lineHeight: "20px", letterSpacing: "0.25px", fontWeight: "400" }],
        "body-lg": ["16px", { lineHeight: "24px", letterSpacing: "0.5px", fontWeight: "400" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.5px", fontWeight: "500" }],
        "title-md": ["16px", { lineHeight: "24px", letterSpacing: "0.15px", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-lg": ["14px", { lineHeight: "20px", letterSpacing: "0.1px", fontWeight: "500" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "title-lg": ["22px", { lineHeight: "28px", fontWeight: "600" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    }
  }
};`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm">Page not found</p>
        <Link to="/" className="mt-6 inline-block underline">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-4 rounded bg-black px-4 py-2 text-white"
        >Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TrustNet" },
      { name: "description", content: "TrustNet — personal safety app" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" },
    ],
    scripts: [
      { src: "https://cdn.tailwindcss.com?plugins=forms,container-queries" },
      { children: TW_CONFIG },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/heatmap", label: "Heatmap", icon: "map" },
  { to: "/sos", label: "SOS", icon: "sos" },
  { to: "/circle", label: "Circle", icon: "group" },
  { to: "/guardian", label: "Guardian", icon: "security" },
  { to: "/profile", label: "Profile", icon: "person" },
] as const;

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[100] flex justify-around items-center bg-white/95 backdrop-blur border-t border-gray-200 h-16 md:hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {NAV.map((n) => (
        <Link
          key={n.to}
          to={n.to}
          className="flex flex-col items-center justify-center text-[11px] text-gray-600 [&.active]:text-[#0d631b] [&.active]:font-semibold"
          activeProps={{ className: "active" }}
          activeOptions={{ exact: true }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{n.icon}</span>
          {n.label}
        </Link>
      ))}
    </nav>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <BottomNav />
    </QueryClientProvider>
  );
}
