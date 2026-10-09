---
version: 1
slug: "src-pages-info-tsx"
primary_target: "src/pages/Info.tsx"
related_targets: ["src/App.tsx","src/components/HoverTitle.tsx","src/index.css"]
---

# Info surface — biography and contact

Scope: the `/info` route (biography and contact), plus the shell changes it
shares with the gallery (hovering title, bottom bar, reduced-motion path,
touch stepping). Visitor mode: **Read**, with one action at the end.

Audience: galleries and curators, mid-evaluation, arriving from the work.
Job: understand the practice in under a minute and leave with a way to make
contact. Constraint: no real artist identity, bio, exhibitions, or contact
details exist yet; every value is a marked placeholder in one content file.

## Direction contract

THESIS: the writing is hung like a work. The info surface refuses the
category default of an about page that breaks the site's format — a scrolling
column, a portrait, a masthead. Here the text occupies the artwork's exact
frame, stepped in the same grammar as slides, so the biography reads as one
more piece in the series rather than an exit from it.

OWN-WORLD: inherited and unchanged — but the world it inherits was replaced
in the styling refactor, so the specifics below supersede this brief's
original text. Paper ground #f1f1f1, ink #1d1d1b and three opacities of it,
no accent colour. Newsreader Light for display at clamp(50px,8rem,80px) on a
fluid root, Hanken Grotesk at clamp(10px,1.2rem,12px) in sentence case with
0.04rem tracking for every label, 1px hairline rules, underline-sweep links.
The only shadow in the system belongs to a travelling slide's leading edge.
No new colour, no new face, no card, no container the gallery does not
already use.

STORY: the curator understands what the practice is about, sees that the site
treats its own writing with the same care as its images, and finds the contact
row where the work's caption would be.

FIRST VIEWPORT: unchanged header at the top, name left and nav right. The
artist name hangs left where artwork titles hang, with the panel name
("Biography", "Contact") in the caption slot below it. Unlike a work, a
column of text cannot be read through, so the prose starts clear of the
label rather than tucking under it: both the label's width on this route and
the reserve the prose leaves come from `--label-width-info`, so they cannot
drift apart. Measure capped near 62ch, lead paragraph one step larger. The
bottom bar carries the panel segments and count. The primary action, the
contact row, is the last panel and the last thing read.

FORM: extension of the established surface, not a new world. New-work section
3, "Extend an existing surface": world inherited, no concept tournament, no
seed key, no DESIGN.md rewrite.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Panel transition

BRIEF.md §2 asks the Overview and Bio transitions to evoke paint spreading
over a canvas. Built as an elliptical `clip-path` anchored off the left edge
and grown across the panel by a registered `--wash` custom property, so the
front of the reveal is curved and reaches the top and bottom of the column
later than its middle. The panel carries the paper ground so the wash has
something to spread over; the outgoing panel holds at full strength until the
wash has covered it, because fading it first left a beat of empty paper
between the two. Inside the panel, prose still rises out of its own mask.

## Unresolved

- Contact mechanism is undecided in PRODUCT.md. Built as a labeled row of
  mailto and representation lines, values placeholder, so swapping to a form
  later touches one panel.
- Touch stepping is undecided in PRODUCT.md. Built as swipe, the direct
  equivalent of the wheel gesture, rather than introducing conventional
  scrolling.
- No exhibition history exists, so no exhibitions panel is built.
