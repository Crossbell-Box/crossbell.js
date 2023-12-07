import { type EIP1193Provider } from 'eip1193-types'
import {
	type Account,
	type Address,
	type Chain,
	type GetContractReturnType,
	type Hex,
	type PublicClient,
	type Transport,
	type WalletClient,
	getContract,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CONTRACT_ADDRESS, crossbell, crossbellTestnet } from '../../network'
import { type Overwrite } from '../../types'
import {
	addressToAccount,
	createPublicClientFromChain,
	createWalletClientFromPrivateKeyAccount,
	createWalletClientFromProvider,
	getProviderAccount,
} from '../../utils/viem'
import * as Abi from '../abi'

export interface AddressOptions {
	entry: Address
	periphery: Address
	cbt: Address
	newbieVilla: Address
	tips: Address
	tipsWithFee: Address
	mira: Address
	linklist: Address
}

export interface ContractOptions {
	/**
	 * The wallet account.
	 *
	 * By default:
	 * - If the `providerOrPrivateKey` is a private key, the account is the private key account.
	 * - If the `providerOrPrivateKey` is a provider, the account is the first account in the provider.
	 *   **The change of this option will only affect in this case**.
	 */
	account?: Account | Address

	/**
	 * The contract addresses.
	 *
	 * Normally you don't need to set this option as all the contract
	 * addresses are the same across all Crossbell chains (mainnet or testnet).
	 *
	 * @default
	 *{
	 *	entry: '0xa6f969045641Cf486a747A2688F3a5A6d43cd0D8',
	 *	periphery: '0x96e96b7af62d628ce7eb2016d2c1d2786614ea73',
	 *	newbieVilla: '0xD0c83f0BB2c61D55B3d33950b70C59ba2f131caA',
	 *	cbt: '0x3D1b588a6Bcd728Bb61570ced6656eA4C05e404f',
	 *	tips: '0x0058be0845952D887D1668B5545de995E12e8783',
	 *	tipsWithFee: '0xf3158018f932981d0005701dDC22Ce51477E436d',
	 *	mira: '0xAfB95CC0BD320648B3E8Df6223d9CDD05EbeDC64',
	 *	linklist: '0xFc8C75bD5c26F50798758f387B698f207a016b6A',
	 *}
	 */
	contractAddresses?: Partial<AddressOptions>

	/**
	 * Gas price for transaction costs.
	 *
	 * Options:
	 * - `'estimate'`: Estimate the gas price from the network.
	 * - bigint: Use a fixed gas price.
	 *
	 * @default 10n ** 9n
	 *
	 */
	gasPrice?: 'estimate' | bigint

	/**
	 * The chain to connect to.
	 *
	 * Options:
	 * - `'mainnet'`: Connect to the Crossbell mainnet.
	 * - `'testnet'`: Connect to the Crossbell testnet.
	 * - Custom chain: Connect to a custom Crossbell chain.
	 *
	 * @default 'mainnet'
	 */
	chain?: 'mainnet' | 'testnet' | Chain

	/**
	 * The RPC URL to connect to.
	 *
	 * This will override the `rpcUrl` field in the `chain` option.
	 *
	 * @default chain.rpcUrls.default.http[0]
	 */
	rpcUrl?: string
}

export type ResolvedContractOptions = Overwrite<
	Required<ContractOptions>,
	{ contractAddresses: AddressOptions; chain: Chain }
>

export class BaseContract {
	publicClient!: PublicClient
	walletClient!: WalletClient<Transport, Chain, Account>
	#account: Account | undefined

	get account(): Account {
		return this.#account as Account
	}
	set account(value: Address | Account) {
		this.#account = typeof value === 'string' ? addressToAccount(value) : value
		if (this.walletClient) this.walletClient.account = this.#account
	}

	options: ResolvedContractOptions

	contract!: GetContractReturnType<
		Abi.Entry,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	linklistContract!: GetContractReturnType<
		Abi.Linklist,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	newbieVillaContract!: GetContractReturnType<
		Abi.NewbieVilla,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	peripheryContract!: GetContractReturnType<
		Abi.Periphery,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	cbtContract!: GetContractReturnType<
		Abi.Cbt,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	miraContract!: GetContractReturnType<
		Abi.Mira,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	tipsContract!: GetContractReturnType<
		Abi.Tips,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>
	tipsWithFeeContract!: GetContractReturnType<
		Abi.TipsWithFee,
		{
			publicClient: typeof BaseContract.prototype.publicClient
			walletClient: typeof BaseContract.prototype.walletClient
		}
	>

	/**
	 * This creates a new Contract instance to interact with.
	 * @param providerOrPrivateKey - The provider or private key to connect to the contract.
	 * @returns The Contract instance.
	 *
	 * @example Connect with Metamask
	 * ```js
	 * import { Contract } from 'crossbell'
	 * const provider = window.ethereum // the metamask provider
	 * const contract = new Contract(provider)
	 * ```
	 *
	 * @example Connect with Private Key
	 * ```js
	 * import { Contract } from 'crossbell'
	 * const privateKey = '0xabcdef0123456789012345678901234567890123456789012345678901234'
	 * const contract = new Contract(privateKey)
	 * ```
	 *
	 * @example Connect with a Readonly Contract
	 * ```js
	 * import { Contract } from 'crossbell'
	 * const contract = new Contract() // readonly contract
	 * ```
	 */
	constructor(
		providerOrPrivateKey: Hex | EIP1193Provider | undefined,
		options?: Partial<ContractOptions>,
	) {
		this.options = this.#resolveOptions(options)

		this.#initPublicClient()
		this.#initWalletClient(providerOrPrivateKey)

		this.#initContract()
	}

	#resolveOptions(options?: ContractOptions): ResolvedContractOptions {
		const chain =
			options?.chain === 'mainnet'
				? crossbell
				: options?.chain === 'testnet'
				  ? crossbellTestnet
				  : options?.chain ?? crossbell
		return {
			account: this.account,
			gasPrice: options?.gasPrice ?? 10n ** 9n,
			contractAddresses: {
				entry: CONTRACT_ADDRESS.ENTRY,
				periphery: CONTRACT_ADDRESS.PERIPHERY,
				cbt: CONTRACT_ADDRESS.CBT,
				tips: CONTRACT_ADDRESS.TIPS,
				tipsWithFee: CONTRACT_ADDRESS.TIPS_WITH_FEE,
				mira: CONTRACT_ADDRESS.MIRA,
				newbieVilla: CONTRACT_ADDRESS.NEWBIE_VILLA,
				linklist: CONTRACT_ADDRESS.LINKLIST,
				...options?.contractAddresses,
			},
			chain,
			rpcUrl: options?.rpcUrl ?? chain.rpcUrls.default.http[0],
		}
	}

	#initPublicClient() {
		this.publicClient = createPublicClientFromChain(
			this.options.chain,
			this.options.rpcUrl,
		)
	}

	#initWalletClient(providerOrPrivateKey: Hex | EIP1193Provider | undefined) {
		if (typeof providerOrPrivateKey === 'string') {
			// private key
			const privateKeyAccount = privateKeyToAccount(providerOrPrivateKey)
			this.#account = privateKeyAccount
			this.walletClient = createWalletClientFromPrivateKeyAccount(
				privateKeyAccount,
				this.options.chain,
				this.options.rpcUrl,
			)
		} else if (
			providerOrPrivateKey &&
			typeof providerOrPrivateKey === 'object'
		) {
			// provider
			const provider = providerOrPrivateKey
			this.#account = this.options.account
				? addressToAccount(this.options.account)
				: getProviderAccount(provider)
			if (!this.options?.account) {
				provider.on('accountsChanged', (accounts) => {
					this.account = accounts[0]
				})
			}
			this.walletClient = createWalletClientFromProvider(
				provider,
				this.account,
				this.options.chain,
			)
		}
	}

	#initContract() {
		this.contract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.entry,
				abi: Abi.entry,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.linklistContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.linklist,
				abi: Abi.linklist,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.newbieVillaContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.newbieVilla,
				abi: Abi.newbieVilla,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.peripheryContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.periphery,
				abi: Abi.periphery,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.cbtContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.cbt,
				abi: Abi.cbt,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.miraContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.mira,
				abi: Abi.mira,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.tipsContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.tips,
				abi: Abi.tips,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.tipsWithFeeContract = this.#proxyContract(
			getContract({
				address: this.options.contractAddresses.tipsWithFee,
				abi: Abi.tipsWithFee,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
	}

	#proxyContract<T extends GetContractReturnType>(contract: T): T {
		if ((contract as any).write)
			(contract as any).write = new Proxy((contract as any).write, {
				get: (...args) => {
					return new Proxy(Reflect.get(...args), {
						apply: (target, thisArg, argArray) => {
							const hasArgs = argArray.length > 0 && Array.isArray(argArray[0])
							const options = {
								...((hasArgs ? argArray[1] : argArray[0]) ?? {}),
							}

							if (typeof this.options.gasPrice === 'bigint')
								options.gasPrice = this.options.gasPrice

							if (argArray.length > 0) {
								if (hasArgs) argArray[1] = options
								else argArray[0] = options
							} else argArray.push(options)

							return Reflect.apply(target, thisArg, argArray)
						},
					})
				},
			})
		return contract
	}
}
