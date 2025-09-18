'use client';

import { useEffect, useMemo, useState } from 'react';

export default function HODReviewPage({ params }: { params: { id: string } }) {
  const { id } = params; // facultyId
  const [loading, setLoading] = useState(true);
  const [selfData, setSelfData] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const sa = await fetch(`/api/appraisals/self?facultyId=${id}`).then((r) => r.json());
      setSelfData(sa);
      setLoading(false);
    };
    load();
  }, [id]);

  const baseScores = useMemo(() => {
    // derive baseline from phases if available
    const teaching = selfData?.phases?.teaching?.teachingScore || 0;
    // Other parts to be added as we implement more tabs
    return { teaching };
  }, [selfData]);

  const totalHodScore = useMemo(() => {
    const v = Object.values(scores).reduce((s, n) => s + (Number.isFinite(n) ? n : 0), 0);
    return Math.min(25, v);
  }, [scores]);

  const submit = async () => {
    const res = await fetch('/api/appraisals/hod', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facultyId: id, academicYear: selfData?.academicYear || '', scores: { ...baseScores, ...scores }, remarks }),
    });
    if (!res.ok) return alert('Failed to submit');
    alert('Submitted to Principal');
    window.location.href = '/hod';
  };

  if (loading) return <main className="p-6">Loading…</main>;
  if (!selfData) return <main className="p-6">No self-appraisal found.</main>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#224563]">HOD Performance Appraisal</h1>

      <section className="bg-white rounded border p-4">
        <h2 className="font-medium text-[#224563] mb-2">Baseline from Self-Appraisal</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-sm text-gray-600">Teaching</div>
            <div className="text-2xl font-semibold">{baseScores.teaching} / 100</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border p-4 space-y-3">
        <h2 className="font-medium text-[#224563]">HOD Assessment (max 25)</h2>
        {[
          ['initiative', 'Initiative and Drive Exhibited'],
          ['leave', 'Availing of Leave/Permissions'],
          ['domain', 'Domain Knowledge'],
          ['mentoring', 'Efficacy of Student Mentoring'],
          ['administration', 'Administrative Efficiency'],
          ['policy', 'Compliance of Institutional Policies & Procedures'],
          ['teamwork', 'Collegiality and Teamwork'],
          ['innovation', 'Class Control & Innovation in Teaching'],
          ['tasks', 'Timely completion of given Tasks'],
          ['punctuality', 'Attire, Appearance & Punctuality'],
        ].map(([k, label]) => (
          <label key={k} className="grid md:grid-cols-2 items-center gap-2">
            <span className="text-sm">{label}</span>
            <input type="number" min={0} max={25} className="border rounded px-3 py-2" value={Number(scores[k as string] || 0)} onChange={(e) => setScores((s) => ({ ...s, [k as string]: parseInt(e.target.value) || 0 }))} />
          </label>
        ))}
        <div className="text-sm text-gray-600">HOD Assessment Score: {totalHodScore} / 25</div>
      </section>

      <section className="bg-white rounded border p-4">
        <label className="space-y-1 w-full">
          <span className="text-sm text-gray-700">Suggestions / Remarks</span>
          <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </label>
      </section>

      <div className="flex justify-end gap-2">
        <button className="bg-[#0071bd] text-white rounded px-4 py-2" onClick={submit}>Submit to Principal</button>
      </div>
    </main>
  );
}
