---
version: 1
slug: "src-pages-home-tsx"
primary_target: "src/pages/Home.tsx"
related_targets: ["src/pages/Project.tsx","src/components/RollLabel.tsx","src/components/SlideProgress.tsx","src/index.css","src/tokens.css","src/App.tsx"]
---

# Gallery surface — scrolling home and the slide-over project page

Scope: `/` (the vertical scroll of works) and `/projects/:slug` (one work's
slides), plus the shell both share: the header, the fixed roll-text label,
the progress scrubber, tokens and motion grammar. Visitor mode:
**Experience**.

Audience: galleries and curators, scanning fast, wanting the work before
anything else. Job: pass the whole body of work in one gesture, open any
piece, and move through its layers without losing the thread.

## Direction contract

THESIS: the label is furniture bolted to the room, and the work moves past
it. This surface refuses two category defaults at once — the thumbnail grid
(there is none; works pass at full scale, one per screen-height) and the
carousel (a landed page never moves again, however far the position travels
past it). A work's pages wait in a visible row to the right and stack onto
the pile one at a time. A work's title
does not travel with its work; it sits at a fixed point on the left wall and
changes to the next value when a new work reaches centre. The box never
resizes, so whatever it holds, the label is in the same place.

OWN-WORLD: replacement of the incumbent "Hung Room". Verified from the live
reference, not guessed: paper #f1f1f1, ink #1d1d1b, three opacities of that
ink, no accent colour anywhere. Root font-size is fluid — `calc(100vw/1920*10)`,
floored only against absurdly narrow windows — so every rem is a fraction of
the viewport and each size carries its own px clamp, exactly as the reference
does. Newsreader Light stands in for
Tiempos Headline at `clamp(50px,8rem,80px)`/0.8; Hanken Grotesk stands in for
ABC Diatype at `clamp(10px,1.2rem,12px)`, sentence case, 0.04rem tracking —
never uppercase, never wide-tracked. 1px hairlines, underline-sweep links at
0.7s cubic-bezier(.77,0,.175,1). No shadow anywhere: the pages ahead are visible,
so the layering is shown rather than drawn.

STORY: the curator scrolls, work after work arrives at centre while one name
changes in place beside them, opens a piece, and watches its layers deal over
one another like prints laid on a table — then scrubs back through them. The
one transition that is neither a slide nor a swap is Overview↔Bio, which
washes across the panel like tempera spreading over a canvas.

FIRST VIEWPORT: header hairline at the top — artist name left, Overview and
Bio right. The first work is a portrait ~69vh tall, centred, uncropped, with
paper at its sides. The label is fixed at left 10rem, vertically centred,
its right end tucked `--label-tuck` past the work's left edge. That tuck
is a measured relationship, not a width: `src/useWorkFrame.ts` publishes
the work's rendered width and the label spans from its own anchor to
that far past the work's edge, so it holds at any viewport and against
any portrait aspect. The label is a 480:170 box holding **supplied
artwork** — an image carrying its own type and colour — with the site's
own serif-over-caption setting as the fallback for a value that has no
artwork yet. Counter bottom-right. No primary action — opening a work is the action, and the work
itself is the target.

FORM: pinned by BRIEF.md and the four artboards in `mockups/`, which fix the
topology, the roll-text reel, the slide-over layer rules and the progress
scrubber. Brief-pinned direction beats the roll: no concept tournament was
run and there is no seed key. Palette, type and motion values were pinned
instead by inspection of the live reference, and the two points where the
brief's unverified readings lost to it (ground colour, label casing) were
confirmed with the user before building.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- The brief's magenta `#de0086` accent and `#ffffff` ground were dropped: the
  live reference has neither. User confirmed the reference palette instead.
  Reinstating the accent touches the progress bar and link hover only.
- **The label is artwork, not type** (user, this build). It is supplied as an
  image nine times in ten, handling its own colour and fonts, so the site does
  not typeset it and BRIEF.md §3.5's slot-machine roll is not animated — the
  value simply changes with the index. A `mix-blend-mode: difference` scheme
  and a measured two-speed reel were both built and then removed on the user's
  call; the reference's 1s/0.5s roll timings are still recorded in tokens.css
  if the animation is ever wanted back. Placeholder artwork lives in
  `/public/labels` at 480x170 with a shared first-line baseline; real artwork
  should keep that box and that baseline.
- The brief specifies CSS transitions; PRODUCT.md records GSAP as a confirmed
  constraint. Built with GSAP driving the brief's exact model (position as a
  pure function of state), which satisfies both.
- Artwork may be a PDF, an image or an SVG; `src/components/Page.tsx` renders
  either as a replaced element with the artwork's own proportion, so every
  layout rule applies without knowing which it got. Remaining placeholders are
  the artboards' own device: a flat tone field captioned `[Artwork image]`. The 500x620 mockup box is
  expressed as ~69vh fit-to-height so real portrait files stay uncropped.
- Narrow widths take a different bargain: the label gets a band along the
  bottom of the screen outright and the scroll column stops above it, because
  there is no room beside a work at that size and text laid over the work
  cannot stay legible against a mid-toned canvas.
