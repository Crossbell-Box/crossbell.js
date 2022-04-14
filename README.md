# crossbell.js

A JavaScript SDK to interact with the Crossbell.

## Installation

```bash
npm install crossbell
```

## Usage

```typescript
import { Contract } from 'crossbell'

const contract = new Contract(provider)
const profileId = await contract.createProfile(
  '0x1234567890123456789012345678901234567890',
  'Jason',
  'ipfs://xxxx/metadata.json',
)
```

## APIs

### Create a Profile

TODO
