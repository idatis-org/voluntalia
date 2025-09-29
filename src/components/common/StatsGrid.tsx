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
}

export const StatsGrid: React.FC<StatsGridProps> = ({ 
  stats, 
  className = "",
  columns = 4
}) => {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3", 
    4: "grid-cols-1 md:grid-cols-4",
    5: "grid-cols-1 md:grid-cols-5"
  }[columns] || "grid-cols-1 md:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-6 ${className}`}>
      {stats.map((stat) => (
        <Card key={stat.key} className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center">
              {stat.icon && (
                <stat.icon 
                  className={`h-8 w-8 ${stat.color || 'text-primary'}`} 
                />
              )}
              <div className={stat.icon ? "ml-4" : ""}>
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};