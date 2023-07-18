#!/usr/bin/env node

// @ts-check

import { readFile, writeFile } from 'node:fs/promises'
import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { camelCase, pascalCase } from 'change-case'
import { format } from 'prettier'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const abiDir = resolve(root, 'src/contract/abi')
const prettierConfig = JSON.parse(
  await readFile(path.resolve(root, '.prettierrc'), 'utf-8'),
)

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function main() {
  const abis = await getAllAbis()

  const index = abis.map(([name]) => `export * from './${name}'\n`).join('')
  await Promise.all([
    writeFile(path.resolve(abiDir, 'index.ts'), index, 'utf-8'),
    ...abis.map(([name, abi]) => writeAbi(name, abi)),
  ])

  console.log('done')
}

/**
 * @returns {Promise<[name: string, abi: import('abitype').Abi][]>}
 */
async function getAllAbis() {
  const [
    { abi: abi1 },
    { abi: abi2 },
    { abi: periphery },
    { abi: cbt },
    { abi: newbieVilla },
    { abi: tips },
    { abi: tipsWithFee },
    mira,
    { abi: linklist },
  ] = await Promise.all([
    getAbi('Web3Entry'),
    getAbi('Events'),
    getAbi('Periphery'),
    getAbi('CharacterBoundToken'),
    getAbi('NewbieVilla'),
    getAbi('Tips'),
    getAbi('TipsWithFee'),
    getAbi(
      'https://raw.githubusercontent.com/Crossbell-Box/crossbell-bridge-contracts/main/build-info/MiraToken.abi',
    ),
    getAbi('Linklist'),
  ])

  const abi = [...abi1, ...abi2]

  return [
    ['entry', simplifyAbi(abi)],
    ['periphery', simplifyAbi(periphery)],
    ['cbt', simplifyAbi(cbt)],
    ['newbie-villa', simplifyAbi(newbieVilla)],
    ['tips', simplifyAbi(tips)],
    ['tips-with-fee', simplifyAbi(tipsWithFee)],
    ['mira', simplifyAbi(mira)],
    ['linklist', simplifyAbi(linklist)],
  ]
}

/** @param name {string} */
function getAbi(name) {
  return fetch(
    name.startsWith('https://')
      ? name
      : `https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/${name}.json`,
  ).then((res) =>
    res
      .json()
      .catch(() => Promise.reject(new Error(`Failed to parse ${name} abi`))),
  )
}

/**
 * @param {string} name kebab-case
 * @param {import('abitype').Abi} abi
 */
async function writeAbi(name, abi) {
  const camelName = camelCase(name)
  const pascalName = pascalCase(name)
  const contents = await format(
    `export const ${camelName} = ${JSON.stringify(abi)} as const;
    export type ${pascalName} = typeof ${camelName};`,
    { ...prettierConfig, parser: 'babel-ts' },
  )
  await writeFile(path.resolve(abiDir, `${name}.ts`), contents)
}

/** @param {import('abitype').Abi} abi */
function simplifyAbi(abi) {
  /** @param {import('abitype').AbiParameter} param */
  function removeField(param) {
    if ('internalType' in param) delete param.internalType
    if ('components' in param) {
      param.components = param.components.map((c) => removeField(c))
    }
    return param
  }

  return abi.map((abi) => {
    if ('anonymous' in abi) delete abi.anonymous
    if ('inputs' in abi && abi.inputs) {
      abi.inputs = abi.inputs.map((i) => removeField(i))
    }
    if ('outputs' in abi && abi.outputs) {
      abi.outputs = abi.outputs.map((i) => removeField(i))
    }
    return abi
  })
}
