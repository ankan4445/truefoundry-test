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

## Why no committed `truefoundry.yaml`

The installed `tfy` CLI (v0.17.3) and its bundled `truefoundry_sdk`/
`truefoundry` Python packages were inspected directly
(`truefoundry_sdk/types/build_build_spec.py`, `docker_file_build.py`,
`python_build.py`). The only two build-spec types defined there are
`dockerfile` and `tfy-python-buildpack` (Python-only). No generic
multi-language Buildpack build type exists in this schema, so a
`truefoundry.yaml` using an unverified `type` value would be a guess, not a
fact. The dashboard's "Build using Buildpack" wizard is used as the source
of truth instead — it demonstrably supports a per-service root/build-context
path. If a real Buildpack-service YAML is exported from the dashboard later,
it can be templated precisely and this decision revisited.

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

- No `truefoundry.yaml` (see above).
- No changes to the Pathfinder zip-upload flow or its `AGENTS.md` rules.
- No CI/CD pipeline — deploys are triggered manually via the TrueFoundry
  dashboard per this design; automating that is a separate future project.
