---
name: Administrative Clarity
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006e2d'
  on-secondary: '#ffffff'
  secondary-container: '#7cf994'
  on-secondary-container: '#007230'
  tertiary: '#7c04d3'
  on-tertiary: '#ffffff'
  tertiary-container: '#9637ed'
  on-tertiary-container: '#f9ecff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#7ffc97'
  secondary-fixed-dim: '#62df7d'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005320'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb8ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6800b4'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Instrument Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Instrument Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Instrument Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-base:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-medium:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Instrument Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  timer-display:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  page-max-width: 1400px
  gutter: 16px
---

## Brand & Style

The design system is a high-precision enterprise management framework designed for governance and administrative efficiency. It balances professional authority with software ergonomics, creating a "clean slate" digital environment that reduces cognitive load during complex meeting lifecycles.

The visual narrative is built on **Modern Corporate Minimalism**. It utilizes heavy whitespace, a sophisticated cool-toned palette, and a structured grid to convey reliability and transparency. Interactive elements are clearly codified through functional color-coding, ensuring that "Live," "Review," and "Completed" states are instantly distinguishable. The atmosphere is airy and spacious, yet data-dense where necessary, utilizing razor-thin borders and subtle tonal layering rather than heavy shadows to maintain a "light" administrative aesthetic.

## Colors

The palette is anchored by a professional **Royal Blue** primary, used for core navigation and primary actions. Functional status is the secondary driver of color:

- **Primary (Royal Blue):** Core interactive states, active pipeline nodes, and primary CTA buttons.
- **Success (Emerald Green):** Completed stages, "Hadir" (Present) status, and final approvals.
- **AI (Deep Violet):** Reserved exclusively for AI-powered summaries, topic extraction, and automated drafts.
- **Warning (Safety Orange):** Pending corrections or items requiring immediate operator review.
- **Destructive (Red):** Stop actions, rejected states, and "Alpha" (Absent) marks.
- **Neutrals:** A range of Slate greys provide hierarchy. `#f8fafc` serves as the canvas background, while `#0f172a` is the high-contrast ink for primary headers.

## Typography

The system uses **Instrument Sans** for all UI copy to ensure high legibility in data-heavy views. The type scale is optimized for functional density. 

**Monospace Usage:** 
A secondary monospaced font (**JetBrains Mono**) is used strictly for recording timers, live transcript timestamps, and technical data points to ensure numerical alignment and a "live" technical feel.

**Hierarchy Rules:**
- **Headlines:** Always in Slate 900 (`#0f172a`) with tight tracking for a crisp, authoritative look.
- **Body:** Uses Slate 700 (`#475569`) for improved reading comfort.
- **Metadata:** Smaller 12px labels use Slate 500 (`#64748b`) and Medium weights to maintain clarity at small sizes.

## Layout & Spacing

This design system uses a **Fluid Grid** with a fixed maximum boundary of 1400px for standard dashboards. The spacing rhythm is built on a 4px baseline.

- **Margins:** Standard page views use 32px (xl) margins on desktop, scaling down to 16px (md) on mobile.
- **Internal Padding:** Cards and containers use a generous 24px (lg) padding to maintain "breathability" even when containing dense tables.
- **Grid Models:**
  - **Stats Row:** 4-column responsive grid.
  - **Review Layout:** A 3-column split (`1fr 1.5fr 1fr`) for detail-heavy document reviews.
  - **Standard Split:** A `1.5fr 1fr` split for main content vs. secondary metadata panels.

## Elevation & Depth

Visual hierarchy is primarily achieved through **Tonal Layering** and **Low-Contrast Outlines** rather than aggressive shadows.

- **Surface Tiering:** Elevated content sits on pure white containers (`#ffffff`) placed over a soft slate background (`#f8fafc`).
- **Borders:** Every card, input, and table row is defined by a 1px border (`#e2e8f0`). This "razor-thin" approach maintains a precise, administrative feel.
- **Shadows:** Use a single, extra-diffused "Soft Shadow" (`0px 1px 3px rgba(15, 23, 42, 0.05)`) for primary cards to provide just enough lift from the background.
- **Interactive Depth:** On hover, cards transition their border color to a subtle Blue tint (`#bfdbfe`) rather than increasing shadow depth.

## Shapes

The shape language is consistently **Rounded** (Level 2) to soften the professional aesthetic and make the tool feel modern and accessible.

- **Cards:** Use `rounded-xl` (1.5rem / 24px) for major layout containers to create distinct, friendly sections.
- **Buttons & Inputs:** Use standard `rounded-lg` (1rem / 16px) for a balanced, functional feel.
- **Status Pills:** Always use `rounded-full` (9999px) to clearly distinguish them from interactive buttons or square containers.

## Components

### Status Stepper (Pipeline)
The signature component. It consists of a horizontal line with 40px circular nodes.
- **Completed:** Green outline, green check icon, green connector.
- **Active:** Solid Royal Blue fill, white text, blue shadow.
- **Pending:** Slate 200 outline, Slate 400 text, grey connector.

### Data Tables
Tables should avoid heavy alternating row colors. Use a light slate header (`#f8fafc`) and thin dividers (`#f1f5f9`). Rows should have a subtle hover state (`#f8fafc`). Primary identifiers (e.g., Meeting Names) should be Bold Slate 900.

### Status Badges
Small, pill-shaped tags with light background tints and darker text:
- **Success:** Emerald 50 background, Emerald 600 text.
- **Info:** Blue 50 background, Blue 600 text.
- **Live:** Includes a pulsing 6px dot next to the text.

### Cards & Inputs
- **Cards:** Pure white, 1px border, 24px padding.
- **Input Fields:** 40px height, 1px Slate 200 border. On focus, use a 1px Blue 500 ring.
- **AI Widgets:** Distinctive subtle Violet 50 background with Violet 200 borders to signal automated content.