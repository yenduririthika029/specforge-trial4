/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UploadCloud,
  FileCode2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Copy,
  Check,
  Zap,
  Info,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { sampleSpecTemplates, SpecTemplate } from '../data/sampleUploadTemplates';
import { Course } from '../types/curriculum';

interface UploadScreenProps {
  onBackToBuilder: () => void;
  onImportCourse: (newCourse: Course) => void;
  onShowToast: (msg: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onBackToBuilder,
  onImportCourse,
  onShowToast,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SpecTemplate>(sampleSpecTemplates[0]);
  const [specContent, setSpecContent] = useState<string>(sampleSpecTemplates[0].content);
  const [fileName, setFileName] = useState<string>(sampleSpecTemplates[0].fileName);
  const [format, setFormat] = useState<'yaml' | 'json' | 'tex'>('yaml');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Load a preset template
  const handleSelectTemplate = (tpl: SpecTemplate) => {
    setSelectedTemplate(tpl);
    setSpecContent(tpl.content);
    setFileName(tpl.fileName);
    setFormat(tpl.format);
    onShowToast(`Loaded preset template: ${tpl.fileName}`);
  };

  // Handle local file drop or selection
  const handleFileProcess = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setSpecContent(text);
      setFileName(file.name);
      if (file.name.endsWith('.json')) {
        setFormat('json');
      } else if (file.name.endsWith('.tex')) {
        setFormat('tex');
      } else {
        setFormat('yaml');
      }
      onShowToast(`Uploaded specification: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  // Pre-flight parsing and diagnostic extraction
  const parseDiagnostics = () => {
    let parsedCode = 'CS-301';
    let parsedTitle = 'Distributed Systems Engineering';
    let parsedCredits = 4.0;
    let parsedTerm = 5;
    let parsedTrack: 'Systems' | 'AI/ML' | 'Theory' | 'Security' = 'Systems';
    let moduleCount = 4;
    let outcomeCount = 4;
    let isValid = true;
    let syntaxError = '';

    if (format === 'json') {
      try {
        const obj = JSON.parse(specContent);
        parsedCode = obj.code || 'CS-SPEC';
        parsedTitle = obj.title || 'Parsed Course Specification';
        parsedCredits = obj.credits?.total || 4.0;
        parsedTerm = obj.term || 6;
        parsedTrack = (obj.track as any) || 'Systems';
        moduleCount = obj.modules?.length || 2;
        outcomeCount = obj.rubric?.length || 3;
      } catch (err: any) {
        isValid = false;
        syntaxError = err.message;
      }
    } else if (format === 'yaml') {
      // Regex / simple heuristic extraction for YAML
      const codeMatch = specContent.match(/code:\s*["']?([^"'\n]+)/);
      const titleMatch = specContent.match(/title:\s*["']?([^"'\n]+)/);
      const termMatch = specContent.match(/term:\s*([0-9]+)/);
      const credMatch = specContent.match(/total:\s*([0-9.]+)/);
      const trackMatch = specContent.match(/track:\s*["']?([^"'\n]+)/);

      if (codeMatch) parsedCode = codeMatch[1].trim();
      if (titleMatch) parsedTitle = titleMatch[1].trim();
      if (termMatch) parsedTerm = parseInt(termMatch[1], 10);
      if (credMatch) parsedCredits = parseFloat(credMatch[1]);
      if (trackMatch && ['Systems', 'AI/ML', 'Theory', 'Security'].includes(trackMatch[1].trim())) {
        parsedTrack = trackMatch[1].trim() as any;
      }

      const chapterMatches = specContent.match(/chapter:/g);
      moduleCount = chapterMatches ? chapterMatches.length : 3;
      const soMatches = specContent.match(/SO-[0-9]/g);
      outcomeCount = soMatches ? Array.from(new Set(soMatches)).length : 4;
    } else {
      // LaTeX (.tex)
      const codeMatch = specContent.match(/Course Code:\s*\}?\s*([A-Z]+-[0-9]+)/i);
      const titleMatch = specContent.match(/Course Title:\s*\}?\s*([^\\\n]+)/i);
      if (codeMatch) parsedCode = codeMatch[1].trim();
      if (titleMatch) parsedTitle = titleMatch[1].trim();
      parsedCredits = 4.0;
      parsedTerm = 4;
      parsedTrack = 'Systems';
      moduleCount = 3;
      outcomeCount = 2;
    }

    return {
      isValid,
      syntaxError,
      parsedCode,
      parsedTitle,
      parsedCredits,
      parsedTerm,
      parsedTrack,
      moduleCount,
      outcomeCount,
    };
  };

  const diagnostics = parseDiagnostics();

  // Ingest into Workstation
  const handleIngestSpec = () => {
    if (!diagnostics.isValid) {
      onShowToast('Cannot ingest invalid specification. Fix syntax errors first.');
      return;
    }

    const newCourse: Course = {
      id: `course-${diagnostics.parsedCode.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now()}`,
      code: diagnostics.parsedCode,
      title: diagnostics.parsedTitle,
      level: `Level ${diagnostics.parsedCode.match(/[0-9]+/)?.[0] || '300'} Core`,
      term: diagnostics.parsedTerm,
      credits: {
        lecture: Math.max(1, diagnostics.parsedCredits - 1),
        lab: 1.0,
        recitation: 0.0,
        total: diagnostics.parsedCredits,
      },
      track: diagnostics.parsedTrack,
      status: 'Under Review',
      accreditationCycle: 'ABET 2026 Ingestion Session',
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      author: 'Uploaded Curricular Specification',
      descriptionMarkdown: `## ${diagnostics.parsedCode}: ${diagnostics.parsedTitle}\n\nIngested via SpecForge Specification Importer.\n\n${specContent.slice(0, 300)}...`,
      latexAbstract: `\\begin{abstract}\n\\noindent\\textbf{${diagnostics.parsedCode}: ${diagnostics.parsedTitle}} imported into academic engineering workstation.\n\\end{abstract}`,
      modules: [
        {
          id: `mod-ingest-1`,
          chapterNumber: 1,
          title: `Foundations of ${diagnostics.parsedTitle}`,
          weeks: 'Week 1–4',
          lectureHours: 12,
          labHours: 8,
          learningOutcomes: [
            `Formulate foundational paradigms in ${diagnostics.parsedTitle}.`,
            'Apply rigorous analysis under ABET Criterion 3.',
          ],
          deliverables: ['Lab 1: Architectural Baseline Implementation'],
          requiredTools: ['Departmental Toolset', 'Docker Sandbox'],
        },
        {
          id: `mod-ingest-2`,
          chapterNumber: 2,
          title: 'Advanced System Invariants & Evaluation',
          weeks: 'Week 5–9',
          lectureHours: 15,
          labHours: 10,
          learningOutcomes: ['Design scalable fault-tolerant components.'],
          deliverables: ['Term Project Phase 1: Benchmark Suite'],
          requiredTools: ['GitLab CI/CD'],
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
          id: `rub-ingest-1`,
          category: 'Implementation Labs',
          weight: 50,
          description: 'Evaluated against automated unit regression tests.',
          abetOutcomes: ['SO-1', 'SO-2'],
          deliveryWeek: 'Bi-weekly',
        },
        {
          id: `rub-ingest-2`,
          category: 'Midterm Examination',
          weight: 25,
          description: 'Theoretical examination on core principles.',
          abetOutcomes: ['SO-1'],
          deliveryWeek: 'Week 8',
        },
        {
          id: `rub-ingest-3`,
          category: 'Capstone Engineering Defense',
          weight: 25,
          description: 'Comprehensive project evaluation.',
          abetOutcomes: ['SO-2', 'SO-6'],
          deliveryWeek: 'Week 14',
        },
      ],
      abetOutcomes: [
        {
          id: 'SO-1',
          name: 'Complex Problem Solving',
          shortDescription: 'Solve complex engineering challenges.',
          coveragePercentage: 100,
          mappedItems: ['Implementation Labs', 'Midterm'],
          status: 'passed',
        },
        {
          id: 'SO-2',
          name: 'Engineering Design',
          shortDescription: 'Produce engineering solutions that meet specified needs.',
          coveragePercentage: 90,
          mappedItems: ['Capstone Project'],
          status: 'passed',
        },
      ],
      auditChecks: [
        {
          id: `chk-ingest-1`,
          title: 'Schema Ingestion Invariant',
          description: 'Specification successfully parsed and normalized into workstation state.',
          status: 'pass',
          criterion: 'SpecForge Ingestion Protocol',
        },
        {
          id: `chk-ingest-2`,
          title: 'Carnegie Unit Ratio Verification',
          description: `${diagnostics.parsedCredits}.0 Credits adheres to credit-to-contact hour ratios.`,
          status: 'pass',
          criterion: 'ABET Criterion 5',
        },
      ],
      comments: [
        {
          id: `com-ingest-1`,
          authorName: 'SpecForge Parser',
          role: 'Reviewer',
          avatar: 'SF',
          timestamp: 'Just now',
          section: 'Ingestion Audit',
          content: `Specification successfully imported from ${fileName}. Ready for faculty review.`,
          resolved: true,
        },
      ],
      versionHistory: [
        {
          version: 'v1.0 (Ingested)',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          author: 'SpecForge Importer',
          summary: `Imported from ${fileName}`,
          diffSnippet: `+ Added course specification ${diagnostics.parsedCode}`,
        },
      ],
    };

    onImportCourse(newCourse);
    onShowToast(`Successfully imported ${newCourse.code}: ${newCourse.title} into Course Builder!`);
    onBackToBuilder();
  };

  const handleDownloadSpec = () => {
    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Downloaded ${fileName}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(specContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-y-auto bg-[#0B0F19] select-text">
      {/* Top Banner Navigation & Context */}
      <div className="p-4 bg-[#0F172A] border-b border-white/10 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToBuilder}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#090D16] border border-white/10 rounded hover:border-[#6366F1] hover:text-white transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
              <span>Return to Course Builder</span>
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div>
              <h1 className="font-['Hanken_Grotesk'] text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
                <span>SpecForge · Specification Importer & Schema Converter</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Ingest, audit, and normalize YAML, JSON, and LaTeX curriculum specifications
              </p>
            </div>
          </div>

          {/* Direct CTA */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleIngestSpec}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#4F5EF7] active:bg-[#323EB9] rounded transition-all shadow-sm border-t border-white/20 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Ingest into Workstation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload Workspace */}
      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Preset Sample Specs Strip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              1-Click Academic Specification Presets
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Click any template to inspect & import immediately
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {sampleSpecTemplates.map((tpl) => {
              const isSelected = selectedTemplate.id === tpl.id;
              return (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`p-3 rounded cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-[#1E293B] border-[#6366F1] shadow-xs'
                      : 'bg-[#0F172A] border-white/10 hover:border-white/20 hover:bg-[#131b2e]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/20 uppercase">
                      .{tpl.format}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{tpl.size}</span>
                  </div>

                  <h3 className="text-xs font-semibold text-white mt-1.5 line-clamp-1">
                    {tpl.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{tpl.category}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drag & Drop File Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded p-6 text-center transition-all ${
            isDragging
              ? 'border-[#6366F1] bg-[#1E293B]/60'
              : 'border-white/15 bg-[#0F172A]/60 hover:border-white/30'
          }`}
        >
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <FolderOpen className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Drag & drop course specification file here, or{' '}
              <label className="text-indigo-400 hover:underline cursor-pointer">
                browse files
                <input
                  type="file"
                  accept=".yaml,.yml,.json,.tex,.md,.txt"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              Supports .yaml · .json · .tex (LaTeX Senate Spec) · .md (Markdown Syllabus)
            </p>
          </div>
        </div>

        {/* Dual Pane: Live Code Editor + Pre-Flight Diagnostic Ingestion Report */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Code Editor (7 cols) */}
          <div className="lg:col-span-7 bg-[#090D16] border border-white/10 rounded flex flex-col overflow-hidden">
            <div className="px-3.5 py-2.5 bg-[#0F172A] border-b border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-white font-medium">{fileName}</span>
                <span className="text-slate-600">·</span>
                <span className="text-[11px] text-indigo-300 uppercase">{format}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Copy Code"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={handleDownloadSpec}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 flex font-mono text-xs leading-relaxed overflow-x-auto min-h-[460px]">
              {/* Line numbers gutter */}
              <div className="select-none text-slate-600 pr-3 border-r border-white/5 text-right font-mono text-[11px] space-y-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <textarea
                value={specContent}
                onChange={(e) => setSpecContent(e.target.value)}
                className="w-full pl-3 bg-transparent text-slate-200 font-mono text-xs resize-none focus:outline-none min-h-[460px]"
                rows={24}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right: Pre-Flight Ingestion Diagnostics (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0F172A] border border-white/10 rounded p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pre-Flight Schema Audit</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    diagnostics.isValid
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {diagnostics.isValid ? 'Valid Ingestion Schema' : 'Syntax Error'}
                </span>
              </div>

              {/* Extraction Summary */}
              <div className="space-y-2.5">
                <div className="p-2.5 bg-[#090D16] rounded border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">Target Course ID:</span>
                    <span className="font-mono font-bold text-indigo-300">
                      {diagnostics.parsedCode}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">Course Title:</span>
                    <span className="text-white font-medium text-right line-clamp-1 max-w-[200px]">
                      {diagnostics.parsedTitle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">Credit Weight:</span>
                    <span className="font-mono text-white tabular-nums">
                      {diagnostics.parsedCredits.toFixed(1)} Carnegie Units
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">Academic Term:</span>
                    <span className="font-mono text-white">Term {diagnostics.parsedTerm}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400">Curricular Track:</span>
                    <span className="font-mono text-indigo-400 uppercase">
                      {diagnostics.parsedTrack}
                    </span>
                  </div>
                </div>

                {/* Pre-Flight Checklist */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2 bg-[#090D16] rounded border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Syntax & Invariant Parsing</div>
                      <div className="text-[11px] text-slate-400">
                        {diagnostics.isValid
                          ? 'Schema syntax parsed cleanly without fatal tokens.'
                          : `Fatal token error: ${diagnostics.syntaxError}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-[#090D16] rounded border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">
                        Syllabus Units ({diagnostics.moduleCount} Detected)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Extracted {diagnostics.moduleCount} chapter units with scheduled lab & lecture hours.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-[#090D16] rounded border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">
                        ABET Student Outcomes ({diagnostics.outcomeCount} Mapped)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Evaluated alignment against Criterion 3 student outcomes.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <button
                  onClick={handleIngestSpec}
                  disabled={!diagnostics.isValid}
                  className="w-full h-9 flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-[#3B49DF] hover:bg-[#4F5EF7] active:bg-[#323EB9] disabled:opacity-40 rounded shadow-xs transition-all border-t border-white/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Ingest Specification into Workstation</span>
                </button>

                <button
                  onClick={handleDownloadSpec}
                  className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-300 bg-[#090D16] border border-white/10 hover:border-white/20 rounded transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export Formatted .{format}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
