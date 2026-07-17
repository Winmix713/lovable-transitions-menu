import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  type MenuItemsProps,
} from "@headlessui/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type DropdownOrigin =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type Phase = "closed" | "open" | "closing";

/**
 * Reads --dropdown-close-dur from :root and returns it in ms.
 * Falls back to 150ms to match the transitions.dev default.
 */
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

/**
 * Bridges Headless UI's binary open/closed state with the transitions.dev
 * `.is-open` / `.is-closing` lifecycle so the closing animation can play
 * before the panel unmounts.
 */
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

export type AnimatedMenuProps = {
  label: ReactNode;
  origin?: DropdownOrigin;
  items: Array<{
    key: string;
    label: ReactNode;
    onSelect?: () => void;
    href?: string;
    disabled?: boolean;
  }>;
  triggerClassName?: string;
  panelClassName?: string;
};

/**
 * Headless UI Menu wired to the transitions.dev dropdown animation.
 * Origin-aware growth from the trigger; closing animation plays fully
 * before unmount thanks to the internal phase state.
 */
export function AnimatedMenu({
  label,
  origin = "top-left",
  items,
  triggerClassName,
  panelClassName,
}: AnimatedMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <MenuButton
            className={
              triggerClassName ??
              "inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            }
          >
            {label}
          </MenuButton>

          <AnimatedMenuItems
            open={open}
            origin={origin}
            anchor={{ to: origin.startsWith("top") ? "bottom start" : "top start", gap: 8 }}
            className={
              panelClassName ??
              "min-w-44 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none"
            }
          >
            {items.map((item) => (
              <MenuItem key={item.key} disabled={item.disabled}>
                {({ focus, disabled }) =>
                  item.href ? (
                    <a
                      href={item.href}
                      className={`block rounded-sm px-3 py-2 text-sm transition-colors ${
                        focus ? "bg-accent text-accent-foreground" : ""
                      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={item.onSelect}
                      className={`block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                        focus ? "bg-accent text-accent-foreground" : ""
                      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
                    >
                      {item.label}
                    </button>
                  )
                }
              </MenuItem>
            ))}
          </AnimatedMenuItems>
        </>
      )}
    </Menu>
  );
}
