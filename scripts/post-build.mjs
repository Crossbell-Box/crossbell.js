#!/usr/bin/env node

// @ts-check

import { writeFile, readFile } from 'fs/promises'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const fileLoc = resolve(fileURLToPath(import.meta.url), '../../dist/index.mjs')

let content = await readFile(fileLoc, 'utf8')

content = content.replace(
  /globalThis\.fetch=\w+\(\"undici\"\)\.fetch/,
  'globalThis.fetch=await import("undici").then(mod => mod.fetch)',
)

await writeFile(fileLoc, content)

console.log('done')
