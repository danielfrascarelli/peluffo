import { cn, inputClass } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchInputProps): React.JSX.Element {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn("w-full pl-9 pr-4 py-2.5 rounded-lg text-sm transition-all", inputClass, "bg-card")}
      />
    </div>
  );
}
