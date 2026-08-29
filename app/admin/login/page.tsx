'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.assign('/admin');
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(
        res.status === 503
          ? 'Admin access is not configured on the live site yet.'
          : data?.error === 'Incorrect password'
            ? 'Incorrect password. Please try again.'
            : 'Unable to sign in. Please try again.'
      );
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-white shadow-lg">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">Digital Literacy Simulator</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <Label htmlFor="password" className="flex items-center gap-2 text-base font-medium">
              <Lock className="h-4 w-4" /> Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="h-12 text-base"
              autoFocus
              autoComplete="off"
            />
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="mt-5 h-12 w-full text-base font-semibold">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
