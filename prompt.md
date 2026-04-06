Build a **fully static, single-page portfolio website** that visually mimics a **one-page resume**, using **Next.js (App Router)** and **shadcn/ui components**.

---

### ⚙️ Project Context

* The project is already initialized with:

  * Next.js (latest, App Router)
  * Tailwind CSS
  * shadcn/ui components installed and configured
* The output must be:

  * **Fully static (SSG)** with no server-side rendering
  * Compatible with **GitHub Pages hosting**
* Use only **React functional components**
* No external UI libraries besides shadcn/ui

---

### 🎯 Goal

Create a **clean, minimal, professional one-page resume layout** that looks like a printable resume but is interactive and responsive. The design must strictly follow the **aesthetic of shadcn/ui**:

* Neutral colors
* Clean typography
* Subtle borders
* Consistent spacing
* No flashy gradients or heavy animations

---

### 🧱 Layout Structure (Top to Bottom)

Implement the following sections in a **single page layout**:

1. **Header (Name + Role)**

   * Large name (bold, prominent)
   * Subtitle: role/title
   * Optional: short tagline
   * Right-aligned contact info (email, GitHub, LinkedIn)

2. **Summary / About**

   * Short paragraph (2–4 lines)
   * Use muted foreground styling

3. **Experience**

   * List of roles using structured layout:

     * Company name (bold)
     * Role + duration
     * Bullet points for achievements
   * Use shadcn components like:

     * `Card` or simple bordered sections
     * `Separator` between entries

4. **Projects**

   * Grid or stacked layout
   * Each project includes:

     * Title
     * Description
     * Tech stack badges
     * Optional links (GitHub / live)
   * Use:

     * `Card`
     * `Badge`
     * `Button` (ghost/outline variant)

5. **Skills**

   * Categorized (e.g., Frontend, Backend, Tools)
   * Use `Badge` components for each skill

6. **Education**

   * Simple list format
   * Institution, degree, duration

7. **Footer**

   * Minimal
   * Copyright or small note

---

### 🎨 Design Requirements

* Use **shadcn/ui primitives wherever possible**:

  * Card
  * Badge
  * Button
  * Separator
* Maintain:

  * Consistent spacing (`space-y-*`, `gap-*`)
  * Max width centered layout (`max-w-3xl mx-auto`)
  * Clean typography using Tailwind
* Ensure:

  * Looks like a **printable resume**
  * Works in **light mode primarily** (dark mode optional)
* Avoid:

  * Heavy shadows
  * Bright colors
  * Complex animations

---

### 📱 Responsiveness

* Mobile-first design
* On smaller screens:

  * Stack sections vertically
  * Collapse multi-column layouts
* Ensure readability like a real resume

---

### ⚡ Static Site Requirements

* Use **Next.js static export**:

  * `output: 'export'` in `next.config.js`
* Avoid:

  * Server components requiring runtime data
  * API routes
* All content should be:

  * Hardcoded or sourced from local JSON

---

### 📂 Code Structure

* Use modular components:

  * `/components/sections/Header.tsx`
  * `/components/sections/Experience.tsx`
  * etc.
* Keep data separate:

  * `/data/resume.ts`

---

### ✨ Extra Enhancements (Optional but Preferred)

* Add a **"Download Resume" button** (links to PDF)
* Smooth scroll navigation (anchor links)
* Print-friendly styles (`@media print`)
* Sticky minimal header (optional)

---

### 🚫 Constraints

* Do NOT introduce external UI frameworks
* Do NOT deviate from shadcn design language
* Do NOT use dynamic backend features
* Keep everything **static and deployable on GitHub Pages**

---

### 📦 Expected Output

* Fully working Next.js static site
* Clean, readable, production-quality code
* Matches the look of a **modern one-page resume**
* Uses shadcn components correctly and consistently

---
