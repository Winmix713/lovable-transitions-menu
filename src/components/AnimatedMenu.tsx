import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
  type MenuItemsProps,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";

export type DropdownOrigin =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type Phase = "closed" | "open" | "closing";

function useCloseDurationMs(): number {
  const [ms, setMs] = useState(150);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--dropdown-close-dur")
      .trim();
    if (!raw) return;
    const num = parseFloat(raw);
    if (Number.isNaN(num)) return;
    setMs(raw.endsWith("ms") ? num : num * 1000);
  }, []);
  return ms;
}

function useDropdownPhase(open: boolean): Phase {
  const [phase, setPhase] = useState<Phase>(open ? "open" : "closed");
  const closeMs = useCloseDurationMs();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (open) {
      setPhase("open");
      return;
    }
    setPhase((prev) => (prev === "open" ? "closing" : "closed"));
    timer.current = setTimeout(() => setPhase("closed"), closeMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [open, closeMs]);

  return phase;
}

type AnimatedMenuItemsProps = {
  origin?: DropdownOrigin;
  open: boolean;
  children: ReactNode;
  className?: string;
} & Omit<MenuItemsProps, "static" | "children" | "className">;

function AnimatedMenuItems({
  origin = "top-left",
  open,
  className,
  children,
  ...rest
}: AnimatedMenuItemsProps) {
  const phase = useDropdownPhase(open);
  if (phase === "closed") return null;

  const stateClass = phase === "open" ? "is-open" : "is-closing";

  return (
    <MenuItems
      static
      data-origin={origin}
      className={`t-dropdown ${stateClass} ${className ?? ""}`.trim()}
      {...rest}
    >
      {children}
    </MenuItems>
  );
}

export type AnimatedMenuItem =
  | {
      type?: "item";
      key: string;
      label: ReactNode;
      icon?: ComponentType<{ className?: string }>;
      shortcut?: string;
      onSelect?: () => void;
      href?: string;
      disabled?: boolean;
    }
  | { type: "separator"; key: string };

export type AnimatedMenuProps = {
  label: ReactNode;
  origin?: DropdownOrigin;
  items: AnimatedMenuItem[];
  triggerClassName?: string;
  panelClassName?: string;
  align?: "start" | "center" | "end";
};

function anchorFor(origin: DropdownOrigin, align: "start" | "center" | "end") {
  const side = origin.startsWith("top") ? "bottom" : "top";
  const suffix = align === "center" ? "" : ` ${align}`;
  return `${side}${suffix}`.trim() as
    | "bottom"
    | "top"
    | "bottom start"
    | "bottom end"
    | "top start"
    | "top end";
}

export function AnimatedMenu({
  label,
  origin = "top-left",
  items,
  triggerClassName,
  panelClassName,
  align = "start",
}: AnimatedMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <MenuButton
            className={
              triggerClassName ??
              "group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)] backdrop-blur transition-colors hover:bg-white/[0.09] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            }
          >
            {label}
            <ChevronDown className="h-4 w-4 text-white/60 transition-transform duration-200 group-data-[open]:rotate-180" />
          </MenuButton>

          <AnimatedMenuItems
            open={open}
            origin={origin}
            anchor={{ to: anchorFor(origin, align), gap: 8 }}
            className={
              panelClassName ??
              "min-w-56 rounded-2xl border border-white/10 bg-[#171717]/95 p-1.5 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_24px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl focus:outline-none"
            }
          >
            {items.map((entry) => {
              if (entry.type === "separator") {
                return (
                  <MenuSeparator
                    key={entry.key}
                    className="my-1 h-px bg-white/10"
                  />
                );
              }

              const Icon = entry.icon;
              const inner = (focus: boolean) => (
                <>
                  <span className="flex items-center gap-3">
                    {Icon ? (
                      <Icon
                        className={`h-4 w-4 ${
                          focus ? "text-white" : "text-white/70"
                        }`}
                      />
                    ) : null}
                    <span>{entry.label}</span>
                  </span>
                  {entry.shortcut ? (
                    <kbd className="ml-4 font-sans text-[13px] tracking-wide text-white/50">
                      {entry.shortcut}
                    </kbd>
                  ) : null}
                </>
              );

              return (
                <MenuItem key={entry.key} disabled={entry.disabled}>
                  {({ focus, disabled }) => {
                    const cls = `flex w-full items-center justify-between rounded-lg px-3 py-2 text-[15px] leading-none transition-colors ${
                      focus ? "bg-white/[0.08] text-white" : "text-white/90"
                    } ${disabled ? "pointer-events-none opacity-40" : ""}`;
                    return entry.href ? (
                      <a href={entry.href} className={cls}>
                        {inner(focus)}
                      </a>
                    ) : (
                      <button type="button" onClick={entry.onSelect} className={cls}>
                        {inner(focus)}
                      </button>
                    );
                  }}
                </MenuItem>
              );
            })}
          </AnimatedMenuItems>
        </>
      )}
    </Menu>
  );
}
