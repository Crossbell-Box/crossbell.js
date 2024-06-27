import { createNonceManager, jsonRpc } from 'viem/nonce'

export const nonceManager = createNonceManager({
	source: jsonRpc(),
})
