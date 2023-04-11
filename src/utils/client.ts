import {
  Transport,
  webSocket,
  http,
  PublicClient,
  createPublicClient,
  createWalletClient,
  Hex,
  custom,
  Address,
  Account,
} from 'viem'
import { Network } from '../network'
import type { EIP1193Provider } from 'eip1193-types'

export function createDefaultTransport(): Transport {
  const addr = Network.getJsonRpcAddress()
  if (addr.startsWith('ws://') || addr.startsWith('wss://')) {
    return webSocket(addr, {
      timeout: 30_000,
      key: Network.getNetwork(),
      name: Network.getNetwork(),
      retryCount: 5,
      retryDelay: 5000,
    })
  } else {
    return http(addr)
  }
}

export function createDefaultPublicClient(): PublicClient {
  const transport = createDefaultTransport()
  return createPublicClient({
    transport,
    chain: Network.getChain(),
    pollingInterval: 100,
  })
}

export function createWalletClientFromPrivateKey(privKey: Hex) {
  const transport = createDefaultTransport()
  return createWalletClient({
    transport,
    chain: Network.getChain(),
    pollingInterval: 100,
  })
}

export function getProviderAddress(
  provider: EIP1193Provider,
): Address | undefined {
  if ('selectedAddress' in provider && provider.selectedAddress) {
    return provider.selectedAddress as Address
  }
  if ('send' in provider && typeof provider.send === 'function') {
    const result: any = provider.send({ method: 'eth_accounts' })
    if (result?.result?.[0]) return result.result[0]
  }
}

export function createWalletClientFromCustom(
  provider: EIP1193Provider,
  account?: Address | Account,
) {
  return createWalletClient({
    transport: custom(provider),
    chain: Network.getChain(),
    account,
    pollingInterval: 100,
  })
}
