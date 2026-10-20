export const TONE_CLASS = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  neutral: "bg-neutral text-neutral-foreground",
  brand: "bg-secondary text-primary",
} as const;

export type Tone = keyof typeof TONE_CLASS;
