'use client';

import { useEffect, useMemo, useState } from 'react';

type Course = {
  id: string;
  semester: 'I' | 'II';
  courseName: string;
  periodsTaken: number;
  studentsAppeared: number;
  studentsPassed: number;
  passPercentage: number;
  timesTaught: number;
  assessmentScore: number; // 0-40
};

export default function SelfAppraisalPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'teaching'>('basic');
  const [saving, setSaving] = useState(false);
  const [signed, setSigned] = useState(false);

  const [basic, setBasic] = useState({
    name: '',
    department: '',
    designation: 'Assistant Professor',
    qualification: '',
    dateOfJoining: '',
    totalExperience: '',
    experienceInLIET: '',
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [assignmentsPerCourse, setAssignmentsPerCourse] = useState(0);
  const [innovativeTeachingMethods, setInnovativeTeachingMethods] = useState(0);

  const teachingScore = useMemo(() => {
    let score = 0;
    if (courses.length > 0) {
      const avg = courses.reduce((s, c) => s + (c.assessmentScore || 0), 0) / courses.length;
      score += Math.min(avg, 40);
    }
    score += assignmentsPerCourse >= 3 ? 5 : assignmentsPerCourse > 0 ? 2 : 0;
    score += innovativeTeachingMethods >= 3 ? 5 : innovativeTeachingMethods > 0 ? 2 : 0;
    return Math.min(score, 100);
  }, [courses, assignmentsPerCourse, innovativeTeachingMethods]);

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        semester: 'I',
        courseName: '',
        periodsTaken: 0,
        studentsAppeared: 0,
        studentsPassed: 0,
        passPercentage: 0,
        timesTaught: 0,
        assessmentScore: 0,
      },
    ]);
  };

  const updateCourse = (id: string, patch: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, ...patch } as Course;
        if (
          patch.studentsAppeared !== undefined ||
          patch.studentsPassed !== undefined
        ) {
          next.passPercentage = next.studentsAppeared > 0 ? (next.studentsPassed / next.studentsAppeared) * 100 : 0;
        }
        return next;
      }),
    );
  };

  const removeCourse = (id: string) => setCourses((prev) => prev.filter((c) => c.id !== id));

  const saveDraft = async (submit = false) => {
    setSaving(true);
    try {
      const phases = {
        basicInfo: basic,
        teaching: {
          courses,
          assignmentsPerCourse,
          innovativeTeachingMethods,
          teachingScore,
        },
      };
      const res = await fetch('/api/appraisals/self', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academicYear: new Date().getFullYear() + '-' + String(new Date().getFullYear() + 1).slice(-2),
          phases,
          signed: submit ? signed : false,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      alert(submit ? 'Submitted for HOD review' : 'Draft saved');
      if (submit) window.location.href = '/faculty';
    } catch (e: any) {
      alert(e.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-[#224563]">Faculty Self-Appraisal</h1>

      <div className="flex gap-2">
        <button
          className={`px-3 py-2 rounded border ${activeTab === 'basic' ? 'bg-[#0071bd] text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic Info
        </button>
        <button
          className={`px-3 py-2 rounded border ${activeTab === 'teaching' ? 'bg-[#0071bd] text-white' : 'bg-white'}`}
          onClick={() => setActiveTab('teaching')}
        >
          Teaching
        </button>
      </div>

      {activeTab === 'basic' && (
        <section className="bg-white rounded border p-4 grid md:grid-cols-2 gap-4">
          {[
            ['name', 'Name of Faculty Member'],
            ['department', 'Department'],
            ['qualification', 'Qualification'],
            ['dateOfJoining', 'Date of Joining', 'date'],
            ['totalExperience', 'Total Experience'],
            ['experienceInLIET', 'Experience in LIET'],
          ].map(([key, label, type]) => (
            <label key={key as string} className="space-y-1">
              <span className="text-sm text-gray-700">{label}</span>
              <input
                type={(type as string) || 'text'}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071bd]"
                value={(basic as any)[key as string] || ''}
                onChange={(e) => setBasic((b) => ({ ...b, [key as string]: e.target.value }))}
              />
            </label>
          ))}
          <label className="space-y-1">
            <span className="text-sm text-gray-700">Designation</span>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071bd]"
              value={basic.designation}
              onChange={(e) => setBasic((b) => ({ ...b, designation: e.target.value }))}
            >
              <option>Assistant Professor</option>
              <option>Associate Professor</option>
              <option>Professor</option>
            </select>
          </label>
        </section>
      )}

      {activeTab === 'teaching' && (
        <section className="space-y-4">
          <div className="bg-white rounded border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium text-[#224563]">Theory/Lab Courses (last 2 semesters)</h2>
              <button className="px-3 py-2 border rounded" onClick={addCourse}>Add Course</button>
            </div>
            <div className="space-y-4">
              {courses.map((c, idx) => (
                <div key={c.id} className="border rounded p-3 grid md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-sm">Semester</span>
                    <select
                      className="w-full border rounded px-2 py-2"
                      value={c.semester}
                      onChange={(e) => updateCourse(c.id, { semester: e.target.value as 'I' | 'II' })}
                    >
                      <option value="I">I</option>
                      <option value="II">II</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm">Course Name</span>
                    <input className="w-full border rounded px-2 py-2" value={c.courseName} onChange={(e) => updateCourse(c.id, { courseName: e.target.value })} />
                  </div>
                  <div>
                    <span className="text-sm">Periods Taken</span>
                    <input type="number" className="w-full border rounded px-2 py-2" value={c.periodsTaken} onChange={(e) => updateCourse(c.id, { periodsTaken: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <span className="text-sm">Students Appeared</span>
                    <input type="number" className="w-full border rounded px-2 py-2" value={c.studentsAppeared} onChange={(e) => updateCourse(c.id, { studentsAppeared: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <span className="text-sm">Students Passed</span>
                    <input type="number" className="w-full border rounded px-2 py-2" value={c.studentsPassed} onChange={(e) => updateCourse(c.id, { studentsPassed: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <span className="text-sm">Pass %</span>
                    <input disabled className="w-full border rounded px-2 py-2 bg-gray-50" value={c.passPercentage.toFixed(1)} />
                  </div>
                  <div>
                    <span className="text-sm">Times Taught</span>
                    <input type="number" className="w-full border rounded px-2 py-2" value={c.timesTaught} onChange={(e) => updateCourse(c.id, { timesTaught: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <span className="text-sm">Assessment (0-40)</span>
                    <input type="number" max={40} className="w-full border rounded px-2 py-2" value={c.assessmentScore} onChange={(e) => updateCourse(c.id, { assessmentScore: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="md:col-span-4 flex justify-end">
                    <button className="text-red-600 text-sm" onClick={() => removeCourse(c.id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <label className="space-y-1 bg-white rounded border p-4">
              <span className="text-sm text-gray-700">Assignments per Course</span>
              <input type="number" className="w-full border rounded px-3 py-2" value={assignmentsPerCourse} onChange={(e) => setAssignmentsPerCourse(parseInt(e.target.value) || 0)} />
            </label>
            <label className="space-y-1 bg-white rounded border p-4">
              <span className="text-sm text-gray-700">Innovative Teaching Methods</span>
              <input type="number" className="w-full border rounded px-3 py-2" value={innovativeTeachingMethods} onChange={(e) => setInnovativeTeachingMethods(parseInt(e.target.value) || 0)} />
            </label>
            <div className="bg-white rounded border p-4">
              <div className="text-sm text-gray-700">Teaching Score</div>
              <div className="text-2xl font-semibold text-[#0071bd]">{teachingScore}</div>
            </div>
          </div>
        </section>
      )}

      <div className="flex items-center justify-between py-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
          I confirm this information is accurate.
        </label>
        <div className="flex gap-2">
          <button disabled={saving} className="border px-4 py-2 rounded" onClick={() => saveDraft(false)}>Save Draft</button>
          <button disabled={saving || !signed} className="bg-[#0071bd] text-white px-4 py-2 rounded" onClick={() => saveDraft(true)}>Submit</button>
        </div>
      </div>
    </main>
  );
}
