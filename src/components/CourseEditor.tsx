/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  GraduationCap,
  BookOpen,
  FileCode,
  Eye,
  Edit3,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Course, ModuleUnit, Prerequisite, RubricItem, Role } from '../types/curriculum';

interface CourseEditorProps {
  course: Course;
  currentRole: Role;
  onUpdateCourse: (updated: Course) => void;
  onTriggerAudit: () => void;
  onNavigateToUpload: () => void;
}

export const CourseEditor: React.FC<CourseEditorProps> = ({
  course,
  currentRole,
  onUpdateCourse,
  onTriggerAudit,
  onNavigateToUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'prereqs' | 'rubric' | 'spec'>('modules');
  const [specMode, setSpecMode] = useState<'markdown' | 'latex'>('markdown');
  const [copied, setCopied] = useState(false);

  // Module addition state
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModTitle, setNewModTitle] = useState('');
  const [newModWeeks, setNewModWeeks] = useState('');
  const [newModLecHours, setNewModLecHours] = useState(9);
  const [newModLabHours, setNewModLabHours] = useState(6);
  const [newModOutcome, setNewModOutcome] = useState('');
  const [newModTool, setNewModTool] = useState('');

  // Prerequisite addition state
  const [isAddingPrereq, setIsAddingPrereq] = useState(false);
  const [newPrereqCode, setNewPrereqCode] = useState('');
  const [newPrereqTitle, setNewPrereqTitle] = useState('');
  const [newPrereqGrade, setNewPrereqGrade] = useState('C');
  const [newPrereqType, setNewPrereqType] = useState<'hard' | 'soft'>('hard');

  // Rubric addition state
  const [isAddingRubric, setIsAddingRubric] = useState(false);
  const [newRubCategory, setNewRubCategory] = useState('');
  const [newRubWeight, setNewRubWeight] = useState(20);
  const [newRubWeek, setNewRubWeek] = useState('Week 8');
  const [newRubDesc, setNewRubDesc] = useState('');

  const isReadOnly = currentRole === 'Reviewer';

  // Handle module delete
  const handleDeleteModule = (id: string) => {
    const updatedModules = course.modules
      .filter((m) => m.id !== id)
      .map((m, idx) => ({ ...m, chapterNumber: idx + 1 }));
    onUpdateCourse({ ...course, modules: updatedModules });
  };

  // Handle module reorder (swap up or down)
  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= course.modules.length) return;
    const newModules = [...course.modules];
    const temp = newModules[index];
    newModules[index] = newModules[targetIndex];
    newModules[targetIndex] = temp;
    // Re-index chapter numbers
    const reindexed = newModules.map((m, idx) => ({ ...m, chapterNumber: idx + 1 }));
    onUpdateCourse({ ...course, modules: reindexed });
  };

  // Add new module
  const handleSaveNewModule = () => {
    if (!newModTitle.trim()) return;
    const newMod: ModuleUnit = {
      id: `mod-${Date.now()}`,
      chapterNumber: course.modules.length + 1,
      title: newModTitle,
      weeks: newModWeeks || `Week ${course.modules.length * 3 + 1}–${course.modules.length * 3 + 3}`,
      lectureHours: Number(newModLecHours) || 9,
      labHours: Number(newModLabHours) || 6,
      learningOutcomes: newModOutcome ? [newModOutcome] : ['Synthesize core domain competencies.'],
      deliverables: [`Module ${course.modules.length + 1} Implementation Benchmark`],
      requiredTools: newModTool ? [newModTool] : ['Standard Toolchain'],
    };
    onUpdateCourse({ ...course, modules: [...course.modules, newMod] });
    setIsAddingModule(false);
    setNewModTitle('');
    setNewModWeeks('');
    setNewModOutcome('');
    setNewModTool('');
  };

  // Add prerequisite
  const handleSavePrereq = () => {
    if (!newPrereqCode.trim()) return;
    const prereq: Prerequisite = {
      code: newPrereqCode.toUpperCase(),
      title: newPrereqTitle || 'Curricular Requirement',
      credits: 4.0,
      minimumGrade: newPrereqGrade,
      type: newPrereqType,
      status: 'satisfied',
    };
    onUpdateCourse({ ...course, prerequisites: [...course.prerequisites, prereq] });
    setIsAddingPrereq(false);
    setNewPrereqCode('');
    setNewPrereqTitle('');
  };

  const handleDeletePrereq = (code: string) => {
    onUpdateCourse({
      ...course,
      prerequisites: course.prerequisites.filter((p) => p.code !== code),
    });
  };

  // Rubric weights sum
  const totalRubricWeight = course.rubric.reduce((acc, r) => acc + r.weight, 0);

  const handleSaveRubric = () => {
    if (!newRubCategory.trim()) return;
    const item: RubricItem = {
      id: `rub-${Date.now()}`,
      category: newRubCategory,
      weight: Number(newRubWeight) || 10,
      description: newRubDesc || 'Graded evaluation milestone.',
      abetOutcomes: ['SO-1', 'SO-2'],
      deliveryWeek: newRubWeek,
    };
    onUpdateCourse({ ...course, rubric: [...course.rubric, item] });
    setIsAddingRubric(false);
    setNewRubCategory('');
    setNewRubDesc('');
  };

  const handleDeleteRubric = (id: string) => {
    onUpdateCourse({
      ...course,
      rubric: course.rubric.filter((r) => r.id !== id),
    });
  };

  const handleCopySpec = () => {
    const textToCopy = specMode === 'markdown' ? course.descriptionMarkdown : course.latexAbstract;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate total contact hours
  const totalLecHours = course.modules.reduce((sum, m) => sum + m.lectureHours, 0);
  const totalLabHours = course.modules.reduce((sum, m) => sum + m.labHours, 0);

  return (
    <section className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-y-auto bg-[#0B0F19] select-text">
      {/* Course Master Header */}
      <div className="p-4 bg-[#0F172A] border-b border-white/10 shrink-0">
        <div className="max-w-5xl mx-auto space-y-3">
          {/* Top row: tags and quick actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 font-bold">
                {course.code}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {course.level}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400 font-mono">
                Term {course.term}
              </span>
              <span className="text-slate-600">·</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${
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

            <div className="flex items-center gap-2">
              <button
                onClick={onTriggerAudit}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-[#1E293B] border border-white/15 rounded hover:border-[#6366F1] transition-all shadow-xs"
                title="Verify curricular invariants and ABET Criterion 3 alignment"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Re-run Audit</span>
              </button>

              <button
                onClick={onNavigateToUpload}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded transition-all shadow-xs"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Upload Spec</span>
              </button>
            </div>
          </div>

          {/* Title and Credits Matrix */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <h1 className="font-['Hanken_Grotesk'] text-xl md:text-2xl font-bold text-white tracking-tight">
                {course.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Lead Author: <span className="text-slate-300">{course.author}</span> · Last verified:{' '}
                <span className="text-slate-300">{course.lastModified}</span>
              </p>
            </div>

            {/* Credit Allocation Table */}
            <div className="flex items-center gap-2 bg-[#090D16] p-2 rounded border border-white/10 shrink-0">
              <div className="text-center px-2 border-r border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Lecture</div>
                <div className="text-sm font-bold text-white font-mono tabular-nums">
                  {course.credits.lecture.toFixed(1)}
                </div>
              </div>
              <div className="text-center px-2 border-r border-white/10">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Lab</div>
                <div className="text-sm font-bold text-white font-mono tabular-nums">
                  {course.credits.lab.toFixed(1)}
                </div>
              </div>
              <div className="text-center px-2">
                <div className="text-[10px] font-mono text-indigo-400 uppercase font-semibold">Total Cr</div>
                <div className="text-sm font-bold text-indigo-300 font-mono tabular-nums">
                  {course.credits.total.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1 pt-2 border-t border-white/10 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                activeTab === 'modules'
                  ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Syllabus & Modules ({course.modules.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('prereqs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                activeTab === 'prereqs'
                  ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Prerequisites & Graph ({course.prerequisites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rubric')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                activeTab === 'rubric'
                  ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Assessment Rubrics ({totalRubricWeight}%)</span>
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all whitespace-nowrap ${
                activeTab === 'spec'
                  ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>LaTeX / Markdown Specification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Tab 1: Syllabus & Modules */}
        {activeTab === 'modules' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Curricular Modules & Contact Distribution
                </h2>
                <p className="text-xs text-slate-400">
                  Total Contact: <span className="text-white font-mono">{totalLecHours}h</span> Lecture +{' '}
                  <span className="text-white font-mono">{totalLabHours}h</span> Lab (14 instructional weeks)
                </p>
              </div>

              {!isReadOnly && (
                <button
                  onClick={() => setIsAddingModule(!isAddingModule)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Module</span>
                </button>
              )}
            </div>

            {/* Inline Module Creator Form */}
            {isAddingModule && (
              <div className="p-4 bg-[#0F172A] border border-[#6366F1] rounded space-y-3 shadow-md animate-in fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">
                    Draft New Curricular Chapter
                  </h3>
                  <button
                    onClick={() => setIsAddingModule(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Chapter Title</label>
                    <input
                      type="text"
                      value={newModTitle}
                      onChange={(e) => setNewModTitle(e.target.value)}
                      placeholder="e.g. Distributed Consensus & Raft State Machines"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Instructional Weeks</label>
                    <input
                      type="text"
                      value={newModWeeks}
                      onChange={(e) => setNewModWeeks(e.target.value)}
                      placeholder="e.g. Week 4–7"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Lecture Hours</label>
                    <input
                      type="number"
                      value={newModLecHours}
                      onChange={(e) => setNewModLecHours(Number(e.target.value))}
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1] font-mono tabular-nums"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Lab Hours</label>
                    <input
                      type="number"
                      value={newModLabHours}
                      onChange={(e) => setNewModLabHours(Number(e.target.value))}
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1] font-mono tabular-nums"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Primary Required Tool</label>
                    <input
                      type="text"
                      value={newModTool}
                      onChange={(e) => setNewModTool(e.target.value)}
                      placeholder="e.g. Rust / Wireshark / QEMU"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">
                    Primary Measurable Learning Outcome
                  </label>
                  <input
                    type="text"
                    value={newModOutcome}
                    onChange={(e) => setNewModOutcome(e.target.value)}
                    placeholder="e.g. Prove leader completeness and evaluate partition split-brain resistance"
                    className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsAddingModule(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNewModule}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded"
                  >
                    Append Module to Syllabus
                  </button>
                </div>
              </div>
            )}

            {/* List of Modules */}
            <div className="space-y-3">
              {course.modules.map((mod, index) => (
                <div
                  key={mod.id}
                  className="bg-[#0F172A] border border-white/10 rounded overflow-hidden transition-all hover:border-white/20"
                >
                  {/* Module Header Bar */}
                  <div className="px-3.5 py-2.5 bg-[#131b2e] border-b border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {/* Reorder Grip */}
                      <div className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-indigo-400 cursor-move">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                        Chapter {mod.chapterNumber}
                      </span>
                      <h3 className="text-xs md:text-sm font-semibold text-white tracking-tight">
                        {mod.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span className="text-slate-300">{mod.weeks}</span>
                        <span className="text-slate-600">·</span>
                        <span>{mod.lectureHours}h Lec</span>
                        <span>/</span>
                        <span>{mod.labHours}h Lab</span>
                      </div>

                      {/* Reorder Up/Down */}
                      {!isReadOnly && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveModule(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                            title="Move Chapter Up"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handleMoveModule(index, 'down')}
                            disabled={index === course.modules.length - 1}
                            className="p-1 text-slate-500 hover:text-white disabled:opacity-30"
                            title="Move Chapter Down"
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => handleDeleteModule(mod.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 ml-1"
                            title="Delete Module"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Module Details */}
                  <div className="p-3.5 space-y-3">
                    {/* Learning Outcomes */}
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Measurable Learning Outcomes</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300 pl-4 list-disc marker:text-indigo-400">
                        {mod.learningOutcomes.map((lo, i) => (
                          <li key={i}>{lo}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Deliverables & Tooling */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Assigned Deliverables
                        </span>
                        <div className="space-y-1">
                          {mod.deliverables.map((del, dIdx) => (
                            <div
                              key={dIdx}
                              className="font-mono text-[11px] text-slate-300 bg-[#090D16] px-2 py-1 rounded border border-white/5"
                            >
                              {del}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                          Laboratory Tooling & Environments
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {mod.requiredTools.map((tool, tIdx) => (
                            <span
                              key={tIdx}
                              className="font-mono text-[11px] text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/20"
                            >
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Prerequisites & Dependency Graph */}
        {activeTab === 'prereqs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Prerequisites & Curricular Sequence Invariants
                </h2>
                <p className="text-xs text-slate-400">
                  Enforces academic sequencing, minimum required grades, and DAG circularity verification.
                </p>
              </div>

              {!isReadOnly && (
                <button
                  onClick={() => setIsAddingPrereq(!isAddingPrereq)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Prerequisite</span>
                </button>
              )}
            </div>

            {/* Invariant status banner */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>Acyclic Verification Passed:</strong> No circular dependency loops detected in course DAG sequence.
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400">
                Depth: 3 Terms
              </span>
            </div>

            {/* Inline Add Prereq form */}
            {isAddingPrereq && (
              <div className="p-4 bg-[#0F172A] border border-[#6366F1] rounded space-y-3">
                <h3 className="text-xs font-semibold text-white font-mono uppercase">
                  Add Upstream Prerequisite Requirement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Course Code</label>
                    <input
                      type="text"
                      value={newPrereqCode}
                      onChange={(e) => setNewPrereqCode(e.target.value)}
                      placeholder="e.g. CS-240"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Course Title</label>
                    <input
                      type="text"
                      value={newPrereqTitle}
                      onChange={(e) => setNewPrereqTitle(e.target.value)}
                      placeholder="e.g. Operating Systems"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Min. Grade</label>
                    <select
                      value={newPrereqGrade}
                      onChange={(e) => setNewPrereqGrade(e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono"
                    >
                      <option value="A">A</option>
                      <option value="B+">B+</option>
                      <option value="B">B</option>
                      <option value="B-">B-</option>
                      <option value="C+">C+</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingPrereq(false)}
                    className="px-3 py-1 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSavePrereq}
                    className="px-3 py-1 text-xs font-medium text-white bg-[#3B49DF] rounded"
                  >
                    Save Prerequisite
                  </button>
                </div>
              </div>
            )}

            {/* Prerequisite Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {course.prerequisites.map((p) => (
                <div
                  key={p.code}
                  className="p-3.5 bg-[#0F172A] border border-white/10 rounded space-y-2 relative group hover:border-[#6366F1] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20">
                      {p.code}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
                      Min Grade: {p.minimumGrade}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-white line-clamp-1">{p.title}</h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{p.credits.toFixed(1)} Credits</span>
                    <span className="text-slate-500 capitalize">{p.type} Requirement</span>
                  </div>

                  {!isReadOnly && (
                    <button
                      onClick={() => handleDeletePrereq(p.code)}
                      className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Prerequisite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Assessment Rubrics */}
        {activeTab === 'rubric' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Accreditation Assessment Rubric & Weight Balance
                </h2>
                <p className="text-xs text-slate-400">
                  Weights must equal 100%. Each category maps directly to ABET Student Outcomes (SO-1 through SO-7).
                </p>
              </div>

              {!isReadOnly && (
                <button
                  onClick={() => setIsAddingRubric(!isAddingRubric)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Assessment Item</span>
                </button>
              )}
            </div>

            {/* Total Balance Status */}
            <div
              className={`p-3 rounded border flex items-center justify-between text-xs ${
                totalRubricWeight === 100
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {totalRubricWeight === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span>
                  <strong>Assessment Weight Status:</strong> {totalRubricWeight}% of 100% allocated.
                  {totalRubricWeight !== 100 && ' (Please adjust weights to sum exactly to 100%)'}
                </span>
              </div>
              <span className="font-mono font-bold tabular-nums text-sm">
                {totalRubricWeight}% / 100%
              </span>
            </div>

            {/* Rubric Add Form */}
            {isAddingRubric && (
              <div className="p-4 bg-[#0F172A] border border-[#6366F1] rounded space-y-3">
                <h3 className="text-xs font-semibold text-white font-mono uppercase">
                  Add Assessment Component
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Category / Name</label>
                    <input
                      type="text"
                      value={newRubCategory}
                      onChange={(e) => setNewRubCategory(e.target.value)}
                      placeholder="e.g. Midterm In-Lab Architecture Defense"
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Weight (%)</label>
                    <input
                      type="number"
                      value={newRubWeight}
                      onChange={(e) => setNewRubWeight(Number(e.target.value))}
                      className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Description</label>
                  <input
                    type="text"
                    value={newRubDesc}
                    onChange={(e) => setNewRubDesc(e.target.value)}
                    placeholder="e.g. Rigorous test suite evaluating split-vote and failure invariants"
                    className="w-full h-8 px-2.5 text-xs bg-[#090D16] border border-white/10 rounded text-slate-200"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAddingRubric(false)}
                    className="px-3 py-1 text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveRubric}
                    className="px-3 py-1 text-xs font-medium text-white bg-[#3B49DF] rounded"
                  >
                    Save Component
                  </button>
                </div>
              </div>
            )}

            {/* Rubric Table */}
            <div className="bg-[#0F172A] border border-white/10 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131b2e] border-b border-white/10 font-mono text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Assessment Category</th>
                    <th className="py-2.5 px-3">Timeline</th>
                    <th className="py-2.5 px-3 text-right">Weight</th>
                    <th className="py-2.5 px-3">Mapped ABET Outcomes</th>
                    {!isReadOnly && <th className="py-2.5 px-3 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {course.rubric.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{r.category}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{r.description}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 text-[11px]">
                        {r.deliveryWeek}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-indigo-300 text-sm tabular-nums">
                        {r.weight}%
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {r.abetOutcomes.map((o) => (
                            <span
                              key={o}
                              className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/20"
                            >
                              {o}
                            </span>
                          ))}
                        </div>
                      </td>
                      {!isReadOnly && (
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteRubric(r.id)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: LaTeX / Markdown Specification */}
        {activeTab === 'spec' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">
                  Academic Specification Document
                </h2>
                <p className="text-xs text-slate-400">
                  Switch between LaTeX Master Senate Format and Markdown Web Specification.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Format toggle */}
                <div className="flex items-center bg-[#090D16] p-0.5 rounded border border-white/10">
                  <button
                    onClick={() => setSpecMode('markdown')}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                      specMode === 'markdown'
                        ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    onClick={() => setSpecMode('latex')}
                    className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                      specMode === 'latex'
                        ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    LaTeX (.tex)
                  </button>
                </div>

                <button
                  onClick={handleCopySpec}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-[#0F172A] border border-white/15 rounded hover:bg-[#1E293B] transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Spec</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Split View: Monospace Editor with Gutter + Live Typeset View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Code Editor Panel */}
              <div className="bg-[#090D16] border border-white/10 rounded flex flex-col overflow-hidden">
                <div className="px-3 py-2 bg-[#0F172A] border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>
                    {specMode === 'markdown' ? `${course.code}-Syllabus.md` : `${course.code}-Spec.tex`}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">Monospace Raw</span>
                </div>
                <div className="p-3 flex font-mono text-xs leading-relaxed overflow-x-auto min-h-[360px]">
                  {/* Line Numbers Gutter */}
                  <div className="select-none text-slate-600 pr-3 border-r border-white/5 text-right font-mono text-[11px] space-y-1">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={specMode === 'markdown' ? course.descriptionMarkdown : course.latexAbstract}
                    onChange={(e) => {
                      if (specMode === 'markdown') {
                        onUpdateCourse({ ...course, descriptionMarkdown: e.target.value });
                      } else {
                        onUpdateCourse({ ...course, latexAbstract: e.target.value });
                      }
                    }}
                    disabled={isReadOnly}
                    className="w-full pl-3 bg-transparent text-slate-200 font-mono text-xs resize-none focus:outline-none min-h-[360px]"
                    rows={18}
                  />
                </div>
              </div>

              {/* Live Academic Typeset Preview */}
              <div className="bg-[#0F172A] border border-white/10 rounded flex flex-col overflow-hidden">
                <div className="px-3 py-2 bg-[#131b2e] border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-indigo-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Typeset Preview</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Synced</span>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto text-xs text-slate-200 max-h-[420px]">
                  <div className="border-b border-white/10 pb-2">
                    <div className="text-[10px] font-mono uppercase text-indigo-400">Course Syllabus Specification</div>
                    <h3 className="font-['Hanken_Grotesk'] text-base font-bold text-white mt-0.5">
                      {course.code}: {course.title}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      {course.credits.total}.0 Credits (Lecture: {course.credits.lecture}, Lab: {course.credits.lab})
                    </div>
                  </div>

                  <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                    <h4 className="text-xs font-mono uppercase text-slate-400">Curricular Summary</h4>
                    <p className="whitespace-pre-line bg-[#090D16] p-3 rounded border border-white/5 font-mono text-[11px]">
                      {course.descriptionMarkdown}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <h4 className="text-xs font-mono uppercase text-slate-400">Course Prerequisites</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {course.prerequisites.map((p) => (
                        <span key={p.code} className="font-mono text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                          {p.code} (Min: {p.minimumGrade})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
