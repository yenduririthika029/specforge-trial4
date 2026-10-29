/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sliders, Shield, BookMarked, Save } from 'lucide-react';
import { WorkstationSettings } from '../types/curriculum';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WorkstationSettings;
  onSaveSettings: (settings: WorkstationSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<WorkstationSettings>(settings);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-white/15 rounded max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-4 py-3 bg-[#131b2e] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white font-['Hanken_Grotesk']">
              Curricular Workstation Preferences
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
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Institutional Faculty</label>
            <input
              type="text"
              value={form.institutionName}
              onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
              className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Accreditation Mandate Standard</label>
            <select
              value={form.accreditationStandard}
              onChange={(e) => setForm({ ...form, accreditationStandard: e.target.value as any })}
              className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200"
            >
              <option value="ABET EAC 2026">ABET EAC 2026 (Engineering Accreditation Commission)</option>
              <option value="ACM/IEEE CS2023">ACM/IEEE-CS Computer Science Curricula 2023</option>
              <option value="Washington Accord">Washington Accord International Standard</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-slate-400">Credit Hour Metric Model</label>
            <select
              value={form.creditHourStandard}
              onChange={(e) => setForm({ ...form, creditHourStandard: e.target.value as any })}
              className="w-full h-8 px-2.5 bg-[#090D16] border border-white/10 rounded text-slate-200"
            >
              <option value="Carnegie Unit (3:1)">Carnegie Unit (1 Credit = 1hr Lecture or 2-3hr Lab/wk)</option>
              <option value="ECTS (25-30 hrs)">European Credit Transfer System (ECTS)</option>
              <option value="Quarter System">Quarter Term Contact Units</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="enforcePrereq"
              checked={form.enforcePrereqStrictness}
              onChange={(e) => setForm({ ...form, enforcePrereqStrictness: e.target.checked })}
              className="w-4 h-4 rounded bg-[#090D16] border-white/20 text-[#3B49DF] focus:ring-0"
            />
            <label htmlFor="enforcePrereq" className="text-slate-300 cursor-pointer">
              Strictly prevent circular references and missing prerequisite registration
            </label>
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
              <Save className="w-3.5 h-3.5" />
              <span>Apply Workstation Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
