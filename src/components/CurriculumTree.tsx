/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Filter,
  Layers,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Course } from '../types/curriculum';

interface CurriculumTreeProps {
  courses: Course[];
  activeCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onAddNewCourse: () => void;
  programTitle: string;
}

export const CurriculumTree: React.FC<CurriculumTreeProps> = ({
  courses,
  activeCourseId,
  onSelectCourse,
  onAddNewCourse,
  programTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [collapsedTerms, setCollapsedTerms] = useState<Record<number, boolean>>({});

  const tracks = ['All', 'Systems', 'AI/ML', 'Theory', 'Security'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrack === 'All' || c.track === selectedTrack;
    return matchesSearch && matchesTrack;
  });

  // Group by term
  const terms = Array.from(new Set(courses.map((c) => c.term))).sort((a, b) => a - b);

  const toggleTerm = (term: number) => {
    setCollapsedTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const totalCredits = courses.reduce((acc, c) => acc + c.credits.total, 0);

  return (
    <aside className="w-[280px] shrink-0 bg-[#0F172A] border-r border-white/10 flex flex-col h-[calc(100vh-3rem)] select-none">
      {/* Institutional Context & Program Header */}
      <div className="p-3 border-b border-white/10 bg-[#0B0F19]/60">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Curriculum Hierarchy
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
            ABET EAC
          </span>
        </div>
        <h2 className="text-xs font-semibold text-white tracking-tight leading-snug line-clamp-2">
          {programTitle}
        </h2>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Total Program Weight</span>
          <span className="text-white font-semibold tabular-nums">{totalCredits}.0 / 128 cr</span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-[#090D16] h-1.5 rounded-full overflow-hidden mt-1 border border-white/5">
          <div
            className="bg-[#3B49DF] h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, (totalCredits / 128) * 100)}%` }}
          />
        </div>
      </div>

      {/* Search & Track Filter Strip */}
      <div className="p-2.5 border-b border-white/10 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code or title..."
            className="w-full h-8 pl-8 pr-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 text-[10px] text-slate-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Track Filter Segment */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrack(t)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors whitespace-nowrap ${
                selectedTrack === t
                  ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Course Tree List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {terms.length === 0 || filteredCourses.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-500 space-y-2">
            <Layers className="w-6 h-6 mx-auto text-slate-600" />
            <p>No courses match filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTrack('All');
              }}
              className="text-xs text-indigo-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          terms.map((term) => {
            const termCourses = filteredCourses.filter((c) => c.term === term);
            if (termCourses.length === 0) return null;
            const isCollapsed = collapsedTerms[term];
            const termCredits = termCourses.reduce((sum, c) => sum + c.credits.total, 0);

            return (
              <div key={term} className="space-y-1">
                {/* Term Group Header */}
                <button
                  onClick={() => toggleTerm(term)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {isCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span className="font-semibold text-slate-300">
                      Term {term}
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      ({term === 3 ? 'Sophomore Fall' : term === 4 ? 'Sophomore Spring' : term === 5 ? 'Junior Fall' : term === 6 ? 'Junior Spring' : term === 7 ? 'Senior Fall' : 'Senior Spring'})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {termCredits}.0 cr
                  </span>
                </button>

                {/* Term Courses */}
                {!isCollapsed && (
                  <div className="space-y-1 pl-2 border-l border-white/5 ml-3">
                    {termCourses.map((course) => {
                      const isSelected = course.id === activeCourseId;
                      return (
                        <div
                          key={course.id}
                          onClick={() => onSelectCourse(course.id)}
                          className={`group relative p-2 rounded cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-[#1E293B] border-[#6366F1] shadow-xs'
                              : 'bg-[#0F172A] border-white/5 hover:border-white/15 hover:bg-[#131b2e]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#3B49DF] shadow-[0_0_6px_#3B49DF] shrink-0" />
                              )}
                              <span className="font-mono text-xs font-bold text-indigo-300">
                                {course.code}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-black/30 px-1 py-0.5 rounded border border-white/5 tabular-nums shrink-0">
                              {course.credits.total}.0 cr
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 font-medium line-clamp-1 mt-1">
                            {course.title}
                          </p>

                          <div className="mt-1.5 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                              {course.track}
                            </span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${
                                course.status === 'Accredited'
                                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                                  : course.status === 'Under Review'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {course.status}
                            </span>
                          </div>

                          {/* Prerequisite status tag */}
                          {course.prerequisites.length > 0 && (
                            <div className="mt-1 flex items-center gap-1 text-[9px] font-mono text-slate-500">
                              <span>Prereqs:</span>
                              <span className="text-slate-400">
                                {course.prerequisites.map((p) => p.code).join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tree Footer: Action Button */}
      <div className="p-2.5 border-t border-white/10 bg-[#0B0F19]/60">
        <button
          onClick={onAddNewCourse}
          className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-200 bg-[#1E293B] border border-white/15 rounded hover:border-[#6366F1] hover:text-white transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Course Node</span>
        </button>
      </div>
    </aside>
  );
};
