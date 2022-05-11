import { isBrowser } from 'browser-or-node'
import type { fetch as Ifetch } from 'undici'

let fetch: typeof Ifetch

if (isBrowser) {
  fetch = window.fetch as unknown as typeof Ifetch
} else {
  fetch = require('undici').fetch as typeof Ifetch
}

export { fetch }
