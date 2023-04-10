import {
  Transport,
  webSocket,
  http,
  PublicClient,
  createPublicClient,
  WalletClient,
  createWalletClient,
  Hex,
  custom,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { Network } from '../network'

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

export function createWalletClientFromPrivateKey(privKey: Hex): WalletClient {
  const account = privateKeyToAccount(privKey)
  const transport = createDefaultTransport()
  return createWalletClient({
    transport,
    account,
    chain: Network.getChain(),
    pollingInterval: 100,
  })
}

export type CustomProvider = Parameters<typeof custom>[0]

export function createWalletClientFromCustom(
  provider: CustomProvider,
): WalletClient {
  return createWalletClient({
    transport: custom(provider),
    chain: Network.getChain(),
    pollingInterval: 100,
  })
}
