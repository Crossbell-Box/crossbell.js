#!/usr/bin/env node

// const { execSync } = require('child_process')
// const { writeFile, readFile } = require('fs/promises')
// const { resolve } = require('path')
// const { fetch } = require('undici')

// ;(async () => {
//   const fileLoc = resolve(__dirname, '../dist/index.mjs')

//   let content = await readFile(fileLoc, 'utf8')

//   content = content.replace(
//     /globalThis\.fetch=\w+\(\"undici\"\)\.fetch/,
//     'globalThis.fetch=await import("undici").then(mod => mod.fetch)',
//   )

//   await writeFile(fileLoc, content)

//   console.log('done')
// })()
