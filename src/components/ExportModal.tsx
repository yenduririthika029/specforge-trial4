/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { Course } from '../types/curriculum';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onShowToast: (msg: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  course,
  onShowToast,
}) => {
  const [exportFormat, setExportFormat] = useState<'yaml' | 'json' | 'tex' | 'markdown'>('yaml');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateExportText = (): string => {
    if (exportFormat === 'json') {
      return JSON.stringify(course, null, 2);
    }

    if (exportFormat === 'markdown') {
      return `# Course Specification: ${course.code} - ${course.title}
**Level:** ${course.level} | **Term:** ${course.term} | **Status:** ${course.status}
**Credits:** ${course.credits.total} (Lecture: ${course.credits.lecture}, Lab: ${course.credits.lab})
**Accreditation Cycle:** ${course.accreditationCycle}
**Author:** ${course.author}

${course.descriptionMarkdown}

## Prerequisites
${course.prerequisites.map((p) => `- **${p.code}**: ${p.title} (Min Grade: ${p.minimumGrade}, ${p.type})`).join('\n')}

## Syllabus Modules
${course.modules
  .map(
    (m) =>
      `### Chapter ${m.chapterNumber}: ${m.title} (${m.weeks})
- **Contact Hours:** ${m.lectureHours}h Lecture, ${m.labHours}h Lab
- **Learning Outcomes:** ${m.learningOutcomes.join('; ')}
- **Required Tools:** ${m.requiredTools.join(', ')}`
  )
  .join('\n\n')}

## Assessment Rubric
${course.rubric.map((r) => `- **${r.category}** (${r.weight}%): ${r.description} [${r.abetOutcomes.join(', ')}]`).join('\n')}
`;
    }

    if (exportFormat === 'tex') {
      return `% Faculty Senate TeX Master Specification
\\documentclass[11pt,a4paper]{article}
\\title{Course Specification: ${course.code} ${course.title}}
\\author{${course.author}}
\\date{${course.accreditationCycle}}
\\begin{document}
\\maketitle
${course.latexAbstract}

\\section{Curricular Details}
Total Credits: ${course.credits.total.toFixed(1)} Carnegie Units.
Lecture Hours: ${course.credits.lecture}, Lab Hours: ${course.credits.lab}.

\\section{Prerequisite Graph}
\\begin{itemize}
${course.prerequisites.map((p) => `  \\item \\textbf{${p.code}:} ${p.title} (Min Grade: ${p.minimumGrade})`).join('\n')}
\\end{itemize}

\\section{Syllabus Chapters}
${course.modules
  .map(
    (m) => `\\subsection{Chapter ${m.chapterNumber}: ${m.title}}
Weeks: ${m.weeks}. Lecture: ${m.lectureHours}h, Lab: ${m.labHours}h.`
  )
  .join('\n\n')}

\\end{document}`;
    }

    // Default: YAML
    return `# SpecForge Course Specification Schema v2.4
code: "${course.code}"
title: "${course.title}"
level: "${course.level}"
term: ${course.term}
track: "${course.track}"
status: "${course.status}"
accreditation_cycle: "${course.accreditationCycle}"
credits:
  lecture: ${course.credits.lecture}
  lab: ${course.credits.lab}
  recitation: ${course.credits.recitation}
  total: ${course.credits.total}

prerequisites:
${course.prerequisites.map((p) => `  - code: "${p.code}"\n    title: "${p.title}"\n    min_grade: "${p.minimumGrade}"\n    type: "${p.type}"`).join('\n')}

modules:
${course.modules
  .map(
    (m) => `  - chapter: ${m.chapterNumber}
    title: "${m.title}"
    weeks: "${m.weeks}"
    lecture_hours: ${m.lectureHours}
    lab_hours: ${m.labHours}
    learning_outcomes:
${m.learningOutcomes.map((lo) => `      - "${lo}"`).join('\n')}
    required_tools:
${m.requiredTools.map((t) => `      - "${t}"`).join('\n')}`
  )
  .join('\n')}

rubric:
${course.rubric.map((r) => `  - category: "${r.category}"\n    weight: ${r.weight}\n    delivery_week: "${r.deliveryWeek}"\n    abet_outcomes: [${r.abetOutcomes.map((o) => `"${o}"`).join(', ')}]`).join('\n')}
`;
  };

  const exportText = generateExportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('Specification copied to clipboard');
  };

  const handleDownload = () => {
    const ext = exportFormat === 'yaml' ? 'yaml' : exportFormat === 'json' ? 'json' : exportFormat === 'tex' ? 'tex' : 'md';
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${course.code}-Specification.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${course.code}-Specification.${ext}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-4 py-3 bg-[#131b2e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white font-['Hanken_Grotesk']">
              Export Specification Bundle: {course.code}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* Format Selector */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-slate-400 uppercase text-[11px]">
              Select Target Format
            </span>
            <div className="flex items-center bg-[#090D16] p-0.5 rounded border border-white/10">
              {(['yaml', 'json', 'tex', 'markdown'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`px-3 py-1 font-mono uppercase text-[10px] rounded transition-colors ${
                    exportFormat === fmt
                      ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Box */}
          <div className="bg-[#090D16] border border-white/10 rounded overflow-hidden">
            <pre className="p-3 text-[11px] font-mono leading-relaxed text-slate-200 max-h-[300px] overflow-y-auto">
              {exportText}
            </pre>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Ready for ABET repository commit or faculty distribution
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#1E293B] border border-white/10 rounded hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Spec'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Specification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
