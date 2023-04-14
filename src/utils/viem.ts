import {
  type Transport,
  type PublicClient,
  type PrivateKeyAccount,
  type DecodeEventLogReturnType,
  webSocket,
  http,
  createPublicClient,
  createWalletClient,
  custom,
  Address,
  Account,
  Log,
  decodeEventLog,
} from 'viem'
import type { EIP1193Provider } from 'eip1193-types'
import {
  ExtractAbiEvent,
  AbiTypeToPrimitiveType,
  ExtractAbiEventNames,
  Abi as _Abi,
  AbiType,
} from 'abitype'
import { Network } from '../network'
import * as Abi from '../contract/abi'
import { WalletClient } from 'viem'
import { Chain } from 'viem'

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

export function createWalletClientFromPrivateKeyAccount(
  account: PrivateKeyAccount,
): WalletClient<Transport, Chain, Account> {
  const transport = createDefaultTransport()
  return createWalletClient({
    transport,
    chain: Network.getChain(),
    account,
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

export function createWalletClientFromProvider(
  provider: EIP1193Provider,
  account?: Address | Account,
): WalletClient<Transport, Chain, Account> {
  return createWalletClient({
    transport: custom(provider),
    chain: Network.getChain(),
    account,
    pollingInterval: 100,
  })
}

type EventInputs<
  TAbi extends _Abi,
  TName extends ExtractAbiEventNames<TAbi>,
> = ExtractAbiEvent<TAbi, TName>['inputs']

type GetAbiType<
  TAbi extends _Abi,
  TName extends ExtractAbiEventNames<TAbi>,
  Key,
> = Extract<
  NonNullable<EventInputs<TAbi, TName>[number]>,
  { name: Key }
>['type']

type GetEventArgs<
  TAbi extends _Abi,
  TName extends ExtractAbiEventNames<TAbi>,
> = {
  [K in NonNullable<
    EventInputs<TAbi, TName>[number]['name']
  >]: AbiTypeToPrimitiveType<
    GetAbiType<TAbi, TName, K> extends AbiType
      ? GetAbiType<TAbi, TName, K>
      : never
  >
}

export type FixedEventReturn<
  TAbi extends _Abi,
  TName extends ExtractAbiEventNames<TAbi>,
> = Omit<DecodeEventLogReturnType<TAbi, TName>, 'args'> & {
  args: GetEventArgs<TAbi, TName>
}

export function parseLog<TName extends ExtractAbiEventNames<Abi.Entry>>(
  logs: Log[],
  filterTopic: TName,
  options: {
    throwOnMultipleLogsFound?: boolean
    returnMultipleLogs: true
    abi?: Abi.Entry
  },
): FixedEventReturn<Abi.Entry, TName>[]
export function parseLog<TName extends ExtractAbiEventNames<Abi.Entry>>(
  logs: Log[],
  filterTopic: TName,
  options?: {
    throwOnMultipleLogsFound?: boolean
    returnMultipleLogs?: boolean
    abi?: Abi.Entry
  },
): FixedEventReturn<Abi.Entry, TName>
export function parseLog<TName extends ExtractAbiEventNames<Abi.Entry>>(
  logs: Log[],
  targetTopic: TName,
  {
    throwOnMultipleLogsFound,
    returnMultipleLogs,
  }: {
    throwOnMultipleLogsFound?: boolean
    returnMultipleLogs?: boolean
  } = {},
): any {
  const parsedLogs = logs
    .map((log) =>
      decodeEventLog({ abi: [...Abi.entry, ...Abi.linklist], ...log }),
    )
    .filter(
      (log): log is DecodeEventLogReturnType<Abi.Entry, TName> =>
        log.eventName === targetTopic,
    )

  if (parsedLogs.length === 0) {
    throw new Error(`Log with topic ${targetTopic} not found`)
  }

  if (throwOnMultipleLogsFound && parsedLogs.length > 1) {
    throw new Error(`More than one log with topic ${parsedLogs} found`)
  }

  if (returnMultipleLogs) return parsedLogs

  return parsedLogs[0]
}
