interface ModalHeaderProps {
  onClose: () => void;
  children: React.ReactNode;
  sticky?: boolean;
}

export default function ModalHeader({ onClose, children, sticky }: ModalHeaderProps): React.JSX.Element {
  return (
    <div
      className={`flex items-start justify-between px-6 pt-6 pb-4 ${sticky ? "sticky top-0 bg-card border-b border-muted z-10" : ""}`}
    >
      <div className="flex-1 min-w-0">{children}</div>
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="ml-4 shrink-0 text-muted-foreground transition-opacity hover:opacity-60"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
