import { type BaseContract } from '../../contract/subcontracts/base'
import { crossbell, isCrossbellChain } from '../../network'
import { warn } from '../../utils/logger'

// TODO: refactor this to ES standard decorator
// Wait for esbuild
export function autoSwitchMainnet() {
	return (
		target: object,
		propertyKey: string,
		descriptor: TypedPropertyDescriptor<
			(this: { base: BaseContract }, ...args: any[]) => Promise<any>
		>,
	) => {
		const originalMethod = descriptor.value

		descriptor.value = async function (...args: any[]) {
			const checkAndSwitch = async () => {
				const { walletClient } = this.base
				if (!walletClient) return
				const isCorrectChain = await isCrossbellChain(walletClient)
				if (!isCorrectChain) {
					warn(
						"You're not on the crossbell chain. Switching to crossbell chain.",
					)
					await walletClient.switchChain({ id: crossbell.id })
				}
			}

			try {
				await checkAndSwitch()
			} catch {
				// we may need to connect again if the user switch network on the halfway
				await checkAndSwitch()
			}

			return originalMethod?.apply(this, args)
		}

		return descriptor
	}
}
