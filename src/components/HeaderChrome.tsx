/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  UploadCloud,
  FileCode2,
  Sliders,
  Download,
  ShieldCheck,
  Building2,
  GitBranch,
} from 'lucide-react';
import { Role, Screen } from '../types/curriculum';

interface HeaderChromeProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onOpenSettings: () => void;
  onExportBundle: () => void;
  activeCourseCode: string;
}

export const HeaderChrome: React.FC<HeaderChromeProps> = ({
  currentScreen,
  onNavigate,
  currentRole,
  onRoleChange,
  onOpenSettings,
  onExportBundle,
  activeCourseCode,
}) => {
  const roles: Role[] = ['Author', 'Reviewer', 'HOD'];

  return (
    <header className="h-12 w-full bg-[#0F172A] border-b border-white/10 px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Zone 1: Brand & Institutional Context */}
      <div className="flex items-center gap-6 shrink-0">
        <button
          onClick={() => onNavigate('builder')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
        >
          <div className="w-6 h-6 rounded bg-[#3B49DF] flex items-center justify-center text-white shadow-sm font-mono font-bold text-xs tracking-tighter">
            SF
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-['Hanken_Grotesk'] text-base font-bold text-white tracking-tight">
              SpecForge
            </span>
            <span className="text-[11px] font-mono text-indigo-300/80 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/20">
              v2.4
            </span>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 pl-4 border-l border-white/10">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium">Faculty of CS & Engineering</span>
          </div>
          <span className="text-slate-600">/</span>
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <GitBranch className="w-3 h-3 text-emerald-400" />
            <span>curriculum-2026.git</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation Screens & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Screen Tabs */}
        <div className="flex items-center bg-[#090D16] p-0.5 rounded border border-white/10">
          <button
            onClick={() => onNavigate('builder')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
              currentScreen === 'builder'
                ? 'bg-[#1E293B] text-white border border-[#6366F1] shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Course Builder</span>
            {currentScreen === 'builder' && (
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900/40 px-1 rounded">
                {activeCourseCode}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigate('upload')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
              currentScreen === 'upload'
                ? 'bg-[#1E293B] text-white border border-[#6366F1] shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Spec</span>
            <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-1 rounded">
              .yaml .json .tex
            </span>
          </button>
        </div>

        {/* Role Segmented Switcher */}
        <div className="hidden sm:flex items-center bg-[#090D16] p-0.5 rounded border border-white/10">
          <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-medium">
            Role
          </div>
          {roles.map((role) => {
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E293B] text-white border border-[#6366F1]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch workstation perspective to ${role}`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3B49DF] shadow-[0_0_6px_#3B49DF]" />
                )}
                <span>{role}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Zone 3: Actions & Settings */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onExportBundle}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-[#0F172A] border border-white/15 rounded hover:bg-[#1E293B] hover:border-[#6366F1] transition-all whitespace-nowrap"
          title="Export current course specification bundle"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Spec</span>
        </button>

        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-[#3B49DF] hover:bg-[#4F5EF7] active:bg-[#323EB9] rounded transition-all shadow-xs whitespace-nowrap border-t border-white/20"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Import Spec</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1E293B] rounded border border-transparent hover:border-white/10 transition-all"
          title="Curriculum Workstation Settings"
          aria-label="Settings"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
