'use client';

import Link from 'next/link';

export default function FacultyDashboard() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-[#224563]">Faculty Dashboard</h1>
      <section className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded border p-6 space-y-2">
          <h2 className="font-medium text-[#224563]">Start / Edit Self-Appraisal</h2>
          <p className="text-sm text-gray-600">Fill the complete form and attach documents. You can save as draft and submit later.</p>
          <Link href="/appraisal/self" className="inline-block bg-[#0071bd] text-white rounded px-4 py-2 mt-2">Open Self-Appraisal</Link>
        </div>
        <div className="bg-white rounded border p-6 space-y-2">
          <h2 className="font-medium text-[#224563]">Your Submissions</h2>
          <p className="text-sm text-gray-600">Track past submissions and status.</p>
          <Link href="/appraisal/self?view=list" className="inline-block border rounded px-4 py-2 mt-2">View Submissions</Link>
        </div>
      </section>
    </main>
  );
}
