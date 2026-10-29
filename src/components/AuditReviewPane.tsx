/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  MessageSquare,
  Send,
  GitCommit,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Course, Role, ReviewComment } from '../types/curriculum';

interface AuditReviewPaneProps {
  course: Course;
  currentRole: Role;
  onUpdateCourse: (updated: Course) => void;
  onShowToast: (msg: string) => void;
}

export const AuditReviewPane: React.FC<AuditReviewPaneProps> = ({
  course,
  currentRole,
  onUpdateCourse,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'abet' | 'diagnostics' | 'diff' | 'comments'>('abet');
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<string>(
    course.versionHistory[0]?.version || 'v1.4 (Current Draft)'
  );
  const [isDiffExpanded, setIsDiffExpanded] = useState(true);

  // Add a review comment
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const comment: ReviewComment = {
      id: `com-${Date.now()}`,
      authorName:
        currentRole === 'Author'
          ? 'Prof. Eric Vance'
          : currentRole === 'Reviewer'
          ? 'Dr. Sarah Vance'
          : 'Dean Marcus Hayes',
      role: currentRole,
      avatar: currentRole === 'Author' ? 'EV' : currentRole === 'Reviewer' ? 'SV' : 'MH',
      timestamp: 'Just now',
      section: 'General Specification',
      content: newCommentText,
      resolved: false,
    };
    onUpdateCourse({
      ...course,
      comments: [comment, ...course.comments],
    });
    setNewCommentText('');
    onShowToast(`Comment posted as ${currentRole}`);
  };

  const handleToggleResolve = (commentId: string) => {
    const updated = course.comments.map((c) =>
      c.id === commentId ? { ...c, resolved: !c.resolved } : c
    );
    onUpdateCourse({ ...course, comments: updated });
  };

  // Role Workflow Actions
  const handleSubmitForReview = () => {
    onUpdateCourse({ ...course, status: 'Under Review' });
    onShowToast('Specification submitted for peer audit');
  };

  const handleReviewerApprove = () => {
    onUpdateCourse({ ...course, status: 'Under Review' });
    onShowToast('Peer review audit checklist approved');
  };

  const handleHODRatify = () => {
    onUpdateCourse({
      ...course,
      status: 'Accredited',
      accreditationCycle: 'ABET 2026 Ratified',
      lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    });
    onShowToast('Accreditation ratified and curriculum frozen by Head of Department');
  };

  // Fix warning suggestion
  const handleResolveCheck = (checkId: string) => {
    const updatedChecks = course.auditChecks.map((chk) => {
      if (chk.id === checkId) {
        return {
          ...chk,
          status: 'pass' as const,
          description: 'Protobuf & gRPC contract definitions successfully mapped.',
        };
      }
      return chk;
    });
    onUpdateCourse({ ...course, auditChecks: updatedChecks });
    onShowToast('Curriculum check resolved: gRPC / protobuf standard verified');
  };

  return (
    <aside className="w-[340px] shrink-0 bg-[#0F172A] border-l border-white/10 flex flex-col h-[calc(100vh-3rem)] select-none">
      {/* Pane Navigation Header */}
      <div className="p-2 border-b border-white/10 bg-[#0B0F19]/60 shrink-0">
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#090D16] rounded border border-white/10">
          <button
            onClick={() => setActiveTab('abet')}
            className={`py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap text-center ${
              activeTab === 'abet'
                ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ABET
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap text-center ${
              activeTab === 'diagnostics'
                ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Checks
          </button>
          <button
            onClick={() => setActiveTab('diff')}
            className={`py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap text-center ${
              activeTab === 'diff'
                ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Diff
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`py-1 text-[11px] font-medium rounded transition-colors whitespace-nowrap text-center relative ${
              activeTab === 'comments'
                ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Feed</span>
            {course.comments.filter((c) => !c.resolved).length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1.5" />
            )}
          </button>
        </div>
      </div>

      {/* Pane Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Tab 1: ABET Criterion 3 Matrix */}
        {activeTab === 'abet' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                ABET Criterion 3 (SO 1–7)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                88% Avg Coverage
              </span>
            </div>

            <div className="space-y-2">
              {course.abetOutcomes.map((outcome) => (
                <div
                  key={outcome.id}
                  className="p-2.5 bg-[#090D16] border border-white/5 rounded space-y-1.5 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-300">
                      {outcome.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        outcome.status === 'passed'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {outcome.coveragePercentage}%
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-200 font-medium leading-snug">
                    {outcome.name}
                  </p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {outcome.shortDescription}
                  </p>

                  {/* Coverage meter */}
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        outcome.status === 'passed' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${outcome.coveragePercentage}%` }}
                    />
                  </div>

                  {/* Mapped syllabus items */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {outcome.mappedItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono text-slate-400 bg-white/5 px-1 py-0.2 rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Curricular Diagnostics & Invariants */}
        {activeTab === 'diagnostics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Specification Audit Checks
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {course.auditChecks.filter((c) => c.status === 'pass').length} /{' '}
                {course.auditChecks.length} Passed
              </span>
            </div>

            <div className="space-y-2">
              {course.auditChecks.map((check) => (
                <div
                  key={check.id}
                  className={`p-2.5 rounded border space-y-1.5 ${
                    check.status === 'pass'
                      ? 'bg-[#090D16] border-emerald-500/20'
                      : check.status === 'warn'
                      ? 'bg-amber-950/20 border-amber-500/30'
                      : 'bg-rose-950/20 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      {check.status === 'pass' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="text-xs font-semibold text-white leading-snug">
                        {check.title}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {check.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500 border-t border-white/5">
                    <span>{check.criterion}</span>
                    {check.status === 'warn' && (
                      <button
                        onClick={() => handleResolveCheck(check.id)}
                        className="text-amber-300 hover:text-white underline"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Version Diff */}
        {activeTab === 'diff' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Specification Version Tree
              </span>
              <span className="text-[10px] font-mono text-indigo-400">Git Synced</span>
            </div>

            {/* Version Selector */}
            <div className="space-y-1.5">
              {course.versionHistory.map((ver) => (
                <div
                  key={ver.version}
                  onClick={() => setSelectedVersion(ver.version)}
                  className={`p-2 rounded cursor-pointer border text-xs transition-colors ${
                    selectedVersion === ver.version
                      ? 'bg-[#1E293B] border-[#6366F1]'
                      : 'bg-[#090D16] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-[11px]">
                      {ver.version}
                    </span>
                    <span className="font-mono text-slate-500 text-[10px]">{ver.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">{ver.summary}</p>
                </div>
              ))}
            </div>

            {/* Unified Diff View */}
            <div className="bg-[#090D16] border border-white/10 rounded overflow-hidden">
              <div className="px-3 py-1.5 bg-[#131b2e] border-b border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1.5">
                  <GitCommit className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Unified Invariant Diff</span>
                </div>
                <button
                  onClick={() => setIsDiffExpanded(!isDiffExpanded)}
                  className="text-slate-400 hover:text-white"
                >
                  {isDiffExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {isDiffExpanded && (
                <pre className="p-3 font-mono text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
                  {course.versionHistory.find((v) => v.version === selectedVersion)?.diffSnippet ||
                    '+ No changes in selected snapshot'}
                </pre>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Reviewer Feed & Comments */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Curricular Review Feed
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {course.comments.length} comments
              </span>
            </div>

            {/* Post comment input */}
            <div className="space-y-1.5 bg-[#090D16] p-2.5 rounded border border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Commenting as:</span>
                <span className="text-indigo-300 font-semibold">{currentRole}</span>
              </div>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Add peer critique or accreditation annotation..."
                className="w-full h-16 p-2 text-xs bg-[#0F172A] border border-white/10 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#6366F1] resize-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleAddComment}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded"
                >
                  <Send className="w-3 h-3" />
                  <span>Post</span>
                </button>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-2.5">
              {course.comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-2.5 rounded border space-y-1.5 ${
                    c.resolved ? 'bg-[#090D16]/50 border-white/5 opacity-70' : 'bg-[#090D16] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-indigo-900/80 border border-indigo-500/30 flex items-center justify-center font-mono text-[9px] font-bold text-indigo-200">
                        {c.avatar}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white">{c.authorName}</span>
                        <span className="text-[10px] font-mono text-indigo-400 ml-1.5">
                          ({c.role})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{c.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{c.content}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                    <span className="text-slate-500 font-mono">{c.section}</span>
                    <button
                      onClick={() => handleToggleResolve(c.id)}
                      className="text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {c.resolved ? (
                        <span className="text-emerald-400 font-mono">✓ Resolved</span>
                      ) : (
                        <span>Mark Resolved</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pane Footer: Role Action Trigger */}
      <div className="p-3 border-t border-white/10 bg-[#0B0F19]/80 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Active Role Action:</span>
          <span className="text-indigo-300 font-semibold">{currentRole} Mode</span>
        </div>

        {currentRole === 'Author' && (
          <button
            onClick={handleSubmitForReview}
            className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] rounded shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Spec for Faculty Audit</span>
          </button>
        )}

        {currentRole === 'Reviewer' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleReviewerApprove}
              className="h-8 flex items-center justify-center gap-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 hover:bg-emerald-900/60 rounded"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve Spec</span>
            </button>
            <button
              onClick={() => onShowToast('Revision notes sent to lead author')}
              className="h-8 flex items-center justify-center gap-1 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-500/30 hover:bg-amber-900/60 rounded"
            >
              <span>Request Edit</span>
            </button>
          </div>
        )}

        {currentRole === 'HOD' && (
          <button
            onClick={handleHODRatify}
            className="w-full h-8 flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow-xs font-semibold"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ratify into 2026 Academic Catalogue</span>
          </button>
        )}
      </div>
    </aside>
  );
};
