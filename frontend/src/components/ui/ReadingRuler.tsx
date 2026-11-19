import React, { useEffect, useState } from 'react';
import { useAccessibilityStore } from '../../stores/accessibilityStore';

export function ReadingRuler() {
  const enabled = useAccessibilityStore((s) => s.readingRulerEnabled);
  const [mouseY, setMouseY] = useState<number>(200);

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('clientY' in e) {
        setMouseY(e.clientY);
      } else if (e.touches && e.touches[0]) {
        setMouseY(e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [enabled]);

  if (!enabled) return null;

  const rulerHeight = 44; // standard reading line height

  return (
    <aside
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none transition-transform duration-75"
      aria-hidden="true"
    >
      {/* Top dimming mask */}
      <div
        className="absolute top-0 left-0 right-0 bg-ink-900/15 backdrop-blur-[0.5px]"
        style={{ height: `${Math.max(0, mouseY - rulerHeight / 2)}px` }}
      />
      {/* Active focus strip */}
      <div
        className="absolute left-0 right-0 border-y-2 border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(102,138,117,0.15)]"
        style={{
          top: `${Math.max(0, mouseY - rulerHeight / 2)}px`,
          height: `${rulerHeight}px`,
        }}
      />
      {/* Bottom dimming mask */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-ink-900/15 backdrop-blur-[0.5px]"
        style={{
          top: `${mouseY + rulerHeight / 2}px`,
        }}
      />
    </aside>
  );
}
