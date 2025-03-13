
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  colorClass?: string;
  isStreakCounter?: boolean;
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
  colorClass,
  isStreakCounter = false,
}) => {
  // Function to get appropriate color class based on title or provided color
  const getColorClass = () => {
    if (colorClass) return colorClass;
    
    if (isStreakCounter) {
      const valueNum = typeof value === 'number' ? value : 0;
      if (valueNum >= 30) return 'streak-counter-blue';
      if (valueNum >= 14) return 'streak-counter-green';
      if (valueNum >= 7) return 'streak-counter-orange';
      return 'streak-counter-pink';
    }
    
    switch(title.toLowerCase()) {
      case "today's progress":
        return 'text-blue-500';
      case "current streak":
        return 'text-amber-500';
      case "longest streak":
        return 'text-purple-500';
      case "total completions":
        return 'text-green-500';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden h-full transition-all duration-300 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm hover:shadow-md", 
      className
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            {icon && (
              <div className={cn(
                "mr-2 text-muted-foreground p-1.5 rounded-full bg-gray-100 dark:bg-gray-700",
                getColorClass()
              )}>
                {icon}
              </div>
            )}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          
          <div className="flex items-center gap-4">
            {ringValue !== undefined && ringMax !== undefined ? (
              <ProgressRing 
                value={ringValue} 
                max={ringMax} 
                size={50} 
                strokeWidth={4} 
                showPercentage={false}
                className="flex-shrink-0"
                progressColor={getColorClass()}
              />
            ) : null}
            
            <div>
              <div className={cn(
                "text-2xl font-bold", 
                getColorClass()
              )}>
                {value}
              </div>
              
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
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
