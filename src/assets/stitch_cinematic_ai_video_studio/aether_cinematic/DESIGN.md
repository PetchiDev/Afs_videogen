```markdown
# Design System Specification: Cinematic AI Video Platform

## 1. Overview & Creative North Star: "The Neon Auteur"
The Creative North Star for this design system is **"The Neon Auteur."** This vision moves away from the clinical, "SaaS-white" look toward a premium, cinematic environment. It treats the interface as a professional editing suite—an immersive, dark canvas where the content (AI-generated video) is the protagonist. 

To break the "template" feel, we employ **Intentional Asymmetry**. Larger display type is often offset or bled off-canvas, and UI elements are layered with varying levels of transparency to create a sense of physical space. This is not a flat interface; it is a digital stage built on depth, light, and motion.

---

## 2. Colors & Surface Philosophy
The palette is built on a foundation of absolute blacks (`#0e0e0f`) and deep charcoals, punctuated by high-energy electric pulses.

### Surface Hierarchy & The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are prohibited. Boundaries must be defined solely through background color shifts or tonal transitions.
- **Base Layer:** Use `surface` (`#0e0e0f`) for the primary application background.
- **Nesting Depth:** To define a sidebar or a secondary panel, shift to `surface_container_low` (`#131314`). 
- **Interactive Elements:** Cards and interactive modules should sit on `surface_container_highest` (`#262627`) to "pop" against the dark background.
- **Glass & Gradient Rule:** For floating modals or "Gen-AI" status bars, use a backdrop-blur (20px+) with `surface_variant` at 60% opacity. This creates a "frosted obsidian" effect.

### Signature Textures
Main CTAs and Hero accents should utilize a subtle linear gradient:
- **Primary Pulse:** `primary` (`#89acff`) to `primary_container` (`#739eff`) at a 135-degree angle.
- **Secondary Glow:** `secondary` (`#a68cff`) to `secondary_container` (`#591adc`).

---

## 3. Typography: Editorial High-Contrast
We utilize two distinct typefaces to create a "Media-Grade" hierarchy.

- **Display & Headlines (Space Grotesk):** A modern, geometric sans-serif with a futuristic "tech" edge. 
    - *Usage:* `display-lg` (3.5rem) should be used sparingly for hero statements with tight letter-spacing (-0.02em).
    - *Impact:* Use high-contrast weighting—pairing a `headline-lg` in Bold with a `title-sm` in Regular to create an editorial, magazine-like feel.
- **UI & Body (Manrope):** A highly legible, balanced sans-serif.
    - *Usage:* All functional labels and long-form descriptions. 
    - *Logic:* `body-md` (0.875rem) is our workhorse for tooltips and settings, providing clarity against the dark `surface`.

---

## 4. Elevation & Depth: Tonal Layering
In a cinematic system, depth is conveyed through light and opacity, not structural lines.

- **The Layering Principle:** Instead of shadows, use "stacking." A `surface_container_lowest` (`#000000`) element placed inside a `surface_container` creates an immediate, natural sense of a "sunken" input field or timeline track.
- **Ambient Shadows:** When an element must float (e.g., a context menu), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6)`. The shadow should feel like a soft "glow of darkness."
- **Ghost Borders:** If an edge needs definition for accessibility, use a "Ghost Border": `outline_variant` (`#484849`) at 20% opacity. Never use 100% opaque lines.
- **3D Card Effects:** Apply a subtle `rotateX` and `rotateY` transform on hover for video thumbnails, combined with a `primary` outer glow to simulate the card catching light from the screen.

---

## 5. Components

### Buttons
- **Primary:** High-gloss. Background: `primary` gradient. Text: `on_primary_fixed` (Black). 
- **Secondary/Ghost:** No background. Ghost Border (20% `outline`). On hover, transition to 10% `primary` background opacity.
- **Rounding:** Use `md` (0.375rem) for a professional, "tooled" look.

### Input Fields & Text Areas
- **Style:** "Sunken" aesthetic. Background: `surface_container_lowest` (`#000000`). 
- **Focus State:** Transition the Ghost Border to 50% `primary` opacity with a 2px `primary_dim` outer soft glow.

### Chips (Video Tags)
- **Action Chips:** Use `surface_container_high` with `label-md` typography.
- **Selection:** Use a subtle `secondary_container` tint to indicate active AI filters.

### Media Cards & Timelines
- **No Dividers:** Separate timeline tracks using alternating rows of `surface_container_low` and `surface_dim`. 
- **Glassmorphism:** Overlays on video previews (play buttons, timestamps) must use a `surface_bright` tint with a 12px blur.

### AI Progress Bars
- **Animation:** A moving gradient transition between `primary` and `tertiary` (`#81ecff`) to indicate "Generative" states.

---

## 6. Do's and Don'ts

### Do:
- **Use Negative Space:** Give the large `display-lg` typography room to breathe; treat the screen like a movie poster.
- **Vary Opacity:** Use `on_surface_variant` at 70% for secondary text to maintain the visual hierarchy of the dark theme.
- **Subtle Transitions:** All hover states should have a minimum 300ms cubic-bezier transition to feel "expensive" and smooth.

### Don't:
- **No Pure White Text:** Avoid using `#ffffff` for long body copy; use `on_surface_variant` (`#adaaab`) to reduce eye strain in the dark environment.
- **No Hard Borders:** Never use a 1px solid border to separate the sidebar from the main canvas. Use a tonal shift to `surface_container_low`.
- **No Default Grids:** Avoid perfectly symmetrical 4-column grids for creative tools. Use staggered layouts or varying card widths to imply a more "bespoke" AI creation process.

### Accessibility Note
Ensure that all `primary` and `secondary` accents maintain at least a 4.5:1 contrast ratio against the `surface` when used for functional icons or small text. Use `primary_fixed` for essential interactive indicators.```