import {existsSync} from 'node:fs'
import {opendir} from 'node:fs/promises'
import path from 'node:path'
import {spawn} from 'node:child_process'

const siteDir = path.resolve('.next/server/app')
const outputDir = path.resolve('public/_pagefind')

async function hasHtmlFiles(dir) {
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    if (!current) continue
    try {
      const dirHandle = await opendir(current)
      for await (const dirent of dirHandle) {
        const fullPath = path.join(current, dirent.name)
        if (dirent.isDirectory()) {
          stack.push(fullPath)
        } else if (dirent.isFile() && dirent.name.toLowerCase().endsWith('.html')) {
          return true
        }
      }
    } catch (error) {
      // Ignore directories we cannot open
    }
  }
  return false
}

async function main() {
  if (!existsSync(siteDir)) {
    console.warn(`[pagefind] Skipping index build — site directory not found: ${siteDir}`)
    return
  }

  if (!(await hasHtmlFiles(siteDir))) {
    console.warn(`[pagefind] Skipping index build — no HTML files found under ${siteDir}`)
    return
  }

  const pagefindBin = path.resolve('node_modules/.bin/pagefind')
  const args = ['--site', siteDir, '--output-path', outputDir]

  await new Promise((resolve, reject) => {
    const child = spawn(pagefindBin, args, {stdio: 'inherit'})
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`pagefind exited with code ${code}`))
    })
  })
}

main().catch((error) => {
  console.error('[pagefind] Failed to build index:', error)
  process.exit(1)
})
