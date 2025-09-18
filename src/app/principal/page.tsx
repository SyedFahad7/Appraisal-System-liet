'use client';

import { useEffect, useState } from 'react';

export default function PrincipalDashboard() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch('/api/appraisals/hod');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : data ? [data] : []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = items.filter((i) => {
    const hay = `${i?.facultyId || ''} ${i?.remarks || ''}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#224563]">Principal Reviews</h1>
        <input className="border rounded px-3 py-2" placeholder="Search faculty or remarks" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <section className="bg-white rounded border">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-4">No submissions yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">Faculty</th>
                <th className="p-2">Academic Year</th>
                <th className="p-2">Updated</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row._id} className="border-t">
                  <td className="p-2">{row.facultyId}</td>
                  <td className="p-2">{row.academicYear}</td>
                  <td className="p-2">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '-'}</td>
                  <td className="p-2">
                    <a className="text-[#0071bd] underline" href={`/principal/reviews/${row.facultyId}`}>Review</a>
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
