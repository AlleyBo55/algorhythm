import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const baseStyles = cn(
      "inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-150",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-40",
      "select-none"
    );

    const variants = {
      primary: cn(
        "bg-[#1db954] text-black",
        "hover:bg-[#1ed760] active:bg-[#1aa34a]",
        "focus-visible:ring-[#1db954]"
      ),
      secondary: cn(
        "bg-white/10 text-white",
        "hover:bg-white/15 active:bg-white/20",
        "focus-visible:ring-white/50"
      ),
      ghost: cn(
        "text-zinc-400",
        "hover:text-white hover:bg-white/5",
        "active:bg-white/10",
        "focus-visible:ring-white/30"
      ),
      danger: cn(
        "bg-red-500/10 text-red-400 border border-red-500/20",
        "hover:bg-red-500/20 hover:text-red-300",
        "active:bg-red-500/30",
        "focus-visible:ring-red-500/50"
      ),
      outline: cn(
        "border border-white/10 text-white",
        "hover:bg-white/5 hover:border-white/20",
        "active:bg-white/10",
        "focus-visible:ring-white/30"
      ),
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      md: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-lg",
      icon: "h-10 w-10 rounded-lg",
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
