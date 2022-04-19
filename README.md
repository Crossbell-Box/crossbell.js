# crossbell.js

A JavaScript SDK to interact with the Crossbell.

## Installation

```bash
npm install crossbell.js
```

## Usage

### Metamask

```typescript
import { Contract } from 'crossbell.js'

// Create a new contract instance with metamask provider
const provider = window.ethereum
const contract = new Contract(provider)

// Connect to the chain
await contract.connect()

// Example API: Create a new profile for an address
try {
  const data = await contract.createProfile(
    '0x1234567890123456789012345678901234567890',
    'Jason',
    'ipfs://xxxx/metadata.json',
  )
  console.log(data.profileId) // '42'
  console.log(data.transactionHash) // '0xabcdef...'
} catch (e) {
  console.error(e.message) // e.g. "execution reverted: Web3Entry: HandleExists"
}
```

For more contract api, see [docs](https://crossbell-box.github.io/crossbell.js/classes/Contract.html).
