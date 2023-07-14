#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
const { writeFile, readFile, mkdir } = require('fs/promises')
const { resolve } = require('path')
const { fetch } = require('fetch-undici')
const { existsSync } = require('fs')

const getAbi = (name) =>
  fetch(
    name.startsWith('https')
      ? name
      : `https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/${name}.json`,
  ).then(async (res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch ${name}`)
    }

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch (e) {
      throw new Error(`Failed to parse ${name} abi`)
    }
  })

const writeJson = async (dir, abi) => {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true })
  }

  writeFile(`${dir}/abi.json`, JSON.stringify(abi, null, 2))
}

const genTypes = (dir) =>
  execAsync(
    `npx typechain --target ethers-v5 --out-dir ${dir}/types ${dir}/abi.json`,
  )

const main = async () => {
  const [
    { abi: abi1 },
    { abi: abi2 },
    { abi: periphery_abi },
    { abi: cbt_abi },
    { abi: newbie_villa_abi },
    { abi: tips_abi },
    { abi: tips_with_fee_abi },
    mira_abi,
    { abi: linklist_abi },
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

  const entryDir = resolve(__dirname, '../src/contract/abis/entry')
  const peripheryDir = resolve(__dirname, '../src/contract/abis/periphery')
  const cbtDir = resolve(__dirname, '../src/contract/abis/cbt')
  const newbieVillaDir = resolve(__dirname, '../src/contract/abis/newbie-villa')
  const tipsDir = resolve(__dirname, '../src/contract/abis/tips')
  const tipsWithFeeDir = resolve(__dirname, '../src/contract/abis/tips-with-fee')
  const miraDir = resolve(__dirname, '../src/contract/abis/mira')
  const linklistDir = resolve(__dirname, '../src/contract/abis/linklist')

  await Promise.all([
    writeJson(entryDir, abi),
    writeJson(peripheryDir, periphery_abi),
    writeJson(cbtDir, cbt_abi),
    writeJson(newbieVillaDir, newbie_villa_abi),
    writeJson(tipsDir, tips_abi),
    writeJson(tipsWithFeeDir, tips_with_fee_abi),
    writeJson(miraDir, mira_abi),
    writeJson(linklistDir, linklist_abi),
  ])

  await Promise.all([
    genTypes(entryDir),
    genTypes(peripheryDir),
    genTypes(cbtDir),
    genTypes(newbieVillaDir),
    genTypes(tipsDir),
    genTypes(tipsWithFeeDir),
    genTypes(miraDir),
    genTypes(linklistDir),
  ])

  // patch types
  // this is needed to make sure the types bundled with the package are correct
  // perhaps this is a bug of esbuild?
  const peripheryTypeFile = resolve(peripheryDir, 'types/Abi.ts')
  const peripheryType = await readFile(peripheryTypeFile, 'utf-8')
  await writeFile(
    peripheryTypeFile,
    peripheryType.replace(/export (declare namespace DataTypes)/, '$1'),
  )

  console.log('done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
