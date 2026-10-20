import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden bg-secondary text-primary",
  {
    variants: {
      size: {
        xs: "w-8 h-8 text-xs",
        sm: "w-9 h-9 text-sm",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-lg",
        xl: "w-16 h-16 text-xl",
      },
    },
    defaultVariants: { size: "md" },
  },
);

interface AvatarProps extends VariantProps<typeof avatarVariants> {
  name: string;
  initial?: string;
  src?: string;
}

// Photo when available, initial as fallback (also when the image fails to load).
export default function Avatar({ name, size, initial, src }: AvatarProps): React.JSX.Element {
  const [broken, setBroken] = useState(false);
  return (
    <div className={avatarVariants({ size })}>
      {src && !broken ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        (initial ?? name.charAt(0).toUpperCase())
      )}
    </div>
  );
}
