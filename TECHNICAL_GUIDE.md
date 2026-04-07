# Technical Implementation Guide — Horizontal Masonry Grid Resume

## For AI Agents Implementing This Feature

---

## 1. Project Context & Constraints

### 1.1 Current Tech Stack
```
Next.js 16.1.7 (App Router, static export)
React 19.2.4
Tailwind CSS v4.2.1 (CSS-first config, no tailwind.config.js)
shadcn/ui (radix-lyra style, OKLCH color tokens)
TypeScript 5.9.3 (strict mode, path alias @/*)
Lucide React 1.7.0 (icons)
```

### 1.2 Hard Constraints
- **Static export only** (`output: 'export'` in `next.config.js`) — no server-side code, no API routes
- **No new dependencies** unless absolutely necessary — prefer native APIs and existing deps
- **Preserve all existing functionality** — print styles, dark mode, theme toggle, existing sections
- **Bundle size budget**: Do not increase JS bundle by more than 15KB (gzipped)
- **No breaking changes** to existing `data/resume.ts` structure — extend, don't modify

### 1.3 Files That Must NOT Be Modified
```
app/globals.css (except adding new section at bottom for grid-specific styles)
app/layout.tsx
data/resume.ts (read-only reference, create new data files instead)
components/sections/Header.tsx
components/sections/Summary.tsx
components/sections/Experience.tsx
components/sections/Projects.tsx
components/sections/Skills.tsx
components/sections/Education.tsx
components/sections/Footer.tsx
components/StickyNav.tsx
```

**Rationale**: These files represent the current working resume. The new grid layout should coexist — the old vertical layout remains accessible via a toggle or separate route, and print styles continue working.

---

## 2. Architecture Overview

### 2.1 Component Hierarchy (New)
```
app/
  page.tsx                          # Modified: wraps content in GridProvider
  grid/
    page.tsx                        # NEW: dedicated grid route (optional alternative)

components/
  sections/
    MasonryGrid.tsx                 # NEW: Main grid container, client component
    MasonryTile.tsx                 # NEW: Individual tile with expansion logic
    GridNavigation.tsx              # NEW: Horizontal scroll nav + progress

  ui/
    tile.tsx                        # NEW: shadcn add - base tile primitive
    expandable-panel.tsx            # NEW: View Transitions API wrapper

  grid/
    tiles/
      HeroTile.tsx                  # NEW: Name/intro tile
      ExperienceTile.tsx            # NEW: Experience card tile
      ProjectTile.tsx               # NEW: Project card tile
      SkillTile.tsx                 # NEW: Skill category tile
      StatTile.tsx                  # NEW: Quick stat tile
      EducationTile.tsx             # NEW: Education tile
      SummaryTile.tsx               # NEW: Summary/philosophy tile
    ExpandedContent/
      ExpandedExperience.tsx        # NEW: Detailed experience view
      ExpandedProject.tsx           # NEW: Detailed project view
      ExpandedSkills.tsx            # NEW: Detailed skills view
      ExpandedEducation.tsx         # NEW: Detailed education view

hooks/
  use-horizontal-scroll.ts          # NEW: Scroll position + snap management
  use-tile-expansion.ts             # NEW: Expansion state + View Transitions
  use-keyboard-navigation.ts        # NEW: Keyboard nav for grid
  use-grid-responsive.ts            # NEW: Breakpoint handling for grid

data/
  grid-layout.ts                    # NEW: Tile configuration
  grid-projects.ts                  # NEW: Extended project data (placeholders)
```

### 2.2 State Management Strategy

**No global state library needed.** Use React Context + hooks:

```typescript
// Context shape
interface GridContextValue {
  // Layout
  tiles: TileConfig[];
  activeTileId: string | null;
  expandedTileId: string | null;
  
  // Actions
  expandTile: (id: string) => void;
  collapseTile: () => void;
  setActiveTile: (id: string | null) => void;
  
  // Scroll
  scrollProgress: number; // 0-1
  scrollToTile: (id: string) => void;
  
  // View mode
  viewMode: 'grid' | 'vertical'; // toggle between layouts
  toggleViewMode: () => void;
}
```

**Why Context**: Single consumer (the grid), no complex cross-component state, avoids Redux/Zustand overhead for static site.

---

## 3. Data Layer Implementation

### 3.1 `data/grid-layout.ts`

```typescript
import { resumeData } from './resume';

export type TileSize = '2x2' | '2x1' | '1x1' | '0.5x1';
export type TileType = 'hero' | 'experience' | 'project' | 'skill' | 'education' | 'summary' | 'stat';

export interface TileConfig {
  id: string;
  type: TileType;
  size: TileSize;
  order: number; // Horizontal position (0-indexed column group)
  rowStart: number; // 1-4
  rowSpan: number; // 1-2
  colSpan: number; // 1-2
  dataRef: string; // Key into resumeData or grid-projects.ts
  icon?: string; // Lucide icon name
  title: string; // Shown in collapsed state
  subtitle?: string; // Optional secondary text
}

export const tileLayout: TileConfig[] = [
  // Column 0: Hero section
  {
    id: 'hero-intro',
    type: 'hero',
    size: '2x2',
    order: 0,
    rowStart: 1,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'header',
    icon: 'User',
    title: 'Kaushik',
    subtitle: 'Senior Software Engineer',
  },
  {
    id: 'hero-current-role',
    type: 'hero',
    size: '2x2',
    order: 0,
    rowStart: 3,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'experience:0', // Globant
    icon: 'Briefcase',
    title: 'Globant',
    subtitle: 'Senior Software Engineer • Aug 2024 - Present',
  },

  // Column 1: Experience + Summary
  {
    id: 'experience-liquidly',
    type: 'experience',
    size: '2x1',
    order: 1,
    rowStart: 1,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'experience:1',
    icon: 'Building2',
    title: 'Liquidly',
    subtitle: 'Technical Lead • Apr 2020 - Aug 2024',
  },
  {
    id: 'summary',
    type: 'summary',
    size: '1x1',
    order: 1,
    rowStart: 3,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'summary',
    icon: 'Quote',
    title: 'About Me',
  },
  {
    id: 'experience-marg',
    type: 'experience',
    size: '1x1',
    order: 1,
    rowStart: 4,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'experience:2',
    icon: 'Landmark',
    title: 'Marg Sahayak',
    subtitle: 'Software Engineer',
  },

  // Column 2: Projects
  {
    id: 'project-async',
    type: 'project',
    size: '2x1',
    order: 2,
    rowStart: 1,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'project:0',
    icon: 'Package',
    title: 'AsyncEndpoints',
    subtitle: 'Distributed Job Processing',
  },
  {
    id: 'project-whiteboard',
    type: 'project',
    size: '2x1',
    order: 2,
    rowStart: 3,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'grid-project:0',
    icon: 'Palette',
    title: 'Collaborative Whiteboard',
    subtitle: 'Real-time Multiplayer',
  },

  // Column 3: More Projects + Skills
  {
    id: 'project-cli-tool',
    type: 'project',
    size: '2x1',
    order: 3,
    rowStart: 1,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'grid-project:1',
    icon: 'Terminal',
    title: '.NET Scaffolding CLI',
    subtitle: 'Developer Productivity',
  },
  {
    id: 'skill-system-design',
    type: 'skill',
    size: '1x1',
    order: 3,
    rowStart: 3,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'skills:0',
    icon: 'Layers',
    title: 'System Design',
  },
  {
    id: 'skill-languages',
    type: 'skill',
    size: '1x1',
    order: 3,
    rowStart: 4,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'skills:1',
    icon: 'Code2',
    title: 'Languages & Frameworks',
  },

  // Column 4: Stats + More Skills
  {
    id: 'stat-years',
    type: 'stat',
    size: '0.5x1',
    order: 4,
    rowStart: 1,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'stat:years',
    title: '8+',
    subtitle: 'Years Experience',
  },
  {
    id: 'stat-led',
    type: 'stat',
    size: '0.5x1',
    order: 4,
    rowStart: 1,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'stat:led',
    title: '8',
    subtitle: 'Engineers Led',
  },
  {
    id: 'stat-performance',
    type: 'stat',
    size: '0.5x1',
    order: 4,
    rowStart: 2,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'stat:performance',
    title: '60s→<1s',
    subtitle: 'Query Optimization',
  },
  {
    id: 'stat-cicd',
    type: 'stat',
    size: '0.5x1',
    order: 4,
    rowStart: 2,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'stat:cicd',
    title: '15m→8m',
    subtitle: 'CI/CD Speedup',
  },
  {
    id: 'skill-databases',
    type: 'skill',
    size: '1x1',
    order: 4,
    rowStart: 3,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'skills:2',
    icon: 'Database',
    title: 'Databases',
  },
  {
    id: 'skill-cloud',
    type: 'skill',
    size: '1x1',
    order: 4,
    rowStart: 4,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'skills:3',
    icon: 'Cloud',
    title: 'Cloud & Infra',
  },

  // Column 5: Education + More Projects
  {
    id: 'project-rate-limiter',
    type: 'project',
    size: '2x1',
    order: 5,
    rowStart: 1,
    rowSpan: 2,
    colSpan: 2,
    dataRef: 'grid-project:2',
    icon: 'Shield',
    title: 'Distributed Rate Limiter',
    subtitle: 'Sliding Window Algorithm',
  },
  {
    id: 'education',
    type: 'education',
    size: '1x1',
    order: 5,
    rowStart: 3,
    rowSpan: 1,
    colSpan: 1,
    dataRef: 'education',
    icon: 'GraduationCap',
    title: 'VGEC',
    subtitle: 'B.E. Information Technology',
  },
  // ... additional stat or summary tiles to fill column 5 rows 3-4
];

// Viewport configuration
export const gridConfig = {
  tileBaseWidth: 280, // px
  tileBaseHeight: 140, // px
  gap: 16, // px
  maxVisibleColumns: 4, // How many columns visible before scroll
  rowHeight: 140, // matches tileBaseHeight for clean grid
};
```

### 3.2 `data/grid-projects.ts`

```typescript
export interface GridProject {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  architecture?: string; // Text description of architecture
  links: { label: string; url: string }[];
  highlights: string[];
  // Placeholder image or diagram (SVG string or path)
  diagram?: string;
}

export const gridProjects: GridProject[] = [
  {
    id: 'collaborative-whiteboard',
    title: 'Collaborative Whiteboard',
    description: 'Real-time multiplayer whiteboard with CRDT-based conflict resolution.',
    longDescription: `
      A real-time collaborative whiteboard supporting multiple concurrent users. 
      Built with WebSocket connections and CRDT (Conflict-free Replicated Data Types) 
      for eventual consistency without central authority. Supports drawing tools, 
      sticky notes, image upload, and session recording.
      
      Handles network partitions gracefully with operational transformation fallback.
      Canvas rendering optimized with requestAnimationFrame throttling at 60fps.
    `,
    techStack: ['TypeScript', 'WebSocket', 'Canvas API', 'CRDT', 'Redis Pub/Sub'],
    architecture: 'Client-server with CRDT sync layer. Redis for presence and session state.',
    links: [
      { label: 'GitHub', url: 'https://github.com/kaushik2901/whiteboard' },
      { label: 'Live Demo', url: '#' },
    ],
    highlights: [
      'Sub-50ms draw latency with optimistic updates',
      'Supports 10+ concurrent users without conflicts',
      'Session playback with compressed event log',
    ],
  },
  {
    id: 'dotnet-scaffolding-cli',
    title: '.NET Scaffolding CLI',
    description: 'Developer productivity tool for generating .NET project templates from CLI.',
    longDescription: `
      A command-line scaffolding tool that generates opinionated .NET project templates 
      with Clean Architecture pre-configured. Supports custom template packs, 
      interactive prompts, and dry-run preview.
      
      Integrates with `dotnet new` pipeline and supports conditional file generation 
      based on user selections. Includes unit test templates with xUnit and Moq scaffolding.
    `,
    techStack: ['C#', '.NET 8', 'Spectre.Console', 'System.CommandLine', 'NuGet'],
    architecture: 'Plugin-based template engine with configuration-driven generation.',
    links: [
      { label: 'GitHub', url: 'https://github.com/kaushik2901/scaffolding-cli' },
      { label: 'NuGet', url: '#' },
    ],
    highlights: [
      'Reduces project setup time from hours to minutes',
      '500+ GitHub stars, 1000+ NuGet downloads',
      'Supports .NET 8 through .NET 10',
    ],
  },
  {
    id: 'distributed-rate-limiter',
    title: 'Distributed Rate Limiter',
    description: 'Sliding window rate limiting middleware for distributed systems.',
    longDescription: `
      A NuGet library implementing distributed rate limiting using sliding window 
      log algorithm with Redis backend. Supports multiple strategies: fixed window, 
      sliding window, and token bucket.
      
      Designed for microservices — shares rate limit state across service instances 
      with sub-millisecond overhead. Includes ASP.NET Core middleware integration 
      and customizable rejection responses.
    `,
    techStack: ['C#', '.NET 9', 'Redis', 'Lua Scripting', 'ASP.NET Core Middleware'],
    architecture: 'Middleware pipeline with Redis-backed sliding window counter.',
    links: [
      { label: 'GitHub', url: 'https://github.com/kaushik2901/rate-limiter' },
      { label: 'NuGet', url: '#' },
    ],
    highlights: [
      '<1ms overhead per request',
      'Handles 50k+ RPM per Redis instance',
      'Lua scripts for atomic operations',
    ],
  },
];
```

---

## 4. Component Implementation Details

### 4.1 `MasonryGrid.tsx` — Main Container

```typescript
'use client';

import { GridProvider } from '@/context/grid-context';
import { tileLayout, gridConfig } from '@/data/grid-layout';
import { MasonryTile } from './MasonryTile';
import { GridNavigation } from './GridNavigation';
import styles from './MasonryGrid.module.css';

export function MasonryGrid() {
  return (
    <GridProvider>
      <div className={styles.gridWrapper}>
        <GridNavigation />
        <div 
          className={styles.masonryGrid}
          role="grid"
          aria-label="Professional Experience Grid"
        >
          {tileLayout.map((tile) => (
            <MasonryTile key={tile.id} config={tile} />
          ))}
        </div>
      </div>
    </GridProvider>
  );
}
```

**CSS Module** `MasonryGrid.module.css`:
```css
.gridWrapper {
  width: 100%;
  overflow: hidden;
}

.masonryGrid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(var(--tile-width, 280px), 1fr);
  grid-template-rows: repeat(4, var(--row-height, 140px));
  gap: var(--gap, 16px);
  overflow-x: auto;
  scroll-snap-type: x proximity;
  scroll-behavior: smooth;
  padding: 1rem;
  padding-bottom: 2rem;
  
  /* Hide scrollbar but keep functionality */
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 3px;
  }
}

/* Responsive: tablet reduces rows */
@media (max-width: 1024px) {
  .masonryGrid {
    grid-template-rows: repeat(3, var(--row-height, 140px));
  }
}

/* Mobile: switch to vertical layout */
@media (max-width: 768px) {
  .masonryGrid {
    display: flex;
    flex-direction: column;
    overflow-x: visible;
    overflow-y: auto;
    scroll-snap-type: none;
    gap: 1rem;
    
    /* Each tile becomes full-width */
    > * {
      grid-column: 1 !important;
      grid-row: auto !important;
      width: 100%;
    }
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .masonryGrid {
    scroll-behavior: auto;
  }
}
```

### 4.2 `MasonryTile.tsx` — Tile Wrapper

```typescript
'use client';

import { useGrid } from '@/context/grid-context';
import { TileConfig } from '@/data/grid-layout';
import { useTileExpansion } from '@/hooks/use-tile-expansion';
import { getTileComponent } from './tile-registry';
import styles from './MasonryTile.module.css';

interface MasonryTileProps {
  config: TileConfig;
}

export function MasonryTile({ config }: MasonryTileProps) {
  const { expandedTileId, setActiveTile } = useGrid();
  const { isExpanded, handleExpand } = useTileExpansion(config.id);
  
  const isExpanded = expandedTileId === config.id;
  const TileComponent = getTileComponent(config.type);
  
  return (
    <div
      className={styles.tile}
      data-size={config.size}
      data-expanded={isExpanded}
      data-type={config.type}
      style={{
        gridColumn: `span ${config.colSpan}`,
        gridRow: `${config.rowStart} / span ${config.rowSpan}`,
        viewTransitionName: isExpanded ? `tile-${config.id}` : undefined,
      }}
      role="gridcell"
      aria-expanded={isExpanded}
      aria-label={config.title}
      tabIndex={0}
      onClick={() => handleExpand()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleExpand();
        }
      }}
    >
      <div className={styles.tileContent}>
        <TileComponent config={config} isExpanded={isExpanded} />
      </div>
      
      {/* Expanded overlay */}
      {isExpanded && (
        <div 
          className={styles.tileOverlay}
          onClick={(e) => {
            e.stopPropagation();
            // Collapse handled by parent
          }}
        >
          {/* Close button, expanded content */}
        </div>
      )}
    </div>
  );
}
```

**CSS Module** `MasonryTile.module.css`:
```css
.tile {
  position: relative;
  border: 1px solid var(--border);
  background: var(--card);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  scroll-snap-align: start;
  
  transition: 
    border-color 150ms ease,
    box-shadow 200ms ease,
    transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
  
  &:hover {
    border-color: var(--border)/0.8;
    box-shadow: 0 2px 8px var(--shadow-sm);
    transform: translateY(-1px);
  }
  
  &:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }
  
  &[data-expanded="true"] {
    box-shadow: 0 8px 32px var(--shadow-md);
    z-index: 10;
    transform: none;
    cursor: default;
  }
}

.tileContent {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tileOverlay {
  position: absolute;
  inset: 0;
  background: var(--card);
  z-index: 20;
  animation: overlayFadeIn 300ms ease;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* View Transitions API animation */
@keyframes tileExpandIn {
  from {
    transform: scale(0.95);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes tileExpandOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

::view-transition-old(tile-*) {
  animation: tileExpandOut 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

::view-transition-new(tile-*) {
  animation: tileExpandIn 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

### 4.3 Tile Registry Pattern

```typescript
// components/sections/tile-registry.ts
import { TileType } from '@/data/grid-layout';
import { HeroTile } from '@/components/grid/tiles/HeroTile';
import { ExperienceTile } from '@/components/grid/tiles/ExperienceTile';
import { ProjectTile } from '@/components/grid/tiles/ProjectTile';
import { SkillTile } from '@/components/grid/tiles/SkillTile';
import { StatTile } from '@/components/grid/tiles/StatTile';
import { EducationTile } from '@/components/grid/tiles/EducationTile';
import { SummaryTile } from '@/components/grid/tiles/SummaryTile';

const tileComponentMap: Record<TileType, React.ComponentType<any>> = {
  hero: HeroTile,
  experience: ExperienceTile,
  project: ProjectTile,
  skill: SkillTile,
  stat: StatTile,
  education: EducationTile,
  summary: SummaryTile,
};

export function getTileComponent(type: TileType) {
  return tileComponentMap[type];
}
```

---

## 5. View Transitions API Implementation

### 5.1 Core Hook: `use-tile-expansion.ts`

```typescript
import { useState, useCallback } from 'react';
import { useGrid } from '@/context/grid-context';

export function useTileExpansion(tileId: string) {
  const { expandedTileId, expandTile, collapseTile } = useGrid();
  const isExpanded = expandedTileId === tileId;
  const isTransitioning = useState(false);

  const handleExpand = useCallback(async () => {
    if (isExpanded) {
      collapseTile();
      return;
    }

    // Check View Transitions API support
    if (!document.startViewTransition) {
      // Fallback: direct state change
      expandTile(tileId);
      return;
    }

    // Set transitioning state for CSS hooks
    isTransitioning[1](true);

    const transition = document.startViewTransition(() => {
      expandTile(tileId);
    });

    try {
      await transition.finished;
    } finally {
      isTransitioning[1](false);
    }
  }, [isExpanded, tileId, expandTile, collapseTile]);

  return {
    isExpanded,
    isTransitioning: isTransitioning[0],
    handleExpand,
  };
}
```

### 5.2 View Transitions CSS

Add to `app/globals.css` (at bottom, new section):

```css
/* ==========================================
   Horizontal Grid - View Transitions
   ========================================== */

::view-transition-group(tile-*) {
  animation-duration: 350ms;
  animation-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
}

::view-transition-old(tile-*) {
  animation: 350ms cubic-bezier(0.25, 0.1, 0.25, 1) both tile-scale-out;
}

::view-transition-new(tile-*) {
  animation: 350ms cubic-bezier(0.25, 0.1, 0.25, 1) both tile-scale-in;
}

@keyframes tile-scale-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

@keyframes tile-scale-in {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Grid reflow animation */
::view-transition-old(grid),
::view-transition-new(grid) {
  animation: 350ms cubic-bezier(0.25, 0.1, 0.25, 1) both grid-reflow;
}

@keyframes grid-reflow {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(var(--reflow-offset, 0px));
  }
}

/* Reduced motion: disable View Transitions */
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

### 5.3 Browser Support Detection

```typescript
// lib/view-transitions.ts
export function supportsViewTransitions(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

export function withViewTransition(
  update: () => void,
  options?: ViewTransitionOptions
): Promise<ViewTransition> | void {
  if (!supportsViewTransitions()) {
    update();
    return;
  }

  return document.startViewTransition(update);
}
```

---

## 6. Context Implementation

### 6.1 `context/grid-context.tsx`

```typescript
'use client';

import { 
  createContext, 
  useContext, 
  useState, 
  useCallback,
  ReactNode 
} from 'react';
import { tileLayout } from '@/data/grid-layout';

interface GridContextValue {
  tiles: typeof tileLayout;
  activeTileId: string | null;
  expandedTileId: string | null;
  scrollProgress: number;
  viewMode: 'grid' | 'vertical';
  
  expandTile: (id: string) => void;
  collapseTile: () => void;
  setActiveTile: (id: string | null) => void;
  setScrollProgress: (progress: number) => void;
  scrollToTile: (id: string) => void;
  toggleViewMode: () => void;
}

const GridContext = createContext<GridContextValue | null>(null);

export function GridProvider({ children }: { children: ReactNode }) {
  const [activeTileId, setActiveTileId] = useState<string | null>(null);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'vertical'>('grid');

  const expandTile = useCallback((id: string) => {
    setExpandedTileId(id);
  }, []);

  const collapseTile = useCallback(() => {
    setExpandedTileId(null);
  }, []);

  const scrollToTile = useCallback((id: string) => {
    const element = document.querySelector(`[aria-label="${id}"]`);
    element?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }, []);

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'vertical' : 'grid'));
  }, []);

  const value: GridContextValue = {
    tiles: tileLayout,
    activeTileId,
    expandedTileId,
    scrollProgress,
    viewMode,
    expandTile,
    collapseTile,
    setActiveTile: setActiveTileId,
    setScrollProgress,
    scrollToTile,
    toggleViewMode,
  };

  return <GridContext value={value}>{children}</GridContext>;
}

export function useGrid() {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within GridProvider');
  }
  return context;
}
```

---

## 7. Hook Implementations

### 7.1 `use-horizontal-scroll.ts`

```typescript
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGrid } from '@/context/grid-context';

export function useHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScrollProgress } = useGrid();
  const [isScrolling, setIsScrolling] = useState(false);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setScrollProgress(Math.min(1, Math.max(0, progress)));
  }, [setScrollProgress]);

  const scrollToEnd = useCallback(() => {
    containerRef.current?.scrollTo({
      left: containerRef.current.scrollWidth,
      behavior: 'smooth',
    });
  }, []);

  const scrollToStart = useCallback(() => {
    containerRef.current?.scrollTo({
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  // Scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    isScrolling,
    scrollToEnd,
    scrollToStart,
  };
}
```

### 7.2 `use-keyboard-navigation.ts`

```typescript
import { useEffect, useCallback } from 'react';
import { useGrid } from '@/context/grid-context';
import { tileLayout } from '@/data/grid-layout';

export function useKeyboardNavigation() {
  const { expandedTileId, activeTileId, setActiveTile, expandTile, collapseTile } = useGrid();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tileIds = tileLayout.map((t) => t.id);
    const currentIndex = tileIds.indexOf(activeTileId || tileIds[0]);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < tileIds.length - 1) {
          const nextId = tileIds[currentIndex + 1];
          setActiveTile(nextId);
          // Scroll into view
          const el = document.querySelector(`[aria-label="${nextId}"]`);
          el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
        }
        break;

      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) {
          const prevId = tileIds[currentIndex - 1];
          setActiveTile(prevId);
          const el = document.querySelector(`[aria-label="${prevId}"]`);
          el?.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (activeTileId && !expandedTileId) {
          expandTile(activeTileId);
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (expandedTileId) {
          collapseTile();
        }
        break;

      case 'Home':
        e.preventDefault();
        setActiveTile(tileIds[0]);
        break;

      case 'End':
        e.preventDefault();
        setActiveTile(tileIds[tileIds.length - 1]);
        break;
    }
  }, [activeTileId, expandedTileId, setActiveTile, expandTile, collapseTile]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

### 7.3 `use-grid-responsive.ts`

```typescript
import { useState, useEffect } from 'react';

type GridBreakpoint = 'desktop' | 'tablet' | 'mobile';

export function useGridResponsive(): GridBreakpoint {
  const [breakpoint, setBreakpoint] = useState<GridBreakpoint>('desktop');

  useEffect(() => {
    const evaluate = () => {
      const width = window.innerWidth;
      if (width > 1024) {
        setBreakpoint('desktop');
      } else if (width > 768) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    evaluate();
    window.addEventListener('resize', evaluate, { passive: true });
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return breakpoint;
}
```

---

## 8. Tile Component Templates

### 8.1 Base Tile Primitive: `ui/tile.tsx`

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tileVariants = cva('relative overflow-hidden', {
  variants: {
    size: {
      '2x2': 'col-span-2 row-span-2',
      '2x1': 'col-span-2 row-span-1',
      '1x1': 'col-span-1 row-span-1',
      '0.5x1': 'col-span-1 row-span-1',
    },
    variant: {
      default: 'border bg-card hover:border-border/80',
      hero: 'border-2 bg-card hover:border-primary/50',
      project: 'border bg-card hover:border-border/80',
      stat: 'border bg-muted/50 hover:bg-muted',
    },
  },
  defaultVariants: {
    size: '1x1',
    variant: 'default',
  },
});

export interface TileProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tileVariants> {}

export const Tile = ({ className, size, variant, ...props }: TileProps) => (
  <div className={cn(tileVariants({ size, variant, className }))} {...props} />
);
```

### 8.2 Example: `ExperienceTile.tsx`

```typescript
import { Tile } from '@/components/ui/tile';
import { TileConfig } from '@/data/grid-layout';
import { resumeData } from '@/data/resume';
import { LucideIcon, Briefcase, MapPin, Calendar } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ExperienceTileProps {
  config: TileConfig;
  isExpanded: boolean;
}

export function ExperienceTile({ config, isExpanded }: ExperienceTileProps) {
  const [expIndex] = config.dataRef.split(':').map(Number);
  const experience = resumeData.experience[expIndex];
  
  const Icon = (LucideIcons[config.icon || 'Briefcase'] as LucideIcon) ?? Briefcase;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div>
            <h3 className="font-medium text-sm leading-tight">{experience.company}</h3>
            <p className="text-xs text-muted-foreground">{experience.role}</p>
          </div>
        </div>
      </div>

      {/* Collapsed: Show brief info */}
      {!isExpanded && (
        <div className="mt-auto space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{experience.startDate} - {experience.endDate || 'Present'}</span>
          </div>
          {experience.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{experience.location}</span>
            </div>
          )}
        </div>
      )}

      {/* Expanded: Show full details */}
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in-0 duration-300">
          <div className="space-y-2">
            {experience.achievements.map((achievement, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/60" />
                <p className="text-muted-foreground">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 8.3 Example: `ProjectTile.tsx`

```typescript
import { Tile } from '@/components/ui/tile';
import { TileConfig } from '@/data/grid-layout';
import { gridProjects } from '@/data/grid-projects';
import { LucideIcon, ExternalLink, Github } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface ProjectTileProps {
  config: TileConfig;
  isExpanded: boolean;
}

export function ProjectTile({ config, isExpanded }: ProjectTileProps) {
  const [projectIndex] = config.dataRef.split(':').map(Number);
  const project = gridProjects[projectIndex];
  
  const Icon = (LucideIcons[config.icon || 'Package'] as LucideIcon) ?? ExternalLink;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-sm leading-tight">{project.title}</h3>
          {config.subtitle && (
            <p className="text-xs text-muted-foreground">{config.subtitle}</p>
          )}
        </div>
      </div>

      {!isExpanded && (
        <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-4 animate-in fade-in-0 duration-300">
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {project.longDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs bg-muted rounded-md font-mono"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Highlights */}
          <div className="space-y-1">
            {project.highlights.map((highlight, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/60" />
                <p className="text-muted-foreground">{highlight}</p>
              </div>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3 pt-2">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label === 'GitHub' ? (
                  <Github className="h-3 w-3" />
                ) : (
                  <ExternalLink className="h-3 w-3" />
                )}
                <span>{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 9. Grid Navigation Component

### 9.1 `GridNavigation.tsx`

```typescript
'use client';

import { useGrid } from '@/context/grid-context';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function GridNavigation() {
  const { scrollProgress, scrollToTile, tiles } = useGrid();
  const { containerRef, scrollToStart, scrollToEnd } = useHorizontalScroll();

  // Group tiles by order (column)
  const columnGroups = tiles.reduce((acc, tile) => {
    if (!acc[tile.order]) acc[tile.order] = [];
    acc[tile.order].push(tile);
    return acc;
  }, {} as Record<number, typeof tiles>);

  const totalColumns = Object.keys(columnGroups).length;

  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Scroll controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollToStart}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Scroll to start"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalColumns }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(scrollProgress * totalColumns) >= i
                    ? 'bg-foreground'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollToEnd}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Scroll to end"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress text */}
        <div className="text-xs text-muted-foreground font-mono">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-border">
        <div
          className="h-full bg-foreground transition-all duration-150"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>
  );
}
```

---

## 10. Page Integration

### 10.1 `app/page.tsx` — Modified

```typescript
import { Header } from '@/components/sections/Header';
import { MasonryGrid } from '@/components/sections/MasonryGrid';
import { Footer } from '@/components/sections/Footer';
import { StickyNav } from '@/components/StickyNav';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav />
      <Header />
      
      {/* Grid replaces individual sections */}
      <MasonryGrid />
      
      {/* Keep sections as fallback for print/mobile vertical view */}
      <div className="print:block hidden">
        {/* ... existing vertical sections for print ... */}
      </div>
      
      <Footer />
    </div>
  );
}
```

**Note**: Keep existing vertical sections wrapped in `print:block hidden` so print layout still works.

---

## 11. Accessibility Implementation

### 11.1 ARIA Attributes

Every tile must have:
```tsx
<div
  role="gridcell"
  aria-expanded={isExpanded}
  aria-label={config.title}
  aria-describedby={`tile-desc-${config.id}`}
  tabIndex={0}
>
```

Grid container:
```tsx
<div
  role="grid"
  aria-label="Professional Experience Grid"
  aria-rowcount={4}
  aria-colcount={tileLayout.length}
>
```

### 11.2 Screen Reader Announcements

```typescript
// components/ui/live-region.tsx
'use client';

export function LiveRegion({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Usage in tile expansion:
{isExpanded && (
  <LiveRegion>
    {config.title} expanded. Showing detailed view.
  </LiveRegion>
)}
```

### 11.3 Focus Management on Expansion

```typescript
// When tile expands, focus should move to expanded content
useEffect(() => {
  if (isExpanded) {
    const expandedContent = document.querySelector(
      `[data-expanded-content="${config.id}"]`
    );
    expandedContent?.focus();
  }
}, [isExpanded, config.id]);
```

### 11.4 Reduced Motion

Already handled in CSS, but also respect in JS:

```typescript
const prefersReducedMotion = useReducedMotion(); // from custom hook

const handleExpand = () => {
  if (prefersReducedMotion || !document.startViewTransition) {
    expandTile(tileId); // Direct, no animation
    return;
  }
  
  document.startViewTransition(() => {
    expandTile(tileId);
  });
};
```

---

## 12. Testing Strategy

### 12.1 What to Test

No automated test suite required (static site), but manual testing checklist:

```
□ All tiles render with correct content
□ Tile expansion/collapse works smoothly
□ View Transitions animation plays at 60fps (no jank)
□ Fallback works in Firefox/Safari (no View Transitions)
□ Keyboard navigation: all keys work as documented
□ Screen reader: NVDA/JAWS announces tile states
□ Touch: swipe, tap, long-press work on mobile
□ Print layout: all sections print correctly
□ Dark mode: all tiles readable
□ Reduced motion: animations disabled
□ Responsive: desktop, tablet, mobile all work
□ Scroll snap: stops at logical points
□ No layout shifts after initial load (CLS = 0)
□ Bundle size: JS increase < 15KB gzipped
□ All links open in new tab with noopener
```

### 12.2 Browser Testing Matrix

| Feature | Chrome 111+ | Edge 111+ | Firefox | Safari |
|---------|-------------|-----------|---------|--------|
| View Transitions | ✅ | ✅ | ⚠️ Flag | ❌ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Scroll Snap | ✅ | ✅ | ✅ | ✅ |
| Backdrop Blur | ✅ | ✅ | ✅ | ✅ |
| OKLCH Colors | ✅ | ✅ | ✅ | ⚠️ 15.3+ |

---

## 13. Performance Guidelines

### 13.1 Do
- Use CSS Grid (GPU-accelerated layout)
- Use `view-transition-name` for native animations
- Lazy-load expanded content if heavy (React.lazy)
- Use `content-visibility: auto` on off-screen tiles
- Debounce scroll event handlers
- Use `passive: true` for scroll/touch listeners

### 13.2 Don't
- Don't use `getBoundingClientRect()` in scroll handler
- Don't re-render entire grid on tile expansion (only affected tiles)
- Don't use heavy animation libraries (Framer Motion, etc.)
- Don't load images synchronously in tiles
- Don't block main thread during transitions

### 13.3 Performance Monitoring

Add to `app/layout.tsx`:
```typescript
// Report Web Vitals (optional, for local testing)
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log(`[Perf] ${entry.name}: ${entry.startTime}ms`);
    });
  });
  
  observer.observe({ entryTypes: ['layout-shift', 'largest-contentful-paint'] });
}
```

---

## 14. Common Pitfalls & Solutions

### 14.1 Issue: View Transitions conflicts with React state updates

**Solution**: Ensure state update happens synchronously inside `startViewTransition` callback:

```typescript
// ✅ Correct
document.startViewTransition(() => {
  setExpandedTileId(tileId); // Synchronous state update
});

// ❌ Wrong
setExpandedTileId(tileId);
document.startViewTransition(() => {}); // Empty, React already re-rendered
```

### 14.2 Issue: Grid layout shifts during tile expansion

**Solution**: Use explicit grid placement (rowStart, colSpan) rather than auto-placement:

```typescript
// data/grid-layout.ts explicitly sets positions
{
  rowStart: 1,
  rowSpan: 2,
  colSpan: 2,
}
```

### 14.3 Issue: Horizontal scroll doesn't work on Safari

**Solution**: Safari needs `-webkit-overflow-scrolling: touch`:

```css
.masonryGrid {
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll; /* Not just auto */
}
```

### 14.4 Issue: Tiles overlap in expanded state

**Solution**: Expanded tile needs higher z-index and other tiles need lower:

```css
.tile {
  z-index: 1;
  
  &[data-expanded="true"] {
    z-index: 10;
  }
}
```

### 14.5 Issue: Keyboard navigation doesn't scroll tile into view

**Solution**: Call `scrollIntoView` after focusing:

```typescript
element.focus();
element.scrollIntoView({ behavior: 'smooth', inline: 'nearest' });
```

---

## 15. File Creation Order (Implementation Sequence)

Follow this order to avoid circular dependencies or missing imports:

1. `data/grid-layout.ts` — Tile configuration
2. `data/grid-projects.ts` — Extended project data
3. `context/grid-context.tsx` — State management
4. `hooks/use-tile-expansion.ts` — Expansion hook
5. `hooks/use-horizontal-scroll.ts` — Scroll hook
6. `hooks/use-keyboard-navigation.ts` — Keyboard hook
7. `hooks/use-grid-responsive.ts` — Responsive hook
8. `components/ui/tile.tsx` — Base tile primitive
9. `components/grid/tiles/*.tsx` — All tile components
10. `components/grid/ExpandedContent/*.tsx` — Expanded views
11. `components/grid/tile-registry.ts` — Tile component registry
12. `components/sections/MasonryTile.tsx` — Tile wrapper
13. `components/sections/MasonryGrid.tsx` — Grid container
14. `components/sections/GridNavigation.tsx` — Navigation
15. `app/page.tsx` — Integration
16. `app/globals.css` — Add View Transitions CSS
17. Test across browsers
18. Accessibility audit

---

## 16. Code Quality Standards

### 16.1 TypeScript
- No `any` types — use `unknown` with type guards if needed
- Strict null checks enabled
- All exports typed explicitly
- No implicit returns

### 16.2 Component Structure
```typescript
// Standard pattern for all components
import { ... } from '...';

interface ComponentProps {
  // Explicit props interface
}

export function Component({ ... }: ComponentProps) {
  // Hooks first
  // State
  // Effects
  // Handlers
  // Render
  return (...);
}
```

### 16.3 Naming Conventions
- Components: PascalCase (`MasonryGrid`)
- Hooks: camelCase with `use` prefix (`useTileExpansion`)
- Types/Interfaces: PascalCase (`TileConfig`)
- Constants: UPPER_SNAKE_CASE (`GRID_CONFIG`)
- Files: kebab-case (`masonry-grid.tsx`)

### 16.4 CSS
- CSS Modules for component-specific styles
- Global styles only in `globals.css`
- Use CSS custom properties for theming
- No inline styles except dynamic values (viewTransitionName)

### 16.5 Git Commits
Follow conventional commits:
```
feat(grid): implement masonry grid layout
feat(tile): add View Transitions API support
fix(keyboard): arrow navigation scroll behavior
style(css): add reduced motion support
docs(readme): update with grid documentation
```

---

## 17. Rollback Strategy

If implementation goes wrong:

1. Grid route: `app/grid/page.tsx` — isolated, can be removed independently
2. Old vertical layout preserved in `print:block hidden` div
3. No changes to `data/resume.ts` — original data intact
4. All new files in separate directories — easy to delete
5. `app/page.tsx` change is reversible — swap back to vertical sections

**Nuclear option**: Delete all new files, revert `app/page.tsx` — back to working state in 2 minutes.

---

## 18. Final Checklist Before Consideration Complete

```
□ All files created in correct order
□ No TypeScript errors or warnings
□ No ESLint errors
□ Prettier formatting applied
□ View Transitions work in Chrome/Edge
□ Fallback works in Firefox/Safari
□ Keyboard navigation fully functional
□ Screen reader announces tile states
□ Print layout unchanged
□ Dark mode all tiles readable
□ Mobile falls back to vertical scroll
□ Reduced motion respected
□ Bundle size within budget
□ All links open correctly
□ No console errors or warnings
□ Code follows project conventions
□ Comments explain "why" not "what"
```

---

*Document Version: 1.0*  
*Last Updated: 7 April 2026*  
*Status: Ready for Implementation*
