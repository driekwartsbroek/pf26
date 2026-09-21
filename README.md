# Portfolio 2026

Three layers, one loop: **me** (`/`) → **work** (`/work`) → **a company** (`/work/<slug>`), and back out with Esc. The visual language borrows from FigJam: a dot-grid canvas, white rounded surfaces with hairline borders and soft shadows, floating toolbars, sticker-style marks, and quick spring motion. The work wheel is modelled on the FigJam sticker menu.

## Run

```bash
npm install
npm run dev
```

`npm run build` checks the copy, type-checks, and builds to `dist/`. `npm run og` regenerates the share image (`public/og.png`) after you change your portrait, title or logos.

## Editing content

Everything lives in `src/content/companies/`:

- `<slug>.md`: one per company. Frontmatter holds name, role, dates, ring position (`order`), accent colour and shots. The body is the short context paragraph.
- `shots/`: the images. Per shot you set `caption`, `span` (`normal`, `wide`, `tall`), `fit` (`cover`, `contain`) and `redact`.
- `marks/<slug>.png` (or `.svg`, `.jpg`, `.webp`): the company mark, shown as a sticker in its own colours with a white outline. **The filename must match the Markdown filename, and keep one file per company.** Use the symbol on a transparent background, not the full lockup with wordmark; it's shown small. Full logos are kept in `marks/originals/` for reference.

### Link tiles

A shot can be a link instead of an image. It becomes a link card in the grid, filled in at build time from the page's own preview data (title, description, image, icon):

```yaml
shots:
  - link: https://getgoally.com/goally-apps/polar-bank/
    caption: Polar Bank, a game app for Goally
    title: Polar Bank          # optional override
    text: Your own one-liner   # optional override
    image: ./shots/cover.png   # optional cover, instead of the page's preview image
```

### Stacks

A shot can be a pile of screens. On the page they lie on top of each other and fan out on hover. Clicking opens an overlay with all of them in a grid; click one to see it large, then cycle with the arrows. Esc steps back to the grid, then closes.

```yaml
shots:
  - stack:
      - ./shots/app-01.png
      - ./shots/app-02.png
      - ./shots/app-03.png
    caption: Onboarding and chat, iOS
```

### Under NDA

`nda: true` on a company replaces all work on its page with one large locked panel and a "Get in touch" button. Use it for a current job. `did` (sticky notes) and `methods` still show under the panel, so you can describe the work without showing it.

### Live prototypes

Any company can list `prototypes`. The first one is shown large, the rest two per row. Each card's cover is a live, non-clickable preview of the prototype itself, loaded when the card scrolls into view. `title` isn't shown; it's used as the label for screen readers and the window.

- **Desktop** prototypes open in a large window. They render at their design `width` (default 1440) and scale down to fit, so breakpoints behave as designed even on a small laptop. The window has restart, fullscreen, open in new tab and close.
- **Mobile** prototypes (`device: mobile`) play inline in a phone frame.

```yaml
prototypes:
  - title: Onboarding flow
    url: https://your-project.framer.app/
    device: desktop        # or mobile
    poster: ./shots/onboarding-cover.png   # optional cover shown before play
    embed: true            # set false if the site refuses to be embedded; it becomes a link
    width: 1440            # design width for desktop prototypes
```

Leave out `url` to reserve a slot; it shows as "Prototype coming soon".

Framer sites embed fine. Figma prototypes work with the embed URL from Share → Get embed code (`https://embed.figma.com/proto/...`).

### Analysis pages

Roles without screens to show (Tobania, Colruyt) use `kind: analysis`. Instead of a shot grid, the page shows:

- `flow`: a small diagram of steps joined by arrows. Mark your step with `you: true` and a "Bert" cursor sits on it.
- `did`: sticky notes, each a `title` plus an optional `text`.
- `methods`: tools and methods as chips.

`shots` still work on analysis pages if you do have a screen or two; they appear in a "Screens" section at the end.

`redact: true` blurs a shot and only publishes a 36px version, so the original never reaches the site.

Three ways to edit:

1. Ask Claude ("add a shot to Solidaris, wide, caption X").
2. Edit the files by hand.
3. [Pages CMS](https://pagescms.org): sign in with GitHub, open this repo, and use the form. Config is in `.pages.yml`. Each save is a commit and triggers a deploy.

Contact links and your name are in `src/lib/site.ts`. Education and certificates are in `src/pages/about.astro`.

### Portrait

Drop `src/assets/portrait.jpg` (or `.png`/`.webp`) in and it replaces the placeholder SVG. It shows as a round avatar, so crop it square with your face centred.

## Copy rules

`scripts/lint-copy.mjs` fails the build on em dashes, spaced en dashes, and a list of stock phrases. Add to the list when you spot a new one.

## Deploy

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes to GitHub Pages and works out the base path itself, so a project repo, a `username.github.io` repo and a custom domain all work.

One-time setup: repo **Settings → Pages → Source: GitHub Actions**.

## How it fits together

- `src/styles/global.css`: tokens (surfaces, borders, shadows, radii, easing) and the shared primitives (`.surface`, `.pill`, `kbd`, the top bar).
- `src/components/CanvasScene.astro`: the virtual Bert working in the background of every page. He builds buttons with the pen tool, rounds their corners and renames them; now and then drags one to the other side, and once in a while sticks a "can we make this pop more?" note on one. Placement is balanced across the top, left and right of the screen. Hidden on phones and with reduced motion.
- `src/components/Sticker.astro`: a mark as a FigJam-style sticker. Each sticker carries a `transition:name`, so it flies from the wheel into the company header when you navigate.
- `src/pages/work/index.astro`: the wheel. Wedges are HTML links clipped to ring segments, so hover and click follow the exact shape.
- The avatar also morphs between the home card and the centre of the wheel. Both use Astro's `ClientRouter` view transitions, which fall back to a normal page load in browsers without them.
