import {
	type Abi as _Abi,
	type AbiType,
	type AbiTypeToPrimitiveType,
	type ExtractAbiEvent,
} from 'abitype'
import { type EIP1193Provider } from 'eip1193-types'
import { backOff } from 'exponential-backoff'
import {
	http,
	type Account,
	type Address,
	type Chain,
	type ContractEventName,
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
	webSocket,
} from 'viem'
import * as Abi from '../contract/abi'
import { crossbell, getJsonRpcAddress } from '../network'
import { log } from './logger'

export function createDefaultTransport(addr = getJsonRpcAddress()): Transport {
	if (addr.startsWith('ws://') || addr.startsWith('wss://')) {
		return webSocket(addr, {
			timeout: 30_000,
			key: crossbell.name,
			name: crossbell.name,
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
	TName extends ContractEventName<TAbi>,
> = ExtractAbiEvent<TAbi, TName>['inputs']

type GetAbiType<
	TAbi extends _Abi,
	TName extends ContractEventName<TAbi>,
	Key,
> = Extract<
	NonNullable<EventInputs<TAbi, TName>[number]>,
	{ name: Key }
>['type']

type GetEventArgs<TAbi extends _Abi, TName extends ContractEventName<TAbi>> = {
	[K in
		NonNullable<
			EventInputs<TAbi, TName>[number]['name']
		>]: AbiTypeToPrimitiveType<
		GetAbiType<TAbi, TName, K> extends AbiType
			? GetAbiType<TAbi, TName, K>
			: never
	>
}

export type FixedEventReturn<
	TAbi extends _Abi,
	TName extends ContractEventName<TAbi>,
> = Omit<DecodeEventLogReturnType<TAbi, TName>, 'args'> & {
	args: GetEventArgs<TAbi, TName>
}

export function parseLog<
	TAbi extends _Abi = Abi.Entry,
	TName extends ContractEventName<TAbi> = ContractEventName<TAbi>,
>(
	logs: Log[],
	filterTopic: TName,
	options: {
		throwOnMultipleLogsFound?: boolean
		returnMultipleLogs: true
		abi?: TAbi
	},
): FixedEventReturn<TAbi, TName>[]
export function parseLog<
	TAbi extends _Abi = Abi.Entry,
	TName extends ContractEventName<TAbi> = ContractEventName<TAbi>,
>(
	logs: Log[],
	filterTopic: TName,
	options?: {
		throwOnMultipleLogsFound?: boolean
		returnMultipleLogs?: boolean
		abi?: TAbi
	},
): FixedEventReturn<TAbi, TName>
export function parseLog<
	TAbi extends _Abi = Abi.Entry,
	TName extends ContractEventName<TAbi> = ContractEventName<TAbi>,
>(
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
		.filter((log) => log.eventName === targetTopic)

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

/**
 * @see https://github.com/Crossbell-Box/crossbell.js/issues/40
 *
 * This function is used to retry waitForTransactionReceipt
 * because sometimes the transaction is not mined on a load-balanced node.
 *
 * The retry time is
 * `100ms`, `200ms`, `400ms`, `800ms`, `1600ms`, `3200ms`,
 * i.e. `6300ms` in total.
 **/
export async function waitForTransactionReceiptWithRetry(
	client: PublicClient,
	hash: Address,
): Promise<TransactionReceipt> {
	return backOff(() => client.waitForTransactionReceipt({ hash }), {
		retry: (e, i) => {
			log('retrying waitForTransactionReceipt', { hash, i, e })
			return true
		},
		numOfAttempts: 6,
		timeMultiple: 2,
		startingDelay: 100,
	})
}
