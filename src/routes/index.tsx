import { createFileRoute } from "@tanstack/react-router";
import { AnimatedMenu, type DropdownOrigin } from "@/components/AnimatedMenu";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Animated Menu — Headless UI × transitions.dev" },
      {
        name: "description",
        content:
          "Headless UI Menu with the transitions.dev dropdown animation: origin-aware growth and a full closing animation before unmount.",
      },
    ],
  }),
});

const ORIGINS: DropdownOrigin[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

function Index() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight">Animated Menu</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Headless UI Menu + transitions.dev dropdown animation. Click any trigger — the panel
          grows from the origin, and closing plays fully before unmount.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {ORIGINS.map((origin) => (
            <div key={origin} className="flex flex-col items-start gap-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                {origin}
              </span>
              <AnimatedMenu
                label={origin}
                origin={origin}
                items={[
                  { key: "profile", label: "Profile", onSelect: () => {} },
                  { key: "settings", label: "Settings", onSelect: () => {} },
                  { key: "docs", label: "Docs", href: "#" },
                  { key: "signout", label: "Sign out", onSelect: () => {} },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
