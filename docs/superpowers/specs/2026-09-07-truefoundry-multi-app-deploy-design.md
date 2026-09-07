# Multi-app TrueFoundry Buildpack deployment — design

Date: 2026-09-07

## Goal

Deploy app folders living at the repo root to TrueFoundry using the
dashboard's "Build using Buildpack" strategy, one app folder at a time, and
support adding further app folders later without changing the pattern.

## Layout convention

The repo root is a monorepo of independently deployable apps: one top-level
folder per app (e.g. `coffee-shop-react-with-agents.md/`). Each folder is
fully self-contained — its own `package.json`, its own build — with no
shared root-level build tooling. Each app folder maps to exactly one
TrueFoundry Service, configured in the dashboard with that folder set as the
Build Context Path / Root Path.

## `truefoundry.yaml` — confirmed schema

The installed `tfy` CLI (v0.17.3), its bundled `truefoundry_sdk`/
`truefoundry` Python packages, and TrueFoundry's live API docs all agree:
there is no generic multi-language Buildpack build-spec type. The only two
are `dockerfile` and `tfy-python-buildpack` — the latter is what the
dashboard's "Build using Buildpack" wizard actually exports for this org,
confirmed by pasting a real exported YAML (see below) rather than guessing.

Consequences of that confirmed schema:

- **It's a Python-flavored builder, not a Node one.** There's no npm/Node
  auto-detection. `apt_packages: [nodejs, npm]` installs a Node toolchain
  into the (Debian-based) build image, and `build_spec.command` — set as the
  container's entrypoint — is what actually runs `npm install && npm run
  build && npm run start`. This means the Node build happens at **container
  start**, not at image-build time: every cold start reinstalls
  node_modules and rebuilds. Acceptable for this dev/test use case; a
  `dockerfile`-type build (a real multi-stage Docker build) would avoid the
  repeated build cost if this app needs to scale or restart often later.
- **Node version risk.** The apt `nodejs`/`npm` packages' version depends on
  the buildpack's underlying Debian release. Vite 5 needs Node ≥18. This is
  expected to be fine on current Debian-based Python images (bookworm ships
  Node 18.x) but isn't independently verified here — check `node --version`
  in the first deploy's build logs; if it's too old, switch to a
  `dockerfile` build with an explicit Node base image instead.
- **`build_context_path`** (relative to the git checkout root) is exactly
  the per-app-folder mechanism this design's layout convention relies on —
  confirmed real, not assumed.
- **`ref` is a pinned commit SHA**, not a branch — `GitSource.ref` is
  required. The committed template carries a placeholder; update it to the
  commit you want deployed (`git rev-parse HEAD`) before each `tfy deploy`.
- **Path-prefix routing strips back to `/` by default.** `Port.path` (e.g.
  `/coffee-shop/`) is rewritten to `Port.rewrite_path_to`, which **defaults
  to `/`** per the SDK's own field docs. So even though multiple apps share
  one host with different path prefixes, each container itself receives
  plain `/` requests — the earlier "serve at the root of its own URL"
  base-path decision below is still correct; the shared host/path-prefix
  routing is handled entirely by TrueFoundry's ingress, not by the app.

## Git source

TrueFoundry pulls source from a connected Git repository for this flow.
This directory is initialized as a git repo and pushed to a remote
(GitHub/GitLab/etc., chosen by the user); each app-folder Service in the
dashboard points at that remote + the folder as build root.

## Per-app runtime requirement

A Buildpack build produces a long-running container, not static hosting —
something must bind `$PORT`. For a static Vite/React app this means:

- Add `serve` (npm, `^14.2.6`) as a normal `dependency` (not `devDependency`
  — buildpacks may prune dev deps before the run image, and `serve` must
  survive into it).
- Add a `start` script: `serve -s dist -l ${PORT:-3000}`.
- Do not use `vite preview` as the start command — `vite` is a
  `devDependency` and isn't guaranteed to survive into the run image.

Every new app folder that's a static SPA follows this same recipe.

## Base-path conflict with the existing Pathfinder target

`coffee-shop-react-with-agents.md/AGENTS.md` and its `vite.config.ts` bake
production asset paths under `/app/coffee-shop/` for a separate, existing
deployment target ("Pathfinder", a zip-upload system that serves apps
nested under `/app/<name>/`). TrueFoundry serves each Service at the root of
its own URL, so reusing that same base would 404 every asset.

Fix: `vite.config.ts` gets one additional conditional branch, keyed off a
`DEPLOY_TARGET=truefoundry` build-time env var (set in the TrueFoundry
Service's build settings, not committed anywhere), that forces `base: '/'`
for the TrueFoundry build only. The existing Pathfinder build path (default,
no env var set) and every rule in its `AGENTS.md` stay unchanged. Any future
app folder that only ever targets TrueFoundry does not need this branch at
all — it's a `dispatch`-per-target inspired mechanism, not a general
requirement of the layout.

## Root-level files

- `README.md` — usage doc: layout convention, the per-app Buildpack
  requirements checklist above, git push setup, and the dashboard steps to
  register an app folder as a Service (create Service → connect repo →
  Build using Buildpack → set Root/Build Context Path to the folder → set
  build env vars if the app needs the `DEPLOY_TARGET` override → set Port →
  deploy). Also documents how to add a new app folder.
- `.gitignore` — wildcarded per-folder patterns (`**/node_modules`,
  `**/dist`, `**/app.zip`, `*.local`) since multiple app folders will exist
  side by side.

## Out of scope

- No changes to the Pathfinder zip-upload flow or its `AGENTS.md` rules.
- No CI/CD pipeline, and no automatic `ref` updates — `tfy deploy -f` is run
  manually per app, and the `ref` placeholder is updated by hand first;
  automating that is a separate future project.
- No `dockerfile`-type build for coffee-shop, even though it would avoid the
  container-start rebuild cost noted above — out of scope unless the
  apt-Node approach proves unworkable.
