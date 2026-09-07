import { createWriteStream, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import archiver from 'archiver'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(root, 'dist')
const zipPath = resolve(root, 'app.zip')

if (!existsSync(distDir)) {
  console.error('zip-dist: dist/ is missing — run `npm run build` first.')
  process.exit(1)
}

const output = createWriteStream(zipPath)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', () => {
  console.log(`zip-dist: app.zip created (${archive.pointer()} bytes)`)
})

archive.on('error', (err) => {
  console.error('zip-dist: failed to create app.zip')
  console.error(err)
  process.exit(1)
})

archive.pipe(output)
archive.directory(distDir, false)
archive.finalize()
