import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6fcfc]">
      <header className="sticky top-0 bg-white/90 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block h-8 w-8 rounded bg-[#0071bd]"></span>
            <span className="font-semibold text-[#224563]">LORDS Faculty Appraisal</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-[#224563]">
            <Link href="#features" className="hover:text-[#0071bd]">Features</Link>
            <Link href="#security" className="hover:text-[#0071bd]">Security</Link>
            <Link href="#contact" className="hover:text-[#0071bd]">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[#0071bd]">Sign in</Link>
            <Link href="/login" className="bg-[#0071bd] text-white px-3 py-2 rounded">Go to App</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#224563] leading-tight">
            Streamlined Faculty Appraisals for LORDS Institute
          </h1>
          <p className="mt-4 text-[#224563]/80">
            Secure, role-based workflows for Faculty, HOD, and Principal with real-time analytics.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="bg-[#0071bd] text-white px-5 py-3 rounded">Get Started</Link>
            <a href="#features" className="px-5 py-3 rounded border border-[#0071bd] text-[#0071bd]">Learn More</a>
          </div>
        </div>
        <div className="bg-white rounded shadow p-6">
          <ul className="space-y-3 text-[#224563]">
            <li>• Secure JWT authentication</li>
            <li>• Departmental HOD management</li>
            <li>• Multi-phase self-appraisal with file uploads</li>
            <li>• HOD performance evaluation and Principal remarks</li>
            <li>• Clean analytics and year-wise filters</li>
          </ul>
        </div>
      </section>

      <section id="features" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 grid md:grid-cols-3 gap-8">
          {[
            ['Role-based Access', 'Separate portals for Faculty, HOD, and Principal.'],
            ['Atomic Submissions', 'Reliable, consistent saves with validations.'],
            ['Secure Uploads', 'Cloud uploads with size validation.'],
          ].map(([title, desc]) => (
            <div key={title} className="rounded border p-6">
              <h3 className="font-semibold text-[#224563]">{title}</h3>
              <p className="text-[#224563]/80 mt-2 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contact" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[#224563]/80">
          © {new Date().getFullYear()} LORDS Institute. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
