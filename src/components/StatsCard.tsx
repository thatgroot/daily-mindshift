
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import ProgressRing from './ProgressRing';
import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

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
      if (valueNum >= 30) return 'text-blue-500';
      if (valueNum >= 14) return 'text-green-500';
      if (valueNum >= 7) return 'text-orange-500';
      return 'text-pink-500';
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

  const getGradientClass = () => {
    if (isStreakCounter) {
      const valueNum = typeof value === 'number' ? value : 0;
      if (valueNum >= 30) return 'from-blue-500/10 to-blue-600/5';
      if (valueNum >= 14) return 'from-green-500/10 to-green-600/5';
      if (valueNum >= 7) return 'from-orange-500/10 to-orange-600/5';
      return 'from-pink-500/10 to-pink-600/5';
    }
    
    switch(title.toLowerCase()) {
      case "today's progress":
        return 'from-blue-500/10 to-blue-600/5';
      case "current streak":
        return 'from-amber-500/10 to-amber-600/5';
      case "longest streak":
        return 'from-purple-500/10 to-purple-600/5';
      case "total completions":
        return 'from-green-500/10 to-green-600/5';
      default:
        return 'from-gray-200 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50';
    }
  };

  return (
    <Card className={cn(
      "overflow-hidden h-full transition-all duration-300 rounded-xl border-none shadow-sm hover:shadow-md", 
      `bg-gradient-to-br ${getGradientClass()}`,
      className
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex items-center mb-3">
            {icon && (
              <div className={cn(
                "mr-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                getColorClass()
              )}>
                {icon}
              </div>
            )}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            {isStreakCounter && typeof value === 'number' && value >= 7 && (
              <Sparkles className={cn("h-3 w-3 ml-1", getColorClass())} />
            )}
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
                  "flex items-center mt-1 px-2 py-0.5 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm w-fit",
                  trend > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {trend > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  <span className="text-xs font-medium">{Math.abs(trend)}%</span>
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
