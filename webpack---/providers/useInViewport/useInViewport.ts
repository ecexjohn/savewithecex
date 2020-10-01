import { useState, useEffect, RefObject } from 'react';

/**
 * Custom hook for determining if DOM node is in viewport
 *
 * @param ref a reference to a DOM node
 */
export function useInViewport(ref: RefObject<any>) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef && typeof window.IntersectionObserver === 'function') {
      const observer = new window.IntersectionObserver(([entry]) => {
        setIntersecting(entry.isIntersecting);
      });

      observer.observe(currentRef);

      return () => {
        observer.disconnect();
      };
    }

    return () => {};
  }, [ref]);

  return isIntersecting;
}
