import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  variant?: "default" | "warning" | "danger" | "success"
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className={cn(
      "border-border",
      variant === "warning" && "border-warning/50",
      variant === "danger" && "border-destructive/50",
      variant === "success" && "border-success/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          variant === "default" && "bg-secondary",
          variant === "warning" && "bg-warning/10",
          variant === "danger" && "bg-destructive/10",
          variant === "success" && "bg-success/10"
        )}>
          <Icon className={cn(
            "h-5 w-5",
            variant === "default" && "text-muted-foreground",
            variant === "warning" && "text-warning",
            variant === "danger" && "text-destructive",
            variant === "success" && "text-success"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-2xl font-bold",
          variant === "warning" && "text-warning",
          variant === "danger" && "text-destructive",
          variant === "success" && "text-success"
        )}>
          {value}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
