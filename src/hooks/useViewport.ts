import { useState, useEffect } from 'react';

export function useViewport() {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isDesktop = viewport.width >= 1024;
  const isTablet = viewport.width >= 641 && viewport.width <= 1023;
  const isPhablet = viewport.width >= 481 && viewport.width <= 640;
  const isMobile = viewport.width <= 480;

  return {
    width: viewport.width,
    height: viewport.height,
    isDesktop,
    isTablet,
    isPhablet,
    isMobile,
    isMobileOrTablet: !isDesktop,
  };
}