import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedCounter from './AnimatedCounter';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  label?: string;
  progressColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  showPercentage = true,
  label,
  progressColor
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = max === 0 ? 0 : (value / max) * 100;
  const offset = circumference - (percent / 100) * circumference;
  
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-secondary"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-1000 ease-in-out",
            progressColor ? progressColor : "stroke-accent"
          )}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center justify-center text-center">
        {showPercentage && (
          <div className="text-xl font-semibold">
            <AnimatedCounter value={Math.round(percent)} />
            <span>%</span>
          </div>
        )}
        
        {!showPercentage && (
          <div className="text-xl font-semibold flex items-baseline">
            <AnimatedCounter value={value} />
            <span className="text-base mx-1">/</span>
            <span>{max}</span>
          </div>
        )}
        
        {label && <span className="text-sm text-muted-foreground mt-1">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
