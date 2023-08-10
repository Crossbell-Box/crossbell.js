import {
  type Account,
  type Address,
  type Chain,
  type DecodeEventLogReturnType,
  type Log,
  type PrivateKeyAccount,
  type PublicClient,
  type TransactionReceipt,
  type Transport,
  type WalletClient,
  createPublicClient,
  createWalletClient,
  custom,
  decodeEventLog,
  http,
  webSocket,
} from 'viem'
import {
  type AbiType,
  type AbiTypeToPrimitiveType,
  type ExtractAbiEvent,
  type ExtractAbiEventNames,
  type Abi as _Abi,
} from 'abitype'
import { type EIP1193Provider } from 'eip1193-types'
import { crossbell, getJsonRpcAddress } from '../network'
import * as Abi from '../contract/abi'

export function createDefaultTransport(addr = getJsonRpcAddress()): Transport {
  if (addr.startsWith('ws://') || addr.startsWith('wss://')) {
    return webSocket(addr, {
      timeout: 30_000,
      key: crossbell.network,
      name: crossbell.network,
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
    chain: crossbell,
    pollingInterval: 100,
    batch: {
      multicall: true,
    },
  })
}

export function createWalletClientFromPrivateKeyAccount(
  account: PrivateKeyAccount,
): WalletClient<Transport, Chain, Account> {
  const transport = createDefaultTransport()
  return createWalletClient({
    transport,
    chain: crossbell,
    account,
    pollingInterval: 100,
  })
}

export function getProviderAccount(
  provider: EIP1193Provider,
): Account | undefined {
  if ('selectedAddress' in provider && provider.selectedAddress) {
    return addressToAccount(provider.selectedAddress as Address)
  }
  if ('send' in provider && typeof provider.send === 'function') {
    const result: any = provider.send({ method: 'eth_accounts' })
    if (result?.result?.[0]) {
      return addressToAccount(result.result[0])
    }
  }
}

export function createWalletClientFromProvider(
  provider: EIP1193Provider,
  account: Address | Account,
): WalletClient<Transport, Chain, Account> {
  return createWalletClient({
    transport: custom(provider),
    chain: crossbell,
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

export function addressToAccount(address: Address | Account): Account {
  if (typeof address === 'string')
    return {
      type: 'json-rpc',
      address,
    }
  return address
}

/** @see https://github.com/Crossbell-Box/crossbell.js/issues/40 */
export async function waitForTransactionReceiptWithRetry(
  client: PublicClient,
  hash: Address,
  retryCount = 10,
): Promise<TransactionReceipt> {
  let count = 0
  while (count < retryCount) {
    try {
      const receipt = await client.waitForTransactionReceipt({ hash })
      await new Promise((resolve) => setTimeout(resolve, 100))
      return receipt
    } catch (e: any) {
      if (count === retryCount - 1) throw e
      count++
    }
  }
  throw new Error('unreachable') // for type check
}
