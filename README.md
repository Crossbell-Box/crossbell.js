# crossbell.js

A JavaScript SDK to interact with the Crossbell.

## Installation

```bash
npm install crossbell
```

## Usage

### Metamask

```typescript
import { Contract } from 'crossbell'

const provider = window.ethereum
const contract = new Contract(provider)
const data = await contract.createProfile(
  '0x1234567890123456789012345678901234567890',
  'Jason',
  'ipfs://xxxx/metadata.json',
)
console.log(data.profileId) // '42'
console.log(data.transactionHash) // '0xabcdef...'
```

For more contract api, see [docs](https://crossbell-box.github.io/crossbell.js/classes/Contract.html).
