import { type KeyboardEvent, useEffect, useRef, useState } from "react";

export type MenuEntry =
  | {
      label: string;
      /** The key that does the same, shown at the right of the item. */
      shortcut?: string;
      /** Set for an item of a pick-one group, such as the skill levels. */
      checked?: boolean;
      onSelect: () => void;
    }
  | "separator";

export interface Menu {
  id: string;
  label: string;
  entries: MenuEntry[];
}

interface MemoryMenuBarProps {
  menus: Menu[];
  /** The menu open when the bar is drawn, for the stories. */
  initialOpen?: string;
}

const ITEM =
  "flex w-full items-center gap-6 whitespace-nowrap py-1 pl-6 pr-4 text-left hover:bg-win-navy hover:text-white focus:bg-win-navy focus:text-white focus:outline-hidden";

/** The first letter underlined, as the menu bar showed the key that opened it. */
const Mnemonic = ({ label }: { label: string }) => (
  <>
    <span className="underline underline-offset-2">{label[0]}</span>
    {label.slice(1)}
  </>
);

/**
 * The Windows 3.1 menu bar: a row of words on white, each dropping a menu
 * when clicked. While one is open, pointing at another opens that one
 * instead, as it did. The arrow keys move through the items and between the
 * menus, Enter picks, and Escape, Tab or a click anywhere else closes it.
 */
const MemoryMenuBar = ({ menus, initialOpen }: MemoryMenuBarProps) => {
  const [open, setOpen] = useState<string | null>(initialOpen ?? null);
  const barRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusFirst = useRef(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setOpen(null);
    };
    window.addEventListener("pointerdown", close);
    return () => window.removeEventListener("pointerdown", close);
  }, [open]);

  // A menu opened from the keyboard puts the caret on its first item.
  useEffect(() => {
    if (!open || !focusFirst.current) return;
    focusFirst.current = false;
    barRef.current?.querySelector<HTMLElement>('[role="menu"] [role^="menuitem"]')?.focus();
  }, [open]);

  const openFromKeyboard = (id: string) => {
    focusFirst.current = true;
    setOpen(id);
  };

  const closeTo = (id: string) => {
    setOpen(null);
    triggerRefs.current[id]?.focus();
  };

  const neighbour = (id: string, step: number) => {
    const index = menus.findIndex((menu) => menu.id === id);
    return menus[(index + step + menus.length) % menus.length].id;
  };

  const onTriggerKeyDown = (id: string) => (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFromKeyboard(id);
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      triggerRefs.current[neighbour(id, event.key === "ArrowRight" ? 1 : -1)]?.focus();
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(null);
    }
  };

  const onMenuKeyDown = (id: string) => (event: KeyboardEvent<HTMLDivElement>) => {
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role^="menuitem"]')];
    const index = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      items[(index + step + items.length) % items.length]?.focus();
    } else if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      openFromKeyboard(neighbour(id, event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeTo(id);
    } else if (event.key === "Tab") {
      setOpen(null);
    }
  };

  return (
    <div ref={barRef} className="relative flex border-b border-black bg-white px-1" role="menubar">
      {menus.map((menu) => (
        <div key={menu.id} className="relative">
          <button
            ref={(element) => {
              triggerRefs.current[menu.id] = element;
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === menu.id}
            onClick={() => setOpen((current) => (current === menu.id ? null : menu.id))}
            onPointerEnter={() => open && open !== menu.id && setOpen(menu.id)}
            onKeyDown={onTriggerKeyDown(menu.id)}
            className={`px-2 py-0.5 focus-visible:outline-1 focus-visible:outline-black focus-visible:outline-dotted ${
              open === menu.id ? "bg-win-navy text-white" : ""
            }`}
          >
            <Mnemonic label={menu.label} />
          </button>

          {open === menu.id && (
            <div
              role="menu"
              aria-label={menu.label}
              onKeyDown={onMenuKeyDown(menu.id)}
              className="absolute left-0 top-full z-20 min-w-40 border border-black bg-white py-0.5 shadow-[2px_2px_0_black]"
            >
              {menu.entries.map((entry, index) =>
                entry === "separator" ? (
                  // A separator never moves, so its place in the list is its identity.
                  <hr key={`separator-${index}`} className="my-1 border-black" />
                ) : (
                  <button
                    key={entry.label}
                    type="button"
                    role={entry.checked === undefined ? "menuitem" : "menuitemradio"}
                    aria-checked={entry.checked}
                    tabIndex={-1}
                    onClick={() => {
                      // The caret goes back to the bar, unless what was picked opens a
                      // dialog, which takes it from there.
                      closeTo(menu.id);
                      entry.onSelect();
                    }}
                    className={`relative ${ITEM}`}
                  >
                    {entry.checked && (
                      <span aria-hidden="true" className="absolute left-1.5">
                        ✓
                      </span>
                    )}
                    <span className="flex-1">{entry.label}</span>
                    {entry.shortcut && <span>{entry.shortcut}</span>}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MemoryMenuBar;
