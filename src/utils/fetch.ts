// @ts-nocheck don't check fetch
// TODO remove this file when fetch is supported in Node 18

import { fetch } from 'fetch-undici'

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = fetch
}

export { fetch }
