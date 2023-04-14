#!/usr/bin/env node

// @ts-check

import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const fileLoc = resolve(fileURLToPath(import.meta.url), '../../dist/index.mjs')

let content = await readFile(fileLoc, 'utf8')

content = content.replace(
  /globalThis\.fetch=\w+\("undici"\)\.fetch/,
  'globalThis.fetch=await import("undici").then(mod => mod.fetch)',
)

await writeFile(fileLoc, content)

console.log('done')
