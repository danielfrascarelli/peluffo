import { useState } from "react";
import UserMenu from "@/components/layout/UserMenu";
import Avatar from "@/components/shared/Avatar";
import { ROLE_LABEL } from "@/lib/labels";
import { fullName } from "@/lib/names";
import { NAV_ITEMS } from "@/components/layout/navItems";
import type { User } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: (section: string) => React.ReactNode;
}

const PROFILE_SECTION = { id: "perfil", label: "Mi perfil" };

function BrandMark({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn("flex items-center justify-center rounded-lg bg-primary text-primary-foreground", className)}>
      <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-1/2 h-1/2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

// Desktop: sidebar nav + header with the account menu.
// Phone: compact top bar with the account menu + bottom tab bar (no drawer).
export default function Layout({ user, onLogout, children }: LayoutProps): React.JSX.Element {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  const [active, setActive] = useState(items[0]?.id ?? PROFILE_SECTION.id);
  const title = [...items, PROFILE_SECTION].find((i) => i.id === active)?.label ?? "";
  const userMenu = <UserMenu user={user} onProfile={() => setActive(PROFILE_SECTION.id)} onLogout={onLogout} />;

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar">
        <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <BrandMark className="w-8 h-8" />
          <span className="font-semibold text-sidebar-foreground">Peluffo Giguens</span>
        </div>
        <nav aria-label="Secciones" className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              aria-current={active === item.id ? "page" : undefined}
              onClick={() => setActive(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
                active === item.id
                  ? "bg-sidebar-foreground/12 text-sidebar-foreground"
                  : "text-sidebar-foreground/65 hover:bg-sidebar-foreground/8 hover:text-sidebar-foreground",
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-4">
          <button
            type="button"
            onClick={() => setActive(PROFILE_SECTION.id)}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left outline-none hover:bg-sidebar-foreground/8 focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Avatar name={fullName(user)} src={user.avatarUrl} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-sidebar-foreground">{fullName(user)}</span>
              <span className="block truncate text-xs text-sidebar-foreground/60">{ROLE_LABEL[user.role]}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="shrink-0 rounded-lg p-2 text-sidebar-foreground/60 outline-none hover:bg-sidebar-foreground/8 hover:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-accent"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="w-5 h-5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 h-14 md:h-16 bg-card border-b border-border px-4 md:px-8 flex items-center gap-3">
          <BrandMark className="md:hidden w-8 h-8" />
          <h1 className="text-base md:text-lg font-semibold text-foreground truncate">{title}</h1>
          <div className="ml-auto">{userMenu}</div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-8 pb-24 md:pb-8">
          <div className="mx-auto w-full max-w-6xl">{children(active)}</div>
        </main>

        {items.length > 1 && (
          <nav
            aria-label="Secciones"
            className="md:hidden fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-card pb-[env(safe-area-inset-bottom)]"
          >
            {items.map((item) => (
              <button
                type="button"
                key={item.id}
                aria-current={active === item.id ? "page" : undefined}
                onClick={() => setActive(item.id)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 pt-2 pb-2.5 text-xs font-medium outline-none focus-visible:bg-row-hover",
                  active === item.id ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
