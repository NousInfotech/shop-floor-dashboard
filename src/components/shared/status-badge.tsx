'use client'

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Pause, 
  PlayCircle 
} from "lucide-react"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 shadow-sm",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 shadow-sm",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground border border-input shadow-sm",
        success:
          "border-transparent bg-green-100 text-green-800 [a&]:hover:bg-green-200 shadow-sm",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 [a&]:hover:bg-yellow-200 shadow-sm",
        danger:
          "border-transparent bg-red-100 text-red-800 [a&]:hover:bg-red-200 shadow-sm",
        info:
          "border-transparent bg-blue-100 text-blue-800 [a&]:hover:bg-blue-200 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"
  
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

// Enhanced status badge component that uses the Badge component
export function StatusBadge({ status, className }: { status: string, className?: string }) {
  // Map status to proper variant and icon
type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

const statusConfig: Record<string, {
  variant: BadgeVariant
  icon: React.ReactNode
  label: string
}> = {
  Active: { variant: "success", icon: <CheckCircle className="h-3 w-3" />, label: "Active" },
  Completed: { variant: "success", icon: <CheckCircle className="h-3 w-3" />, label: "Completed" },
  "In Progress": { variant: "info", icon: <PlayCircle className="h-3 w-3" />, label: "In Progress" },
  Pending: { variant: "warning", icon: <Clock className="h-3 w-3" />, label: "Pending" },
  Paused: { variant: "warning", icon: <Pause className="h-3 w-3" />, label: "Paused" },
  Delayed: { variant: "warning", icon: <AlertTriangle className="h-3 w-3" />, label: "Delayed" },
  Cancelled: { variant: "danger", icon: <XCircle className="h-3 w-3" />, label: "Cancelled" },
  Failed: { variant: "danger", icon: <XCircle className="h-3 w-3" />, label: "Failed" },
  Inactive: { variant: "outline", icon: <Pause className="h-3 w-3" />, label: "Inactive" },
}

  const config = statusConfig[status as keyof typeof statusConfig] || {
    variant: 'outline',
    icon: null,
    label: status
  }

  return (
  <Badge 
  variant={config.variant} 
  className={cn("rounded-full font-medium py-1", className)}
>

      {config.icon}
      {config.label}
    </Badge>
  )
}

export { Badge, badgeVariants }