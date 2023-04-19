import { type BaseContract } from '../../contract/subcontracts/base'
import { CROSSBELL_CHAIN, isCrossbellMainnet } from '../../network'
import { warn } from '../../utils/logger'

// TODO: refactor this to ES standard decorator
// Wait for esbuild
export function autoSwitchMainnet() {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<
      (this: { base: BaseContract }, ...args: any[]) => Promise<any>
    >,
  ) => {
    const originalMethod = descriptor.value!

    descriptor.value = async function (...args: any[]) {
      const checkAndSwitch = async () => {
        const { walletClient } = this.base
        if (!walletClient) return
        const isMainnet = await isCrossbellMainnet(walletClient)
        if (!isMainnet) {
          warn("You're not on the mainnet. Switching to mainnet.")
          await walletClient.switchChain({ id: CROSSBELL_CHAIN.id })
        }
      }

      try {
        await checkAndSwitch()
      } catch {
        // we may need to connect again if the user switch network on the halfway
        await checkAndSwitch()
      }

      return originalMethod.apply(this, args)
    }

    return descriptor
  }
}
