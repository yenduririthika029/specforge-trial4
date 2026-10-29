/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';
import { Course } from '../types/curriculum';

interface NewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCourse: (course: Course) => void;
}

export const NewCourseModal: React.FC<NewCourseModalProps> = ({
  isOpen,
  onClose,
  onAddCourse,
}) => {
  const [code, setCode] = useState('CS-360');
  const [title, setTitle] = useState('Network Security & Cryptographic Protocols');
  const [level, setLevel] = useState('Upper Division / Level 300');
  const [term, setTerm] = useState(6);
  const [track, setTrack] = useState<'Systems' | 'AI/ML' | 'Theory' | 'Security'>('Security');
  const [lectureCredits, setLectureCredits] = useState(3.0);
  const [labCredits, setLabCredits] = useState(1.0);

  if (!isOpen) return null;

  const totalCredits = lectureCredits + labCredits;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim()) return;

    const newCourse: Course = {
      id: `course-${code.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`,
      code: code.toUpperCase().trim(),
      title: title.trim(),
      level,
      term: Number(term),
      credits: {
        lecture: Number(lectureCredits),
        lab: Number(labCredits),
        recitation: 0.0,
        total: totalCredits,
      },
      track,
      status: 'Draft',
      accreditationCycle: 'ABET 2026 Ingestion Session',
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      author: 'Faculty Curriculum Committee',
      descriptionMarkdown: `## ${code}: ${title}\n\nComprehensive exploration of ${title.toLowerCase()} within the academic engineering curriculum.`,
      latexAbstract: `\\begin{abstract}\n\\noindent\\textbf{${code}: ${title}} investigates foundational principles and practical verification.\n\\end{abstract}`,
      modules: [
        {
          id: `mod-new-1`,
          chapterNumber: 1,
          title: `Foundations of ${title}`,
          weeks: 'Week 1–5',
          lectureHours: 15,
          labHours: 10,
          learningOutcomes: ['Formulate foundational architectural invariants.'],
          deliverables: ['Lab 1: Baseline Architecture Implementation'],
          requiredTools: ['Departmental Toolset'],
        },
      ],
      prerequisites: [
        {
          code: 'CS-201',
          title: 'Data Structures & Algorithms',
          credits: 4.0,
          minimumGrade: 'C',
          type: 'hard',
          status: 'satisfied',
        },
      ],
      rubric: [
        {
          id: `rub-new-1`,
          category: 'Implementation Projects',
          weight: 50,
          description: 'Hands-on programming assignments.',
          abetOutcomes: ['SO-1', 'SO-2'],
          deliveryWeek: 'Continuous',
        },
        {
          id: `rub-new-2`,
          category: 'Examinations',
          weight: 50,
          description: 'Midterm and final theoretical evaluations.',
          abetOutcomes: ['SO-1'],
          deliveryWeek: 'Week 8 & 15',
        },
      ],
      abetOutcomes: [
        {
          id: 'SO-1',
          name: 'Complex Problem Solving',
          shortDescription: 'Solve complex engineering problems.',
          coveragePercentage: 90,
          mappedItems: ['Implementation Projects', 'Exams'],
          status: 'passed',
        },
      ],
      auditChecks: [
        {
          id: `chk-new-1`,
          title: 'Draft Sequence Invariant',
          description: 'Initial draft registered in curriculum tree.',
          status: 'pass',
          criterion: 'Curriculum Register',
        },
      ],
      comments: [],
      versionHistory: [
        {
          version: 'v1.0 (Draft)',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          author: 'Faculty Member',
          summary: 'Created initial course specification outline',
          diffSnippet: `+ Added course ${code}`,
        },
      ],
    };

    onAddCourse(newCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-4 py-3 bg-[#131b2e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white font-['Hanken_Grotesk']">
              Add New Course Specification Node
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Course Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS-360"
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono focus:outline-none focus:border-[#6366F1]"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Course Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Network Security & Cryptographic Protocols"
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Academic Term</label>
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((t) => (
                  <option key={t} value={t}>
                    Term {t} ({t <= 2 ? 'Freshman' : t <= 4 ? 'Sophomore' : t <= 6 ? 'Junior' : 'Senior'})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Track Specialization</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as any)}
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200"
              >
                <option value="Systems">Systems</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Theory">Theory</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Lecture Credits</label>
              <input
                type="number"
                step="0.5"
                value={lectureCredits}
                onChange={(e) => setLectureCredits(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Lab Credits</label>
              <input
                type="number"
                step="0.5"
                value={labCredits}
                onChange={(e) => setLabCredits(Number(e.target.value))}
                className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-indigo-400 font-semibold">Total Credits</label>
              <div className="w-full h-8 px-2.5 bg-[#090D16] border border-indigo-500/30 rounded text-indigo-300 font-mono font-bold flex items-center">
                {totalCredits.toFixed(1)} cr
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Course Node</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
