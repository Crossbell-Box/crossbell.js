# crossbell.js

A JavaScript SDK to interact with the Crossbell.

## Installation

```bash
npm install crossbell
```

## Usage

```typescript
import { Contract } from 'crossbell'

const api = new Contract.Web3Entry(provider)
const profileId = await api.createProfile(
  '0x1234567890123456789012345678901234567890',
  'Jason',
  'ipfs://xxxx/metadata.json',
)
```

## APIs

### Create a Profile

TODO
