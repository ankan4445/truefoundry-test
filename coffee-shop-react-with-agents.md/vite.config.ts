import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isDev = process.env.npm_lifecycle_event === 'dev'
const isTruefoundry = process.env.DEPLOY_TARGET === 'truefoundry'

// Two production targets share this build: Pathfinder serves this app
// nested under /app/coffee-shop/ (the default), TrueFoundry serves it at
// the root of its own URL (DEPLOY_TARGET=truefoundry, set as a build env
// var on the TrueFoundry Service, never committed here).
export default defineConfig({
  plugins: [react()],
  base: isDev || isTruefoundry ? '/' : '/app/coffee-shop/',
  build: { outDir: 'dist' },
})
