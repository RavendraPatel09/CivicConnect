# CivicConnect AI — Design System Specification

**Version**: 2.0 (Editorial Civic-Tech Edition)  
**Target Atmosphere**: Authoritative, Transparent, Dependable, Accessible  

---

## 1. Color Palette & Semantic Tokens

### 1.1 Core Palette

| Token | Hex Value | Semantic Purpose |
| :--- | :--- | :--- |
| `background` | `#FAFAF7` | Warm white default surface background |
| `surface` | `#FFFFFF` | Primary content panels, tables, cards |
| `primary` | `#183B3A` | Deep forest navy — headings, high-priority buttons, brand identity |
| `accent` | `#2563EB` | Civic blue — action links, active state, location markers |
| `secondary` | `#3B8278` | Muted teal — secondary emphasis, verified milestones |
| `text` | `#202B2A` | Primary body typography (high contrast, WCAG AAA) |
| `muted` | `#66736F` | Secondary labels, timestamps, metadata |
| `border` | `#E5E8E4` | Restrained architectural grid borders |
| `border-subtle` | `#F0F2EE` | Low-contrast dividing lines between rows |

### 1.2 Status System (Operational Grievance Lifecycle)

| Status | Color | Token Class | Meaning |
| :--- | :--- | :--- | :--- |
| **Filed** | Neutral Slate (`#64748B`) | `bg-slate-100 text-slate-800 border-slate-200` | Incident received from citizen, queued for review |
| **Acknowledged** | Civic Blue (`#2563EB`) | `bg-blue-50 text-blue-800 border-blue-200` | Validated by municipal triage, department assigned |
| **In Progress** | Amber (`#B7791F`) | `bg-amber-50 text-amber-800 border-amber-200` | Work order issued, field crew dispatched |
| **Resolved** | Civic Green (`#23845B`) | `bg-emerald-50 text-emerald-800 border-emerald-200` | Field repair completed with inspection evidence |
| **Rejected** | Crimson (`#C34B4B`) | `bg-rose-50 text-rose-800 border-rose-200` | Closed without action (duplicate, outside jurisdiction) |

### 1.3 Dark Mode Equivalent

Dark mode is preserved as an accessible secondary theme with deep ink navy (`#0B1320`) and charcoal surface panels (`#131E30`), using WCAG AA compliant text (`#F1F5F9`) and muted borders (`#22344D`).

---

## 2. Typography Hierarchy

| Style | Font Family | Size / Line-Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | Manrope | `3rem (48px)` / 1.15 | 800 (Extrabold) | `-0.025em` | Hero main heading |
| **Section Title** | Manrope | `2rem (32px)` / 1.25 | 700 (Bold) | `-0.02em` | Section headers, page titles |
| **Component Header**| Manrope | `1.25rem (20px)` / 1.4 | 600 (Semibold) | `-0.01em` | Panel titles, modal headers |
| **Body (Primary)** | Inter | `1rem (16px)` / 1.6 | 400 (Regular) | `0` | Long-form reading copy |
| **Body (Compact)** | Inter | `0.875rem (14px)` / 1.5 | 400 / 500 | `0` | Dashboard tables, form descriptions |
| **Eyebrow / Overline**| Manrope | `0.75rem (12px)` / 1.2 | 700 (Bold) | `+0.05em` | Category badges, step numbering |
| **Data / Numbers** | Inter (tabular) | `0.875rem (14px)` / 1 | 600 (Semibold) | `0` | Coordinates, dates, ticket IDs |

---

## 3. Component Standards

### 3.1 Buttons
* **Primary**: Solid deep forest navy (`#183B3A` / hover `#122C2B`) or civic blue (`#2563EB`). Rectangular with subtle rounding (`rounded-md` or `rounded-lg`). **Never generic pills (`rounded-full`)**.
* **Secondary**: Light warm surface with crisp border (`border-[#E5E8E4]` hover `bg-[#F4F5F0]`).
* **Ghost**: Minimal background on hover, zero resting border.

### 3.2 Forms & Inputs
* Solid white background (`#FFFFFF`), 1px structural border (`#E5E8E4`).
* Focus state: Clean 2px civic blue ring (`#2563EB`) with zero glow blur.
* Clear typography for labels (`text-sm font-semibold text-[#202B2A]`).
* Inline error indicators with high contrast crimson text (`#C34B4B`).

### 3.3 Data Tables (TanStack Table)
* High-density horizontal rows with alternating hover highlights (`hover:bg-[#F9FAF8]`).
* Column headers: Left-aligned with subtle sort indicator arrows (`ArrowUpDown`).
* Status indicators: Clean rectangular badges with solid 6px indicator dots.
* Pinned right-side action buttons (`Inspect`, `Update Status`).

### 3.4 Maps (Leaflet)
* Neutral architectural map tiles (CARTO Voyager / OpenStreetMap).
* Crisp custom SVG pin markers with semantic category colors.
* Clear demonstration notice (`Demonstration Prototype Data — Not Live Municipal Records`).

---

## 4. Layout & Spacing Scale

* Baseline grid: 4px / 8px scale (`gap-2`, `gap-4`, `gap-6`, `gap-8`, `gap-12`).
* Max container width: `max-w-7xl (1280px)` for public pages, `max-w-7xl` with 240px fixed sidebar for dashboards.
* Whitespace: Generous editorial margins (`py-20` on sections), clean vertical rhythm.
