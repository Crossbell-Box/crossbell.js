# crossbell.js

A JavaScript SDK to interact with the Crossbell. It works for both browser and Node.js.

[![npm version](https://badgen.net/npm/v/crossbell)](https://npm.im/crossbell) [![npm downloads](https://badgen.net/npm/dm/crossbell)](https://npm.im/crossbell)

- [API Reference](https://crossbell-box.github.io/crossbell.js/)
- [Vite Example](https://crossbell-js.netlify.app/)

## Installation

```bash
npm install crossbell
```

## Usage

### Requirements

Node.js >= 18.0.0 or Node.js >= 16.14.0 with [fetch polyfill](https://github.com/nodejs/undici)

### Contract

#### Connect with Metamask

```typescript
import { Contract } from 'crossbell'

// Create a new contract instance with metamask provider
const provider = window.ethereum
const contract = new Contract(provider)

// Example API: Create a new character for an address
try {
  const result = await contract.character.create(
    '0x1234567890123456789012345678901234567890',
    'Jason',
    'ipfs://xxxx/metadata.json',
  )
  console.log(result.data) // '42' (characterId)
  console.log(result.transactionHash) // '0xabcdef...'
} catch (e) {
  console.error(e.message) // e.g. "execution reverted: Web3Entry: HandleExists"
}
```

#### Connect with Private Key

You can also connect with a private key directly.

```typescript
import { Contract } from 'crossbell'

const privateKey =
  '0xabcdef0123456789012345678901234567890123456789012345678901234'
const contract = new Contract(privateKey)
```

#### Connect with Read-Only

You can also connect with a read-only provider. Note that in this case, you can't do write operations like `createCharacter`.

```typescript
import { Contract } from 'crossbell'

const contract = new Contract() // just pass nothing to use a read-only provider
```

For more contract api, see [docs](https://crossbell-box.github.io/crossbell.js/classes/Contract.html).

### Indexer

You can fetch data from the crossbell indexer.

```typescript
import { createIndexer } from 'crossbell'

const indexer = createIndexer()

// get a list of characters owned by a specific address
const res = await indexer.character.getMany(
  '0x1234567890123456789012345678901234567890',
)
console.log(res.list)
```

For more indexer api, see [docs](https://crossbell-box.github.io/crossbell.js/classes/Indexer.html).
