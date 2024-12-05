import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "glass-elevation-2 hover:glass-elevation-3 text-white",
        destructive:
          "glass-elevation-2 hover:glass-elevation-3 text-red-500",
        outline:
          "glass-effect border border-[#C89B3C]/20 hover:glass-effect-strong",
        secondary:
          "glass-elevation-1 hover:glass-elevation-2 text-[#C89B3C]",
        ghost: "hover:glass-effect",
        link: "text-[#C89B3C] underline-offset-4 hover:underline",
        gold: "bg-gradient-to-b from-[#C89B3C] to-[#785A28] text-[#1E282D] hover:from-[#F0B254] hover:to-[#C89B3C]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
