/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'Author' | 'Reviewer' | 'HOD';

export type Screen = 'builder' | 'upload';

export interface ModuleUnit {
  id: string;
  chapterNumber: number;
  title: string;
  weeks: string;
  lectureHours: number;
  labHours: number;
  learningOutcomes: string[];
  deliverables: string[];
  requiredTools: string[];
}

export interface Prerequisite {
  code: string;
  title: string;
  credits: number;
  minimumGrade: string;
  type: 'hard' | 'soft' | 'corequisite';
  status: 'satisfied' | 'active' | 'missing';
}

export interface RubricItem {
  id: string;
  category: string;
  weight: number; // percentage, e.g. 25
  description: string;
  abetOutcomes: string[];
  deliveryWeek: string;
}

export interface ABETOutcome {
  id: string; // e.g. SO-1
  name: string;
  shortDescription: string;
  coveragePercentage: number;
  mappedItems: string[];
  status: 'passed' | 'warning' | 'deficient';
}

export interface AuditCheck {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warn' | 'error';
  criterion: string;
  fixSuggestion?: string;
}

export interface ReviewComment {
  id: string;
  authorName: string;
  role: Role;
  avatar: string;
  timestamp: string;
  section: string;
  content: string;
  resolved: boolean;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  level: string;
  term: number;
  credits: {
    lecture: number;
    lab: number;
    recitation: number;
    total: number;
  };
  track: 'Systems' | 'AI/ML' | 'Theory' | 'Security';
  status: 'Accredited' | 'Under Review' | 'Draft' | 'Needs Revision';
  accreditationCycle: string;
  lastModified: string;
  author: string;
  descriptionMarkdown: string;
  latexAbstract: string;
  modules: ModuleUnit[];
  prerequisites: Prerequisite[];
  rubric: RubricItem[];
  abetOutcomes: ABETOutcome[];
  auditChecks: AuditCheck[];
  comments: ReviewComment[];
  versionHistory: {
    version: string;
    date: string;
    author: string;
    summary: string;
    diffSnippet: string;
  }[];
}

export interface WorkstationSettings {
  accreditationStandard: 'ABET EAC 2026' | 'ACM/IEEE CS2023' | 'Washington Accord';
  creditHourStandard: 'Carnegie Unit (3:1)' | 'ECTS (25-30 hrs)' | 'Quarter System';
  academicYear: string;
  institutionName: string;
  programTitle: string;
  enforcePrereqStrictness: boolean;
}
