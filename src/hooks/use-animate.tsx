
import { useEffect, useState } from 'react';

type AnimationProps = {
  initialClass?: string;
  animateClass?: string;
  shouldAnimate?: boolean;
  delay?: number;
};

export const useAnimate = ({
  initialClass = 'opacity-0',
  animateClass = 'opacity-100',
  shouldAnimate = true,
  delay = 0,
}: AnimationProps = {}) => {
  const [classes, setClasses] = useState(initialClass);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!shouldAnimate || hasAnimated) return;

    const timeout = setTimeout(() => {
      setClasses(`${initialClass} ${animateClass}`);
      setHasAnimated(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [initialClass, animateClass, shouldAnimate, delay, hasAnimated]);

  return classes;
};
