import {
  WalletClient,
  PublicClient,
  getContract,
  Address,
  Hex,
  GetContractReturnType,
  Account,
  Transport,
  Chain,
} from 'viem'
import { Network } from '../../network'
import {
  createWalletClientFromPrivateKeyAccount,
  createWalletClientFromProvider,
  getProviderAddress,
  createDefaultPublicClient,
} from '../../utils/viem'
import * as Abi from '../abi'
import { Overwrite } from '../../types/utils'
import type { EIP1193Provider } from 'eip1193-types'
import { privateKeyToAccount } from 'viem/accounts'

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
}

export type ResolvedContractOptions = Overwrite<
  ContractOptions,
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
    this.contract = getContract({
      address: this.options.address.entryContract,
      abi: Abi.entry,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.newbieVillaContract = getContract({
      address: this.options.address.newbieVillaContract,
      abi: Abi.newbieVilla,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.peripheryContract = getContract({
      address: this.options.address.peripheryContract,
      abi: Abi.periphery,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.cbtContract = getContract({
      address: this.options.address.cbtContract,
      abi: Abi.cbt,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.miraContract = getContract({
      address: this.options.address.miraContract,
      abi: Abi.mira,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
    this.tipsContract = getContract({
      address: this.options.address.tipsContract,
      abi: Abi.tips,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    })
  }
}
