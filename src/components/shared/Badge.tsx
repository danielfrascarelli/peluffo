import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TONE_CLASS, type Tone } from "@/lib/tones";

const badgeVariants = cva("px-2 py-0.5 rounded-full font-medium", {
  variants: {
    size: { xs: "text-xs", sm: "text-sm" },
  },
  defaultVariants: { size: "xs" },
});

interface BadgeProps {
  label: string;
  tone: Tone;
  size?: "xs" | "sm";
  className?: string;
}

export default function Badge({ label, tone, size, className }: BadgeProps): React.JSX.Element {
  return <span className={cn(badgeVariants({ size }), TONE_CLASS[tone], className)}>{label}</span>;
}
