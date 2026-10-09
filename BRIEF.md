# Art portfolio with slides that slide over each other

Read top to bottom before writing any code. The folder `mockups` holds the interactive design mockups (see "About the mockups" at the end).

## 1 · The goal in two sentences

Build a minimal art-portfolio website that looks and feels like [giannantoniodemalde.com](https://giannantoniodemalde.com/): white ground, the artwork as the only hero, quiet typography, restrained micro-interactions.

**One deliberate difference:** on an artwork's detail view, the slides must NOT travel sideways together like a carousel. They are stacked layers: the next slide slides in **over** the current one, and the current one stays perfectly still underneath.

**The other signature element:** a fixed text label at the middle left of the screen. It never moves with the scroll or the slides; when the artwork in focus changes, its text rolls upward to the new value in place. The same label, in the same spot, is on the home page and on the project page.

## 2 · Style to copy from the reference

**Do this first:** open the live site in a browser and inspect it with DevTools. I could only read a text summary of it, so the exact font families, sizes, spacing and easing values below are **not verified**. Write down the real computed values (font-family, font-size, letter-spacing, paddings, transition durations and easings) into a small tokens file (CSS custom properties) and use those. Do not guess them.

What is known about the reference:

- **Ground and colour.** White `#ffffff` page, near-black text. One accent, a hot magenta `#de0086`, used sparingly (progress bar, hover, active states). No other colours; the artwork brings the colour.
- **Attitude.** The designer's own words: typography, whitespace and micro-interactions all exist to highlight the work, and the look should be "elegant five years ago and still elegant in five years". So: no trendy effects, no gradients, no drop-shadow cards, no rounded pill buttons.
- **Structure.** Intro animation (feels like a book cover or exhibition poster) leads to the home page, a vertical scroll of artworks (section 3), which leads to a project page made of slides (section 4). Header is minimal: a home link and a "Bio" toggle. Prev / Next moves between projects.
- **Slider progress bar.** A thin progress bar under the slider that doubles as a drag scrubber. Keep this.
- **Overview and Bio transitions.** They evoke paint or tempera spreading over a canvas: an organic reveal that grows from an edge. Reproduce it if you can with a `clip-path` or mask animation; inspect how the reference does it.
- **Content.** Do not copy the artist's images, texts, name or logo. Use clearly labelled placeholders such as \[Artist name\], \[Project title\] and \[Artwork image\].

Type direction used in my mockups (replace with the verified values from step 1): a refined serif (Newsreader) for titles, a small quiet grotesk (Hanken Grotesk) in uppercase with wide tracking for labels and counters.

## 3 · Home page and the fixed roll-text label

This replaces any grid or thumbnail overview. See the **Overview** artboard: scroll it, and click an artwork to open **Detail**.

1.  **Home is one long vertical scroll.** One artwork per project, centred horizontally, stacked top to bottom with generous white space between them (mockup: artwork 500 by 620 px, 160 px gap, on a 1440 by 900 screen). Normal free scrolling with the scrollbar hidden; a soft `scroll-snap-type: y proximity` is optional. Add top and bottom padding so the first and last artwork can also reach the vertical centre.
2.  **One fixed text label.** A single element with `position: fixed`, vertically centred (`top: 50%` and `translateY(-50%)`) and placed at the left (mockup: `left: 96px`). It has a large serif title (mockup: 68 px) and a small uppercase meta line beneath it (year and medium). It is wide enough that its right end overlaps the artwork's left edge slightly (mockup: about 100 px). It sits above the artwork (`z-index`) and has `pointer-events: none` so clicks and wheel events go through to the artwork.
3.  **It does not move when the page scrolls.** The text stays exactly where it is while the artworks pass behind it.
4.  **Active artwork.** The artwork whose centre is closest to the vertical centre of the viewport is the active one. Use an `IntersectionObserver` with `rootMargin: '-50% 0px -50% 0px'` (a zero-height band at the centre), or compute `round(scrollTop / pitch)`.
5.  **The text rolls upward to the new value.** When the active artwork changes, the old text does not fade or jump: it scrolls up and out while the new text scrolls up into the same spot, like a slot-machine reel. Build it as a reel: a column holding every value, each in a line box of a fixed height, inside a wrapper with the height of one line and `overflow: hidden`. Set the column to `translateY(-index * lineHeight)` with `700ms cubic-bezier(.76, 0, .24, 1)`. Scrolling down rolls the text up, and scrolling back up rolls it back down, for free, because the position is just a function of the index.
6.  **Title and meta line roll together**, each in its own reel, with the same index and the same timing. Nice option: stagger the characters by 15 ms.
7.  **Fast scrolling** just retargets the index; the reel spins through the values in between. No queue, no lock.
8.  **Legibility over artwork.** Where the label overlaps the artwork, white text with `mix-blend-mode: difference` keeps it readable on any image (it also reads as black on the white page). Check the reference; if it uses plain dark text, do that instead.
9.  **Click an artwork** to open its project page. The label must feel like the same element carrying over: same position, same size, same typography, and on arrival it already shows that project's value. Best: keep it as one persistent component across both routes (or use the View Transitions API with a shared `view-transition-name`). In my mockups the two screens are separate artboards, so this continuity is only illustrated.
10. **On the project page,** the label sits above all slide layers (higher `z-index` than the slides, below the header and controls) and does not slide with them. Each slide may carry its own text. When the slide changes and the text differs from the current one, the label rolls exactly as on the home page. When the next slide has the same text, nothing animates.

Data model that supports this (per project):

    project = {
      title: '[Project one]',
      meta:  '[Year] · [Medium]',
      slides: [
        { image: '...' },                                  /* inherits the project text */
        { image: '...' },                                  /* still the same text: no roll */
        { image: '...', text: '[Detail title A]', meta: '[Year] · [Medium] · [Size]' },
        { image: '...' }                                   /* inherits [Detail title A] */
      ]
    }
    /* label value for slide i = the last slide at or before i that has its own text,
       else the project title. Build the reel from the distinct consecutive values. */

    /* CSS */
    .label { position: fixed; left: 96px; top: 50%; transform: translateY(-50%);
             z-index: 90; pointer-events: none; color: #fff; mix-blend-mode: difference; }
    .reel        { height: 76px; overflow: hidden; }
    .reel-track  { display: flex; flex-direction: column;
                   transition: transform 700ms cubic-bezier(.76, 0, .24, 1); }
    .reel-item   { height: 76px; line-height: 76px; font-size: 68px; white-space: nowrap; }

    /* JS: home page */
    const track = document.querySelector('.reel-track');
    function setLabel(i) { track.style.transform = 'translateY(' + (-i * 76) + 'px)'; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setLabel(Number(e.target.dataset.i)); });
    }, { rootMargin: '-50% 0px -50% 0px' });
    document.querySelectorAll('.artwork').forEach((el) => io.observe(el));

## 4 · The slide-over behaviour: exact rules

1.  **Layers, not a track.** All slides of a project sit in ONE container as `position: absolute; inset: 0` layers of identical size, in DOM order 1 to N. Slide k always has a higher `z-index` than slide k-1 (`z-index = k`). Never translate a wrapper that holds all slides; that is the carousel look we do not want.
2.  **Only the incoming slide moves.** Going forward from k to k+1: slide k+1 animates from `translateX(100%)` to `0`, on top of slide k. Slide k does not move, fade, scale or dim. (Optional lever `PARALLAX`, 0 to 15 percent, default **0**: slide k may drift left by that amount. Keep it at 0 unless asked.)
3.  **Going back is the exact reverse.** From k to k-1: the current top slide k slides back out to the right (`0` to `100%`), uncovering slide k-1, which has been sitting untouched underneath. Never animate slide k-1.
4.  **Position is a pure function of state.** One number, `current`. Slide i is at `0` if i is less than or equal to current, and at `100%` if i is greater than current. That is all.
5.  **Timing.** Start with `800ms cubic-bezier(.76, 0, .24, 1)`, then match the pace of the reference after inspecting it. Animate `transform` only (GPU friendly, `will-change: transform`). Give the incoming slide a faint edge shadow on its leading side, `box-shadow: -24px 0 60px rgba(0,0,0,.08)`, so the overlap reads as layering.
6.  **Interruptible.** No animation lock and no queue. If the user clicks Next twice quickly, just retarget `current`; the CSS transition handles the rest.
7.  **Jumping.** Clicking a progress-bar segment from slide 2 to slide 6 sets `current = 6` directly. Slides 3 to 6 all get their new position at once; z-order means slide 6 arrives on top. Do not step through the slides in between.
8.  **Scrubbing (drag on the progress bar).** Use a fractional progress p from 0 to N-1 and give slide i the offset `100 * clamp(i - p, 0, 1)` percent, with transitions switched off while dragging. On release, snap to `round(p)` and switch transitions back on. Same formula, so the drag feels identical to the click animation.
9.  **Inputs.** Next / Prev buttons, ArrowLeft and ArrowRight, swipe on touch, horizontal trackpad scroll (debounced), progress-bar click and drag. Counter reads like `02 / 08`.
10. **Artwork rendering.** `object-fit: contain`, centred, never cropped or stretched. Caption (title, year, medium) bottom-left inside the slide. Slide backgrounds are white like the reference; my mockup tints them slightly only so the layering is visible on screen.
11. **Accessibility and performance.** Each slide is an `article` with `aria-roledescription="slide"` and `aria-label="2 of 8"`. Slides that are not current get `inert` once their transition ends. Prefetch the next image. Under `prefers-reduced-motion`, replace the slide with a 200ms crossfade. Use `100dvh` on mobile.

## 5 · Reference snippets (framework-agnostic)

    /* CSS */
    .viewer { position: relative; overflow: hidden; height: 100dvh; }
    .slide  { position: absolute; inset: 0; background: #fff;
              transform: translate3d(100%, 0, 0);
              transition: transform 800ms cubic-bezier(.76, 0, .24, 1);
              box-shadow: -24px 0 60px rgba(0, 0, 0, .08);
              will-change: transform; }
    .slide.is-current,
    .slide.is-past   { transform: translate3d(0, 0, 0); }
    .slide.is-future { transform: translate3d(100%, 0, 0); }

    /* JS */
    const slides = [...document.querySelectorAll('.slide')];
    let current = 0;

    function go(next) {
      current = Math.max(0, Math.min(slides.length - 1, next));
      slides.forEach((el, i) => {
        el.style.zIndex = i + 1;                       /* later slide is always on top */
        el.classList.toggle('is-future',  i > current);
        el.classList.toggle('is-current', i === current);
        el.classList.toggle('is-past',    i < current);
        el.inert = i !== current;
      });
    }
    go(0);

Note what is absent: there is no wrapper `transform`, no `left` / `margin` animation, and no transition on the outgoing slide.

## 6 · Acceptance checks

- Press Next and freeze a frame mid-animation: the old slide's artwork is still at its original pixel position, and the new slide covers it from the right edge.
- Press Prev: the top slide leaves to the right and the slide beneath is already in place, never moving.
- Ten fast clicks on Next never leave a half-way slide or a stuck state.
- Clicking the last progress segment from the first slide shows only the last slide arriving over the rest.
- Dragging the progress bar scrubs the overlap smoothly and snaps to a whole slide on release.
- Home: scrolling never moves the label. When the next artwork reaches the vertical centre, the label rolls up to its value; scrolling back up rolls it back down.
- Project page: the label is in the same spot with the same value on arrival, stays put while slides cover each other, and only rolls when a slide carries a different text.
- Only `transform` animates; no layout shift; no horizontal page scrollbar; reduced-motion users get a crossfade.

## About the mockups

`mockups` contains four `.dc.html` files exported from a design canvas. They are **visual and behavioural references only**: do not try to run or ship them, and ignore the `<x-dc>`, `<sc-for>`, `{{ }}` and `DCLogic` syntax, which belongs to the design tool. Read them for exact layout numbers, inline CSS, and the state logic in each `renderVals()`.

- `Overview.dc.html`: home page. Vertical scroll, fixed roll-text label, scroll position mapped to the active index.
- `Detail.dc.html`: project page. Slide-over stack, progress segments, Prev / Next, roll-text label with per-slide values.
- `Stack.dc.html`: static diagram of the right (slide-over) vs. wrong (carousel) behaviour.
- `Main.dc.html`: the original of this brief.

Suggested first prompt: "Read BRIEF.md and the files in mockups/. Start by inspecting giannantoniodemalde.com in a browser and writing the verified design tokens to tokens.css, then build the home page, then the project page, then run through the acceptance checks."
