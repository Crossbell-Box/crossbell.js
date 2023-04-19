import { type Address, type WalletClient } from 'viem'

export const CONTRACT_ADDRESS = {
  ENTRY: '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8',
  PERIPHERY: '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73',
  NEWBIE_VILLA: '0xD0c83f0BB2c61D55B3d33950b70C59ba2f131caA',
  CBT: '0x3D1b588a6Bcd728Bb61570ced6656eA4C05e404f',
  TIPS: '0x0058be0845952D887D1668B5545de995E12e8783',
  MIRA: '0xAfB95CC0BD320648B3E8Df6223d9CDD05EbeDC64',
  LINKLIST: '0xFc8C75bD5c26F50798758f387B698f207a016b6A',
} as const satisfies Record<string, Address>

export const AVAILABLE_NETWORKS = ['crossbell'] as const
export type AvailableNetwork = (typeof AVAILABLE_NETWORKS)[number]

export const IPFS_GATEWAY = 'https://w3s.link/ipfs/'
export const JSON_RPC_ADDRESS =
  // @ts-ignore
  globalThis.process?.env.CROSSBELL_RPC_ADDRESS ?? 'https://rpc.crossbell.io'

export const CROSSBELL_CHAIN = {
  name: 'Crossbell',
  network: 'crossbell',
  id: 3737,
  nativeCurrency: {
    name: 'CSB',
    symbol: 'CSB',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://rpc.crossbell.io'] },
    default: { http: ['https://rpc.crossbell.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'Crossbell', url: 'https://scan.crossbell.io' },
    default: { name: 'Crossbell', url: 'https://scan.crossbell.io' },
  },
  contracts: {
    multicall3: {
      address: CONTRACT_ADDRESS.ENTRY,
      blockCreated: 30548014,
    },
  },
} as const

/**
 * This checks if the current network is the Crossbell mainnet.
 * @param client - The wallet client to check if it's the Crossbell mainnet.
 * @returns A boolean value indicating if the current network is the Crossbell mainnet.
 */
export async function isCrossbellMainnet(client: WalletClient) {
  return (await client.getChainId()) === CROSSBELL_CHAIN.id
}
