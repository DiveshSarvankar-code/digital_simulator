'use client';

import { useState, useMemo } from 'react';
import { PhoneFrame } from '@/components/phone/phone-frame';
import type { TaskProps } from '../task-router';
import { Search, MapPin, Navigation, Star, ArrowLeft, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  rating: number;
  distance: string;
  isHospital: boolean;
}

export function SearchTask({ tr, onComplete }: TaskProps) {
  const [query, setQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const completedRef = useState({ done: false })[0];

  const allResults: SearchResult[] = useMemo(
    () => [
      { name: tr('searchResultHospital'), type: 'hospital', rating: 4.2, distance: '2.5 km', isHospital: true },
      { name: tr('searchResultClinic'), type: 'clinic', rating: 4.0, distance: '5.1 km', isHospital: false },
      { name: tr('searchResultPharmacy'), type: 'pharmacy', rating: 4.5, distance: '1.2 km', isHospital: false },
    ],
    [tr]
  );

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allResults.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.includes(q) ||
        (r.isHospital && ('hospital'.includes(q) || q.includes('hosp')))
    );
  }, [query, allResults]);

  const handleDirections = (result: SearchResult) => {
    if (!result.isHospital) return;
    if (!completedRef.done) {
      completedRef.done = true;
      setSelectedResult(result.name);
      setTimeout(() => onComplete({}), 700);
    }
  };

  return (
    <PhoneFrame wifiOn appName={tr('phoneBrowser')}>
      {/* Browser URL bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-3 py-2">
        <ArrowLeft className="h-4 w-4 text-gray-400" />
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tr('searchPlaceholder')}
            className="flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Search results */}
      <div className="min-h-[300px] flex-1 bg-white">
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
            <Globe className="mb-3 h-12 w-12 text-gray-300" />
            <p className="text-sm">{tr('searchPlaceholder')}</p>
          </div>
        )}

        {query.trim() && filteredResults.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No results for "{query}"
          </div>
        )}

        {filteredResults.length > 0 && (
          <div className="divide-y divide-gray-100">
            {filteredResults.map((result) => (
              <div
                key={result.name}
                className={cn(
                  'flex items-start gap-3 p-4 transition-colors',
                  selectedResult === result.name ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  result.isHospital ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                )}>
                  {result.type === 'hospital' ? <MapPin className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium text-gray-900">{result.name}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {result.rating}
                    </span>
                    <span>·</span>
                    <span>{result.distance}</span>
                    <span>·</span>
                    <span className="capitalize">{result.type}</span>
                  </div>
                  {selectedResult === result.name && (
                    <p className="mt-1 text-xs font-medium text-success">
                      {tr('directions')} ✓
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDirections(result)}
                  disabled={!result.isHospital || !!selectedResult}
                  className={cn(
                    'touch-target flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition-all',
                    result.isHospital
                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                      : 'cursor-not-allowed bg-gray-100 text-gray-400'
                  )}
                >
                  <Navigation className="h-4 w-4" />
                  {tr('directions')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
