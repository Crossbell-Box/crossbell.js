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
import { CONTRACT_ADDRESS } from '../../network'
import { type Overwrite } from '../../types'
import {
	addressToAccount,
	createDefaultPublicClient,
	createWalletClientFromPrivateKeyAccount,
	createWalletClientFromProvider,
	getProviderAccount,
} from '../../utils/viem'
import * as Abi from '../abi'

export interface AccountOptions {
	account: Account | Address
}
export interface AddressOptions {
	entryContract: Address
	peripheryContract: Address
	cbtContract: Address
	newbieVillaContract: Address
	tipsContract: Address
	tipsWithFeeContract: Address
	miraContract: Address
	linklistContract: Address
}
export interface ContractOptions extends Partial<AccountOptions> {
	address?: Partial<AddressOptions>
	/**
	 * Gas price for transaction costs.
	 *
	 * `estimate`: Estimate the gas price from the network.
	 *
	 * @default 10n ** 9n
	 *
	 */
	gasPrice?: 'estimate' | bigint
}

export type ResolvedContractOptions = Overwrite<
	Required<ContractOptions>,
	{ address: AddressOptions }
>

export class BaseContract {
	publicClient: PublicClient = createDefaultPublicClient()
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
		if (typeof providerOrPrivateKey === 'string') {
			const account = privateKeyToAccount(providerOrPrivateKey)
			this.#account = account
			this.walletClient = createWalletClientFromPrivateKeyAccount(account)
		} else if (
			providerOrPrivateKey &&
			typeof providerOrPrivateKey === 'object'
		) {
			const provider = providerOrPrivateKey
			this.#account = options?.account
				? addressToAccount(options.account)
				: getProviderAccount(provider)
			if (!options?.account) {
				provider.on('accountsChanged', (accounts) => {
					this.account = accounts[0]
				})
			}
			this.walletClient = createWalletClientFromProvider(provider, this.account)
		}
		this.options = this.#resolveOptions(options)
		this.#initContract()
	}

	#resolveOptions(options?: ContractOptions): ResolvedContractOptions {
		return {
			account: this.account,
			gasPrice: options?.gasPrice ?? 10n ** 9n,
			address: {
				entryContract: CONTRACT_ADDRESS.ENTRY,
				peripheryContract: CONTRACT_ADDRESS.PERIPHERY,
				cbtContract: CONTRACT_ADDRESS.CBT,
				tipsContract: CONTRACT_ADDRESS.TIPS,
				tipsWithFeeContract: CONTRACT_ADDRESS.TIPS_WITH_FEE,
				miraContract: CONTRACT_ADDRESS.MIRA,
				newbieVillaContract: CONTRACT_ADDRESS.NEWBIE_VILLA,
				linklistContract: CONTRACT_ADDRESS.LINKLIST,
				...options?.address,
			},
		}
	}

	#initContract() {
		this.contract = this.#proxyContract(
			getContract({
				address: this.options.address.entryContract,
				abi: Abi.entry,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.linklistContract = this.#proxyContract(
			getContract({
				address: this.options.address.linklistContract,
				abi: Abi.linklist,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.newbieVillaContract = this.#proxyContract(
			getContract({
				address: this.options.address.newbieVillaContract,
				abi: Abi.newbieVilla,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.peripheryContract = this.#proxyContract(
			getContract({
				address: this.options.address.peripheryContract,
				abi: Abi.periphery,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.cbtContract = this.#proxyContract(
			getContract({
				address: this.options.address.cbtContract,
				abi: Abi.cbt,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.miraContract = this.#proxyContract(
			getContract({
				address: this.options.address.miraContract,
				abi: Abi.mira,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.tipsContract = this.#proxyContract(
			getContract({
				address: this.options.address.tipsContract,
				abi: Abi.tips,
				client: {
					publicClient: this.publicClient,
					walletClient: this.walletClient,
				},
			}),
		)
		this.tipsWithFeeContract = this.#proxyContract(
			getContract({
				address: this.options.address.tipsWithFeeContract,
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
