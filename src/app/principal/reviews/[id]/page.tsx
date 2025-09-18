'use client';

import { useEffect, useState } from 'react';

export default function PrincipalReviewPage({ params }: { params: { id: string } }) {
  const facultyId = params.id;
  const [hodAppraisal, setHodAppraisal] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [finalRating, setFinalRating] = useState<number | ''>('');

  useEffect(() => {
    const load = async () => {
      const hod = await fetch(`/api/appraisals/hod?facultyId=${facultyId}`).then((r) => r.json());
      setHodAppraisal(hod);
    };
    load();
  }, [facultyId]);

  const submit = async () => {
    const res = await fetch('/api/appraisals/principal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facultyId, academicYear: hodAppraisal?.academicYear || '', hodAppraisalId: hodAppraisal?._id, remarks, finalRating: finalRating === '' ? undefined : Number(finalRating), signed: true }),
    });
    if (!res.ok) return alert('Failed');
    alert('Remarks submitted');
    window.location.href = '/principal';
  };

  if (!hodAppraisal) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#224563]">Principal Review</h1>
      <section className="bg-white rounded border p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600">HOD Score</div>
            <div className="text-2xl font-semibold">{hodAppraisal?.scores?.hodAssessmentScore || 0} / 25</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Teaching (from Self)</div>
            <div className="text-2xl font-semibold">{hodAppraisal?.scores?.teaching || 0} / 100</div>
          </div>
        </div>
      </section>
      <section className="bg-white rounded border p-4 space-y-3">
        <label className="space-y-1 block">
          <span className="text-sm text-gray-700">Observations and Remarks</span>
          <textarea className="w-full border rounded px-3 py-2 min-h-[120px]" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </label>
        <label className="space-y-1 block max-w-xs">
          <span className="text-sm text-gray-700">Final Rating (0-100)</span>
          <input type="number" min={0} max={100} className="w-full border rounded px-3 py-2" value={finalRating} onChange={(e) => setFinalRating(e.target.value === '' ? '' : parseInt(e.target.value) || 0)} />
        </label>
      </section>
      <div className="flex justify-end">
        <button className="bg-[#0071bd] text-white rounded px-4 py-2" onClick={submit}>Sign & Submit</button>
      </div>
    </main>
  );
}
