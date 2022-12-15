export class Logger {
  static prefix = '[crossbell.js]'

  static log(...message: any[]) {
    console.log(this.prefix, ...message)
  }

  static warn(...message: any[]) {
    console.warn(this.prefix, ...message)
  }

  static error(...message: any[]) {
    console.error(this.prefix, ...message)
  }

  static info(...message: any[]) {
    console.info(this.prefix, ...message)
  }
}
