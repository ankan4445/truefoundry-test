import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.npm_lifecycle_event === 'dev'

// Two production targets share this build. Pathfinder serves this app
// nested under /app/coffee-shop/ (the default below). TrueFoundry serves it
// under its own path prefix on a shared host (e.g. /coffee-shop/) — the
// ingress rewrites the *upstream request* back to "/" before it reaches the
// container, but it does NOT change what path the browser must use to
// reach assets, so `base` still has to be the real external prefix, exactly
// as set in this app's truefoundry.yaml `ports[0].path`. TFY_BASE_PATH is
// set as a build env var there — never hardcode it here.
const truefoundryBasePath = process.env.TFY_BASE_PATH

export default defineConfig({
  plugins: [react()],
  base: isDev ? '/' : truefoundryBasePath || '/app/coffee-shop/',
  build: { outDir: 'dist' },
})
