
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ProgressRing from './ProgressRing';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  trend?: number;
  ringValue?: number;
  ringMax?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  ringValue,
  ringMax,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {ringValue !== undefined && ringMax !== undefined ? (
            <ProgressRing 
              value={ringValue} 
              max={ringMax} 
              size={60} 
              strokeWidth={5} 
              showPercentage={false}
              className="flex-shrink-0"
            />
          ) : null}
          
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend !== undefined && (
              <div className={cn(
                "flex items-center mt-1",
                trend > 0 ? "text-green-500" : "text-red-500"
              )}>
                {trend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                <span className="text-xs">{Math.abs(trend)}% from last week</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
