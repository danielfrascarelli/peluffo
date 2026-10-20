import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  label: string;
}

// Bottom sheet on phones, centered dialog from sm up.
export default function Modal({ onClose, children, maxWidth = "sm:max-w-xl", label }: ModalProps): React.JSX.Element {
  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-foreground/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "bg-card w-full max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl",
          "pb-[env(safe-area-inset-bottom)]",
          maxWidth,
        )}
      >
        <div aria-hidden className="sm:hidden mx-auto mt-2 h-1 w-10 rounded-full bg-input" />
        {children}
      </div>
    </div>
  );
}
