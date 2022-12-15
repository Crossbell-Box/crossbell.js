import './fetch'
import { Logger } from './logger'

// check if the version is the latest
export const checkLatestVersion = async () => {
  try {
    const res = await fetch(
      'https://registry.npmjs.org/crossbell.js/latest',
    ).then((res) => res.json())
    const latest = res.version
    const { version } = await import('../../package.json')
    if (latest !== version) {
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
