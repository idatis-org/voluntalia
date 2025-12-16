import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface StatItem {
  key: string;
  label: string;
  value: number | string;
  icon?: React.ComponentType<any>;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
  columns?: number;
  isLoading?: boolean;
  isError?: boolean;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  className = "",
  columns = 4,
  isLoading = false,
  isError = false,
}) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-5"
  }[columns] || "grid-cols-1 md:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {isLoading ? (
        // Render skeletons while loading
        Array.from({ length: columns }).map((_, i) => (
          <Card key={`skeleton-${i}`} className="shadow-card animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-muted rounded-md" />
                <div className={"ml-4"}>
                  <p className="h-6 bg-muted rounded w-24 mb-2" />
                  <p className="h-4 bg-muted rounded w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : isError ? (
        <Card className="shadow-card col-span-full">
          <CardContent className="p-6">
            <div className="text-sm text-destructive">Unable to load stats.</div>
          </CardContent>
        </Card>
      ) : (
        stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center">
                  {Icon && (
                    <Icon className={`h-8 w-8 ${stat.color || 'text-primary'}`} />
                  )}
                  <div className={Icon ? "ml-4" : ""}>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};