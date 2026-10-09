# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **galleries and curators** evaluating the artist for exhibition or
representation. They arrive skeptical, scan quickly, and want the work itself
before anything else, plus enough context to judge it and a way to make contact.

Other visitors (press, collectors, people arriving from social media) reach the
same single surface. No separate audience path is confirmed, and none should be
invented.

## Product Purpose

A single-artist portfolio that presents artworks full-screen, one at a time.
A visitor browses artwork by artwork on the home surface and opens any one of
them to move through that work's sequence of slides.

Success: a curator reaches the end of the body of work with a clear sense of the
practice, having seen each piece uncropped and at scale, and knows how to get in
touch.

## Positioning

The artwork is the interface. The site steps through work one piece at a time at
full height rather than laying out a scrolling grid of thumbnails, and each
artwork can unfold in stages — a slide marked see-through layers on top of the
slide beneath it instead of replacing it, so a single work can be revealed in
passes. The title hovers beside the work rather than labeling it from above.

## Operating Context

- Desktop and laptop browsing is the assumed scene; wheel and trackpad are the
  primary input, arrow keys the alternate.
- The site is a link a curator opens between other tasks, often forwarded from
  an email or an application. It has to make sense within seconds of landing.
- The home surface is a conventional vertical scroll of works, one per
  screen-height. A project page does not scroll: its slides are stepped.
  (Superseded 2026-09-20. This entry previously read "nothing scrolls
  conventionally"; BRIEF.md reverses it for the home surface and the user
  confirmed the reversal.)
- Touch stepping is a swipe, the direct equivalent of one wheel gesture.
  Decided during the build, not by the user: see "Decided in the build" below.

## Capabilities and Constraints

**Stack (existing codebase):** Vite, React 19, TypeScript, react-router-dom 7,
GSAP 3. No backend.

**Routes:** `/` cycles artworks; `/projects/:slug` opens one artwork's slides.
A persistent shell holds the header and the hovering title across both, so the
title does not remount on navigation.

**Confirmed constraints:**

- All animation is driven by GSAP. CSS transitions were evaluated and rejected
  by the user as not smooth enough.
- No WebGL. The reference site's WebGL intro/preloader is deliberately out of
  scope.
- Artworks are vertical (portrait). They display fit-to-height and centered,
  with empty space at the sides. **Never cropped.**
- A project's pages are **visible in a row** and stack one by one (user,
  2026-09-20). They are not full-viewport sheets: a page has no ground of its
  own and casts no shadow, because the pages to come are shown rather than
  implied.
- **PDFs are a first-class input, for artwork and for labels** (user,
  2026-09-20). They are rendered to a canvas with pdf.js, never handed to the
  browser's PDF viewer, which would bring a toolbar and a grey surround. The
  library is loaded on first use, so a manifest with no PDFs never downloads
  it. `file.pdf#page=3` addresses one page, so a single multi-page PDF can
  supply several pages of a work.
- **`seeThrough` decides whether a page keeps its sheet.** A page of a work is
  a sheet and is drawn on white. A see-through PDF is printed on matte film
  (user, 2026-10-06): its sheet is dropped and what lies beneath is softly
  blurred, so the page under it reads diffused rather than cut out. For an image that
  distinction is just its alpha channel; for a PDF the flag is what carries
  it.
- Artwork data lives in a single manifest (`src/artworks.ts`). A slide may be
  flagged see-through, which layers it over the preceding slides back to the
  first opaque one.
- Wheel/trackpad and arrow keys step through a project's slides and the info
  panels. The home surface scrolls conventionally instead, with arrow keys
  scrolling it work to work. (Amended 2026-09-20 with the entry above.)
- The site is built incrementally. The user asked explicitly not to build the
  whole thing at once and to confirm before expanding scope.

**Terminology:** an *artwork* is one piece, made of ordered *slides*. Its page
is the *project page*.

**Confirmed scope:** artwork browsing and project pages, plus an about/bio
surface and a way to make contact. No commerce, no pricing, no sales flow.

**Explicitly undecided (do not invent):** overview mode and focus toggle.
These are unbuilt ideas from the reference site, not commitments.

The **draggable progress indicator** left this list on 2026-09-20: BRIEF.md
§4.8 specifies it, so it is now built and confirmed — a segment per slide that
clicks to jump and drags to scrub a fractional overlap.

**Decided in the build, awaiting the user's confirmation.** Two facts recorded
here as undecided were settled by the build rather than by the user, because
leaving them open would have shipped a site that does nothing on a phone and
offers a curator no way to make contact. Either can be changed without
disturbing anything else:

- *Touch stepping* is a swipe on the dominant axis, matching the wheel gesture.
  The alternative the user may still prefer is a conventional scrolling
  fallback on touch, which they declined for reduced motion but were never
  asked about for touch.
- *Contact* is a labeled row of values, with the email as a `mailto:` link and
  room for more rows. The alternatives are a form or routing enquiries through
  gallery representation. Swapping touches one panel.

## Brand Commitments

- `giannantoniodemalde.com` is a binding structural and interaction reference,
  minus the WebGL intro. Recreating its behavior was the explicit request.
- **Its palette and type metrics are binding too, and are now verified rather
  than inferred** (2026-09-20). Read off its stylesheet: ground `#f1f1f1`, ink
  `#1d1d1b`, and *no accent colour anywhere*. BRIEF.md described a white ground
  with a hot magenta `#de0086` accent; neither exists on the reference, and the
  user chose the real palette over the brief's reading. Emphasis is made with
  opacity, scale and motion. Every verified value, with its source, is recorded
  in `src/tokens.css`.
- Labels are sentence case with ~0.04rem tracking, never uppercase and never
  wide-tracked — also verified, and also chosen over the mockups' rendering.
- The hovering title sits to the **left** of the artwork, slightly overlapping
  its left edge for depth, and stays visually still across route changes.
  Confirmed by the user. As of 2026-09-20 it is a fixed roll-text label: its
  measured movement while the page scrolls is zero, and its text rolls in place
  like a station board rather than sweeping out and in.
- The label **is plain text** set in the site's own faces (user, 2026-10-06,
  reversing the 2026-09-20 decision that labels were supplied as images). A
  work or slide may instead name a PDF label. Changing *on scroll* remains
  required; since 2026-10-06 (user) a change is a short GSAP crossfade, not
  a cut — still never a roll or slide. A `mix-blend-mode: difference` scheme was tried
  early and rejected: it tints the letters with the artwork's complement and
  cancels to invisible against one mid-tone.
- The label's **tuck over the work is a measured relationship**, not a chosen
  width. `src/useWorkFrame.ts` publishes the work's rendered width and the
  label spans from its own anchor to `--label-tuck` past the work's left edge,
  so the tuck holds at any viewport and against any portrait aspect. Layout
  width, not a bounding rect: a slide measured mid-transform reports a position
  a viewport to the right.
- Artist name, site title, and voice are **not yet decided**. The current
  "A Retrospective — Placeholder Artist" is placeholder text and must never be
  treated as the real identity or carried into finished copy.
- Current fonts (Newsreader, Hanken Grotesk) are acknowledged free stand-ins for
  the reference site's licensed Tiempos Headline Light and ABC Diatype. They are
  a placeholder, not a commitment. (Changed from Playfair Display and Inter on
  2026-09-20: both new faces are closer in kind — Newsreader is Times-descended
  like Tiempos, Hanken Grotesk a neo-grotesk like Diatype.)

## Evidence on Hand

- **No real artwork files yet.** `public/artworks/` holds 10 placeholder SVGs
  across three works. As of 2026-09-20 their invented Italian titles are gone:
  `src/artworks.ts` now reads `[Project one]`, `[Detail title A]` and so on, per
  BRIEF.md's instruction to use visibly labelled placeholders. The SVGs
  themselves are no longer invented pictures either — they were illustrated
  gradient posters, which BRIEF.md §2 rules out and which read as real work;
  they are now the artboards' own device, a flat tone field captioned
  `[Artwork image]`. `public/labels/` holds matching placeholder label artwork
  at a 480x170 box with a shared first-line baseline. The shapes are
  varied deliberately — a two-line title, a work whose slides rename it partway
  through, and works of two, three and five slides — so the layout is exercised.
- **No real artist identity.** There is no confirmed name, bio, exhibition
  history, press, representation, or contact detail. None of it may be
  fabricated, including in placeholder copy that could be mistaken for real.
- The user will supply real artwork files (JPG for opaque slides, PNG with alpha
  for see-through ones), real titles and years, and the artist's identity.

## Product Principles

1. **The work leads; the interface recedes.** Every element earns its presence
   against the artwork it sits beside.
2. **Never crop an artwork.** Fit-to-height with empty margins beats a filled
   viewport, always.
3. **Placeholders stay visibly placeholder.** No invented artist facts, titles,
   exhibitions, or credibility markers survive into the build.
4. **Motion is the identity, and it has an accessible path.** The stepped,
   cinematic feel is core; a reduced-motion visitor still sees everything.
5. **Build incrementally and confirm before expanding.** Scope grows by the
   user's decision, not by momentum.

## Accessibility & Inclusion

- `prefers-reduced-motion` must yield a calmer version of the experience.
  Wheel-stepping remains the default for everyone else; it is not replaced by
  conventional scrolling.
- Keyboard users must be able to reach every artwork and every project page.
  Arrow keys step, Escape closes a project.
- Screen-reader users must be able to reach the same content; artworks need real
  alternative text once real work replaces the placeholders.
