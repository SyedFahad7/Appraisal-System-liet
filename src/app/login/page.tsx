'use client';

import { useEffect, useState } from 'react';

const roles = ['Faculty', 'HOD', 'Principal'] as const;

type Role = typeof roles[number];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Faculty');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Disable back to login after successful navigation
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', window.location.href);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Login failed');

      const detected = json.role as Role;
      if (detected !== role) {
        // role mismatch: notify but still route to actual role for security
        alert(`Logged in as ${detected}. Redirecting to your ${detected} portal.`);
      }

      const path = detected === 'Faculty' ? '/faculty' : detected === 'HOD' ? '/hod' : '/principal';
      window.location.replace(path);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6fcfc] p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white shadow rounded p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-[#224563]">LORDS Faculty Appraisal</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Email (@lords.ac.in)</label>
          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071bd]"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Password</label>
          <input
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071bd]"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-700">Select your role</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071bd]"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500">If the selected role mismatches your account, we will redirect to your actual portal.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0071bd] text-white rounded py-2 hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
