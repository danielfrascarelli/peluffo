import { useEffect, useId, useRef, useState } from "react";
import Avatar from "@/components/shared/Avatar";
import { ROLE_LABEL } from "@/lib/labels";
import { fullName } from "@/lib/names";
import type { User } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: User;
  onProfile: () => void;
  onLogout: () => void;
}

export default function UserMenu({ user, onProfile, onLogout }: UserMenuProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const name = fullName(user);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent): void => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (action: () => void) => () => {
    setOpen(false);
    action();
  };

  const itemClass =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-row-hover focus-visible:bg-row-hover outline-none";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Cuenta de ${name}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2.5 rounded-full p-0.5 md:pr-3 transition-colors outline-none",
          "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-muted",
        )}
      >
        <Avatar name={name} src={user.avatarUrl} size="sm" />
        <span className="hidden md:block text-sm font-medium text-foreground">{user.firstName}</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="hidden md:block w-4 h-4 text-muted-foreground"
        >
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-lg"
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={name} src={user.avatarUrl} size="md" />
            <div className="min-w-0">
              <div className="truncate font-semibold text-foreground">{name}</div>
              <div className="truncate text-sm text-muted-foreground">{user.email}</div>
              <div className="mt-0.5 text-xs text-primary">{ROLE_LABEL[user.role]}</div>
            </div>
          </div>
          <div className="my-1 h-px bg-muted" />
          <button type="button" role="menuitem" onClick={choose(onProfile)} className={itemClass}>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5 text-muted-foreground"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Mi perfil
          </button>
          <button type="button" role="menuitem" onClick={choose(onLogout)} className={itemClass}>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5 text-muted-foreground"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
