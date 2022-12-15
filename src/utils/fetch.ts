// @ts-ignore
import { fetch } from 'fetch-undici'

if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = fetch
}

export { fetch }
