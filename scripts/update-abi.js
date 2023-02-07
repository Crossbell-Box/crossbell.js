#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
const { writeFile, readFile } = require('fs/promises')
const { resolve } = require('path')
const { fetch } = require('undici')

const getAbi = (name) =>
  fetch(
    `https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/${name}.json`,
  )
    .then((res) => res.json())
    .catch((e) => {
      console.error(`Error while fetching ${name}`)
      throw e
    })

const writeJson = (dir, abi) =>
  writeFile(`${dir}/abi.json`, JSON.stringify(abi, null, 2))

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
  ] = await Promise.all([
    getAbi('Web3Entry'),
    getAbi('Events'),
    getAbi('Periphery'),
    getAbi('CharacterBoundToken'),
    getAbi('NewbieVilla'),
  ])

  const abi = [...abi1, ...abi2]

  const entryDir = resolve(__dirname, '../src/contract/abis/entry')
  const peripheryDir = resolve(__dirname, '../src/contract/abis/periphery')
  const cbtDir = resolve(__dirname, '../src/contract/abis/cbt')
  const newbieVillaDir = resolve(__dirname, '../src/contract/abis/newbie-villa')

  await Promise.all([
    writeJson(entryDir, abi),
    writeJson(peripheryDir, periphery_abi),
    writeJson(cbtDir, cbt_abi),
    writeJson(newbieVillaDir, newbie_villa_abi),
  ])

  await Promise.all([
    genTypes(entryDir),
    genTypes(peripheryDir),
    genTypes(cbtDir),
    genTypes(newbieVillaDir),
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
