#!/usr/bin/env node

const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
const { writeFile } = require('fs/promises')
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
  ] = await Promise.all([
    getAbi('Web3Entry'),
    getAbi('Events'),
    getAbi('Periphery'),
    getAbi('CharacterBoundToken'),
  ])

  const abi = [...abi1, ...abi2]

  const entryDir = resolve(__dirname, '../src/contract/abis/entry')
  const peripheryDir = resolve(__dirname, '../src/contract/abis/periphery')
  const cbtDir = resolve(__dirname, '../src/contract/abis/cbt')

  await Promise.all([
    writeJson(entryDir, abi),
    writeJson(peripheryDir, periphery_abi),
    writeJson(cbtDir, cbt_abi),
  ])

  await Promise.all([
    genTypes(entryDir),
    genTypes(peripheryDir),
    genTypes(cbtDir),
  ])

  console.log('done')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
