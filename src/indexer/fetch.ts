if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = require('undici').fetch
}

const fetch = globalThis.fetch

export { fetch }
