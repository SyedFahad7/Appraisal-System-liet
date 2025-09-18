'use client';

import { useEffect, useState } from 'react';

export default function HODFacultyPage() {
  const [loading, setLoading] = useState(true);
  const [faculty, setFaculty] = useState<Array<{ id: string; email: string; name?: string }>>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/users');
    const data = await res.json();
    setFaculty(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const createFaculty = async () => {
    if (!email || !password) return alert('Enter email and password');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return alert('Failed to create');
    setEmail('');
    setPassword('');
    load();
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#224563]">Department Faculty</h1>

      <section className="bg-white rounded border p-4 grid md:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" placeholder="faculty@lords.ac.in" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Initial Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-[#0071bd] text-white rounded px-4" onClick={createFaculty}>Create Faculty</button>
      </section>

      <section className="bg-white rounded border">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="p-2">Email</th>
                <th className="p-2">Name</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faculty.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-2">{f.email}</td>
                  <td className="p-2">{f.name || '-'}</td>
                  <td className="p-2">
                    <a className="text-[#0071bd] underline" href={`/hod/reviews/${f.id}`}>Review</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
