import { ReactNode, useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  className?: string;
  minHeight?: number;
  rootMargin?: string;
}

const DeferredSection = ({
  children,
  className = '',
  minHeight = 600,
  rootMargin = '200px',
}: DeferredSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const node = ref.current;
    if (!node) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }

    const timeoutId = window.setTimeout(() => setIsVisible(true), 0);
    return () => window.clearTimeout(timeoutId);
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: `${minHeight}px`,
      }}
    >
      {isVisible ? children : null}
    </div>
  );
};

export default DeferredSection;
