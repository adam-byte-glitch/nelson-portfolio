'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-dvh grid place-items-center bg-[#0b0b10] text-white px-6">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6">
        <div className="text-sm text-white/70">Admin</div>
        <h1 className="mt-1 text-xl font-medium tracking-tight">Login</h1>
        <p className="mt-2 text-sm text-white/60">Enter your admin passcode.</p>

        <form
          className="mt-5 space-y-3"
          onSubmit={async e => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ password }),
              });
              if (!res.ok) throw new Error('Invalid passcode');
              window.location.href = '/admin';
            } catch (err: any) {
              setError(err.message || 'Failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Passcode"
            className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-white/25"
          />
          {error ? <div className="text-sm text-red-300">{error}</div> : null}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black px-3 py-2 text-sm font-medium disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}
