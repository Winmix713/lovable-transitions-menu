import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Copy, Archive, Trash2 } from "lucide-react";
import { AnimatedMenu } from "@/components/AnimatedMenu";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dropdown Menu — Headless UI × transitions.dev" },
      {
        name: "description",
        content:
          "Dark, polished dropdown menu built with Headless UI and the transitions.dev origin-aware animation.",
      },
    ],
  }),
});

function Index() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
          {/* aurora glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full opacity-70 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(56,189,248,0.18), rgba(16,185,129,0.10) 55%, transparent 75%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-10%] top-[-20%] h-[380px] w-[380px] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(139,92,246,0.14), transparent 70%)",
            }}
          />

          <div className="relative flex min-h-[520px] items-center justify-center px-6 py-24">
            <div className="flex flex-col items-end gap-3">
              <AnimatedMenu
                label="Options"
                origin="top-right"
                align="end"
                items={[
                  { key: "edit", label: "Edit", icon: Pencil, onSelect: () => {} },
                  {
                    key: "duplicate",
                    label: "Duplicate",
                    icon: Copy,
                    shortcut: "⌘D",
                    onSelect: () => {},
                  },
                  { type: "separator", key: "sep-1" },
                  { key: "archive", label: "Archive", icon: Archive, onSelect: () => {} },
                  { key: "delete", label: "Delete", icon: Trash2, onSelect: () => {} },
                ]}
              />
            </div>
          </div>

          <div className="relative border-t border-white/10 px-8 py-6">
            <h2 className="text-2xl font-semibold tracking-tight">Dropdown Menu</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
