# AGENTS.md — Pathfinder deployment instructions

You are generating or modifying a web app that will be deployed to `/app/coffee-shop/` on
Pathfinder — NOT the site root. Follow every rule below exactly; do not ask the
user to relax them.

## Step 1 — Make sure this copy was actually customized for an app

This file only works once two placeholders have been filled in with real
values: one holding the app's name, one holding its base path. Each is
written, whenever it has NOT yet been filled in, as a bare word wrapped
directly in double curly braces with nothing else inside — the general
shape is `{{like-this}}` — one named `appName`, one named `basePath`.

Search this entire file for either one still in that raw, un-filled-in
shape — an actual `{{`, the bare word, then `}}`, nowhere replaced by a
real value. If you find either anywhere below, this copy was never
customized: it's the raw admin template, not a real per-app download, and
nothing below can be trusted as-is until this is fixed. In that case:

1. Ask the user for exactly one thing: the app's name as registered on
   Pathfinder (e.g. "coffee-shop"). Do not also ask for the base path
   separately — it is always `/app/<name>/`, derived from the name alone.
   Do not guess the name from the project folder, `package.json`, or
   anything else already in the project; none of those are connected to
   what Pathfinder actually serves this app as.
2. Once you have it, replace every raw `appName` placeholder in this file
   with that name, and every raw `basePath` placeholder with
   `/app/<name>/` — a plain find-and-replace across the whole document,
   not just the vite.config section below.
3. Re-read the file and confirm neither placeholder's raw shape remains
   anywhere before continuing to Step 2.

## Step 2 — Verify this file matches the project you're building

Even a correctly-customized file can be stale for the project it's
sitting in:

- If the project already has a `vite.config` from an earlier session,
  read its `base` value. If it points at a **different** app name than
  `coffee-shop` — most often because this exact `AGENTS.md` (or the whole
  project) was copied over from an earlier app instead of freshly
  downloaded for this one — STOP. Tell the user what you found and get
  them to confirm the correct app name before touching anything. Do not
  silently keep whichever base happens to already be there.
- This mismatch will NOT necessarily be caught later: it produces a build
  that is internally self-consistent (every asset reference agrees with
  every other one), so it looks correct right up until it's actually
  served under this app's real URL. Pathfinder's own upload validation
  does catch it at that point and refuses to deploy rather than ship a
  blank page — but that is a last-resort safety net, not a reason to skip
  this check. Catching it here, before wasting a whole build cycle, is
  strictly better.

## Step 3 — Claude Code compatibility

Check whether a `CLAUDE.md` file already exists in the project root.

- If it does **not** exist, create one containing exactly this single line:
  `@AGENTS.md`
- If it already exists, leave it alone — do not overwrite or edit an
  existing `CLAUDE.md` just to add this.

Claude Code loads `CLAUDE.md` as its memory file, not `AGENTS.md` directly.
The `@AGENTS.md` line uses Claude Code's own `@`-import syntax to pull this
entire file in as memory, so every rule below is guaranteed to be followed
under that harness too, regardless of whether it also auto-detects
`AGENTS.md` on its own.

## Tech stack

This file covers both stacks Pathfinder supports. Work out which one applies
— from an existing project's dependencies/files (`react`/`react-dom` in
`package.json`, or `.tsx` files, means **React**; otherwise plain **HTML / CSS
/ JS**) or from what the user asks for — then follow ONLY that stack's
structure, Vite config, and asset rules below. Never mix the two folder
layouts in the same project.

- **HTML / CSS / JS** — plain markup, styles and scripts, no framework.
- **React** — scaffold with `npm create vite@latest coffee-shop -- --template react-ts`
  if starting fresh.

## Required folder structure

**HTML / CSS / JS:**

```
my-app/
├── index.html          ← entry point, stays at the project root
├── vite.config.js       ← create this if it doesn't exist (see below)
├── package.json
├── src/
│   ├── style.css
│   └── main.js
└── assets/              ← images, fonts, etc.
```

**React:**

```
my-app/
├── index.html            ← entry point, stays at the project root
├── vite.config.ts         ← create this if it doesn't exist (see below)
├── package.json
└── src/
    ├── main.tsx
    ├── App.tsx
    └── assets/
```

## Build tool: Vite (required, no exceptions)

If the project has no build output and no `vite.config.js`/`vite.config.ts`,
CREATE the one matching your stack before writing any other code. It must
contain exactly:

**HTML / CSS / JS — `vite.config.js`:**

```js
import { defineConfig } from 'vite'

// npm_lifecycle_event is the name of whichever npm script is currently
// running ("dev", "build", or "preview") — see the explanation below.
const isDev = process.env.npm_lifecycle_event === 'dev'

export default defineConfig({
  base: isDev ? '/' : '/app/coffee-shop/',
  build: { outDir: 'dist' },
})
```

**React — `vite.config.ts`:**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.npm_lifecycle_event === 'dev'

export default defineConfig({
  plugins: [react()],
  base: isDev ? '/' : '/app/coffee-shop/',
  build: { outDir: 'dist' },
})
```

`base` and `build.outDir` are both **required** in either config — omitting
`base` breaks every asset path once deployed; renaming `outDir` away from
`dist` breaks the deploy step below.

`base` is conditional rather than a plain string because Vite's dev/preview
server nests its OWN local serving root under `base` too, not just the
production build output. `npm run dev` needs `/` so the app is reachable at
the plain `http://localhost:<port>/` Vite prints — nesting local dev under
`/app/coffee-shop/` too is confusing and serves no purpose there. `npm run build` and
`npm run preview` must keep the real `/app/coffee-shop/`: preview serves the already-
built `dist/`, whose asset references were baked in with that base during
the build, so previewing it at `/` instead would 404 every asset. Detecting
"dev" via `npm_lifecycle_event` (rather than Vite's own `command`, which
only distinguishes build from serve and lumps preview in with dev) is what
keeps preview correctly nested while dev is not.

## Asset & import rules

**HTML / CSS / JS:**

- Reference the project's OWN files with relative paths only: `./src/style.css`, `./assets/logo.png`.
- Never use root-absolute paths like `/style.css` or `/assets/logo.png` — they 404 once deployed under `/app/coffee-shop/`.
- External `https://` CDN links may be left as-is.
- Move inline `<style>` blocks into `src/style.css`; move inline page-logic `<script>` blocks into `src/main.js` loaded as `<script type="module" src="./src/main.js">`.

**React:**

- Import every static asset through the bundler: `import logo from './assets/logo.png'`.
- Never hardcode absolute paths like `/logo.png`.
- If the app uses react-router, construct the router with:
  `<BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '')}>`
  so client-side routes resolve correctly under `/app/coffee-shop/`.

## Build process — run this after EVERY change, before telling the user you're done

`app.zip` must always reflect the current source — never let it go stale.
Re-run every step below after every change that touches source files: after
each prompt that edits code, AND after any manual edit made outside a prompt
(the user editing files directly, pulling in changes from elsewhere, etc.).
There is no batching multiple edits before rebuilding — if the code changes
10 times, this runs 10 times and `app.zip` is regenerated 10 times.

1. `npm install` (whenever dependencies changed)
2. `npm run build`
3. Verify `dist/index.html` exists. If it doesn't, the build failed — fix the
   error and rebuild before finishing. Do not report success on a failed build.
4. Verify `app.zip` was created at the project root (see Packaging below). If
   it's missing, the packaging step failed — fix it and rebuild. Do not report
   success without `app.zip` present.
5. Optionally sanity-check with `npm run preview` — it's reachable at
  `http://localhost:<port>/app/coffee-shop/`, matching the deployed path. `npm run dev`
   is different: it's reachable at plain `http://localhost:<port>/`, with no
  `/app/coffee-shop/` prefix — that's expected (see the vite.config note above), not a
   sign the base path is missing or wrong.

If the user says they changed files by hand (outside of asking you to), or you
otherwise can't be sure `app.zip` matches the current source, run
`npm run build` again before doing anything else — it regenerates both
`dist/` and `app.zip` in one step (see Packaging below). Never hand off or
upload a zip that predates the latest change; a stale zip is worse than none.

## Packaging for upload — enforced automatically, do not do this manually

Packaging must NOT depend on a human or agent remembering a manual step. It is
enforced via an npm `postbuild` hook, so it runs automatically every time
`npm run build` runs:

- `package.json` must declare `archiver` as a devDependency and a
  `postbuild` script: `"postbuild": "node scripts/zip-dist.js"`.
- `scripts/zip-dist.js` must exist and zip the **contents** of `dist/` (never
  the project source, never the `dist` folder itself) into `app.zip` at the
  project root, failing loudly if `dist/` is missing.

If either the `postbuild` script or `scripts/zip-dist.js` is missing or has
been removed, recreate them before building — do not fall back to telling the
user to zip it themselves.

## Never

- Never proceed while an unfilled `appName`/`basePath` placeholder (see
  Step 1) is still present anywhere in this file, and never invent or guess
  a replacement app name/base path yourself — ask the user for the app
  name and derive the base path from it, exactly as Step 1 describes.
- Never omit `base` from vite.config.
- Never hardcode `base` as a plain `'/app/coffee-shop/'` string — use the
  `npm_lifecycle_event` check above. A plain string also nests `npm run dev`
  under `/app/coffee-shop/`, forcing you to navigate to `http://localhost:<port>/app/coffee-shop/`
  instead of the server root just to see anything while developing.
- Never leave a raw `.ts`/`.tsx` file referenced directly from `index.html` —
  browsers cannot execute TypeScript; only compiled Vite output belongs in the
  upload zip.
- Never rename `outDir` away from `dist`.
- Never write files outside this project's own folder.
- Never remove the `postbuild` script or `scripts/zip-dist.js` — packaging
  must stay automatic, not a manual instruction someone can forget to follow.
- Never tell the user to manually zip `dist/` themselves; the build already
  produces `app.zip`.
- Never mix the HTML/CSS/JS and React folder structures in the same project.
- Never skip a rebuild after a change, whether it came from a prompt or was
  made by hand — `app.zip` is only trustworthy immediately after
  `npm run build` finishes.
