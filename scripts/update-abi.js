#!/usr/bin/env node

const { execSync } = require('child_process')
const { writeFile } = require('fs/promises')
const { resolve } = require('path')
const { fetch } = require('undici')

;(async () => {
  const [{ abi: abi1 }, { abi: abi2 }, { abi: periphery_abi }] =
    await Promise.all([
      fetch(
        'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/feature/character-2/build-info/Web3Entry.json',
        // 'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/Web3Entry.json',
      ).then((res) => res.json()),
      fetch(
        'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/feature/character-2/build-info/Events.json',
        // 'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/Events.json',
      ).then((res) => res.json()),
      fetch(
        'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/feature/character-2/build-info/Periphery.json',
        // 'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/Periphery.json',
      ).then((res) => res.json()),
    ])

  const abi = [...abi1, ...abi2]

  const entryDir = resolve(__dirname, '../src/contract/abis/entry')
  const peripheryDir = resolve(__dirname, '../src/contract/abis/periphery')

  await writeFile(`${entryDir}/abi.json`, JSON.stringify(abi, null, 2))

  await writeFile(
    `${peripheryDir}/abi.json`,
    JSON.stringify(periphery_abi, null, 2),
  )

  execSync(
    `npx typechain --target ethers-v5 --out-dir ${entryDir}/types ${entryDir}/abi.json`,
  )

  execSync(
    `npx typechain --target ethers-v5 --out-dir ${peripheryDir}/types ${peripheryDir}/abi.json`,
  )

  console.log('done')
})()
