/* eslint-disable no-console */

const PREFIX = '[crossbell.js]'
const isProduction = globalThis?.process?.env?.NODE_ENV === 'production'

export function log(...message: any[]) {
  if (!isProduction) console.log(PREFIX, ...message)
}

export function warn(...message: any[]) {
  console.warn(PREFIX, ...message)
}

export function error(...message: any[]) {
  console.error(PREFIX, ...message)
}

export function info(...message: any[]) {
  console.info(PREFIX, ...message)
}
