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
import { type EIP1193Provider } from 'eip1193-types'
import { Network } from '../../network'
import {
  createDefaultPublicClient,
  createWalletClientFromPrivateKeyAccount,
  createWalletClientFromProvider,
  getProviderAddress,
} from '../../utils'
import { type Overwrite } from '../../types'
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
  walletClient: WalletClient<Transport, Chain, Account> | undefined
  #account: Address | Account | undefined

  get account() {
    return this.#account!
  }
  set account(value) {
    this.#account = value
    if (this.walletClient)
      this.walletClient.account =
        typeof value === 'string' ? { type: 'json-rpc', address: value } : value
  }
  options: ResolvedContractOptions

  contract!: GetContractReturnType<
    Abi.Entry,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  newbieVillaContract!: GetContractReturnType<
    Abi.NewbieVilla,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  peripheryContract!: GetContractReturnType<
    Abi.Periphery,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  cbtContract!: GetContractReturnType<
    Abi.Cbt,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  miraContract!: GetContractReturnType<
    Abi.Mira,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >
  tipsContract!: GetContractReturnType<
    Abi.Tips,
    PublicClient,
    WalletClient<Transport, Chain, Account>
  >

  /**
   * This creates a new Contract instance to interact with.
   * @param providerOrPrivateKey - The provider or private key to connect to the contract.
   * @returns The Contract instance.
   *
   * @example Connect with Metamask
   * ```js
   * import { Contract } from 'crossbell.js'
   * const provider = window.ethereum // the metamask provider
   * const contract = new Contract(provider)
   * ```
   *
   * @example Connect with Private Key
   * ```js
   * import { Contract } from 'crossbell.js'
   * const privateKey = '0xabcdef0123456789012345678901234567890123456789012345678901234'
   * const contract = new Contract(privateKey)
   * ```
   *
   * @example Connect with a Readonly Contract
   * ```js
   * import { Contract } from 'crossbell.js'
   * const contract = new Contract() // readonly contract
   * ```
   */
  constructor(
    providerOrPrivateKey?: Hex | EIP1193Provider,
    options?: Partial<ContractOptions>,
  ) {
    if (typeof providerOrPrivateKey === 'string') {
      const account = privateKeyToAccount(providerOrPrivateKey)
      this.#account = account
      this.walletClient = createWalletClientFromPrivateKeyAccount(account)
    } else if (providerOrPrivateKey) {
      const provider = providerOrPrivateKey
      this.#account = options?.account || getProviderAddress(provider)
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
        entryContract: Network.getContractAddress(),
        peripheryContract: Network.getPeripheryContractAddress(),
        cbtContract: Network.getCbtContractAddress(),
        tipsContract: Network.getTipsContractAddress(),
        miraContract: Network.getMiraContractAddress(),
        newbieVillaContract: Network.getNewbieVillaContractAddress(),
        linklistContract: Network.getLinklistContractAddress(),
        ...options?.address,
      },
    }
  }

  #initContract() {
    this.contract = this.proxyContract(
      getContract({
        address: this.options.address.entryContract,
        abi: Abi.entry,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
    this.newbieVillaContract = this.proxyContract(
      getContract({
        address: this.options.address.newbieVillaContract,
        abi: Abi.newbieVilla,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
    this.peripheryContract = this.proxyContract(
      getContract({
        address: this.options.address.peripheryContract,
        abi: Abi.periphery,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
    this.cbtContract = this.proxyContract(
      getContract({
        address: this.options.address.cbtContract,
        abi: Abi.cbt,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
    this.miraContract = this.proxyContract(
      getContract({
        address: this.options.address.miraContract,
        abi: Abi.mira,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
    this.tipsContract = this.proxyContract(
      getContract({
        address: this.options.address.tipsContract,
        abi: Abi.tips,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      }),
    )
  }

  proxyContract<T extends GetContractReturnType>(contract: T): T {
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
