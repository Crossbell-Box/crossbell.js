import './fetch'
import { Logger } from './logger'
import { version } from '../../package.json'

// check if the version is the latest
export const checkLatestVersion = async () => {
  try {
    const res: string = await fetch(
      'https://registry.npmjs.org/crossbell.js/latest',
    )
      .then((res) => res.json())
      .then((res) => res.version)

    const latest = res.split('.')
    const current = version.split('.')
    const isLatest = latest.every((v, i) => Number(v) <= Number(current[i]))

    if (!isLatest) {
      Logger.warn(
        `There is a new version of crossbell.js available: ${latest}. You are using version: ${version}. Please update to the latest version.`,
        `Changelog: https://github.com/Crossbell-Box/crossbell.js/releases`,
        `Or, pass the option { enableVersionCheck: false } to the Crossbell constructor to disable this warning.`,
      )
    }
  } catch (e) {
    Logger.warn('Failed to check for the latest version of crossbell.js.', e)
  }
}
