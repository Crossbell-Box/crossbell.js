const { execSync } = require('child_process')
const { writeFileSync } = require('fs')
const { resolve } = require('path')
const { fetch } = require('undici')

;(async () => {
  const [{ abi: abi1 }, { abi: abi2 }] = await Promise.all([
    fetch(
      'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/Web3Entry.json',
    ).then((res) => res.json()),
    fetch(
      'https://raw.githubusercontent.com/Crossbell-Box/Crossbell-Contracts/main/build-info/Events.json',
    ).then((res) => res.json()),
  ])

  const abi = [...abi1, ...abi2]

  writeFileSync(
    resolve(__dirname, '../src/contract/abi/abi.json'),
    JSON.stringify(abi, null, 2),
  )

  execSync(
    'npx typechain --target ethers-v5 --out-dir ./src/contract/abi/types ./src/contract/abi/abi.json',
  )

  console.log('done')
})()
