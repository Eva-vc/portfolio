---
name: Art Portfolio — The Fixed Label
description: A warm-grey paper room where the work moves and one label stays bolted to the wall.
colors:
  paper: "#f1f1f1"
  ink: "#1d1d1b"
  ink-soft: "rgba(29, 29, 27, 0.68)"
  ink-faint: "rgba(29, 29, 27, 0.32)"
  rule: "rgba(29, 29, 27, 0.16)"
typography:
  display:
    fontFamily: "Newsreader, 'Times New Roman', Georgia, serif"
    fontSize: "clamp(50px, 8rem, 80px)"
    fontWeight: 300
    lineHeight: 0.8
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Newsreader, 'Times New Roman', Georgia, serif"
    fontSize: "clamp(16px, 2.2rem, 22px)"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "0"
  title:
    fontFamily: "Newsreader, 'Times New Roman', Georgia, serif"
    fontSize: "clamp(19px, 2.4rem, 26px)"
    fontWeight: 300
    lineHeight: 1.34
    letterSpacing: "0"
  body:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, sans-serif"
    fontSize: "clamp(15px, 1.6rem, 17px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  label:
    fontFamily: "'Hanken Grotesk', system-ui, -apple-system, sans-serif"
    fontSize: "clamp(10px, 1.2rem, 12px)"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.04rem"
    fontFeature: "tabular-nums (counters only)"
rounded:
  none: "0px"
spacing:
  gutter: "9rem"
  gutter-narrow: "3rem"
  chrome-top: "4.4rem"
  chrome-top-narrow: "2.6rem"
  label-left: "10rem"
  label-tuck: "10rem"
  label-min: "30rem"
  label-width-info: "44rem"
  info-reserve: "7rem"
  work-gap: "clamp(96px, 17vh, 220px)"
  work-height: "min(69vh, 78vw)"
  label-band: "170px"
components:
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  nav-link-current:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
  nav-link-disabled:
    textColor: "{colors.ink-faint}"
    typography: "{typography.label}"
  header:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "4.4rem 9rem"
  counter:
    textColor: "{colors.ink-soft}"
    typography: "{typography.label}"
  progress-segment:
    backgroundColor: "{colors.ink-faint}"
    height: "1px"
    size: "44px"
  progress-segment-filled:
    backgroundColor: "{colors.ink}"
    height: "1px"
  progress-segment-hover:
    backgroundColor: "{colors.ink-soft}"
    height: "1px"
  slide:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.none}"
  slide-seethrough:
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
  fixed-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    width: "max(30rem, (100vw - var(--work-width)) / 2 + 10rem - 10rem)"
  info-row:
    textColor: "{colors.ink}"
    padding: "1.4rem 0"
    rounded: "{rounded.none}"
---

# Design System: Art Portfolio — The Fixed Label

## Overview

**Creative North Star: "The Hung Room, Re-measured"**

This is a warm-grey room with one piece of furniture in it. The paper never changes, the ink never changes, and the only things that move are the works: they scroll past a label bolted to the left wall, or they wait in a row and stack onto a pile one by one, like pages laid out on a table. Every visual decision is subtractive — there is no accent hue, no radius, no card, no container, and **no shadow anywhere**.

Almost every value here was **measured, not chosen**. The palette, the fluid root scale, the type metrics, the gutter, the label's anchor point, and the settle curve were read off the live reference `giannantoniodemalde.com` (its stylesheet `/_astro/about.BojjPLFS.css` plus inlined critical CSS) and recorded token by token in `src/tokens.css`, each one carrying the rule it came from. That provenance is the most load-bearing fact about this system: a future change that contradicts a `VERIFIED` comment is not a taste disagreement, it is a regression against a source. Two places where the original brief's unverified reading lost to the stylesheet are settled and confirmed with the user: the ground is warm grey, not white, and there is **no magenta accent** — nor any accent hue at all. Labels are sentence case, never uppercase and never wide-tracked.

The scale is the second mechanism. `1rem` is a fraction of the viewport (`clamp(7px, calc(100vw / 1920 * 10), 11px)`), so the whole composition scales rather than reflows, and every size then carries its own px clamp so nothing collapses on a laptop. Emphasis is made only with opacity, scale and motion. A visitor who asks for reduced motion gets the same room with the travel taken out — GSAP still writes every final value, so nothing can be stranded half-revealed.

**Key Characteristics:**
- One paper ground, one ink and three opacities of it. No accent colour exists.
- Fluid root font-size; every rem is a fraction of the viewport, every size individually clamped.
- A serif display face over a small grotesk furniture face, both acknowledged stand-ins.
- Square corners everywhere; 1px hairlines are the only dividers.
- No shadow anywhere. Depth is real stacking and nothing else.
- A fixed label whose width is a measured relationship to the work's edge, not a constant.
- All animation is GSAP, routed through one reduced-motion gate.

## Colors

A single warm-grey paper with one ink stepped through three opacities; the artwork supplies every colour on screen.

### Primary

There is no accent. The ink is the only hue the interface owns, and it is the primary.

- **Reference Ink** (`#1d1d1b`): the live reference's own brand ink. Every piece of primary text, the current nav item, a filled progress segment, focus outlines, selection background, caret and accent-color. It is near-black but not black, which is why it never looks like a browser default on this ground.

### Neutral

- **Reference Paper** (`#f1f1f1`): the ground of the page and of the info panel. A page carries no ground of its own — it is its own artwork. A PDF page of a work is drawn on white, because a page is a sheet; a see-through layer and every label are drawn on nothing, because they are marks on this paper rather than sheets laid on it. The info panel's ground is paper because a wash needs a canvas to spread over.
- **Ink at Reading Strength** (`rgba(29,29,27,0.68)`, 5.4:1 on paper): secondary text — the counter, panel markers, row labels, and any nav destination you are not currently at.
- **Ink at Rest** (`rgba(29,29,27,0.32)`): inert marks and spent chrome only — an unfilled progress track, a disabled Prev, the thin scrollbar thumb. **Never body text.**
- **Hairline** (`rgba(29,29,27,0.16)`): the single divider weight in the system, used at 1px under the info marker and between contact rows.

### Named Rules

**The No Accent Rule.** There is no accent colour anywhere in this system, and adding one is a change to the world, not a styling decision. Emphasis is made with opacity, scale and motion. Audit test: if a screenshot contains a hue the artwork did not put there, it is wrong.

**The Three Opacities Rule.** Ink appears at exactly four strengths — full, 0.68, 0.32, 0.16 — and each has one job (primary, secondary, inert, divider). A fifth opacity is a new token and needs a reason no existing one serves.

**The Ink Owns the Browser Rule.** Caret, selection, form accent and scrollbar are set to the system's own ink. Browser surfaces belong to the design too.

## Typography

**Display Font:** Newsreader (Light 300), with Times New Roman / Georgia fallback
**Body / Label Font:** Hanken Grotesk (400/500), with system-ui fallback

**Both families are placeholders, not commitments.** They are acknowledged free stand-ins for the reference's licensed Tiempos Headline Light and ABC Diatype, chosen because they are close in kind — Newsreader is a Times-descended low-contrast text serif, Hanken Grotesk a neo-grotesk. Swapping them in when licences exist is expected and should not disturb any metric here; the metrics are the reference's, the faces are not.

**Character:** A quiet, high-contrast pairing: one large light serif that does all the naming, and one small grotesk that does all the counting, labelling and reading. Nothing between them competes.

### Hierarchy

- **Display** (Newsreader 300, `clamp(50px, 8rem, 80px)`, leading 0.8, tracking -0.01em): the label's title when a value has no supplied artwork, and nothing else. Leading below 1 is deliberate: two title lines should read as one block.
- **Headline** (Newsreader 300, `clamp(16px, 2.2rem, 22px)`, tracking 0): the artist name in the header, the only serif in the chrome.
- **Title** (Newsreader 300, `clamp(19px, 2.4rem, 26px)`, leading 1.34): the lead paragraph of an info panel — one step up from body, serif, to open a panel the way a display line opens a work.
- **Body** (Hanken Grotesk 400, `clamp(15px, 1.6rem, 17px)`, leading 1.5, tracking 0): info panel prose and contact values. Measure capped at **62ch**. Tracking is explicitly zeroed here; the label tracking must not leak into reading text.
- **Label** (Hanken Grotesk 400, `clamp(10px, 1.2rem, 12px)`, leading 1.2, tracking 0.04rem, **sentence case**): the document default. Nav, counters, Prev/Next, row labels, panel markers, the label's caption line. Counters add tabular numerals so digits do not jitter as they change.

### Named Rules

**The Sentence Case Rule.** Labels are sentence case with 0.04rem tracking. Never uppercase, never wide-tracked. This is verified from the reference (which sets no `text-transform` anywhere) and was chosen by the user over the mockups' uppercase-at-0.14em rendering.

**The Own-Clamp Rule.** Every type size carries its own px clamp on top of the fluid root. The root floor exists only to guard absurdly narrow desktop windows; raising it to force any single element wide is forbidden — it pins the scale flat across every real laptop and defeats the mechanism.

**The Two Faces Rule.** Serif names things; grotesk counts, labels and is read. There is no third face and no weight outside 300 (serif) and 400/500 (grotesk).

## Layout

The page never scrolls. `html`, `body` and `#root` are full-bleed with `overflow: hidden`; the app is one `100dvh` box and each surface is absolutely positioned inside it. Only the home gallery scrolls, and it scrolls inside itself with the scrollbar hidden — the counter and the keyboard carry the same information a scrollbar would.

**The rhythm is the reference's own:** chrome sits on a **9rem** side gutter with a **4.4rem** top/bottom inset, and the fixed label is anchored at **left: 10rem**, vertically centred. Works are portrait, fit-to-height at `min(69vh, 78vw)`, centred, capped at `min(46vw, 620px)` wide, with `clamp(96px, 17vh, 220px)` of paper between them and half-screen padding at each end so the first and last work can also reach centre. Nothing is ever cropped.

**The label's width is a relationship, not a value.** `src/useWorkFrame.ts` measures the active work's rendered `offsetWidth` and publishes it as `--work-width` on the root; the label then spans from its own anchor to `--label-tuck` (10rem) past the work's left edge, floored at 30rem. Layout width is used rather than a bounding rect precisely because slides are moved with transforms and would otherwise report an offstage position. On `/info` there is no work to measure, so the label takes a fixed `44rem` and the prose reserves that same token plus `7rem` — one value, so the two cannot drift apart.

**Narrow (≤860px) is a bargain, not a shrink.** The root switches to `clamp(9px, 2.6vw, 11px)`, the gutter drops to 3rem, and the bottom **170px** of the screen is given to the label outright: the gallery column stops above that band, the label unpins from centre and stretches gutter to gutter, the tuck goes to zero, and images take 82vw. The label is still fixed and still never moves; it simply has its own paper instead of lying over a work it could not stay legible against at that size.

### Named Rules

**The Label Never Moves Rule.** The label is fixed and is mounted once in the shell, outside the routes. It does not move on scroll, between slides, or across navigation — the value changes, the box does not. Route-boundary values are built to be identical on both sides so the crossing is invisible. Audit test: screenshot the label at the top and bottom of the gallery; the two must be pixel-identical in position.

**The Measured Tuck Rule.** Any dimension that expresses the relationship between two elements is measured and published as a custom property, never hard-coded to look right at one viewport.

## Elevation & Depth

This system is flat. Depth is made by **real stacking**, not by shadow: pages are absolutely positioned layers, page *k* always above page *k-1*, and a page with alpha simply lets the one beneath show through. No card, no lifted surface, no shadow anywhere.

The pages ahead are not hidden offstage. They sit in a row to the right, visible and waiting, and each travels left onto the pile when its turn comes — so the layering is shown rather than implied, and needs no drawn cue.

### Shadow Vocabulary

There is none. BRIEF.md §4.5 asked for a leading-edge shadow so the overlap would read as layering; it was built first as `box-shadow: -24px 0 60px rgba(0,0,0,.08)`, then as a travelling gradient strip when the box-shadow was found to bleed 60px of grey in from the right edge the whole time the next slide sat parked offstage. Both are gone with the full-viewport sheet that cast them: once the pages are visible in a row, the layering is self-evident and a drawn cue is redundant.

### Named Rules

**The No Shadow Rule.** Nothing in this system casts anything. Layering is shown by putting the pages where you can see them, not by drawing an edge. A shadow appearing anywhere is a regression.

## Shapes

Every corner is square. There is no border-radius token because there is no radius anywhere: not on images, not on buttons, not on the progress segments, not on the info rows. Borders are 1px hairlines at the divider opacity and appear in exactly two places, under the info marker and between contact rows. The one curved form in the system is not a border but a reveal: the info panel's `clip-path: ellipse(calc(var(--wash) * 170%) 150% at -14% 50%)`, an ellipse anchored off the left edge whose curved front is what makes the transition read as a wash rather than a wipe. The label's box has a fixed proportion of **480:170** — the box the placeholder label artwork is drawn to — and holds whatever it is given with `object-fit: contain`, left-centred, so an image of any proportion never resizes the label.

## Components

### Links (the one interactive primitive)

Every actionable thing in this system is the same object: text with a 1px underline that sweeps.

- **Shape:** none. Text only, no box, no radius, no padding.
- **Rest:** `scaleX(0)` from the right origin — invisible.
- **Hover / focus-visible:** `scaleX(1)` from the left origin over `0.7s cubic-bezier(0.77, 0, 0.175, 1)`, so the rule sweeps in from the left and, on leaving, out to the right.
- **Disabled:** ink at rest, `cursor: default`, underline removed entirely.
- **Focus ring:** `1px solid` ink at `5px` offset, system-wide, never suppressed.

### Navigation (header)

One hairline of text along the top, mounted once and never remounted: artist name left (serif), Overview and Bio right. Where you are is set in full ink; where you could go is set back to reading strength and crosses over `0.45s` on the settle curve. There is no separate close control on a project — Overview is the way out, because leaving a work and looking at all of them are the same movement.

### Progress bar (project and info)

Counter, one segment per slide, then Prev / Next, right-aligned along the bottom on the gutter. The bar itself takes no pointer events — it is a line of air over the work — and only the controls do.

- **Segment:** a 1px track at inert ink, filled to full ink by a `scaleX` transform from the left; the mark is the hairline but the hit target is a 44px-tall box around it.
- **Hover:** the track lifts to reading strength.
- **Drag:** transitions off entirely, so under a finger the fill *is* the finger rather than something chasing it; on release it snaps and the transition returns.
- **Counter:** two-digit tabular numerals either side of a 2.2rem hairline — the reference stretches a hyphen with `scaleX(7)`; this draws it as a rule so it matches every other line in the system.

### Info panel

Paper-on-paper: the panel carries the ground colour so an arriving panel can actually cover the one it replaces. The column sits in the same frame a work occupies, aligned to the **start** of the reserved area rather than centred in it (centring pushed the column into the right third and left a cliff of paper beside the label). A hairline-ruled marker opens it, then a serif lead, then grotesk body. Contact values are a definition list of hairline-ruled rows; a value you can act on carries its underline already drawn at 40% opacity and reaches full strength on hover, while a value you cannot is simply set at reading strength.

### The Fixed Label (signature)

The site's one piece of furniture, and the thing the whole layout is built around. A fixed 480:170 box at left 10rem, vertically centred, `pointer-events: none` so wheel, clicks and drags all belong to whatever is behind it, `aria-hidden` because every value is mounted at once and the current value reaches assistive technology through the shell's live region instead.

**Every value is mounted simultaneously and the current one is simply the one made visible.** That is what makes the change instant: the incoming image is already decoded, so there is no empty frame and no layout shift. The normal case is **supplied artwork** — an image carrying its own type and colour, which the site does not typeset at all; the serif-over-caption setting is the fallback for a value that has no artwork yet.

*Placeholder status:* the label artwork in `/public/labels` and the artwork SVGs in `/public/artworks` are placeholders, as is all bracketed copy (`[Artist name]`, `[Project one]`, `[Year] · [Medium]`). Real label artwork must keep the 480:170 ratio, fill it to the right edge, and keep its first title line on the same baseline, so the label reads from the same spot whatever it says. The user has also asked for the label to be given its own coloured background; until it has one, the sliver of title overlapping a dark canvas loses contrast. A `mix-blend-mode: difference` scheme was tried for this and rejected — it tints the letters with the artwork's complement and cancels to invisible against one mid-tone.

## Do's and Don'ts

### Do:

- **Do** treat `src/tokens.css` as the source of truth and keep every token's provenance comment. A value marked `VERIFIED` was read off the reference stylesheet; contradicting it is a regression, not a preference.
- **Do** make emphasis with opacity, scale and motion — the four ink strengths, the display/label size jump, and the settle curve are the whole emphasis vocabulary.
- **Do** route every animation through GSAP and through `dur()` / `step()` in `src/motion.ts`. Reduced motion collapses every duration to zero while GSAP still writes the final values, so nothing can be left half-revealed.
- **Do** use the named curves for their named jobs: **settle** `cubic-bezier(0.19, 1, 0.22, 1)` (`expo.out`, the reference's one settle curve, 37 uses there) for arrivals and colour crossfades; **sweep** `cubic-bezier(0.77, 0, 0.175, 1)` at 0.7s for the link underline only; **slide** `cubic-bezier(0.76, 0, 0.24, 1)` (`power3.inOut`) at 0.8s for the page row.
- **Do** keep a page's position a pure function of one number: page *i* sits `max(i - position, 0)` pages to the right of the pile, a count CSS multiplies by `--work-width + --page-gap`. Whole positions give the row, fractional ones give a scrub. That is why there is no animation lock and no queue — ten fast clicks just retarget it.
- **Do** publish any two-element relationship as a measured custom property, the way `--work-width` is.
- **Do** cap reading measure at 62ch and zero the tracking on body text.
- **Do** keep placeholders visibly bracketed and leave `site.placeholders` true until real identity, copy and artwork arrive.

### Don't:

- **Don't** introduce an accent colour. The brief's `#de0086` and `#ffffff` were dropped on the user's explicit decision because the reference has neither.
- **Don't** set any label uppercase or widen its tracking past 0.04rem.
- **Don't** add a border-radius, a card, a gradient fill, a pill button, or a drop-shadowed surface. There is no shadow in this system at all.
- **Don't** translate a wrapper that holds all the slides. Slides are layers; a shared track is the carousel look this build exists to refuse.
- **Don't** move a page that has already landed. Going forward, only the waiting row travels; going back, only the departing page does. The pile itself is always still.
- **Don't** raise the root font-size floor to make one element fit. That was tried, it pinned the fluid scale flat across every real laptop width, and the fix was to measure the relationship instead.
- **Don't** crop an artwork. Fit-to-height with paper at the sides, always.
- **Don't** let the label move — not on scroll, not between slides, not across routes. If a change makes it remount, the change is wrong.
- **Don't** treat the two font families as decided; they are stand-ins for Tiempos Headline Light and ABC Diatype.
