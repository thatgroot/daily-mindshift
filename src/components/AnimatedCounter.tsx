
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 1000, 
  className 
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const startValue = useRef<number>(0);
  const startTime = useRef<number>(0);
  
  useEffect(() => {
    if (nodeRef.current) {
      startValue.current = parseInt(nodeRef.current.innerText || '0');
      startTime.current = Date.now();
      
      const animate = () => {
        if (!nodeRef.current) return;
        
        const currentTime = Date.now();
        const elapsed = currentTime - startTime.current;
        
        if (elapsed < duration) {
          const nextValue = Math.round(easeOutQuad(
            elapsed, 
            startValue.current, 
            value - startValue.current, 
            duration
          ));
          
          nodeRef.current.innerText = nextValue.toString();
          requestAnimationFrame(animate);
        } else {
          nodeRef.current.innerText = value.toString();
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [value, duration]);
  
  // Easing function for smoother animation
  const easeOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d;
    return -c * t * (t - 2) + b;
  };
  
  return (
    <div 
      ref={nodeRef} 
      className={cn("tabular-nums", className)}
    >
      {startValue.current}
    </div>
  );
};

export default AnimatedCounter;
