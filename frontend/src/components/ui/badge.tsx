import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
      difficulty: {
        easy: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
        medium:
          "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
        hard: "bg-red-100 text-red-800 border-red-300 hover:bg-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  difficulty?: "easy" | "medium" | "hard";
}

function Badge({ className, variant, difficulty, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, difficulty }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
