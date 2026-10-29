---
name: Academic Engineering Workstation
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c6c5d8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8f8fa1'
  outline-variant: '#454655'
  surface-tint: '#bdc2ff'
  primary: '#bdc2ff'
  on-primary: '#000fa3'
  primary-container: '#3b49df'
  on-primary-container: '#d2d4ff'
  inverse-primary: '#3c4ae0'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#006b49'
  on-tertiary-container: '#62efb3'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000668'
  on-primary-fixed-variant: '#1d2cc9'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  code-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies the calculated precision, focus, and structural integrity demanded by academic computer science and software engineering faculties. Designed primarily for complex curricular architecture, accreditation auditing, and specification modeling, the interface trades ornamental trends for disciplined ergonomic density. 

The aesthetic is characterized by an elevated dark-mode slate architecture, razor-sharp 1px micro-borders, and electric indigo focal points. Surfaces prioritize clear visual hierarchy and high data density, allowing course authors, peer reviewers, and department heads to audit prerequisites, map ABET/ACM competency matrices, and edit programmatic requirements without visual fatigue. The emotional cadence is sober, authoritative, high-bandwidth, and rigorously organized.

## Colors

The palette establishes an architectural dark environment calibrated for extended deep-work sessions under multi-monitor desktop configurations.

- **Primary (`#3B49DF`):** High-cadence technical cobalt. Reserved for affirmative calls to action, committed navigation states, active syllabus nodes, and primary interaction triggers.
- **Secondary (`#6366F1`):** Electric indigo. Deployed for interactive accents, active focus rings, secondary data badges, and relational dependency links.
- **Tertiary (`#10B981`):** Precision emerald. Applied strictly for validated accreditation checks, approved curriculum states, and passing test suites.
- **Neutral (`#0F172A`):** Deep abyssal slate. Formulates the foundational chassis.

### Surface Tiers
- **Canvas (`#0B0F19`):** Root application background.
- **Surface Low (`#0F172A`):** Workstation panels, structural drawers, and inactive containers.
- **Surface Mid (`#1E293B`):** Active card modules, form backgrounds, and interactive hover planes.
- **Surface High (`#334155`):** Popovers, dropdown menus, context tooltips, and elevated modal dialogues.

### Micro-Border Hierarchy
- **Subtle Stroke (`rgba(255, 255, 255, 0.07)`):** Grid lines, passive dividing rules, inactive inputs.
- **Structural Stroke (`rgba(255, 255, 255, 0.14)`):** Card borders, pane separators, table frame boundaries.
- **Focus / Active Stroke (`#6366F1`):** Active role selectors, focused syntax blocks, and selected specification items.

## Typography

The typographic hierarchy pairs the structured, geometric authority of **Hanken Grotesk** for display headers and programmatic section anchors with the ultra-clean, technical metric uniformity of **Geist** for body copy, schema descriptions, and metadata.

### Typographic Principles
- **Monospaced Numerical Alignment:** Tabular figures are enforced across all metadata counters, credit allocations, and course numbering structures.
- **Vertical Rhythm & Compact Sizing:** Line-height ratios are calibrated tightly (1.25 to 1.5) to maintain continuous vertical density during multi-column editing workflows.
- **Letter Spacing:** Headlines utilize slightly negative tracking to tighten display impact, while small technical labels incorporate slight positive tracking to preserve legibility against dark slate backdrops.

## Layout & Spacing

The workspace uses a dense, windowed grid layout designed for high-resolution desktop environments. The viewport utilizes a fixed-height layout model with modular, independent scrollable panels.

### Structural Scaffolding
- **Application Header Chrome:** Fixed 48px height (`h-12`) extending 100% width across the top canvas, encompassing institutional context, role switcher segment, and synchronized repository actions.
- **Primary Grid:** 12-column dynamic desktop layout with 16px (`1rem`) gutters and 24px (`1.5rem`) outer structural boundaries.
- **Panels & Drawers:** Three-column layout on wide screens:
  - Left navigation & curriculum tree: 280px fixed width.
  - Central specification editor & rubric builder: Flexible column (`minmax(640px, 1fr)`).
  - Right audit pane (ABET compliance, diff history, reviewer feed): 340px fixed width.

### Spacing Scale
Layout distance uses base 4 increments. Component padding strictly adheres to:
- `space-xs` (4px) for inline metadata tag gaps and chip icons.
- `space-sm` (8px) for compact list spacing, nested tree indents, and form element pairings.
- `space-md` (12px) for table cell interiors, card header insets, and toolbar gutters.
- `space-lg` (16px) for interior panel padding and component boundaries.
- `space-xl` (24px) for major modal insets and structural partition margins.

## Elevation & Depth

This system avoids expressive drop shadows in favor of **structural depth through tonal stratification and high-precision micro-borders**. Elevation signals layer hierarchy without sacrificing edge crispness.

### Elevation Levels
- **Level 0 (Base Canvas - `#0B0F19`):** Root background, gutters, and inactive canvas space.
- **Level 1 (Docked Panes - `#0F172A`):** Sidebars, main workspace cards, table row groupings. Framed with a 1px micro-border (`rgba(255, 255, 255, 0.08)`).
- **Level 2 (Interactive Modules & Hover - `#1E293B`):** Hovered course modules, active editor panes, draggable learning outcomes. Casts an ambient shadow: `0 4px 16px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)`.
- **Level 3 (Overlays & Menus - `#334155`):** Role switcher flyouts, modal verification dialogs, version diff windows. Casts a deep directional shadow: `0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.25)`.

## Shapes

The interface implements **Soft Geometric Contours (`roundedness: 1`)**. Rounded corners are kept minimal to evoke an engineered, CAD-like instrument where curved forms never compromise perimeter alignment.

- **Base Radius (4px / `0.25rem`):** Buttons, form inputs, dropdown selectors, status badges, and segmented tab triggers.
- **Container Radius (8px / `0.5rem`):** Cards, modular curriculum units, popover panels, and code execution consoles.
- **Pill Exceptions:** Restricted solely to circular avatar rings and binary system online/offline pings.

## Components

### 1. Application Chrome & Role Switcher
- **Chrome Shell:** Persistent `#0F172A` bar, 48px height, segmented with a 1px bottom border (`rgba(255, 255, 255, 0.08)`).
- **Role Segmented Switcher:** Compact toggle hosting three programmatic tiers: `Author`, `Reviewer`, `HOD`.
  - Inactive options render in muted gray (`#94A3B8`) with transparent background.
  - Active selection sits on a `#1E293B` tile with a 1px border (`#6366F1`) and a 4px cobalt status beacon.
- **Action Triggers:** Houses rapid "Upload Spec" (`.yaml`, `.json`, `.tex`) button and contextual Settings gear with tooltip.

### 2. Buttons
- **Primary:** Solid `#3B49DF` background, crisp 4px radius, white label, inset top highlight (`1px inset rgba(255, 255, 255, 0.15)`). Hover elevates to `#4F5EF7`. Active state settles to `#323EB9`.
- **Secondary / Outline:** `#0F172A` surface, 1px border (`rgba(255, 255, 255, 0.14)`), text `#E2E8F0`. Hover transitions to `#1E293B` with border `#6366F1`.
- **Destructive:** Bordered slate with ruby accents (`#EF4444`). Hover shifts background to `rgba(239, 68, 68, 0.12)`.
- **Density:** 32px standard control height for dashboard workflows; 28px for embedded table row tools.

### 3. Chips & Competency Badges
- Constructed with a 4px corner radius, 20px total height, and horizontal padding of 6px.
- **Accreditation State:** Tertiary emerald tint (`rgba(16, 185, 129, 0.12)`), text `#34D399`, border `1px solid rgba(16, 185, 129, 0.3)`.
- **Requirement Code (e.g., CS-301):** Monospaced Geist font, slate background (`#1E293B`), text `#A5B4FC`, border `1px solid rgba(99, 102, 241, 0.2)`.

### 4. Form Inputs & Code Blocks
- **Field Base:** `#090D16` recessed background, 1px micro-border (`rgba(255, 255, 255, 0.1)`), height 32px, text `#F8FAFC`.
- **Focus Indicator:** 0-offset 1px border `#6366F1` with an outer 2px soft glow (`rgba(99, 102, 241, 0.25)`).
- **Monospace Textareas:** Built for Markdown/LaTeX syllabus descriptions; includes line numbering gutter and fixed-width typography.

### 5. Cards & Specification Containers
- **Container Structure:** Surface `#0F172A` with perimeter border (`rgba(255, 255, 255, 0.08)`).
- **Section Headers:** Internal 36px header division, bottom-bordered, displaying syllabus chapter number, credit weighting indicator, and state status.
- **Interactive Drag Targets:** Left-aligned 6-dot reorder grip visible at 40% opacity, transitioning to 100% indigo upon pointer hover.

### 6. Lists & Curriculum Hierarchy Tables
- **Table Grids:** Compact 36px row heights with alternating subtle zebra striping (`#0F172A` / `#0C1220`).
- **Prerequisite Dependencies:** Visual vertical indent lines (`1px solid rgba(255, 255, 255, 0.06)`) connecting interdependent prerequisite course rows.