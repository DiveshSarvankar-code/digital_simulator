'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HintButtonProps {
  hints: string[];
  onHint: () => void;
  label: string;
  title: string;
  noMoreText: string;
}

export function HintButton({ hints, onHint, label, title, noMoreText }: HintButtonProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleTap = useCallback(() => {
    onHint();
    setIndex((prev) => {
      if (prev >= hints.length - 1) return hints.length - 1;
      return prev + 1;
    });
    setOpen(true);
  }, [onHint, hints.length]);

  const currentHint = hints[Math.min(index, hints.length - 1)];
  const isLast = index >= hints.length - 1;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleTap}
        className="touch-target gap-2 border-primary/30 text-primary hover:bg-primary/5"
      >
        <Lightbulb className="h-4 w-4" />
        {label}
        {!isLast && (
          <span className="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary">
            {index + 1}/{hints.length}
          </span>
        )}
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="slide-up w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-warning/15">
                  <Lightbulb className="h-4 w-4 text-warning" />
                </div>
                <span className="font-semibold text-gray-900">{title}</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="touch-target flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className={cn('text-base leading-relaxed text-gray-700', isLast && 'font-medium')}>
              {currentHint}
            </p>
            {isLast && (
              <p className="mt-2 text-xs text-muted-foreground">{noMoreText}</p>
            )}
            <Button
              onClick={() => setOpen(false)}
              className="mt-4 h-11 w-full"
              variant="secondary"
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
