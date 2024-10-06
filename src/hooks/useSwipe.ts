import { useState, useEffect } from 'react';

interface SwipeHandlers {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const useSwipe = (handlers: SwipeHandlers) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0 && handlers.onSwipeLeft) {
        handlers.onSwipeLeft();
      } else if (distanceX < 0 && handlers.onSwipeRight) {
        handlers.onSwipeRight();
      }
    } else if (!isHorizontal && Math.abs(distanceY) > minSwipeDistance) {
      if (distanceY > 0 && handlers.onSwipeUp) {
        handlers.onSwipeUp();
      } else if (distanceY < 0 && handlers.onSwipeDown) {
        handlers.onSwipeDown();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, handlers]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  return {
    onTouchStart,
    onTouchMove,
  };
};