import './fetch'
import { Logger } from './logger'
import { version } from '../../package.json'

let hasNotified = false

// check if the version is the latest
export const checkLatestVersion = async () => {
  if (hasNotified) return

  try {
    const res: string = await fetch(
      'https://registry.npmjs.org/crossbell.js/latest',
    )
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error(`Failed to fetch the latest version of crossbell.js.`)
      })
      .then((res) => res.version)

    const latest = res.split('.')
    const current = version.split('.')
    const isLatest = latest.every((v, i) => Number(v) <= Number(current[i]))

    if (!isLatest) {
      const latestStr = latest.join('.')
      Logger.warn(
        `There is a new version of crossbell.js available: ${latestStr}. You are using version: ${version}. Please update to the latest version.`,
        `Changelog: https://github.com/Crossbell-Box/crossbell.js/releases`,
        `Or, pass the option { enableVersionCheck: false } to the Crossbell constructor to disable this warning.`,
      )
    }
  } catch (e) {
    Logger.warn('Failed to check for the latest version of crossbell.js.', e)
  } finally {
    hasNotified = true
  }
}
