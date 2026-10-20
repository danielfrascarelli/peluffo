import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("py-2.5 px-4 rounded-xl text-sm transition-opacity hover:opacity-90 disabled:opacity-50", {
  variants: {
    variant: {
      primary: "font-semibold text-primary-foreground bg-primary",
      secondary:
        "font-medium border border-input text-muted-foreground transition-colors hover:bg-background hover:opacity-100",
    },
  },
  defaultVariants: { variant: "primary" },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export default function Button({ className, variant, type = "button", ...props }: ButtonProps): React.JSX.Element {
  return <button type={type} {...props} className={cn(buttonVariants({ variant }), className)} />;
}
