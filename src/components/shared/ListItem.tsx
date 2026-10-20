import { cn } from "@/lib/utils";

interface ListItemProps {
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// Tappable row for phone-width lists. Pair with a table from md up.
export default function ListItem({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  className,
}: ListItemProps): React.JSX.Element {
  const body = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-foreground">{title}</div>
        {subtitle && <div className="truncate text-sm text-muted-foreground">{subtitle}</div>}
      </div>
      {trailing}
      {onClick && (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4 shrink-0 text-muted-foreground"
        >
          <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </>
  );
  const base = "flex w-full items-center gap-3 px-4 py-3 text-left min-h-14";
  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(base, "active:bg-row-hover focus-visible:bg-row-hover outline-none", className)}
    >
      {body}
    </button>
  ) : (
    <div className={cn(base, className)}>{body}</div>
  );
}
