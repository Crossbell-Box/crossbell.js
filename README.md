# crossbell.js

A JavaScript SDK to interact with the Crossbell. It works for both browser and Node.js.

[![npm version](https://badgen.net/npm/v/crossbell.js)](https://npm.im/crossbell.js) [![npm downloads](https://badgen.net/npm/dm/crossbell.js)](https://npm.im/crossbell.js)

## Installation

```bash
npm install crossbell.js
```

## Usage

### Connect with Metamask

```typescript
import { Contract } from 'crossbell.js'

// Create a new contract instance with metamask provider
const provider = window.ethereum
const contract = new Contract(provider)

// Connect to the chain
await contract.connect()

// Example API: Create a new profile for an address
try {
  const result = await contract.createProfile(
    '0x1234567890123456789012345678901234567890',
    'Jason',
    'ipfs://xxxx/metadata.json',
  )
  console.log(result.data) // '42' (profileId)
  console.log(result.transactionHash) // '0xabcdef...'
} catch (e) {
  console.error(e.message) // e.g. "execution reverted: Web3Entry: HandleExists"
}
```

### Connect with Private Key

You can also connect with a private key directly.

```typescript
import { Contract } from 'crossbell.js'

const privateKey =
  '0xabcdef0123456789012345678901234567890123456789012345678901234'
const contract = new Contract(privateKey)

// Connect to the chain
await contract.connect()
```

### Connect with Read-Only

You can also connect with a read-only provider. Note that in this case, you can't do write operations like `createProfile`.

```typescript
import { Contract } from 'crossbell.js'

const contract = new Contract() // just pass nothing to use a read-only provider

// Connect to the chain
await contract.connect()
```

For more contract api, see [docs](https://crossbell-box.github.io/crossbell.js/classes/Contract.html).
