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
import { Preloader } from "../components/landing/Preloader";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#224366" },
      { property: "og:site_name", content: "Thermo Películas" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://use.typekit.net" },
      { rel: "preconnect", href: "https://p.typekit.net", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://use.typekit.net/glj0dtk.css" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* ─── SSR Preloader — renders at 0 ms, before any JS ─── */}
        <div
          id="site-preloader"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            background:
              "radial-gradient(60% 55% at 20% 10%, rgba(115,150,180,.15), transparent 55%), radial-gradient(50% 45% at 80% 85%, rgba(34,67,102,.08), transparent 55%), linear-gradient(180deg,#ffffff 0%,#f5f8fb 50%,#eef3f8 100%)",
            transition: "opacity 0.85s cubic-bezier(0.22,1,0.36,1), visibility 0.85s linear",
          }}
          aria-label="Carregando página"
          role="progressbar"
          aria-busy="true"
        >
          {/* CSS animations via inline <style> so they work before stylesheets load */}
          <style
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: `
                #site-preloader.preloader-exit {
                  opacity: 0;
                  visibility: hidden;
                  pointer-events: none;
                }
                @keyframes pl-spin  { to { transform: rotate(360deg); } }
                @keyframes pl-pulse { 0%,100% { opacity:.55; transform:scale(1); } 50% { opacity:1; transform:scale(1.13); } }
                @keyframes pl-blob  { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-18px) scale(1.05); } }
                @keyframes pl-bar   { 0% { transform:translateX(-100%); } 100% { transform:translateX(100%); } }
                @keyframes pl-fade-in { from { opacity:0; transform:translateY(14px) scale(.94); } to { opacity:1; transform:translateY(0) scale(1); } }
              `,
            }}
          />

          {/* Ambient blobs */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {[
              { width:"22rem",height:"22rem",left:"-8%",top:"10%",background:"rgba(115,150,180,.22)",animationDuration:"6s" },
              { width:"18rem",height:"18rem",right:"-5%",bottom:"15%",background:"rgba(196,214,230,.35)",animationDuration:"7s",animationDirection:"reverse" as const },
              { width:"14rem",height:"14rem",left:"35%",bottom:"5%",background:"rgba(34,67,102,.08)",animationDuration:"5s",animationDelay:"1s" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  borderRadius: "50%",
                  filter: "blur(72px)",
                  animation: `pl-blob ${b.animationDuration} ease-in-out infinite`,
                  animationDirection: b.animationDirection,
                  animationDelay: b.animationDelay,
                  ...b,
                }}
              />
            ))}
          </div>

          {/* Center spinner + logo */}
          <div
            style={{
              position: "relative",
              animation: "pl-fade-in .7s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            {/* Glow halo */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: "-16px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(34,67,102,.14) 0%, transparent 70%)",
                animation: "pl-pulse 2s ease-in-out infinite",
              }}
            />

            {/* Spinning gradient SVG ring */}
            <div
              style={{
                width: "120px",
                height: "120px",
                animation: "pl-spin 1.6s linear infinite",
              }}
            >
              <svg viewBox="0 0 120 120" style={{ width:"100%", height:"100%" }}>
                <defs>
                  <linearGradient id="pl-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%"   stopColor="#224366" />
                    <stop offset="50%"  stopColor="#7396b4" />
                    <stop offset="100%" stopColor="#c4d6e6" />
                  </linearGradient>
                </defs>
                <circle
                  cx="60" cy="60" r="54"
                  fill="none"
                  stroke="url(#pl-g)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="240 100"
                />
              </svg>
            </div>

            {/* Glass logo badge */}
            <div
              style={{
                position: "absolute",
                inset: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "rgba(255,255,255,.65)",
                backdropFilter: "blur(16px) saturate(140%)",
                border: "1px solid rgba(255,255,255,.88)",
                boxShadow: "0 4px 16px rgba(34,67,102,.08), inset 0 1px 0 rgba(255,255,255,.9)",
              }}
            >
              <img
                src="/src/assets/landing/logo-default.png"
                alt="Thermo Películas"
                width="52"
                height="auto"
                style={{
                  width: "52px",
                  height: "auto",
                  objectFit: "contain",
                  animation: "pl-fade-in .6s cubic-bezier(0.22,1,0.36,1) .25s both",
                }}
              />
            </div>
          </div>

          {/* Loading bar */}
          <div
            style={{
              width: "140px",
              height: "3px",
              borderRadius: "999px",
              background: "rgba(34,67,102,.08)",
              overflow: "hidden",
              animation: "pl-fade-in .7s cubic-bezier(0.22,1,0.36,1) .1s both",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: "999px",
                background: "linear-gradient(90deg,#224366,#7396b4,#c4d6e6)",
                animation: "pl-bar 1.3s ease-in-out infinite",
              }}
            />
          </div>
        </div>
        {/* ─── End SSR Preloader ─── */}

        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Dismisses the SSR preloader that was injected in RootShell */}
      <Preloader />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
