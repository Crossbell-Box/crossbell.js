import { type Address, type WalletClient } from 'viem'
import { crossbell } from 'viem/chains'
import { crossbellTestnet } from './chains'

export { crossbell, crossbellTestnet }

export const CONTRACT_ADDRESS = {
	ENTRY: '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8',
	PERIPHERY: '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73',
	NEWBIE_VILLA: '0xD0c83f0BB2c61D55B3d33950b70C59ba2f131caA',
	CBT: '0x3D1b588a6Bcd728Bb61570ced6656eA4C05e404f',
	TIPS: '0x0058be0845952D887D1668B5545de995E12e8783',
	TIPS_WITH_CONFIG: '0xF1375C069998d06E123B800cF0566e44DA1BE30E',
	TIPS_WITH_FEE: '0xf3158018f932981d0005701dDC22Ce51477E436d',
	MIRA: '0xAfB95CC0BD320648B3E8Df6223d9CDD05EbeDC64',
	LINKLIST: '0xFc8C75bD5c26F50798758f387B698f207a016b6A',
	GCSB: '0x4200000000000000000000000000000000000301',
} as const satisfies Record<string, Address>

let JSON_RPC_ADDRESS: string | undefined

/**
 * @deprecated
 *
 * **This still works, but it'll be removed in the next major version.**
 *
 * Instead, please set the `options.chain` or `options.rpcUrl` in `createContract()`
 * to change the JSON RPC address.
 */
export function getJsonRpcAddress() {
	return JSON_RPC_ADDRESS
}
/**
 * @deprecated
 *
 * **This still works, but it'll be removed in the next major version.**
 *
 * Instead, please set the `options.chain` or `options.rpcUrl` in `createContract()`
 * to change the JSON RPC address.
 */
export function setJsonRpcAddress(address: string) {
	JSON_RPC_ADDRESS = address
}

/**
 * This checks if the current network is the Crossbell mainnet.
 * @param client - The wallet client to check if it's the Crossbell mainnet.
 * @returns A boolean value indicating if the current network is the Crossbell mainnet.
 */
export async function isCrossbellMainnet(client: WalletClient) {
	return (await client.getChainId()) === crossbell.id
}

/**
 * This checks if the current network is the Crossbell testnet.
 * @param client - The wallet client to check if it's the Crossbell testnet.
 * @returns A boolean value indicating if the current network is the Crossbell testnet.
 */
export async function isCrossbellTestnet(client: WalletClient) {
	return (await client.getChainId()) === crossbellTestnet.id
}

/**
 * This checks if the current network is the Crossbell mainnet or testnet.
 * @param client - The wallet client to check if it's the Crossbell mainnet or testnet.
 * @returns A boolean value indicating if the current network is the Crossbell mainnet or testnet.
 */
export async function isCrossbellChain(client: WalletClient) {
	const chainId = await client.getChainId()
	return chainId === crossbell.id || chainId === crossbellTestnet.id
}
