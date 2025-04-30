import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@turbo-with-tailwind-v4/utils/cn"

export const buttonVariants = cva(
  [
    "rounded-lg",
    "px-8",
    "py-2",
    "transition-all",
    "font-medium",
    "flex justify-center items-center",
    "gap-2",
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0"
  ],
  {
    variants: {
      variant: {
        contained: [],
        text: ["bg-transparent"],
        outline: [
          "border",
          "border-input",
          "bg-background",
          "hover:bg-accent",
          "hover:text-accent-foreground"
        ],
        ghost: [
          "bg-transparent",
          "hover:bg-accent",
          "hover:text-accent-foreground"
        ],
        link: [
          "bg-transparent",
          "underline-offset-4",
          "hover:underline",
          "text-primary"
        ]
      },
      color: {
        primary: [],
        secondary: [],
        destructive: ["bg-red-500", "text-white", "hover:bg-red-600"]
      },
      size: {
        default: ["h-10", "py-2", "px-4"],
        sm: ["h-9", "px-3", "rounded-md"],
        lg: ["h-11", "px-8", "rounded-md"]
      }
    },
    compoundVariants: [
      {
        color: "primary",
        variant: "contained",
        className: [
          "bg-primary-400",
          "text-white",
          "hover:bg-primary-600",
          "dark:bg-primary-400",
          "dark:hover:bg-primary-500"
        ]
      },
      {
        color: "secondary",
        variant: "contained",
        className: [
          "bg-secondary-400",
          "text-white",
          "hover:bg-secondary-600",
          "dark:bg-secondary-400",
          "dark:hover:bg-secondary-500"
        ]
      },
      {
        color: "primary",
        variant: "text",
        className: [
          "text-primary-500",
          "hover:text-primary-50",
          "dark:text-primary-300",
          "dark:hover:bg-primary-950/50"
        ]
      },
      {
        color: "secondary",
        variant: "text",
        className: [
          "text-secondary-500",
          "hover:text-secondary-50",
          "dark:text-secondary-300",
          "dark:hover:bg-secondary-950/50"
        ]
      }
    ],
    defaultVariants: {
      variant: "contained",
      color: "primary",
      size: "default"
    }
  }
)

type ButtonProps =
  | ({ asChild?: false; href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>)
  | ({ asChild?: false; href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement> & VariantProps<typeof buttonVariants>)
  | ({ asChild: true; href?: string } & React.HTMLAttributes<HTMLElement> & VariantProps<typeof buttonVariants>)

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { asChild?: false }
>(
  ({ className, variant, color, size, asChild = false, href, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, color, size }), className)}
          ref={ref as React.Ref<HTMLElement>}
          {...props}
        />
      )
    }
    if (href) {
      return (
        <a
          className={cn(buttonVariants({ variant, color, size }), className)}
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      )
    }
    return (
      <button
        className={cn(buttonVariants({ variant, color, size }), className)}
        ref={ref}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    )
  }
) as
  (<T extends HTMLElement = HTMLButtonElement>(
    props: ButtonProps & { ref?: React.Ref<T> }
  ) => React.ReactElement | null)

const _Button = Button as React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<any>>;
_Button.displayName = "Button";

export { _Button as Button };
