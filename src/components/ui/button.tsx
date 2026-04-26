import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "absolute rounded-full flex items-center justify-center text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-white",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border bg-background text-foreground",
      },
      size: {
        default: "size-4 -top-1 -right-1",
        sm: "size-3 -top-0.5 -right-0.5 text-[0.6rem]",
        lg: "size-5 -top-1 -right-1",
        icon: "size-5 -top-1 -right-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonVariants = cva(
  "relative group/button inline-flex shrink-0 items-center justify-center rounded-4xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs",
        sm: "h-8 gap-1 px-3",
        lg: "h-10 gap-1.5 px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// 🔥 SIZE MAPPING FIX
const badgeSizeMap = {
  default: "default",
  sm: "sm",
  lg: "lg",
  icon: "icon",
  xs: "sm", // map xs → sm
} as const;

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
    badge?: boolean;
    badgeVariant?: VariantProps<typeof badgeVariants>["variant"];
  };

function Button({
  className,
  variant = "default",
  size = "default",
  isLoading = false,
  loadingText,
  children,
  disabled,
  badge,
  badgeVariant = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText || children}
        </>
      ) : (
        children
      )}

      {badge && (
        <span
          className={cn(
            badgeVariants({
              variant: badgeVariant,
              size: badgeSizeMap[size ?? "default"],
            }),
          )}
        />
      )}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
