/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Course, Role, Screen, WorkstationSettings } from './types/curriculum';
import { sampleCourses, defaultSettings } from './data/sampleCurriculum';
import { HeaderChrome } from './components/HeaderChrome';
import { CurriculumTree } from './components/CurriculumTree';
import { CourseEditor } from './components/CourseEditor';
import { AuditReviewPane } from './components/AuditReviewPane';
import { UploadScreen } from './components/UploadScreen';
import { NewCourseModal } from './components/NewCourseModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('builder');
  const [currentRole, setCurrentRole] = useState<Role>('Author');
  const [courses, setCourses] = useState<Course[]>(sampleCourses);
  const [activeCourseId, setActiveCourseId] = useState<string>('course-cs301');
  const [settings, setSettings] = useState<WorkstationSettings>(defaultSettings);

  // Modals state
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0];

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c))
    );
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setActiveCourseId(newCourse.id);
    showToast(`Added ${newCourse.code} to curriculum hierarchy`);
  };

  const handleImportCourseFromUpload = (ingestedCourse: Course) => {
    // Check if course already exists by code
    const existingIndex = courses.findIndex((c) => c.code === ingestedCourse.code);
    if (existingIndex >= 0) {
      setCourses((prev) => {
        const copy = [...prev];
        copy[existingIndex] = ingestedCourse;
        return copy;
      });
      setActiveCourseId(ingestedCourse.id);
    } else {
      setCourses((prev) => [ingestedCourse, ...prev]);
      setActiveCourseId(ingestedCourse.id);
    }
    setCurrentScreen('builder');
  };

  const handleTriggerAudit = () => {
    showToast(`Re-evaluating ABET Criterion 3 invariants for ${activeCourse.code}... Complete.`);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#dae2fd] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* 48px Header Chrome */}
      <HeaderChrome
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          showToast(`Switched workstation perspective to ${role}`);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportBundle={() => setIsExportOpen(true)}
        activeCourseCode={activeCourse?.code || 'CS-301'}
      />

      {/* Screen 1: Course Specification Builder — Initial Screen */}
      {currentScreen === 'builder' && (
        <main className="flex-1 flex overflow-hidden">
          {/* Left: Curriculum Hierarchy Tree (280px) */}
          <CurriculumTree
            courses={courses}
            activeCourseId={activeCourse.id}
            onSelectCourse={setActiveCourseId}
            onAddNewCourse={() => setIsNewCourseOpen(true)}
            programTitle={settings.programTitle}
          />

          {/* Center: Central Specification Editor & Rubric Builder */}
          <CourseEditor
            course={activeCourse}
            currentRole={currentRole}
            onUpdateCourse={handleUpdateCourse}
            onTriggerAudit={handleTriggerAudit}
            onNavigateToUpload={() => setCurrentScreen('upload')}
          />

          {/* Right: Accreditation Audit & Reviewer Feed (340px) */}
          <AuditReviewPane
            course={activeCourse}
            currentRole={currentRole}
            onUpdateCourse={handleUpdateCourse}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* Screen 2: SpecForge - Upload */}
      {currentScreen === 'upload' && (
        <UploadScreen
          onBackToBuilder={() => setCurrentScreen('builder')}
          onImportCourse={handleImportCourseFromUpload}
          onShowToast={showToast}
        />
      )}

      {/* Modals */}
      <NewCourseModal
        isOpen={isNewCourseOpen}
        onClose={() => setIsNewCourseOpen(false)}
        onAddCourse={handleAddCourse}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          showToast('Updated workstation preferences');
        }}
      />

      {activeCourse && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          course={activeCourse}
          onShowToast={showToast}
        />
      )}

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#1E293B] border border-[#6366F1] text-white text-xs px-3.5 py-2.5 rounded shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-[#3B49DF] shadow-[0_0_6px_#3B49DF]" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
