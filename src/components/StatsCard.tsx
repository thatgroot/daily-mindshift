
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
  color?: string;
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
  color,
}) => {
  // Function to pick a gradient based on the title or provided color
  const getGradient = () => {
    if (color) return color;
    
    switch(title.toLowerCase()) {
      case "today's progress":
        return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 hover:from-blue-50 hover:to-blue-100/80 dark:hover:from-blue-900/30 dark:hover:to-blue-800/20";
      case "current streak":
        return "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 hover:from-amber-50 hover:to-amber-100/80 dark:hover:from-amber-900/30 dark:hover:to-amber-800/20";
      case "longest streak":
        return "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 hover:from-purple-50 hover:to-purple-100/80 dark:hover:from-purple-900/30 dark:hover:to-purple-800/20";
      case "total completions":
        return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 hover:from-green-50 hover:to-green-100/80 dark:hover:from-green-900/30 dark:hover:to-green-800/20";
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/10 hover:from-gray-50 hover:to-gray-100/80 dark:hover:from-gray-800/30 dark:hover:to-gray-700/20";
    }
  };

  // Function to pick an accent color based on the title or provided color
  const getAccentColor = () => {
    if (color) return color;
    
    switch(title.toLowerCase()) {
      case "today's progress":
        return "text-blue-600 dark:text-blue-400";
      case "current streak":
        return "text-amber-600 dark:text-amber-400";
      case "longest streak":
        return "text-purple-600 dark:text-purple-400";
      case "total completions":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Function to get ring color
  const getRingColor = () => {
    if (ringValue !== undefined && ringMax !== undefined) {
      const ratio = ringValue / ringMax;
      
      if (ratio === 0) return 'stroke-muted';
      if (ratio < 0.25) return 'stroke-[#0e4429] dark:stroke-[#39d353]/30';
      if (ratio < 0.5) return 'stroke-[#006d32] dark:stroke-[#39d353]/50';
      if (ratio < 0.75) return 'stroke-[#26a641] dark:stroke-[#39d353]/75';
      return 'stroke-[#39d353]';
    }
    
    return undefined;
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md rounded-xl border-none shadow-sm", 
      getGradient(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-3 pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className={cn(
            "text-muted-foreground bg-background/70 p-1.5 rounded-full",
            getAccentColor()
          )}>{icon}</div>
        )}
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {ringValue !== undefined && ringMax !== undefined ? (
            <ProgressRing 
              value={ringValue} 
              max={ringMax} 
              size={60} 
              strokeWidth={5} 
              showPercentage={false}
              className="flex-shrink-0"
              progressColor={getRingColor()}
            />
          ) : null}
          
          <div>
            <div className={cn("text-2xl font-bold", getAccentColor())}>{value}</div>
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
