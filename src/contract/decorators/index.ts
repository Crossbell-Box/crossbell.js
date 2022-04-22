import { Network } from '../../network'
// import { BaseContract } from '../subcontracts/base'

export function autoSwitchMainnet() {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const checkAndSwitch = async () => {
        // @ts-ignore
        const provider = this.contract.provider
        const isMainnet = await Network.isCrossbellMainnet(provider)
        if (!isMainnet) {
          console.warn("You're not on the mainnet. Switching to mainnet.")
          await Network.switchToCrossbellMainnet(provider)
          // @ts-ignore
          await this.connect() // connect again
        }
      }

      // @ts-ignore
      if (this._hasConnected) {
        // only check and switch if we have already connected
        try {
          await checkAndSwitch()
        } catch {
          // we may need to connect again if the user switch network on the halfway
          // @ts-ignore
          await this.connect()
          await checkAndSwitch()
        }
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
