'use client';

import { useRef, useCallback, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DragSliderProps {
  value: number; // 0-100
  onChange: (v: number) => void;
  onCommit?: (v: number) => void;
  className?: string;
  ariaLabel?: string;
  children?: ReactNode;
}

/**
 * A custom drag slider with full touch + mouse support.
 * Uses pointer events with setPointerCapture and touch-action: none
 * so gestures work on budget Android OEM browsers that would otherwise
 * silently swallow the gesture.
 */
export function DragSlider({ value, onChange, onCommit, className, ariaLabel, children }: DragSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastXRef = useRef(0);

  const updateFromPointer = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      onChange(pct);
    },
    [onChange]
  );

  const flushFrame = useCallback(() => {
    rafRef.current = null;
    updateFromPointer(lastXRef.current);
  }, [updateFromPointer]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = true;
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    lastXRef.current = e.clientX;
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flushFrame);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    draggingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    updateFromPointer(lastXRef.current);
    if (onCommit) onCommit(value);
  };

  return (
    <div className={cn('select-none', className)}>
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex h-12 w-full cursor-pointer touch-none items-center"
        style={{ touchAction: 'none' }}
        role="slider"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {/* Track */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-full rounded-full bg-blue-600"
            style={{ width: `${value}%` }}
          />
        </div>
        {/* Thumb */}
        <div
          className="pointer-events-none absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-600 bg-white shadow-md ring-2 ring-blue-600/20"
          style={{ left: `calc(${value}% - 14px)` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
