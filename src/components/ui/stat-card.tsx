import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  trend,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("p-6 flex flex-col justify-between shadow-xs", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">{icon}</div>}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-bold text-slate-900 tracking-tight">{value}</div>

        {(change || description) && (
          <div className="mt-2 flex items-center text-xs space-x-1.5">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center font-semibold px-1.5 py-0.5 rounded",
                  trend === "up" && "bg-emerald-50 text-emerald-700",
                  trend === "down" && "bg-red-50 text-red-700",
                  trend === "neutral" && "bg-slate-100 text-slate-600"
                )}
              >
                {trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                {trend === "down" && <TrendingDown className="w-3 h-3 mr-1" />}
                {trend === "neutral" && <Minus className="w-3 h-3 mr-1" />}
                {change}
              </span>
            )}
            {description && <span className="text-slate-500">{description}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
