# Horizontal Masonry Grid Resume - Requirements Document

## Vision Statement

Transform the current vertical-scroll resume into an **interactive horizontal-scrolling masonry grid** where each tile represents a piece of your professional journey. Clicking a tile triggers a smooth View Transitions API animation that expands it into a detailed view while other tiles intelligently reflow around it. The design remains **minimalist and professional**, leveraging shadcn's clean aesthetic while adding delightful, purposeful interactions.

---

## Core Design Philosophy

> **"Complexity in interaction, simplicity in appearance"**

- Keep the monochrome/grayscale palette (it's professional and timeless)
- Maintain shadcn's `radix-lyra` style (square edges, minimal decoration)
- Add animations only where they serve clarity, not decoration
- Every animation should have a clear purpose: orientation, feedback, or focus
- Print styles remain untouched (critical for a resume)

---

## Detailed Requirements

### 1. Grid Layout System

#### 1.1 Horizontal Scroll Container
- **Behavior**: Primary navigation is horizontal (left to right)
- **Implementation**: CSS `overflow-x: auto` with `scroll-snap-type: x proximity`
- **Scrollbar**: Custom styled scrollbar matching the neutral theme (thin, subtle)
- **Touch Support**: Swipe gestures on mobile with momentum scrolling
- **Keyboard Support**: Arrow keys navigate between tiles, Escape closes expanded view

#### 1.2 Masonry Tile Sizing
Tiles should have **varied sizes** based on content importance and type:

| Tile Type | Size | Count | Examples |
|-----------|------|-------|----------|
| **Hero** | 2x2 (large) | 2-3 | Name/Intro, Current Role at Globant |
| **Large** | 2x1 (wide) | 6-7 | Key projects, Major achievements |
| **Medium** | 1x1 (standard) | 5-7 | Individual skills, Past roles |
| **Small** | 0.5x1 (compact) | 4-6 | Tech stack badges, Quick stats |

**Tile Distribution Logic** (stored in `data/grid-layout.ts`):
```typescript
interface TileConfig {
  id: string;
  type: 'hero' | 'experience' | 'project' | 'skill' | 'education' | 'summary' | 'stat';
  size: '2x2' | '2x1' | '1x1' | '0.5x1';
  order: number; // Horizontal position
  content: any; // Reference to actual data
}
```

#### 1.3 Tile Content (Current Resume Data Mapping)

**Hero Tiles (2x2)**:
1. **Introduction**: Name, title, location, quick contact links
2. **Current Role**: Globant position with key highlight

**Experience Tiles (2x1 or 1x1)**:
- Globant (2x1 - prominent)
- Liquidly (2x1)
- Marg Sahayak (1x1)

**Project Tiles (2x1)**:
- AsyncEndpoints (with GitHub/NuGet links)
- [Personal Project 1] — *Placeholder: Real-time collaborative whiteboard*
- [Personal Project 2] — *Placeholder: CLI scaffolding tool for .NET templates*
- [Personal Project 3] — *Placeholder: Distributed rate limiter middleware*

**Skill Category Tiles (1x1)**:
- System Design
- Languages & Frameworks
- Databases
- Cloud & Infrastructure

**Stat Tiles (0.5x1)**:
- Years of Experience: "8+"
- Technologies: Count
- Teams Led: "8 engineers"
- Performance Improvements: "60s → <1s"

**Education Tile (1x1)**:
- VGEC degree

**Summary Tile (1x1)**:
- Brief professional philosophy

---

### 2. Expanded View (Click Interaction)

#### 2.1 View Transitions API Implementation
- **API**: Use `document.startViewTransition()` for smooth morphing
- **Fallback**: Graceful degradation for browsers without support (simple modal overlay)
- **Transition Name**: Each tile gets unique `view-transition-name` dynamically assigned

**Animation Sequence**:
1. User clicks tile
2. `startViewTransition()` captures before-state
3. Tile expands from current position → detailed view
4. Surrounding tiles reflow with spring physics (smooth, not linear)
5. Backdrop fades in (optional, subtle opacity)
6. Content inside tile fades/slides into view (staggered)

**Reverse Sequence** (on close):
1. Click close button, backdrop, or press Escape
2. Content fades out
3. Tile shrinks back to original position
4. Other tiles return to grid positions
5. Transition completes

#### 2.2 Expanded Tile Content
Each tile type shows **additional detail** when expanded:

**Experience Tile Expanded**:
- Full company details
- All achievement bullet points (currently may show only 2-3 in collapsed)
- Timeline visualization
- Technologies used
- Duration badge

**Project Tile Expanded**:
- Full description
- Architecture diagram (simple SVG)
- Tech stack badges
- Links with preview
- GitHub stats (if available via API)
- *Applies to all 4 projects (AsyncEndpoints + 3 personal)*

**Skill Tile Expanded**:
- Individual skills as badges
- Proficiency indicators (subtle, not gamified - maybe "Years using")
- Related projects/experience that used this skill

**Stat Tile Expanded**:
- Context for the number
- Breakdown or details
- Related tiles/cross-references

#### 2.3 Reflow Behavior
- **Expanded tile** becomes 3x3 or 4x4 (dominant focus)
- **Adjacent tiles** shift left/right to accommodate
- **Non-adjacent tiles** maintain position (minimize movement)
- **Animation timing**: 300-400ms (snappy but smooth)
- **Easing**: Custom cubic-bezier `(0.25, 0.1, 0.25, 1.0)` (material standard)

---

### 3. Visual Design Enhancements

#### 3.1 Tile Styling
Maintain current aesthetic but add subtle depth:

```css
/* Base tile */
.tile {
  border: 1px solid var(--border);
  background: var(--card);
  transition: border-color 150ms, box-shadow 200ms, transform 200ms;
  
  &:hover {
    border-color: var(--border)/0.8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
  
  &[data-expanded="true"] {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    z-index: 10;
  }
}
```

#### 3.2 Typography Hierarchy
Keep Geist + Geist Mono, add size variations:
- **Hero tiles**: Larger text, bolder weight
- **Expanded view**: Increase readability with proper line-height
- **Mono**: Use for tech stacks, dates, metrics

#### 3.3 Iconography
Continue using Lucide React:
- Each tile type has consistent icon placement
- Icons scale subtly on hover (1.05x, barely perceptible)
- Expanded view shows more icons for detail sections

#### 3.4 Color Accents (Optional, Subtle)
While keeping monochrome base, consider:
- **Current role tile**: Very subtle green tint (`bg-green-500/5`)
- **Project tile**: Very subtle blue tint
- **Skill tile**: Neutral (no tint)
- All tints must work in dark mode and remain professional

---

### 4. Navigation & UX

#### 4.1 Enhanced StickyNav
Current sticky nav adapts for horizontal layout:

**New Behavior**:
- Appears when scrolling horizontally past first tile
- Shows **section indicators** (dots or thin bars) instead of text
- Click indicator scrolls to that section
- Active state tracks current visible tiles
- Can be fixed on right side (vertical dots) or top (horizontal)

**Alternative**: Keep current top StickyNav but add:
- Scroll position indicator (progress bar)
- "Scroll to explore" hint on initial load (fades after first interaction)

#### 4.2 Keyboard Navigation
```
← / →     : Navigate between tiles
Enter     : Expand selected tile
Escape    : Collapse expanded tile
Tab       : Focus next tile (standard)
Home/End  : Jump to first/last tile
```

Visual focus indicator:
- Subtle outline ring matching theme
- Tile slightly elevates on focus

#### 4.3 Touch Gestures
- **Swipe left/right**: Navigate tiles
- **Tap**: Expand tile
- **Pinch**: Zoom into grid (optional, advanced)
- **Long press**: Quick preview (optional, iOS-style peek)

#### 4.4 Initial Load Experience
**First-time visitor**:
1. Page loads with grid in collapsed state
2. Subtle animation: tiles fade in sequentially (staggered 50ms)
3. "Click any tile to explore" tooltip appears briefly (disappears on first click, doesn't return)
4. Smooth, not overwhelming

**Returning visitor** (if using localStorage):
- Remembers last viewed state
- Option to "Resume where you left off"

---

### 5. Technical Implementation Plan

#### 5.1 New Components to Create

```
components/
  sections/
    MasonryGrid.tsx          # Main grid container (client component)
    MasonryTile.tsx          # Individual tile wrapper with interactions
    ExpandedTileContent.tsx  # Detailed view content for each tile type
    ScrollIndicator.tsx      # Horizontal scroll progress/section nav
  ui/
    tile.tsx                 # shadcn-style tile primitive (new shadcn add)
    expandable-panel.tsx     # Handles View Transitions API logic
```

#### 5.2 New Data Files

```
data/
  grid-layout.ts             # Tile configuration and ordering
  tile-content.ts            # Extended content for expanded views
```

#### 5.3 New Hooks

```
hooks/
  use-horizontal-scroll.ts   # Manages scroll position, snap points
  use-tile-expansion.ts      # Manages expanded state, View Transitions
  use-keyboard-nav.ts        # Keyboard navigation logic
  use-masonry-layout.ts      # Calculates tile positions in grid
```

#### 5.4 View Transitions API Strategy

```typescript
// Pseudo-implementation
const handleTileClick = async (tileId: string) => {
  if (!document.startViewTransition) {
    // Fallback: simple modal
    setExpandedTile(tileId);
    return;
  }

  const transition = document.startViewTransition(() => {
    setExpandedTile(tileId);
    // React re-renders, tile expands, others reflow
  });

  await transition.finished;
};
```

**CSS for View Transitions**:
```css
::view-transition-old(tile-1) {
  animation: tile-expand-out 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

::view-transition-new(tile-1) {
  animation: tile-expand-in 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

/* Other tiles shift smoothly */
::view-transition-old(grid),
::view-transition-new(grid) {
  animation: grid-reflow 350ms cubic-bezier(0.25, 0.1, 0.25, 1);
}
```

#### 5.5 Masonry Layout Approach

**Option A: CSS Grid with Auto-placement** (Recommended)
```css
.masonry-grid {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(280px, 1fr);
  grid-template-rows: repeat(4, minmax(120px, auto));
  gap: 1rem;
  overflow-x: auto;
}

/* Tile spans based on size */
.tile-2x2 { grid-column: span 2; grid-row: span 2; }
.tile-2x1 { grid-column: span 2; grid-row: span 1; }
.tile-1x1 { grid-column: span 1; grid-row: span 1; }
```

**Option B: Custom JavaScript Masonry**
- More control, more complexity
- Only if CSS Grid can't achieve desired layout

**Recommendation**: Start with CSS Grid, iterate if needed.

---

### 6. Responsive Behavior

#### 6.1 Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| **Desktop** (>1024px) | Full horizontal masonry, 4-row height |
| **Tablet** (768-1024px) | Horizontal scroll, 3-row height, tiles slightly smaller |
| **Mobile** (<768px) | **Vertical scroll** (keep current layout), tiles stack, tap to expand |

**Rationale**: Horizontal scroll on mobile is poor UX. On mobile, this should gracefully fall back to a refined version of the current vertical layout.

#### 6.2 Mobile Adaptations
- Tiles become full-width cards
- Expanded view becomes bottom sheet (slides up from bottom)
- Swipe gestures remain
- Stat tiles become horizontal scrolling row

---

### 7. Performance Considerations

#### 7.1 Optimization Strategies
- **Lazy rendering**: Only render tiles in viewport + 2 adjacent
- **Virtual scrolling**: For large grids (may not be needed for your tile count)
- **Image optimization**: Any images (company logos, etc.) use Next.js `<Image>`
- **Font loading**: Already optimized with `next/font`
- **Static generation**: All content is static, perfect for `output: 'export'`

#### 7.2 Bundle Size
- Current: ~62 shadcn components, many unused
- **Audit**: Remove unused UI primitives or tree-shake properly
- View Transitions API: Zero bundle impact (native browser API)
- New components: Keep lightweight, avoid heavy animation libraries

#### 7.3 Metrics to Track
- First Contentful Paint: Should remain <1.5s
- Time to Interactive: <2s
- Layout shifts: 0 (CLS should be zero after initial load)
- Animation frame rate: 60fps (no jank during transitions)

---

### 8. Accessibility Requirements

#### 8.1 ARIA Attributes
```html
<div role="grid" aria-label="Professional Experience Grid">
  <div role="gridcell" 
       aria-expanded="false" 
       aria-label="Experience at Globant"
       tabindex="0">
    <!-- Tile content -->
  </div>
</div>
```

#### 8.2 Screen Reader Support
- Expanded state announced: "Tile expanded, showing details"
- Navigation hints: "Press Enter to expand, Escape to collapse"
- Skip link: "Skip to expanded view" when tile is focused
- Live regions: Announce tile changes

#### 8.3 Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Fallback: instant state change, no animation */
  .tile[data-expanded="true"] {
    /* Just show expanded, no transition */
  }
}
```

#### 8.4 Keyboard-Only Users
- All interactions possible without mouse/touch
- Clear focus indicators
- Logical tab order
- No keyboard traps

---

### 9. Professional Polish Enhancements

#### 9.1 Micro-interactions
Subtle details that elevate professionalism:

- **Tile hover**: Cursor changes to `pointer`, very subtle lift (1-2px)
- **Loading states**: Skeleton tiles while grid calculates layout
- **Empty states**: N/A (you have content), but graceful handling if data missing
- **Error boundaries**: If tile fails to render, show fallback with error message
- **Copy contact info**: Click email/phone → copies to clipboard with toast notification

#### 9.2 Easter Eggs (Optional, Fun but Professional)
- **Konami code**: Unlocks a subtle theme variation (not gimmicky)
- **Console message**: "👋 Hey there, fellow developer! Check out the code: [repo link]"
- **Anniversary badge**: "Celebrating X years in tech" on work anniversaries
- **Time-aware greeting**: "Good morning/afternoon/evening" based on visitor's timezone

#### 9.3 Analytics (Optional)
If you want insights:
- Which tiles get clicked most?
- How far do people scroll?
- Time spent on each section
- Device/browser breakdown

**Privacy-respecting**: Use Plausible or Umami (not Google Analytics)

#### 9.4 Open Source Credibility
Since you're a senior engineer:
- **"View Source" link**: Links to this repo
- **Built with badge**: Next.js, shadcn, Tailwind
- **Performance badge**: Lighthouse score screenshot
- **Architecture note**: Brief note about static export, View Transitions API

---

### 10. Content Strategy

#### 10.1 What Stays the Same
- All current resume data is preserved
- Print styles unchanged
- SEO meta tags remain
- Contact information prominent

#### 10.2 What Gets Enhanced
- **Achievements**: In expanded view, add context/metrics
  - Example: "Reduced query time from 60s to <1s" → show before/after with brief explanation
- **Projects**: Add architecture notes, design decisions
- **Skills**: Show real-world context (where you used each skill)
- **Timeline**: Visual representation of career progression

#### 10.3 Future-Proofing
Design data structure so adding new experience is trivial:
```typescript
// Just add to data/resume.ts and it flows into grid
export const experiences = [
  // ... existing
  {
    company: "New Company",
    role: "New Role",
    startDate: "2026-01",
    // ... automatically becomes a tile
  }
];
```

---

### 11. Testing Requirements

#### 11.1 Manual Testing Checklist
- [ ] All tiles expand/collapse smoothly
- [ ] View Transitions works in supported browsers (Chrome 111+, Edge 111+)
- [ ] Fallback works in Firefox/Safari (no View Transitions yet)
- [ ] Keyboard navigation complete
- [ ] Touch gestures work on mobile
- [ ] Print layout still correct
- [ ] Dark mode all tiles readable
- [ ] Screen reader announces properly
- [ ] Reduced motion respected
- [ ] All breakpoints tested

#### 11.2 Browser Compatibility
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| View Transitions | ✅ 111+ | ⚠️ Behind flag | ❌ Coming | ✅ 111+ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Horizontal Scroll | ✅ | ✅ | ✅ | ✅ |

**Fallback Strategy**: Browsers without View Transitions get smooth CSS transitions instead (still polished, just different animation).

---

### 12. Implementation Phases

#### Phase 1: Foundation (Structure)
1. Create `data/grid-layout.ts` with tile configuration
2. Build `MasonryGrid.tsx` container with CSS Grid
3. Create `MasonryTile.tsx` component
4. Migrate existing section content into tiles
5. Horizontal scroll behavior

#### Phase 2: Interactions (Expansion)
1. Implement View Transitions API integration
2. Build expand/collapse logic
3. Create expanded tile content components
4. Reflow animation for adjacent tiles
5. Fallback for unsupported browsers

#### Phase 3: Polish (UX)
1. Keyboard navigation
2. Touch gestures
3. Enhanced StickyNav
4. Initial load animations
5. Accessibility audit
6. Responsive breakpoints

#### Phase 4: Professional Touch
1. Micro-interactions
2. Performance optimization
3. Testing across browsers
4. Content refinement
5. Print styles verification
6. Final accessibility review

---

### 13. What We're NOT Doing

To maintain simplicity and professionalism:

❌ **No complex 3D animations** (distracting, not professional)
❌ **No particle effects or backgrounds** (keeps it clean)
❌ **No sound effects** (obvious reasons)
❌ **No gamification** (this is a resume, not a game)
❌ **No complex routing** (stays single-page, static)
❌ **No backend/database** (static site, perfect for GitHub Pages)
❌ **No user accounts or personalization** (one-size-fits-all)
❌ **No blog or CMS** (out of scope, keep it focused)

---

### 14. Success Metrics

The implementation is successful when:

✅ A recruiter can quickly scan your experience (grid view)
✅ Deep-diving into any tile feels smooth and intentional
✅ Keyboard-only users can navigate everything
✅ Print output remains perfect
✅ Mobile users get a great experience (vertical fallback)
✅ Page load remains fast (<2s to interactive)
✅ Animations enhance understanding, not distract
✅ Code remains maintainable (clear component structure)
✅ Adding new content is straightforward (data-driven)

---

### 15. Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layout | CSS Grid (not JS masonry) | Simpler, performant, sufficient |
| Animation | View Transitions API | Native, smooth, zero bundle cost |
| State Management | React state (no Redux) | Simple enough, no complex state |
| Styling | Tailwind + CSS vars | Consistent with current setup |
| Data | TypeScript files (not CMS) | Static, version-controlled, fast |
| Fallback | CSS transitions | Graceful, still polished |
| Mobile | Vertical scroll fallback | Best UX for small screens |

---

## Next Steps

1. **Review this document** and provide feedback
2. **Prioritize features**: What's must-have vs. nice-to-have?
3. **Approach confirmation**: Are you comfortable with View Transitions API?
4. **Design details**: Any specific tile layouts you want to sketch?
5. **Implementation**: I can help build this phase by phase

---

## Questions to Consider

- Do you want to keep the current vertical layout as an option (toggle)?
- Should stat tiles be interactive or just visual elements?
- Any preference for tile arrangement (chronological, categorical, mixed)?
- Do you want to add company logos to experience tiles?
- Should the grid be deterministic (same every time) or dynamic (shuffles)?

---

*Document Version: 1.0*  
*Last Updated: 7 April 2026*  
*Status: Ready for Review*
