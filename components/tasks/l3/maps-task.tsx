'use client';

import { useState, useMemo } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Search, MapPin, Navigation, Star, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapsResult {
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  rating: number;
  distance: string;
  isOpen: boolean;
  isHospital: boolean;
}

export function MapsTask({ tr, onComplete }: TaskProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const completedRef = useState({ done: false })[0];

  const results: MapsResult[] = useMemo(
    () => [
      { name: tr('searchResultHospital'), type: 'hospital', rating: 4.2, distance: '2.5 km', isOpen: true, isHospital: true },
      { name: tr('searchResultClinic'), type: 'clinic', rating: 4.0, distance: '5.1 km', isOpen: true, isHospital: false },
      { name: tr('searchResultPharmacy'), type: 'pharmacy', rating: 4.5, distance: '1.2 km', isOpen: false, isHospital: false },
    ],
    [tr]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return results.filter(
      (r) => r.name.toLowerCase().includes(q) || r.type.includes(q) || (r.isHospital && 'hospital'.includes(q))
    );
  }, [query, results]);

  const handleDirections = (r: MapsResult) => {
    if (!r.isHospital) return;
    if (!completedRef.done) {
      completedRef.done = true;
      setSelected(r.name);
      setTimeout(() => onComplete({}), 700);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneMaps')}>
      {/* Map background */}
      <div className="relative min-h-[140px] flex-1 overflow-hidden bg-emerald-50">
        {/* Fake map grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 160, 100, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 160, 100, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
        {/* Fake roads */}
        <div className="absolute left-0 right-0 top-1/3 h-3 -rotate-6 bg-gray-200" />
        <div className="absolute left-1/4 top-0 bottom-0 w-2 rotate-3 bg-gray-200" />
        <div className="absolute left-2/3 top-0 bottom-0 w-3 -rotate-12 bg-gray-300" />
        {/* Fake location pin */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <MapPin className="h-10 w-10 fill-red-500 text-red-600" />
            <div className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 animate-pulse rounded-full bg-red-500/30" />
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="border-b border-gray-200 bg-white px-3 py-2">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr('searchPlaceholder')}
            className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="touch-target text-gray-400"
              aria-label="Clear"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 divide-y divide-gray-100 bg-white">
        {!query.trim() && (
          <div className="py-12 text-center text-sm text-gray-400">
            {tr('searchPlaceholder')}
          </div>
        )}
        {filtered.map((r) => (
          <div
            key={r.name}
            className={cn(
              'flex items-start gap-3 p-4 transition-colors',
              selected === r.name ? 'bg-blue-50' : 'hover:bg-gray-50'
            )}
          >
            <div className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              r.isHospital ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            )}>
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium text-gray-900">{r.name}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {r.rating}
                </span>
                <span>·</span>
                <span>{r.distance}</span>
                <span className={cn('flex items-center gap-0.5', r.isOpen ? 'text-success' : 'text-gray-400')}>
                  <Clock className="h-3 w-3" />
                  {r.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
            <button
              onClick={() => handleDirections(r)}
              disabled={!r.isHospital || !!selected}
              className={cn(
                'touch-target flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-all',
                r.isHospital
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                  : 'cursor-not-allowed bg-gray-100 text-gray-400'
              )}
            >
              <Navigation className="h-4 w-4" />
              {tr('mapsDirections')}
            </button>
          </div>
        ))}
      </div>
    </PhoneFrame>
  );
}
