import { BaseContract } from '../../contract/subcontracts/base'
import { Network } from '../../network'
import { Logger } from '../../utils'

export function autoSwitchMainnet() {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (this: BaseContract, ...args: any[]) => Promise<any>
    >,
  ) => {
    const originalMethod = descriptor.value!

    descriptor.value = async function (...args: any[]) {
      const checkAndSwitch = async () => {
        const { walletClient } = this
        if (!walletClient) return
        const isMainnet = await Network.isCrossbellMainnet(walletClient)
        if (!isMainnet) {
          Logger.warn("You're not on the mainnet. Switching to mainnet.")
          await walletClient.switchChain({ id: Network.getChain().id })
          console.log(await walletClient.getChainId())
        }
      }

      try {
        await checkAndSwitch()
      } catch (e) {
        // we may need to connect again if the user switch network on the halfway
        await checkAndSwitch()
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
