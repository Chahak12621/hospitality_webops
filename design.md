# PARADOX '26 — Design System for Website Generation
> Theme: **"Symphony in Shades"** | IIT Madras BS Presents

---

## 1. Brand Identity

### Event
- **Name:** PARADOX '26
- **Full Name:** IIT Madras BS Presents — Paradox '26
- **Tagline:** Symphony in Shades
- **Organized by:** IIT Madras BS (Online BSc Degree Program)

### Core Concept
Paradox '26 is built around the idea that we live in a monochrome world of labels, but within us exists a vibrant spectrum. The theme contrasts passive acceptance with the courage to ask "why," celebrating complexity over stereotypes.

> **One-line brand truth:** *"Your authentic self is contradictory to society's norms."*

### Key Philosophical Pillars
1. **The Monochrome World** — Black/grey/white = labels, stereotypes, routine thinking
2. **The Hidden Spectrum** — The "curious side" within — full of emotion and story
3. **The Quest for Colour** — Choosing understanding over assumption
4. **The Role of Paradox** — A space where no single colour dominates, no single emotion defines
5. **The Core Message** — Uniqueness = the courage to look deeper, not invent something new

---

## 2. Colour Palette

Use these EXACT hex codes. No deviations without approval.

### Vibrants (Primary bold colours)
| Swatch | Hex | Use |
|--------|-----|-----|
| Blue | `#419bd9` | Accent, links, technical elements |
| Green | `#406014` | Nature, grounding elements |
| Yellow | `#ffb000` | Energy, highlights, CTAs |
| Orange | `#f15610` | Sports, action, warmth |
| Crimson | `#970811` | Drama, emphasis, hints |
| Pink | `#f56483` | Culturals primary, soft energy |
| Purple | `#703c84` | Culturals primary, brand identity |
| Black | `#0b0705` | Text, contrast |

### Pastels (Secondary, softer tones)
| Swatch | Hex | Use |
|--------|-----|-----|
| Soft Teal | `#91c5c1` | Backgrounds, soft sections |
| Sage | `#b9b76d` | Secondary accents |
| Pale Yellow | `#ffcf7a` | Warm backgrounds |
| Amber | `#f28705` | Warm accents |
| Salmon | `#ed765c` | Soft orange tones |
| Blush | `#eabfbe` | Soft pink backgrounds |
| Lavender | `#d8d0e8` | Purple pastel sections |

### Gloss (Lightest, near-white tones)
| Swatch | Hex | Use |
|--------|-----|-----|
| Mint Gloss | `#d0e7dd` | Hero backgrounds, wash layers |
| Lime Gloss | `#d1daad` | Subtle green fills |
| Cream | `#ffe8b5` | Warm section fills |
| Peach | `#ffc699` | Gloss orange-pink |
| Rose Gloss | `#fcc4b7` | Soft pinkish fill |
| Petal | `#fdcbca` | Light pink washes |
| Lilac | `#ebdbe6` | Soft lavender fills |

### Neutrals
| Swatch | Hex | Use |
|--------|-----|-----|
| Near-Black | `#0b0705` | Primary text |
| White | `#ffffff` | Backgrounds, cards |

### Purpose of Shades (gradient rows between vibrant and gloss)
- Use shades when vibrants/pastels/gloss don't provide enough contrast or hierarchy
- Use for background gradients and smooth-flow vibes (e.g., hero sections, full-bleed areas)

### CSS Variables (copy into :root)
```css
:root {
  /* Vibrants */
  --col-blue: #419bd9;
  --col-green: #406014;
  --col-yellow: #ffb000;
  --col-orange: #f15610;
  --col-crimson: #970811;
  --col-pink: #f56483;
  --col-purple: #703c84;
  --col-black: #0b0705;

  /* Pastels */
  --col-teal: #91c5c1;
  --col-sage: #b9b76d;
  --col-pale-yellow: #ffcf7a;
  --col-amber: #f28705;
  --col-salmon: #ed765c;
  --col-blush: #eabfbe;
  --col-lavender: #d8d0e8;

  /* Gloss */
  --col-mint: #d0e7dd;
  --col-lime: #d1daad;
  --col-cream: #ffe8b5;
  --col-peach: #ffc699;
  --col-rose: #fcc4b7;
  --col-petal: #fdcbca;
  --col-lilac: #ebdbe6;

  /* Neutrals */
  --col-white: #ffffff;
}
```

---

## 3. Typography

Five fonts in hierarchy order. All must be imported from Google Fonts or system where available.

| Priority | Font Name | Role | Style |
|----------|-----------|------|-------|
| 1st — Primary | **Roxaine Serif** | Main headings, hero titles | Bold, high-contrast serif |
| 2nd — Secondary | **Pastone** | Section headings, sub-headings | Elegant serif |
| 3rd — Tertiary | **Cormorant Upright** | Sub-headings, body text | Refined upright italic |
| 4th — Quaternary | **Tarif** | Body text, CTAs | Clean modern serif |
| 5th — Quinary | **Optima** | Body text, captions, utility | Humanist sans-serif |

> **Google Fonts fallbacks:** If Roxaine/Pastone/Tarif unavailable, use `Playfair Display` for headings and `Cormorant Garamond` for body. Cormorant Upright and Optima are on Google Fonts.

### Type Scale (recommended)
```css
--text-hero: clamp(3rem, 8vw, 7rem);      /* Roxaine Serif */
--text-h1: clamp(2.5rem, 6vw, 5rem);      /* Roxaine or Pastone */
--text-h2: clamp(1.75rem, 4vw, 3rem);     /* Pastone */
--text-h3: clamp(1.25rem, 2.5vw, 2rem);   /* Cormorant Upright */
--text-body: clamp(1rem, 1.5vw, 1.25rem); /* Tarif or Optima */
--text-caption: 0.875rem;                  /* Optima */
```

### Typography Rules
- Font sizes, weights, and styles must follow this hierarchy
- Use typography on CLEAN backgrounds — avoid visually cluttered backgrounds
- No unauthorized fonts without Paradox Multimedia approval

---

## 4. Logo

### Primary Logo
- **Style:** Circular badge/seal
- **Background:** Purple-to-pink gradient (deep purple `#703c84` → pink `#f56483`)
- **Inner element:** Spiral dot pattern (Fibonacci/golden spiral of pearls/dots)
- **Text:** "IIT MADRAS" (small, top) + "PARADOX" (large, center, white bold)
- **Shape:** Circle with organic/blob edge treatment

### SVG Logo Reconstruction
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <radialGradient id="logoGrad" cx="45%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#f56483"/>
      <stop offset="60%" stop-color="#703c84"/>
      <stop offset="100%" stop-color="#4a1a6b"/>
    </radialGradient>
    <!-- Outer ring gradient -->
    <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b3fa8"/>
      <stop offset="100%" stop-color="#4a1060"/>
    </radialGradient>
  </defs>
  <!-- Outer badge ring -->
  <circle cx="100" cy="100" r="98" fill="url(#ringGrad)" />
  <!-- Inner circle -->
  <circle cx="100" cy="100" r="90" fill="url(#logoGrad)" />
  <!-- Spiral dots (approximate, concentric rings) -->
  <!-- Ring 1 -->
  <circle cx="100" cy="60" r="2" fill="rgba(255,255,255,0.7)"/>
  <circle cx="120" cy="65" r="2" fill="rgba(255,255,255,0.7)"/>
  <circle cx="135" cy="78" r="2.5" fill="rgba(255,255,255,0.75)"/>
  <circle cx="140" cy="95" r="2.5" fill="rgba(255,255,255,0.75)"/>
  <circle cx="135" cy="112" r="2.5" fill="rgba(255,255,255,0.8)"/>
  <circle cx="125" cy="126" r="3" fill="rgba(255,255,255,0.8)"/>
  <circle cx="112" cy="136" r="3" fill="rgba(255,255,255,0.85)"/>
  <circle cx="95" cy="140" r="3.5" fill="rgba(255,255,255,0.85)"/>
  <circle cx="78" cy="136" r="3.5" fill="rgba(255,255,255,0.9)"/>
  <circle cx="64" cy="126" r="4" fill="rgba(255,255,255,0.9)"/>
  <circle cx="58" cy="112" r="4" fill="rgba(255,255,255,0.9)"/>
  <circle cx="58" cy="95" r="4" fill="rgba(255,255,255,0.95)"/>
  <circle cx="64" cy="78" r="4.5" fill="rgba(255,255,255,0.95)"/>
  <circle cx="78" cy="66" r="4.5" fill="rgba(255,255,255,1)"/>
  <!-- Center dot -->
  <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.6)"/>
  <!-- Text: IIT MADRAS -->
  <text x="100" y="88" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="600" fill="white" letter-spacing="2">IIT MADRAS</text>
  <!-- Text: PARADOX -->
  <text x="100" y="108" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="20" font-weight="900" fill="white" letter-spacing="1">PARADOX</text>
</svg>
```

### Word Mark
- **Style:** Decorative illustrative — each letter of "PARADOX" contains a unique icon embedded in it (star, dragonfly, citrus slice, vinyl record, music notes, windmill)
- **Supporting line:** "IIT Madras BS PRESENTS" (small, above) + "Symphony in Shades" (italic, below right)
- **Available on:** dark background (black text) and light background (white text)
- **Background swatch color:** `#ed765c` (salmon/peach orange)

---

## 5. Visual Direction by Category

### 5A. Culturals (Arts, Drama, Music, Dance)
- **Primary colours:** Pink (`#f56483`) + Purple (`#703c84`)
- **Secondary colours:** Yellow (`#ffb000`) + Green (`#406014`)
- **Accent/Highlights:** Red (`#970811`)
- **Mood:** Flow + dreamy + smooth
- **Layout style:** Font-heavy with creative font play; text IS the design
- **Visual references:** Movie poster aesthetic, Tangled (Disney) art direction — purple/gold dramatic contrast, whimsical illustration, glowing orbs
- **Feel words:** nostalgia, homecoming, bittersweet-hysteria, animated, sepia-warm

### 5B. Technicals (Science, Tech, Engineering)
- **Primary colours:** Blue (`#419bd9`) + Neutrals/Grey tones
- **Accent/Highlights:** Yellow (`#ffb000`) + Red (`#970811`) + Orange (`#f15610`)
- **Mood:** Smooth + innovative + images/layout driven
- **Layout style:** Clean grid, image-first, minimal decorative elements, bold typography contrast
- **Visual references:** Nike product ads, editorial tech magazines, Swiss/German poster design
- **Feel words:** vibrance, fascination, cognitive (transitional opportunity to ask "why")

### 5C. Sports (Athletics, Gaming, Competitions)
- **Primary colours:** Red (`#970811`) + Yellow (`#ffb000`)
- **Secondary colour:** Orange (`#f15610`)
- **Accent/Hints:** Red + Yellow + Blue
- **Mood:** Active + text play + graphic
- **Layout style:** Bold typography, action photography integration, graphic shapes behind objects
- **Visual references:** Sports poster design, boxing/running posters, game day graphics
- **Feel words:** ecstasy, lively, joyous, blissful

---

## 6. Design Principles & Mood

### Overall Brand Mood Words
- **Culture:** explore, discover, ecstasy, creative, festive, melodic, care-free, blissful
- **Voice:** yester-year, reminiscence, whimsical, melancholic, escape, lively, adorable, joyous
- **Feel:** nostalgia, homecoming, emotional-whiplash, bittersweet-hysteria, animated, sepia*, vivid, rough
- **Audience:** vestige, harmony, questioning, unanimous*, wonderment, novelty, tranquil
- **Impact:** depth, relatability, vibrance, fascination, cognitive*, slice-of-life
- **X-Factor:** quirky, articulate, radiant, inimitable, ephemeral*

*Definitions:*
- **cognitive** = transitioning opportunity; a moment that makes you ask "why"
- **sepia** = warm & nostalgic tone
- **unanimous** = collectively felt, shared emotion
- **ephemeral** = fleeting, beautiful in its impermanence

### Design DOs
- Use gradients that blend palette colours — smooth, flowing transitions
- Mix font weights dramatically for hierarchy (ultra-light body + ultra-bold headline)
- Let typography BE the visual element (font-play layouts)
- Use pastel/gloss colours for backgrounds; vibrants for text/elements
- Keep logos and typography on CLEAN backgrounds
- The Paradox logo must be 1.5× larger than any other org logo on the same material

### Design DON'Ts
- No cluttered, busy backgrounds behind logo or text
- No unauthorized fonts
- No logo modifications, alterations, or distortions
- No external designers — all design goes through Paradox Multimedia team
- No deviations from colour palette without written approval

---

## 7. Layout & Component Guidance

### Hero Section
- Full-bleed background: Gradient using gloss colours (`#d0e7dd` → `#fdcbca` → `#ebdbe6`) with soft painterly feel
- Main headline: Roxaine Serif, `--col-pink` or `--col-purple`, huge scale
- Tagline: Cormorant Upright italic, `--col-purple`
- Logo: Top-left or centered, minimum 80px diameter
- CTA Button: Vibrant fill (`--col-pink` or `--col-yellow`), dark text or white text

### Navigation
- Background: White (`#ffffff`) or near-transparent with blur
- Logo: Left-aligned
- Links: Optima or Tarif, `--col-black`, hover → `--col-purple`
- Active state: `--col-pink` underline or color change

### Cards / Event Tiles
- Background: Gloss or pastel (e.g., `#fcc4b7`, `#d8d0e8`)
- Border: 1–2px, vibrant colour matching category (pink for culturals, blue for tech, red for sports)
- Heading: Pastone or Roxaine, vibrant colour
- Body: Tarif or Optima, `--col-black`
- Hover: Slight lift + shadow + border colour intensifies

### Buttons
- Primary: `background: #f56483`, `color: #ffffff`, border-radius: 4–8px
- Secondary: `background: transparent`, `border: 2px solid #703c84`, `color: #703c84`
- CTA/Action: `background: #ffb000`, `color: #0b0705`
- Hover: Darken by 10%, slight scale(1.02)

### Section Dividers
- Use gradient bands: `linear-gradient(135deg, #fdcbca, #ebdbe6, #d0e7dd)`
- Or decorative horizontal rules in `--col-pink` or `--col-purple`

### Backgrounds
- Hero: Soft painterly gradient (multicolor, pastel-gloss range)
- Content sections: Alternating white and gloss/pastel washes
- Dark sections (if needed): `#0b0705` with vibrant accents
- Avoid solid single-colour backgrounds; prefer gradients or textures

---

## 8. Animation & Motion Guidelines

- **Overall feel:** Smooth, flowing, dreamy — not sharp or jarring
- **Hero entrance:** Staggered fade-in + slight upward drift for text elements
- **Scroll reveals:** Fade-in with translateY(20px → 0) as elements enter viewport
- **Hover on cards:** scale(1.02) + box-shadow increase, 200ms ease
- **Colour transitions:** 300ms ease on all color/border changes
- **Background gradients:** Consider slow-moving gradient animation (20–30s loop) for hero

```css
/* Recommended base animation */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.hero-bg {
  background: linear-gradient(135deg, #d0e7dd, #fdcbca, #ebdbe6, #ffe8b5, #d8d0e8);
  background-size: 300% 300%;
  animation: gradientShift 20s ease infinite;
}
```

---

## 9. Website Structure (Recommended Pages)

### Home / Landing
1. **Hero** — "PARADOX '26 | Symphony in Shades" + tagline + CTA ("Register Now" / "Explore Events")
2. **About the Theme** — 3-column layout: Monochrome World / Hidden Spectrum / Quest for Colour
3. **Event Categories** — 3 cards: Culturals / Technicals / Sports (with category-specific colour theming)
4. **Featured Events** — Grid of event cards
5. **Stats Bar** — Number of events, participants, prize pool, days
6. **Sponsors / Partners** — Logo row on white background
7. **Footer** — Contact: design-content@iitmparadox.org | Naina Bhatt, Core of Multimedia Productions

### Events Page
- Filter tabs: All | Culturals | Technicals | Sports
- Card grid with category-color theming per section direction above
- Each card: Event name (Roxaine/Pastone), short tagline, registration link

### About Page
- Full theme write-up with visual treatment (pull quotes, colour-coded sections)
- Team section

---

## 10. Contact & Assets

- **Multimedia Core:** Naina Bhatt
- **Email:** design-content@iitmparadox.org
- **Assets folder:** Link provided in brand kit (Paradox Multimedia team controls access)

---

## 11. Brand Rules Summary (for agent)

1. Only use hex colours from Section 2 above
2. Only use fonts from Section 3 above (or specified fallbacks)
3. Logo must not be modified — use SVG from Section 4
4. Paradox logo must always be 1.5× larger than any other org logo
5. No typography or logo on cluttered/busy backgrounds
6. Culturals = Pink+Purple primary; Technicals = Blue+Neutral primary; Sports = Red+Yellow primary
7. All backgrounds should feel painterly, gradient, dreamy — not flat solid colours
8. Typography hierarchy: Roxaine (hero) → Pastone (h2) → Cormorant Upright (h3) → Tarif/Optima (body)
9. Motion: smooth, flowing, 200–300ms transitions; dreamlike not snappy
10. The brand truth permeates everything: complexity over labels, spectrum over monochrome

---

*This design system is crafted by the Paradox Multimedia Team and approved by the Paradox '26 Secretaries. All generated designs must align with these specifications.*
